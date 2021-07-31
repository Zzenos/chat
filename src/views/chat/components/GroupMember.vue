<template>
  <div>
    <a-popover
      placement="left"
      trigger="click"
      :ref="'member' + item.wechatId"
      v-model="GroupMebVisible[item.wechatId]"
      overlayClassName="card-message-popover"
      :autoAdjustOverflow="true"
      v-for="item in members"
      :key="item.wechatId"
      :overlayStyle="{
        width: '360px',
        height: '400px'
      }"
    >
      <template slot="content">
        <div class="modal">
          <div>
            <div class="left">群昵称<i></i></div>
            <span>{{ item.wechatName }}</span>
          </div>
          <div>
            <div class="left">备注<i></i></div>
            <span>{{ item.alias }}</span>
          </div>
          <div>
            <div class="left"><i></i></div>
            <span></span>
          </div>
          <div>
            <div class="left"><i></i></div>
            <span></span>
          </div>
          <div>
            <div class="left"><i></i></div>
            <span></span>
          </div>
          <div class="addBtn" ref="addBtn" @click="clickMeb(item)">
            <a-icon v-show="!btnMebText[item.wechatId]" type="sync" :spin="true" />
            {{ btnMebText[item.wechatId] }}
          </div>
        </div>
      </template>
      <template slot="title">
        <a-avatar :src="item.wechatAvatar" />
        <div class="bigname">
          <div style="max-width:170px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ item.wechatName }}</div>
          <img v-if="item.gender == 1" src="@/assets/icon_man.png" alt="" />
          <img v-if="item.gender == 2" src="@/assets/icon_woman.png" alt="" />
        </div>
        <br />
        <div v-if="item.department" class="department">{{ '@' + item.department }}</div>
        <span v-else class="green">@微信</span>
      </template>
      <div>
        <div class="memberInfo" @click="isFriend(item)">
          <a-avatar shape="square" :size="36" :src="item.wechatAvatar" />
          <span class="name ellipsis"> {{ item.wechatName }} </span>
          <span v-if="item.department" class="member-department ellipsis"> @{{ item.department }}</span>
          <span v-else class="member-wechat ellipsis" style="color: #0ead63; font-size: 12px; margin-left: 8px">@微信</span>
        </div>
      </div>
    </a-popover>
    <a-modal v-model="addByGroupShow" wrapClassName="add-friends-modal" title="发送添加邀请" centered @ok="addFriends" ok-text="发送" cancel-text="取消">
      <div class="add-cell">
        <div class="add-text">验证请求：</div>
        <div>
          <textarea v-model="message" class="area-cus" name="" id="" rows="4"></textarea>
          <div class="send-text">你需要发送验证请求，对方通过后才能添加其为客户好友</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as types from '@/store/actionType'
import { mapMutations } from 'vuex'

export default {
  name: 'GroupMember',
  props: {
    // 探鲸id
    tjId: {
      type: String,
      default: ''
    },
    members: {
      type: Array,
      default: () => []
    },
    groupId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      GroupMebVisible: {},
      btnMebText: {},
      curMebInfo: [],
      addByGroupShow: false,
      message: '',
      groupMemberId: ''
    }
  },
  computed: {},
  methods: {
    ...mapMutations([types.ADD_CHAT_LIST]),
    isFriend(item) {
      this.$socket.emit('is_friend', { tjId: this.tjId, targetId: item.wechatId }, ack => {
        if (ack.code == 200) {
          this.btnMebText[item.wechatId] = ack.data[0].isFriend ? '发送消息' : '添加为联系人'
          this.curMebInfo = ack.data[0]
          this.$forceUpdate()
          console.log(this.btnMebText[item.wechatId], 'ack-text', this.$refs.addBtn[0].innerText, '---')
        }
      })
    },
    clickMeb(item) {
      this.groupMemberId = item.wechatId
      console.log(this.$refs.addBtn[0].innerText, 'this.$refs.addBtn[0].innerText', this.btnMebText[item.wechatId])
      if (!this.btnMebText[item.wechatId]) return
      if (this.btnMebText[item.wechatId] == '发送消息') {
        this.GroupMebVisible[item.wechatId] = false
        const chatId = this.tjId + '&' + item.wechatId
        this.$router.push({
          path: `/chatframe/${this.tjId}/recent/${chatId}`,
          query: { ...this.curMebInfo }
        })
        this[types.ADD_CHAT_LIST]({
          tjId: this.$route.params.tjId,
          chatList: [
            {
              chatId,
              ...this.curMebInfo,
              isTop: this.curMebInfo.isTop || 0,
              company: this.curMebInfo.company, // 解决通讯录成员新建会话@未显示公司问题
              chatType: Number(this.curMebInfo.chatType),
              wechatAvatar: this.curMebInfo.wechatAvatar,
              wechatName: this.curMebInfo.wechatName,
              lastActiveTime: new Date().getTime()
            }
          ]
        })
      } else {
        this.addByGroupShow = true
        this.GroupMebVisible[item.wechatId] = false
      }
    },
    addFriends() {
      this.addByGroupShow = false
      this.$socket.emit('add_contact_by_group', { tjId: this.tjId, groupId: this.groupId, groupMemberId: this.groupMemberId, message: this.message }, ack => {
        console.log(ack, 'add_contact_by_group-ack')
      })
      this.message = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.memberInfo {
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  font-family: PingFangSC-Regular, PingFang SC;
  .name {
    font-size: 14px;
    margin-left: 12px;
    max-width: 110px;
    line-height: 36px;
  }
  .member-department {
    color: #ff8000;
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    margin-left: 8px;
    max-width: 95px;
    line-height: 36px;
  }
  .member-wechat {
    color: #0ead63;
    font-size: 12px;
    margin-left: 8px;
    line-height: 18px;
    margin-top: 9px;
    font-weight: 400;
  }
}
/deep/ .add-friends-modal.ant-modal-mask {
  display: none;
}
/deep/ .ant-modal-wrap.ant-modal-centered.add-friends-modal {
  background-color: rgba(0, 0, 0, 0.5);
  .ant-modal-content {
    width: 640px;
    height: 406px;
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
