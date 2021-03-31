<template>
  <div class="address-book_container">
    <div class="address-book_tab">
      <a-tabs :default-active-key="activeKey" @change="tabChange">
        <a-tab-pane key="customer" tab="客户">
          <div v-for="item in customer_list" :key="item.wechat_id" class="item" :class="{ active: curAddress.wechat_id === item.wechat_id }" @click="handleItem(item)">
            <img class="avatar" :src="item.wechat_avatar" alt="" />
            <div class="nickname">
              <span v-html="item.wechat_name"></span>
              <span v-if="item.wechat_avatar" class="label">@微信</span>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="group" tab="群聊">
          <div v-for="item in group_list" :key="item.wechat_id" class="item" :class="{ active: curAddress.group_id === item.group_id }" @click="handleItem(item)">
            <svg-icon class-name="avatar" icon-class="icon_groupchat"></svg-icon>
            <span v-html="item.group_name"> </span><span>（{{ item.group_num }}）</span>
          </div>
        </a-tab-pane>
        <a-tab-pane key="member" tab="成员">
          <div v-for="item in member_list" :key="item.wechat_id" class="item" :class="{ active: curAddress.wechat_id === item.wechat_id }" @click="handleItem(item)">
            <img class="avatar" :src="item.wechat_avatar" alt="" />
            <div class="nickname">
              <span v-html="item.wechat_name"></span>
              <span v-if="item.wechat_avatar" :style="{ color: item.source === 'work' ? '#FF8000' : '#0ead63' }" class="label">@微信</span>
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
      activeKey: 'customer',
      curAddress: {},
      customer_list: [
        {
          wechat_id: 1,
          wechat_name: '刘东霞',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 2,
          wechat_name: '张建',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 3,
          wechat_name: '刘东霞3',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 4,
          wechat_name: '张建4',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 5,
          wechat_name: '刘东霞5',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 6,
          wechat_name: '张建6',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 7,
          wechat_name: '刘东霞7',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 8,
          wechat_name: '张建8',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        }
      ],
      group_list: [
        {
          group_id: 7,
          group_name: 'BizChat群聊测试',
          group_num: 60
        },
        {
          group_id: 8,
          group_name: 'BizChat群聊测试',
          group_num: 3
        }
      ],
      member_list: [
        {
          wechat_id: 7,
          wechat_name: '刘东霞7',
          source: 'work',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 8,
          wechat_name: '张建8',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        }
      ]
    }
  },
  methods: {
    tabChange() {},
    handleItem(val) {
      console.log(val)
      const { wechat_id } = val
      if (this.curAddress.wechat_id === wechat_id) {
        return
      }
      this.curAddress = val
      this.$router.push({ path: `/chatframe/${wechat_id}/contactInfo/0` })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-book_container {
  width: 100%;
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
