<template>
  <div class="contact-info">
    <div class="top">
      <!-- 头像  -->
      <a-avatar shape="square" :size="112" icon="user" :src="friendInfo[0].wechat_avatar" />
      <!-- 名字 -->
      <div class="name">{{ friendInfo[0].wachat_name }}<i></i></div>
      <div style="color: #0ead63; font-size: 12px; margin-top: 8px">@微信</div>
    </div>
    <div class="bottom">
      <div class="info">
        <div>
          <div class="left">备注<i></i></div>
          <span>{{ friendInfo[0].wachat_name }}</span>
          <span class="edit"><a-icon type="edit"/></span>
        </div>
        <div>
          <div class="left">电话<i></i></div>
          <span>{{ friendInfo[0].mobilephones }}}</span>
        </div>
        <div>
          <div class="left">添加时间<i></i></div>
          <span>2021-03-20</span>
        </div>
        <div>
          <div class="left">标签<i></i></div>
          <span>一般用户</span>
          <span class="edit"><a-icon type="edit"/></span>
        </div>
      </div>
      <div class="sendmsg">
        发消息
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'contactInfo',
  data() {
    return {
      chatId: this.$route.params.contactId
    }
  },
  computed: {
    ...mapGetters('accountDetails', {
      friendDetail: 'wechatDetailsById'
    }),
    friendInfo() {
      return this.friendDetail(this.chatId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.contact-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  .top {
    background: #f4f6f9;
    height: 320px;
    padding-top: 80px;
    font-size: 28px;
    color: rgba(0, 0, 0, 0.85);
    font-family: PingFangSC-Regular, PingFang SC;
    .name {
      margin-top: 16px;
      // width: 192px;
      // height: 42px;
    }
  }
  .bottom {
    flex: 1 1 0;
    padding-top: 60px;
    padding-left: 226px;
    padding-right: 226px;

    .info {
      & > div {
        display: flex;
        position: relative;
        .left {
          margin-top: 20px;
          margin-right: 40px;
          width: 80px;
          text-align: justify;
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          line-height: 22px;

          // 用来两端对齐文字
          i {
            display: inline-block;
            padding-left: 100%;
          }
        }
        span {
          display: block;
          margin-top: 16px;
        }
        .edit {
          //  align-items: flex-end;
          position: absolute;
          right: 0;
        }
      }
    }
    .sendmsg {
      width: 200px;
      height: 40px;
      background: #1d61ef;
      margin: 60px auto;
      cursor: pointer;
    }
  }
}
</style>
