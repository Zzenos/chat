<template>
  <div class="address-book_container">
    <div class="address-book_tab">
      <a-tabs :default-active-key="activeKey" :tabBarGutter="5">
        <a-tab-pane key="1" tab="客户">
          <div class="list-wraper">
            <div v-for="item in contactData.customerList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname">
                <span v-html="item.wechatName"></span>
                <span v-if="item.wechatAvatar" class="label">@微信</span>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="群聊">
          <div class="list-wraper">
            <div v-for="item in contactData.groupList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <svg-icon class-name="avatar" icon-class="icon_groupchat"></svg-icon>
              <span v-html="item.wechatName"> </span><span>（{{ item.group_num }}）</span>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="成员">
          <div class="list-wraper">
            <div v-for="item in contactData.memberList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname">
                <span v-html="item.wechatName"></span>
                <span v-if="item.wechatAvatar" :style="{ color: item.source === 'work' ? '#FF8000' : '#0ead63' }" class="label">@微信</span>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addressBook',
  data() {
    return {
      activeKey: '1', // 1 客户 2 群聊 3 成员 查询详情的时候使用
      curAddress: {},
      customerList: [
        {
          wechatId: 1,
          wechatName: '刘东霞',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 2,
          wechatName: '张建',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechatId: 3,
          wechatName: '刘东霞3',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 4,
          wechatName: '张建4',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechatId: 5,
          wechatName: '刘东霞5',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 6,
          wechatName: '张建6',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechatId: 7,
          wechatName: '刘东霞7',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 8,
          wechatName: '张建8',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechatId: 13,
          wechatName: '刘东霞3',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 14,
          wechatName: '张建4',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechatId: 15,
          wechatName: '刘东霞5',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 16,
          wechatName: '张建6',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechatId: 17,
          wechatName: '刘东霞7',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 18,
          wechatName: '张建8',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        }
      ],
      groupList: [
        {
          wechatId: 7,
          wechatName: 'BizChat群聊测试',
          group_num: 60
        },
        {
          wechatId: 8,
          wechatName: 'BizChat群聊测试',
          group_num: 3
        }
      ],
      memberList: [
        {
          wechatId: 7,
          wechatName: '刘东霞7',
          source: 'work',
          wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechatId: 8,
          wechatName: '张建8',
          wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        }
      ]
    }
  },
  props: {
    tjId: {
      type: String
    }
  },
  computed: {
    // 通信录数据
    contactData: function() {
      console.log(77777, this.$store.getters.contactByTjId(this.tjId))
      return this.$store.getters.contactByTjId(this.tjId)[0]
    }
  },
  watch: {
    tjId: {
      immediate: true,
      handler: function(n) {
        console.log(8888888, n, this.contactData)
      }
    }
  },
  methods: {
    handleItem(val) {
      console.log(val)
      const { wechatId } = val
      if (this.curAddress.wechatId === wechatId) {
        return
      }
      this.curAddress = val
      this.$router.push({ path: `/chatframe/${this.tjId}/contactInfo/${wechatId}?type=${this.activeKey}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-book_container {
  width: 100%;
  .list-wraper {
    height: calc(100vh - 193px);
    overflow-y: scroll;
  }
  /deep/ .ant-tabs-nav-scroll {
    text-align: left;
    padding-left: 16px;
  }
  .item {
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    cursor: pointer;
    &.active {
      background-color: #e9eaeb;
    }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      margin-right: 12px;
    }
    .nickname {
      .label {
        color: #0ead63;
        margin-left: 8px;
      }
    }
  }
}
</style>
