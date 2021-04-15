<template>
  <div class="card-message ">
    <a-popover placement="right" trigger="click" overlayClassName="card-message-popover">
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
        <span class="bigname">{{ name }}</span>
        <!-- <img v-if="allInfo.gender == 1" src="../../assets/icon_men.png" alt="" />
        <img v-if="allInfo.gender == 2" src="../../assets/icon_women.png" alt="" /> -->
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
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // visible:false
    }
  },
  methods: {},
  created() {
    console.log(this.content, 'Card')
  }
}
</script>
<style lang="scss">
.card-message-popover {
  .ant-popover-inner {
    height: 400px;
    position: relative;
    padding: 40px;
  }

  &.ant-popover.ant-popover-placement-right,
  &.ant-popover.ant-popover-placement-left {
    // position: absolute;
    // top: -60px !important;
    // left: 80px !important;
    width: 360px;
    height: 400px;

    .ant-popover-content {
      width: 360px;
      height: 400px;
      background: #ffffff;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
      border-radius: 8px;

      .ant-popover-arrow {
        display: none;
      }
      .ant-popover-title {
        height: 88px;
        position: relative;
        padding: 0;

        .ant-avatar.ant-avatar-circle.ant-avatar-image {
          width: 66px;
          height: 66px;
        }

        .bigname {
          margin-left: 20px;
          margin-right: 12px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          line-height: 36px;
          position: absolute;
        }
        .green {
          margin-left: 86px;
          font-size: 14px;
          font-weight: 400;
          color: #0ead63;
          line-height: 22px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          position: absolute;
          bottom: 22px;
        }
      }
      .ant-popover-inner-content {
        padding: 0;
        .modal {
          padding-top: 28px;
          & > div {
            display: flex;
            height: 22px;
            line-height: 22px;
            margin-bottom: 16px;
            .left {
              margin-right: 20px;
              width: 56px;
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
              height: 22px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.85);
              line-height: 22px;
            }
          }
        }
      }
    }
  }

  .ant-popover.ant-popover-placement-left {
    top: -32px !important;
  }
}
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
}
</style>
