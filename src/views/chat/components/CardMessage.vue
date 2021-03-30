<template>
  <div class="card-message ">
    <!-- <div class="card" @click="showModal">
      <div class="avatar">
        <a-avatar :src="src" />
        <span class="nickname">{{ name }}</span>
      </div>
      <div class="person">
        个人名片
      </div>
    </div>
   
 <div v-show="visible" class="modal">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
 </div> -->

    <a-popover
      placement="right"
      trigger="click"
      :getPopupContainer="
        triggerNode => {
          return triggerNode.parentNode
        }
      "
    >
      <template slot="content">
        <div class="modal">
          <div>
            <div class="left">备注<i></i></div>
            <span>{{ name }}</span>
          </div>
          <div>
            <div class="left">电话<i></i></div>
            <span>18866668888</span>
          </div>
          <div>
            <div class="left">添加渠道<i></i></div>
            <span>扫码添加</span>
          </div>
          <div>
            <div class="left">添加时间<i></i></div>
            <span>2021-03-20</span>
          </div>
          <div>
            <div class="left">标签<i></i></div>
            <span>一般用户</span>
          </div>
        </div>
      </template>
      <template slot="title">
        <a-avatar :src="src" />
        <span class="bigname">{{ name }}</span> <i>icon</i>
        <br />
        <span class="green">@微信</span>
      </template>

      <div class="card">
        <div class="avatar">
          <a-avatar :src="src" />
          <span class="nickname">{{ name }}</span>
        </div>
        <div class="person">
          个人名片
        </div>
      </div>
    </a-popover>
  </div>
</template>
<script>
export default {
  name: 'CardMessage',
  props: {
    src: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // visible:false
    }
  },
  methods: {
    // showModal(){
    //   this.visible=!this.visible;
    // },
    // handleOK(e){
    //   console.log(e);
    //   this.visible=false
    // }
  }
}
</script>
<style lang="scss" scoped>
.card-message {
  position: relative;

  .card {
    width: 240px;
    height: 100px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e4e5e7;
    padding: 12px;

    .avatar {
      border-bottom: 1px solid #e4e5e7;
      height: 57px;
      text-align: left;

      .ant-avatar {
        overflow: visible;
      }

      /deep/ .ant-avatar > img {
        width: 44px;
        height: 44px;
      }
      .nickname {
        width: 42px;
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        display: block;
        margin-top: -21px;
        margin-left: 56px;
      }
    }

    .person {
      width: 48px;
      height: 18px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 18px;
      margin-top: 4px;
    }
  }

  /deep/ .ant-popover-inner {
    height: 400px;
    position: relative;
    padding: 40px;
    // left: 452px;
    .modal {
      & > div {
        display: flex;
        .left {
          margin-top: 16px;
          margin-right: 20px;
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
      }
    }
  }

  /deep/ .ant-popover-title {
    width: 360px;
    height: 88px;

    .ant-avatar {
      overflow: visible;
      img {
        width: 66px;
        height: 66px;
      }
    }
    .bigname {
      margin-left: 55px;
      margin-right: 12px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 36px;
    }
    .green {
      margin-left: 87px;
      font-size: 14px;
      font-weight: 400;
      color: #0ead63;
      line-height: 22px;
    }
  }

  /deep/ .ant-popover-placement-left > .ant-popover-content > .ant-popover-arrow {
    display: none;
  }
}
</style>
