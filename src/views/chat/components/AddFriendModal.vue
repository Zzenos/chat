<template>
  <a-modal :visible="show" :closable="false" wrapClassName="add-friends-modal" title="添加客户" centered @ok="addFriends" @cancel="close" ok-text="发送" cancel-text="取消">
    <div class="add-cell">
      <div class="add-text">添加成员：</div>
      <div style="color: rgba(0,0,0,0.85);">{{ name }}</div>
    </div>
    <div class="add-cell">
      <div class="add-text">搜索客户：</div>
      <input class="search-cus" type="text" v-model="phoneNumber" placeholder="请输入客户手机号" />
    </div>
    <div class="add-cell">
      <div class="add-text">验证语：</div>
      <div>
        <textarea v-model="message" class="area-cus" name="" id="" rows="4"></textarea>
        <div class="send-text">你需要发送验证请求，对方通过后才能添加其为客户好友</div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'AddFriendModal',
  props: {
    // 探鲸id
    tjId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addModal: true,
      phoneNumber: '',
      message: ''
    }
  },
  computed: {},
  methods: {
    addFriends() {
      if (!this.phoneNumber) {
        this.$message.warning('手机号不能为空！')
        return
      }
      this.$socket.emit('add_wechat_via_phone_number', { tjId: this.tjId, phoneNumber: this.phoneNumber, message: this.message }, ack => {
        console.log(ack, 'add_wechat_via_phone_number-ack')
      })
      this.phoneNumber = ''
      this.message = ''
      this.$emit('close')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .add-friends-modal.ant-modal-mask {
  display: none;
}
/deep/ .ant-modal-wrap.ant-modal-centered.add-friends-modal {
  background-color: rgba(0, 0, 0, 0.5);
  // .ant-modal-close-x {
  //   display: none;
  // }
  .ant-modal-content {
    width: 640px;
    height: 524px;
    .ant-modal-header {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      border-bottom: none;
    }
    .ant-modal-body {
      padding: 60px;
      font-size: 14px;
      line-height: 22px;
      .add-cell {
        display: flex;
        .add-text {
          width: 84px;
          height: 57px;
          color: rgba(0, 0, 0, 0.85);
        }
        .search-cus {
          width: 400px;
          height: 32px;
          padding-left: 12px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          outline: none;
          &::-webkit-input-placeholder {
            color: rgba(0, 0, 0, 0.25);
          }
        }
        .area-cus {
          width: 400px;
          padding-left: 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          outline: none;
          resize: none;
        }
        .send-text {
          width: 400px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
    .ant-modal-footer {
      border-top: none;
      text-align: center;
      .ant-btn {
        width: 160px;
        height: 40px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #000;
        line-height: 22px;
        &.ant-btn-primary {
          color: #fff;
          margin-left: 24px;
        }
      }
    }
  }
}
</style>
