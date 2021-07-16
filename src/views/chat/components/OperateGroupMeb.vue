<template>
  <select-modal
    :title="title"
    leftTitle=""
    rightTitle="已选："
    rightTopText=""
    :showRightNum="true"
    :showDeleteAll="true"
    :visible="visible"
    :loading="listLoading"
    :allCheckOptions="allCheckOptions || checkOptions"
    checkOptionKey="wechatId"
    @close="closeModal"
    @confirm="confirmSelect"
    class="select-group_modal"
  >
    <div slot="modalTop">
      <div style="margin-bottom: 10px;">
        <a-radio-group v-if="operateType == 'add'" default-value="customer" button-style="solid">
          <a-radio-button value="customer">
            我的客户
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div slot="leftTop">
      <div class="left-search">
        <a-input-search v-model="searchData.name" placeholder="请输入名称" allowClear style="width: 100%" @change="onSearch" />
        <!-- <a-alert style="margin-top:10px;" message="最多显示最近2000个聊天" type="info" show-icon /> -->
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
import { mapGetters } from 'vuex'
import SelectModal from '@/components/common/SelectModal.vue'

export default {
  components: {
    SelectModal
  },
  props: ['visible', 'title', 'groupList', 'operateType'],
  data() {
    return {
      // 左侧搜索条件
      searchData: {
        name: ''
      },
      // 可勾选群聊列表
      allCheckOptions: [],
      // 勾选列表数据加载loading
      listLoading: false,
      // 搜索防抖定时器
      timer: null
    }
  },
  computed: {
    ...mapGetters(['contactByTjId']),
    customerList() {
      return this.contactByTjId(this.$route.params.tjId).customerListAry
    },
    checkedList() {
      return this.operateType == 'add' ? this.customerList : this.groupList
    },
    checkOptions() {
      return this.checkedList.map(item => {
        item.disabled = [1, 3].includes(item.chatType) && [1, 3].includes(item.lost)
        return item
      })
    }
  },
  watch: {
    operateType: {
      immediate: true,
      handler: function() {
        this.allCheckOptions = this.checkOptions
      }
    }
  },
  methods: {
    onSearch() {
      console.log(this.searchData.name, 'this.searchData.name', this.checkOptions)
      this.allCheckOptions = this.searchData.name ? this.checkOptions.filter(ele => ele.wechatName && ele.wechatName.indexOf(this.searchData.name) > -1) : this.checkOptions
    },
    closeModal() {
      this.$emit('update:visible', false)
    },
    confirmSelect(checkedList) {
      // console.log(checkedList, 'operateMebList', this.operateType)
      this.$emit('confirmSelect', checkedList, this.operateType)
    }
  },
  mounted() {}
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
