<template>
  <select-modal
    :title="title"
    leftTitle=""
    rightTitle="已添加群聊"
    rightTopText=""
    :showRightNum="true"
    :showDeleteAll="true"
    :visible="visible"
    :loading="listLoading"
    :allCheckOptions="allCheckOptions || checkOptions"
    checkOptionKey="groupId"
    :rightFilter="rightFilter"
    @close="closeModal"
    @confirm="confirmSelect"
    class="select-group_modal"
  >
    <div slot="modalTop">
      <a-alert style="margin-bottom:13px;" type="info" show-icon>
        <div slot="message">目前一个账号仅支持关注<span style="color: #1d61ef">50个</span>群聊，若群聊未被关注，则该群聊对应的自动回复、违规提醒、及群聊互动信息均不可进行使用</div>
      </a-alert>
    </div>
    <div slot="leftTop">
      <div style="margin-bottom: 10px;">
        <a-radio-group v-model="curSource" button-style="solid">
          <a-radio-button value="1">
            我创建的群(群主)
          </a-radio-button>
          <a-radio-button value="0">
            我加入的群
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class="select-search">
        <a-input-search v-model="searchData.name" placeholder="请输入名称" allowClear style="width: 100%" @change="onSearch" />
      </div>
    </div>
    <div slot="rightTop">
      <div class="select-search">
        <a-input-search v-model="rightSearchData.name" placeholder="请输入名称" allowClear style="width: 200px" @change="changeRightFilter" />
      </div>
    </div>
    <div class="checked-item" slot="checkItem" slot-scope="{ item }">
      <svg-icon class-name="avatar" icon-class="icon_groupchat"></svg-icon>
      <!-- <img class="avatar" :src="item.groupAvatar" alt="" /> -->
      <div class="info">
        <div class="nickname">
          <div class="ellipsis" :style="{ 'max-width': [1, 3].includes(item.chatType) && item.lost ? '150px' : '200px' }">
            <span> {{ item.groupName }} </span>
            <span>（{{ item.memberCount }}）</span>
          </div>
          <span class="tag">内部</span>
          <span class="tag out">外部</span>
        </div>
        <div class="owner">账号信息: {{ item.ownerName }}</div>
      </div>
    </div>
  </select-modal>
</template>

<script>
import SelectModal from '@/components/common/SelectModal.vue'

export default {
  components: {
    SelectModal
  },
  props: ['visible', 'title', 'tjId'],
  data() {
    return {
      // 左侧搜索条件
      searchData: {
        name: ''
      },
      // 右侧搜索条件
      rightSearchData: {
        name: ''
      },
      curSource: '',
      // 可勾选群聊列表
      allCheckOptions: [],
      // 勾选列表数据加载loading
      listLoading: false,
      checkedList: [],
      rightFilter: item => item
    }
  },
  computed: {},
  watch: {
    curSource: {
      immediate: true,
      handler: function(n) {
        if (!n) return
        this.$socket.emit('unconcern_group_list', { tjId: this.tjId, isOwner: +n }, ack => {
          this.checkedList =
            ack.data.length != 0
              ? ack.data
              : [
                  {
                    tjId: '8e0ed7da6f8c45fc882f4cbd0dc82f75', //探鲸id
                    groupId: '8e0ed7da6f8c45fc882f4cbd0dc82f73', // 群编号
                    groupAvatar: 'https://wework.qpic.cn/icZ6MpywvK07Q/0', // 头像默认
                    groupName: '群名称aaaHunter Aguilar,邱叶时,松妍岚', //群名称
                    ownerId: '8e0ed7da6f8c45fc882f4cbd0dc82f733', //群主id
                    ownerName: '群主111', //群主名称
                    createTime: '', //创群时间
                    inContact: false, //是否保存在通讯录
                    isOpen: false, //是否关注群
                    chatType: 2,
                    memberCount: 7
                  },
                  {
                    tjId: '8e0ed7da6f8c45fc882f4cbd0dc82f75', //探鲸id
                    groupId: '8e0ed7da6f8c45fc882f4cbd0dc82f74', // 群编号
                    groupAvatar: 'https://wework.qpic.cn/icZ6MpywvK07Q/0', // 头像默认
                    groupName: '群名称bbb', //群名称
                    ownerId: '8e0ed7da6f8c45fc882f4cbd0dc82f744', //群主id
                    ownerName: '群主222', //群主名称
                    createTime: '', //创群时间
                    inContact: false, //是否保存在通讯录
                    isOpen: false, //是否关注群
                    chatType: 2,
                    memberCount: 7
                  },
                  {
                    tjId: '8e0ed7da6f8c45fc882f4cbd0dc82f75', //探鲸id
                    groupId: '8e0ed7da6f8c45fc882f4cbd0dc82f75', // 群编号
                    groupAvatar: 'https://wework.qpic.cn/icZ6MpywvK07Q/0', // 头像默认
                    groupName: '群名称ccc', //群名称
                    ownerId: '8e0ed7da6f8c45fc882f4cbd0dc82f755', //群主id
                    ownerName: '群主333', //群主名称
                    createTime: '', //创群时间
                    inContact: false, //是否保存在通讯录
                    isOpen: false, //是否关注群
                    chatType: 2,
                    memberCount: 7
                  }
                ]
          this.allCheckOptions = this.checkedList
        })
      }
    }
  },
  methods: {
    onSearch() {
      this.allCheckOptions = this.searchData.name ? this.checkedList.filter(ele => ele.groupName && ele.groupName.indexOf(this.searchData.name) > -1) : this.checkedList
    },
    changeRightFilter() {
      this.rightFilter = list => list.filter(item => item.groupName && item.groupName.indexOf(this.rightSearchData.name) > -1)
    },
    closeModal() {
      this.$emit('update:visible', false)
    },
    confirmSelect(checkedList) {
      this.$emit('confirmSelect', checkedList)
      this.$socket.emit('concern_group', { tjId: this.tjId, groupList: checkedList })
    }
  },
  mounted() {
    this.curSource = '1'
  }
}
</script>

<style scoped lang="scss">
@import '@/mixin/mixin.scss';
.select-group_modal {
  .select-search {
    padding-bottom: 10px;
  }
  @include checkedItem();
}
.select-group_modal .checked-item {
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
  .info {
    display: flex;
    flex-direction: column;
    height: 40px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    .nickname {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      .tag {
        width: 30px;
      }
      .out {
        color: #0ea860;
        background: #daf2e8;
      }
    }
    .owner {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 18px;
    }
  }
}
</style>
