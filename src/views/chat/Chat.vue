<template>
  <div class="chatCotainer" v-if="chatId != 0">
    <!-- header -->
    <header>
      <!-- title -->
      <div class="title" style="height: 100%">
        <div>
          <!-- 好友名字 -->
          <span v-if="$route.query.chatType == 1" class="friendName">
            {{ $route.query.wechatName }}
            <span v-if="$route.query.company" style="color: #FF8000;font-size: 12px; line-height: 18px; font-weight: 400;">{{ $route.query.company }}</span>
            <span v-else style="color: #0ead63; font-size: 12px; line-height: 18px; font-weight: 400;"> @微信</span>
          </span>
          <!-- 群聊名称 -->
          <span v-if="$route.query.chatType == 2" class="groupName">
            {{ $route.query.wechatName }}
            <span class="num">{{ memberCount }}</span>
          </span>
          <span v-if="$route.query.chatType == 3" class="memberName">
            {{ $route.query.wechatName }}
            <span style="color: #FF8000;font-size: 12px; line-height: 18px; font-weight: 400;">{{ $route.query.company }}</span>
          </span>
        </div>
      </div>
    </header>
    <main class="mainContainer">
      <div class="left">
        <div class="talk-container" id="chatScrollbar" ref="list" @scroll="talkScroll($event)">
          <!-- 数据加载状态栏 -->
          <div class="loading-toolbar">
            <span class="pointer color-blue pull-history" @click="loadChatRecords">查看更多消息... </span>

            <!-- <span v-else> 没有更多消息了... </span> -->
          </div>

          <!-- 消息主体 -->
          <div v-for="(item, index) in records" :key="item.msgId">
            <!-- 群消息 加入退出群聊-->
            <!-- <div v-if="item.msg_type == 2" class="message-box"></div> -->

            <!-- 消息时间 -->

            <div class="datetime no-select" v-text="sendTime(item.time)" v-show="compareTime(index, item.time)"></div>

            <!-- 系统通知 -->
            <div class="sysInfo" v-if="item.msgType == 'system'" v-text="item.content"></div>

            <!-- 对话消息 -->
            <div v-else class="message-box" :class="{ 'direction-rt': item.float == 'right' }">
              <!-- 头像 -->
              <div class="avatar-column">
                <a-avatar shape="square" :size="36" :src="item.sender.wechatAvatar" />
              </div>
              <div class="main-column">
                <!-- 昵称 只有在群聊时显示 必须消息来源是群聊且在左边盒子-->
                <div class="talk-title" :class="{ show: item.chatType == 2 && item.float == 'left' }">
                  <span class="nickname" v-show="item.chatType == 2" v-text="item.sender.wechatName"></span>
                </div>
                <!-- 内容 -->
                <div class="talk-content">
                  <div class="talk-content-msg">
                    <!-- 文本消息 -->
                    <text-message v-if="item.msgType == 'text'" :content="item.content" :float="item.float" />

                    <!-- 图片消息 -->
                    <image-message v-else-if="item.msgType == 'image'" :src="item.url" :sendingPic="item.status" />

                    <!-- 文件消息 -->
                    <file-message v-else-if="item.msgType == 'file'" :url="item.url" :title="item.title" />

                    <!-- 视频消息 -->
                    <video-message v-else-if="item.msgType == 'video'" :vid="item.msgId" :url="item.url" :coverurl="item.coverUrl" :sendingPic="item.status" />

                    <!-- 个人名片 -->
                    <card-message v-else-if="item.msgType == 'card'" :src="item.content.profile_photo" :name="item.content.name" />

                    <!-- 语音消息 -->
                    <audio-message v-else-if="item.msgType == 'voice'" :float="item.float" :url="item.url" :voiceTime="item.voiceTime" />

                    <!-- 链接消息 -->
                    <link-message v-else-if="item.msgType == 'link'" :href="item.href" :desc="item.desc" :title="item.title" :coverurl="item.coverUrl" />

                    <!-- 小程序消息 -->
                    <webapp-message
                      v-else-if="item.msgType == 'weapp'"
                      :des="item.content.des_1"
                      :iconurl="item.content.weappiconurl"
                      :title="item.content.title"
                      :url="item.content.pagepath"
                      :coverurl="item.coverUrl"
                    />
                    <!-- !消息发送状态 -->
                    <div class="status" v-if="item.status != 0" @click="clickStatus(index)">
                      <div class="center-fail">
                        <img src="@/assets/icon_resend.png" alt="" />
                      </div>
                    </div>
                    <a-modal
                      v-model="modal2Visible"
                      wrapClassName="send-status-modal"
                      getPopupContainer="triggerNode => {
                        return triggerNode.parentNode
                      }"
                      title="您确定要重新发送消息吗？"
                      centered
                      @ok="toResendMsg"
                      ok-text="确认"
                      cancel-text="取消"
                    >
                      <!-- <p>some contents...</p>
                      <p>some contents...</p>
                      <p>some contents...</p> -->
                    </a-modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 客户流失 -->
        <div class="lost-customer" v-if="isLost">
          <div class="lost-text" @click="lostText">客户已流失，消息无法送达，无法编辑内容</div>
        </div>
        <div class="foot">
          <me-editor :sendToBottom="sendToBottom" :changeSendStatus="changeSendStatus" ref="editor" />
        </div>
      </div>
      <div class="talk-record" v-if="$route.query.chatType == 2">
        <div class="top">
          <span class="groupInfo">群资料</span>
          <!-- <span>快捷回复</span> -->
        </div>
        <div class="search">
          <!-- <a-input-search placeholder="搜索群成员" style="width: 260px; height: 32px; margin: 16px 20px" /> -->
        </div>
        <div class="memberList" v-if="groupInfo.memberCount" style="padding-top:50px">
          <!-- style="padding-top:50px"要删 -->
          群成员({{ groupInfo.memberCount }})
          <div class="memberInfo" v-for="item in groupInfo.members" :key="item.wechatId">
            <a-avatar shape="square" :size="36" :src="item.wechatAvatar" />

            <span class="name"> {{ item.wechatName }} </span>
            <span v-if="item.department" class="member-department"> @{{ item.department }}</span>
            <span v-else class="member-wechat" style="color: #0ead63; font-size: 12px; margin-left: 8px">@微信</span>
          </div>
        </div>
      </div>
      <div class="talk-record" v-else>
        <!-- <div class="top" style="padding:20px;text-align:left">聊天记录</div> -->
        <div class="search">
          <!-- <a-input-search placeholder="搜索" style="width: 260px; height: 32px; margin: 30px 18px" /> -->
        </div>
        <div class="foot" style="margin-top:200px">
          <!-- style="margin-top:200px要删 -->
          <!-- <span>全部</span> -->
          <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" style="margin:100px auto" />
        </div>
      </div>
    </main>
  </div>
  <div class="chatCotainer" v-else>
    <header></header>
    <div class="noRecords">
      <div class="left">
        <div class="talk-container" id="chatScrollbar" ref="list" @scroll="talkScroll($event)" style="position:relative">
          <div style="position:absolute;left: 50%;top: calc(50% + 32px); transform: translate(-50%, -50%);">
            <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
          </div>
        </div>
      </div>
      <div class="talk-record" style="position:relative">
        <!-- <div style="width:100%;height:64px;position:absolute"></div> -->
        <div style="position:absolute;left: 50%;top: calc(50% + 32px); transform: translate(-50%, -50%);">
          <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formateTime, parseTime } from '@/util/util'
