<template>
  <select-modal
    :title="title || '选择群聊'"
    leftTitle=""
    rightTitle="已选会话："
    rightTopText=""
    :showRightNum="true"
    :showDeleteAll="true"
    :visible="visible"
    :loading="listLoading"
    :allCheckOptions="checkOptions"
    checkOptionKey="wechatId"
    :echodCheckedList="defaultList"
    @close="closeModal"
    @confirm="confirmSelect"
    class="select-group_modal"
  >
    <div slot="modalTop">
      <div style="margin-bottom: 10px;">
        <a-radio-group v-model="curSource" button-style="solid">
          <a-radio-button value="chat">
            最近聊天
          </a-radio-button>
          <a-radio-button value="customer">
            客户
          </a-radio-button>
          <a-radio-button value="group">
            群聊
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div slot="leftTop">
      <div class="left-search">
        <a-input-search v-model="searchData.name" placeholder="请输入名称" allowClear style="width: 100%" @change="onSearch" />
        <a-alert style="margin-top:10px;" message="最多显示最近2000个聊天" type="info" show-icon />
      </div>
    </div>
    <div slot="rightTop"></div>
    <div class="checked-item" slot="checkItem" slot-scope="{ item }">
      <svg-icon v-if="item.chatType === 2" class-name="avatar" icon-class="icon_groupchat"></svg-icon>
      <img v-else class="avatar" :src="item.wechatAvatar" alt="" />
      <div class="info">
        <div class="nickname">
          <div class="ellipsis" :style="{ 'max-width': [1, 3].includes(item.chatType) && item.lost ? '150px' : '200px' }">
            <span v-html="item.wechatName"></span>
            <span v-if="[1, 3].includes(item.chatType)" :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">@{{ item.company || '微信' }}</span>
            <span v-if="item.chatType === 2">（{{ item.memberCount }}）</span>
          </div>
          <span v-if="[1, 3].includes(item.chatType) && item.lost == '1'" class="tag">流失客户</span>
          <span v-if="[1, 3].includes(item.chatType) && item.lost == '3'" class="tag">删除客户</span>
        </div>
      </div>
    </div>
  </select-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as types from '@/store/actionType'
import SelectModal from '@/components/common/SelectModal.vue'

export default {
  components: {
    SelectModal
  },
  props: ['visible', 'title', 'checkedList', 'msg', 'defaultList'],
  data() {
    return {
      // 左侧搜索条件
      searchData: {
        name: ''
      },
      curSource: '',
      // 可勾选群聊列表
      checkOptions: [],
      // 勾选列表数据加载loading
      listLoading: false,
      // 搜索防抖定时器
      timer: null
    }
  },
  computed: {
    ...mapGetters(['chatsByTjId', 'contactByTjId', 'userDetailsById']),
    chatList() {
      return this.chatsByTjId(this.$route.params.tjId)
    },
    customerList() {
      return this.contactByTjId(this.$route.params.tjId).customerListAry
    },
    groupList() {
      return this.contactByTjId(this.$route.params.tjId).groupListAry
    }
  },
  watch: {
    curSource(n) {
      this.checkOptions = this[`${n}List`].map(item => {
        item.disabled = [1, 3].includes(item.chatType) && [1, 3].includes(item.lost)
        return item
      })
      // console.log(n, this.checkOptions)
    }
  },
  methods: {
    ...mapActions([types.SEND_MSG]),
    /**
     * @author wlx
     * @time  2021-05-24
     * @param
     * @description 搜索
     */
    onSearch() {
      this.checkOptions = this.searchData.name ? this[`${this.curSource}List`].filter(ele => ele.wechatName && ele.wechatName.indexOf(this.searchData.name) > -1) : this[`${this.curSource}List`]
    },
    /**
     * @author wlx
     * @time  2021-05-24
     * @param
     * @description 关闭弹窗
     */
    closeModal() {
      this.$emit('update:visible', false)
    },
    /**
     * @author wlx
     * @time  2021-05-24
     * @param
     * @description 确认选择
     */
    confirmSelect(checkedList) {
      console.log(checkedList, 'transmitMsgList')
      checkedList.forEach(item => {
        const { tjId } = this.$route.params
        const {
          info: { wechatName, wechatAvatar }
        } = this.userDetailsById(tjId)
        let msg = this.msg.map(i => {
          const { msgType, content, url, coverUrl, title, voiceTime, href, desc, id, msgSerialNo } = i
          const msg = {
            msgType,
            content:
              content &&
              (msgType == 'text'
                ? item.chatType == '2'
                  ? content.replace(/\{用户昵称\}(,|，)?/g, '')
                  : content.replace(/\{用户昵称\}/g, item.wechatName)
                : ['videoNum', 'weapp'].includes(msgType)
                ? JSON.stringify(JSON.stringify(content))
                : content),
            url,
            coverUrl,
            title: msgType == 'link' ? (title ? title : desc) : title,
            voiceTime,
            href,
            desc,
            id,
            msgSerialNo,
            chatId: `${tjId}&${item.wechatId}`,
            chatType: item.chatType,
            fromId: tjId,
            toId: item.wechatId,
            sender: {
              wechatName,
              wechatAvatar
            },
            notResend: true
          }
          return msg
        })

        console.log(msg)
        this[types.SEND_MSG](msg)
      })
      this.$emit('confirmSelect', checkedList)
    }
  },
  mounted() {
    this.curSource = 'chat'
  }
}
</script>

<style scoped lang="scss">
@import '@/mixin/mixin.scss';
.select-group_modal {
  .left-search {
    padding-bottom: 10px;
  }
  @include checkedItem();
}
</style>
