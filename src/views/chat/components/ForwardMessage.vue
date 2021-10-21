<template>
  <div class="forward-message">
    <div class="title ellipsis">
      {{ item.chatType == 2 ? '群聊' : `${item.sender.wechatName} 和 ${item.to.wechatName}` }}
      的聊天记录
    </div>
    <div class="content">
      <div class="item ellipsis" v-for="item in item.content" :key="item.msgId">{{ item.name }} : {{ item.content }}</div>
    </div>
    <div class="bottom">
      聊天记录
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForwardMessage',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      list: [
        {
          name: '欧阳超慧',
          msgId: '111',
          content: '钉钉宣布用户数突破5亿，包括企业学校在内的各类组织数超过1900万'
        },
        {
          name: '冷咏卿',
          msgId: '222',
          content: '网易文创发布全新品牌slogan“有光”'
        },
        {
          name: '焦山琳111',
          msgId: '333',
          content: '适老版App不得再设有广告插件包括企业学校在内的各类组织数超过1900万'
        },
        {
          name: '焦山琳222',
          msgId: '444',
          content: '适老版App不得再设有广告插件包括企业学校在内的各类组织数超过1900万'
        },
        {
          name: '焦山琳333',
          msgId: '555',
          content: '适老版App不得再设有广告插件包括企业学校在内的各类组织数超过1900万'
        }
      ]
    }
  },
  methods: {
    download() {}
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.forward-message {
  width: 280px;
  height: 156px;
  background: #f0f1f2;
  border-radius: 8px;
  padding: 12px 12px 0 12px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 18px;
  text-align: left;
  cursor: pointer;
  .title {
    font-size: 14px;
    color: #000000;
    line-height: 22px;
    margin-bottom: 4px;
  }
  .content {
    height: 90px;
    overflow: hidden;
    .item {
      margin-bottom: 4px;
    }
  }
  .bottom {
    height: 26px;
    border-top: 1px solid #e4e5e7;
    padding-top: 4px;
  }
}
</style>