import TextMessage from '@/views/chat/components/TextMessage'
import ImageMessage from '@/views/chat/components/ImageMessage'
import FileMessage from '@/views/chat/components/FileMessage'
import VideoMessage from '@/views/chat/components/VideoMessage'
import CardMessage from '@/views/chat/components/CardMessage'
import MeEditor from '@/views/chat/components/MeEditor'
import LinkMessage from '@/views/chat/components/LinkMessage.vue'
import AudioMessage from '@/views/chat/components/AudioMessage'
import WebappMessage from '@/views/chat/components/WebappMessage'
import { mapActions } from 'vuex'
import * as types from '@/store/actionType'
export default {
  name: 'chat',
  components: {
    TextMessage,
    ImageMessage,
    FileMessage,
    MeEditor,
    VideoMessage,
    CardMessage,
    LinkMessage,
    AudioMessage,
    WebappMessage
  },
  data() {
    return {
      loadRecord: 1,
      userId: this.$route.params.tjId,
      chatId: this.$route.params.contactId,
      wechatId: this.$route.query.wechatId,
      wechatName: this.$route.query.wechatName,
      memberCount: '',
      chatType: this.$route.query.chatType,
      groupInfo: {
        memberCount: '',
        members: []
      },
      // sendStatus: false,
      modal2Visible: false,
      isLost: false,
      toRensendIndex: 0
      // sendingPic: false
    }
  },
  mounted() {
    this.toBottom()
  },
  methods: {
    ...mapActions([types.SEND_MSG]),
    parseTime,
    sendTime: formateTime,
    compareTime(index, datetime) {
      if (datetime == undefined) return false
      let time = Math.floor(datetime / 1000)
      if (index == 0) return true
      let frontDate = Math.floor(this.records[index - 1].time / 1000)
      if (time - frontDate > 300) return true
    },
    toBottom() {
      let scrollHeight = document.getElementById('chatScrollbar').offsetHeight
      let el = document.getElementById('chatScrollbar')
      if (this.records.length == 0) {
        el.scrollTop = el.scrollHeight
      } else {
        el.scrollTop = el.scrollHeight - scrollHeight
      }
    },
    sendToBottom() {
      setTimeout(() => (this.$refs.list.scrollTop = this.$refs.list.scrollHeight), 0)
    },
    talkScroll(e) {
      if (e.target.scrollTop == 0 && this.loadRecord == 1) {
        // console.log('到达顶部需要请求更多消息')
        return
      }
    },
    ...mapActions([types.PULL_HISTORY_MSG]),
    loadChatRecords() {
      // ('去请求更多聊天记录')
      if (this.loadRecord == 2) return
      this.loadRecord = 2
      this[types.PULL_HISTORY_MSG](this.chatId, this.chatType).then(() => {
        this.changeloadRocrd()
      })
    },
    changeloadRocrd() {
      this.loadRecord = 1
    },
    // showConfirm() {
    //   this.$confirm({
    //     title: '您确定要重新发送消息吗？',
    //     content: '',
    //     okText: '确定',
    //     cancelText: '取消',
    //     onOk() {
    //       console.log('OK')
    //     },
    //     onCancel() {
    //       console.log('Cancel')
    //     },
    //     class: 'test'
    //   })
    // },
    toResendMsg() {
      //点击确定重发 关闭弹框 重发消息 成功后 改边索引的 消息状态
      console.log('to-resend')
      this.modal2Visible = false
      this.records[this.toRensendIndex].notResend = false
      this[types.SEND_MSG](this.records[this.toRensendIndex])
      //types.resend.().then(()=>{this.changeSendStatus(this.toRensendIndex)})
    },
    changeSendStatus(index) {
      // this.sendStatus = true
      //如果不传index 默认是最后一条
      index = index || this.records.length - 1
      this.records[index].sendStatus = true
    },
    clickStatus(index) {
      //点击重发消息 展示弹框 存需要重发消息的索引
      this.modal2Visible = true
      console.log(index)
      this.toRensendIndex = index
    },
    lostText() {
      this.$refs.editor.changePlaceholder()
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newVal) {
        const { wechatId, wechatName, memberCount = '', chatType } = newVal.query
        const { tjId, contactId } = newVal.params
        this.userId = tjId
        this.chatId = contactId //获取传来的参数
        this.wechatId = wechatId
        this.wechatName = wechatName
        this.memberCount = memberCount ? '(' + memberCount + ')' : ''
        this.chatType = chatType
        this.sendToBottom()
        console.log(this.records, 'chat-records')
        console.log(this.$route, 'chat-route')
        if (chatType == 2) {
          // console.log(this.wechatId, 'groupid')
          if (!this.wechatId) {
            this.groupInfo = {
              memberCount: '',
              members: []
            }
            return
          }
          this.$socket.emit(`group_info`, { tjId: this.wechatId }, ack => {
            this.groupInfo = ack.data || {}
            console.log(this.groupInfo, 'ack-data-groupinfo')
          })
        }
        // this.$refs.editor.clear()
        // this.$refs.editor.getDraftText(this.chatId)
      }
    },
    records() {
      if (this.loadRecord == 1) {
        this.sendToBottom()
      }
    }
  },
  computed: {
    records() {
      return this.$store.getters.getMsgsByChatId(this.chatId).map(item => {
        item.float = item.fromId == this.userId ? 'right' : 'left'
        item.sendStatus = true
        return item
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chatCotainer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: PingFangSC-Regular, PingFang SC;

  header {
    height: 68px;
    border-bottom: 1px solid #e4e5e7;

    .friendName,
    .groupName,
    .memberName {
      float: left;
      margin: 22px 8px 22px 20px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 400;
    }
  }
  .noRecords {
    flex: 1 1 0;
    display: flex;
    .left {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e4e5e7;
      .talk-container {
        flex: 1 1 0;
      }
    }
    .talk-record {
      width: 300px;
    }
  }

  .mainContainer {
    flex: 1 1 0;
    display: flex;

    .left {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e4e5e7;
      .talk-container {
        flex: 1 1 0;
        box-sizing: border-box;
        padding: 40px 10px 10px;
        overflow-y: auto;
        position: relative;
        &::-webkit-scrollbar {
          display: none;
        }
        .pull-history {
          cursor: pointer;
        }

        .talk-title {
          display: none;
          height: 15px;
          margin-bottom: 4px;
          color: rgba(0, 0, 0, 0.45);
          font-weight: 400;
          line-height: 18px;
          font-size: 12px;
          text-align: left;
          &.show {
            display: block;
          }
        }

        .datetime {
          height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-weight: 400;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
          margin-top: 40px;
          margin-bottom: 40px;
        }

        .sysInfo {
          width: 252px;
          height: 18px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          line-height: 18px;
          text-align: center;
          margin: 20px auto;
        }

        .message-box {
          width: 100%;
          min-height: 46px;
          margin-top: 20px;
          display: flex;
          flex-direction: row;

          .avatar-column {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            order: 2;
          }

          .main-column {
            order: 3;
            flex: 1 auto;

            .talk-content {
              display: flex;
              align-items: flex-start;
              flex-direction: column;
              .talk-content-msg {
                display: flex;
                .status {
                  order: 2;
                  width: 44px;
                  position: relative;
                  .center-fail {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                  }
                }
              }
            }
          }

          &.direction-rt {
            .avatar-column {
              order: 4;
              margin-right: 0;
              margin-left: 10px;
            }

            .main-column {
              order: 3;

              .talk-content {
                align-items: flex-end;
                .talk-content-msg {
                  display: flex;
                  flex-direction: row-reverse;
                }
              }
            }
          }
        }
      }

      .lost-customer {
        width: 100%;
        height: 40px;
        background: #e1eaff;
        .lost-text {
          width: 228px;
          height: 18px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          line-height: 18px;
          margin: 11px auto;
        }
      }
      .foot {
        height: 160px;
      }
    }

    .talk-record {
      width: 300px;
      display: flex;
      flex-direction: column;

      .top {
        width: 300px;
        height: 60px;
        font-size: 14px;
        color: #000;
        line-height: 22px;
        padding-top: 26px;
        padding-left: 21px;
        border-bottom: 1px solid #e4e5e7;

        .groupInfo {
          margin-right: 34px;
          padding-bottom: 12px;
          color: #1d61ef;
          border-bottom: 1px solid #1d61ef;
        }
      }

      // .search {
      //     padding:16px 20px;
      // }

      .memberList {
        padding-left: 20px;
        text-align: left;
        flex: 1 1 0;
        overflow-y: auto;
        .memberInfo {
          margin-top: 20px;
          margin-bottom: 20px;
          display: flex;
          .name {
            font-size: 14px;
            margin-left: 12px;
            // margin-right: 8x;
            max-width: 110px;
            line-height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .member-department {
            color: #ff8000;
            font-size: 12px;
            line-height: 18px;
            font-weight: 400;
            margin-left: 8px;
            font-family: PingFangSC-Regular, PingFang SC;
            max-width: 95px;
            line-height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .member-wechat {
            color: #0ead63;
            font-size: 12px;
            margin-left: 8px;
            line-height: 18px;
            margin-top: 9px;
            font-weight: 400;
            font-family: PingFangSC-Regular, PingFang SC;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
// /deep/ .ant-modal {
//   top: 40%;
// }
/deep/ .ant-modal-mask {
  display: none;
  background-color: rgba(0, 0, 0, 0.05);
}
/deep/ .ant-modal-close-x {
  display: none;
}
/deep/ .ant-modal-content {
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
  .ant-modal-header {
    border-bottom: none;
    text-align: center;
    padding-top: 50px;
  }
  .ant-modal-body {
    display: none;
  }
  .ant-modal-footer {
    border-top: none;
  }
}
</style>
