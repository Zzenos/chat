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
          <!-- 流失状态显示 -->
          <span class="lost-customer-title" v-if="isLost == '1'">
            <span style="color: #1D61EF;font-size: 11px; line-height: 16px; font-weight: 400;">流失客户</span>
          </span>
          <span class="lost-customer-title" v-if="isLost == '3'">
            <span style="color: #1D61EF;font-size: 11px; line-height: 16px; font-weight: 400;">删除客户</span>
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
          <!-- 网络中断 -->
          <div class="net-lost" v-if="!onLine">
            <img src="@/assets/icon_warning.png" alt="" />
            <span>当前网络不可用，请检查你的网络</span>
          </div>
          <a-modal v-model="modal2Visible" wrapClassName="send-status-modal" title="确认要重发这条信息吗？" centered @ok="toResendMsg" ok-text="确认" cancel-text="取消"> </a-modal>
          <a-modal
            :visible="showOverModal"
            wrapClassName="send-status-modal"
            title="网络连接超时,请重新刷新页面"
            centered
            @ok="closeOverModal"
            @cancel="closeOverModal"
            ok-text="确认"
            cancel-text="取消"
          >
          </a-modal>
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
                    <text-message v-if="item.msgType == 'text'" :content="item.defaultContent" :float="item.float" @contextmenu.native="onCopy(index, item, $event)" />

                    <!-- 图片消息 -->
                    <image-message v-else-if="item.msgType == 'image'" :src="item.url" :sendingPic="item.status" @contextmenu.native="onCopy(index, item, $event)" />

                    <!-- 文件消息 -->
                    <file-message v-else-if="item.msgType == 'file'" :url="item.url" :title="item.title" @contextmenu.native="onCopy(index, item, $event)" />

                    <!-- 视频消息 -->
                    <video-message
                      v-else-if="item.msgType == 'video'"
                      :vid="item.msgId"
                      :url="item.url"
                      :coverurl="item.coverUrl"
                      :sendingPic="item.status"
                      @contextmenu.native="onCopy(index, item, $event)"
                    />

                    <!-- 个人名片 -->
                    <card-message v-else-if="item.msgType == 'card'" :src="item.content.profile_photo" :name="item.content.name" @contextmenu.native="onCopy(index, item, $event)" />

                    <!-- 语音消息 -->
                    <audio-message
                      v-else-if="item.msgType == 'voice'"
                      :float="item.float"
                      :url="item.url"
                      :voiceTime="item.voiceTime"
                      :index="index"
                      :onlyOnePlay="item.onlyOnePlay"
                      :changeAudioIndex="changeAudioIndex"
                      :translateText="item.translateText"
                      :translateShow="item.translateShow"
                      :translateResult="item.translateResult"
                      :closeTranslateText="closeTranslateText"
                      @contextmenu.native="onCopy(index, item, $event)"
                    />

                    <!-- 链接消息 -->
                    <link-message
                      v-else-if="item.msgType == 'link'"
                      :href="item.href"
                      :desc="item.desc"
                      :title="item.title"
                      :coverurl="item.coverUrl"
                      @contextmenu.native="onCopy(index, item, $event)"
                    />

                    <!-- 小程序消息 -->
                    <webapp-message
                      v-else-if="item.msgType == 'weapp'"
                      :des="item.content.des_1"
                      :iconurl="item.content.weappiconurl"
                      :title="item.content.title"
                      :url="item.content.pagepath"
                      :coverurl="item.coverUrl"
                      @contextmenu.native="onCopy(index, item, $event)"
                    />

                    <!-- !消息发送状态 
                      getPopupContainer="triggerNode => {
                        return triggerNode.parentNode
                      }"
                     -->
                    <div class="status" v-if="item.status == 2" @click="clickStatus(index)">
                      <div class="center-fail">
                        <img src="@/assets/icon_resend.png" alt="" />
                      </div>
                    </div>
                    <!--<a-modal v-model="modal2Visible" wrapClassName="send-status-modal" title="确认要重发这条信息吗？" centered @ok="toResendMsg" ok-text="确认" cancel-text="取消"> </a-modal> -->
                  </div>
                  <!-- 引用消息 -->
                  <reply-message v-if="item.msgType == 'text' && item.content.includes('------')" :float="item.float" :content="item.content.split('------')[0]" />
                </div>
              </div>
            </div>

            <!-- 网络不可用 -->
            <!-- <div class="sysInfo" v-if="item.status == 2">消息发送失败,当前网络不可用,请检查网络</div> -->
          </div>
        </div>
        <!-- 客户流失 -->
        <div class="lost-customer" v-if="isLost == '1'">
          <div class="lost-text">客户已流失，消息无法送达，无法编辑内容</div>
        </div>
        <div class="lost-customer" v-if="isLost == '3'">
          <div class="lost-text">客户已删除，消息无法送达，无法编辑内容</div>
        </div>
        <div class="foot">
          <me-editor :sendToBottom="sendToBottom" :showRecordModal="showRecordModal" :showRecordClick="!$route.query.company" ref="editor" />
        </div>
      </div>
      <div class="sidebar">
        <a-tabs v-model="activeKey" :default-active-key="activeKey" :tabBarGutter="5">
          <a-tab-pane key="groupInfo" tab="群资料" v-if="chatType == 2">
            <!-- <div class="search">
              <a-input-search placeholder="搜索群成员" style="width: 260px; height: 32px; margin: 16px 20px" />
            </div> -->
            <div class="memberList" v-if="groupInfo.memberCount">
              <span style="font-weight:600">群成员({{ groupInfo.memberCount }})</span>
              <div class="memberInfo" v-for="item in groupInfo.members" :key="item.wechatId">
                <a-avatar shape="square" :size="36" :src="item.wechatAvatar" />
                <span class="name"> {{ item.wechatName }} </span>
                <span v-if="item.department" class="member-department"> @{{ item.department }}</span>
                <span v-else class="member-wechat" style="color: #0ead63; font-size: 12px; margin-left: 8px">@微信</span>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="customerInfo" tab="客户资料" v-if="chatType == 1 || chatType == 3">
            <iframe ref="customerInfoFrame" title="客户资料" src="http://test-bizchat.zmeng123.cn/app/cusPortrait.html" frameborder="0">
              <p>Your Browser dose not support iframes</p>
            </iframe>
          </a-tab-pane>
          <!-- <a-tab-pane key="verbalTrick" tab="快捷回复" v-if="chatType == 1 || chatType == 3">
            <iframe ref="verbalTrickFrame" title="话术库" src="http://test-bizchat.zmeng123.cn/app/verbalTricks.html" frameborder="0">
              <p>Your Browser dose not support iframes</p>
            </iframe>
          </a-tab-pane> -->
        </a-tabs>
      </div>
      <!-- 聊天记录弹窗 -->
      <chat-record-modal v-if="!$route.query.company" :visible.sync="chatRecordVisible" :type="chatType == 2" :infoData="infoData"></chat-record-modal>
      <!-- 选择群聊窗口 -->
      <transmit-msg-modal v-if="transmitMsgVisible" title="转发消息" :msg="msgInfo" :visible.sync="transmitMsgVisible" @confirmSelect="transmitMsg"></transmit-msg-modal>
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
        <div class="foot" style="display:none">
          <me-editor :sendToBottom="sendToBottom" ref="editor" />
        </div>
      </div>
      <!-- <div class="sidebar" style="position:relative">
        <div style="position:absolute;left: 50%;top: calc(50% + 32px); transform: translate(-50%, -50%);">
          <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import * as types from '@/store/actionType'
import Contextmenu from 'vue-contextmenujs'
import axios from 'axios'
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
import ReplyMessage from '@/views/chat/components/ReplyMessage'
import overTimeModal from '@/util/overTime'
import ChatRecordModal from './components/ChatRecordModal'
import TransmitMsgModal from './components/TransmitMsgModal'
Vue.use(Contextmenu)
import iframeMixin from '@/mixin/iframeMixin'

const { state: overState } = overTimeModal()
export default {
  name: 'chat',
  mixins: [iframeMixin],
  components: {
    TextMessage,
    ImageMessage,
    FileMessage,
    MeEditor,
    VideoMessage,
    CardMessage,
    LinkMessage,
    AudioMessage,
    WebappMessage,
    ReplyMessage,
    ChatRecordModal,
    TransmitMsgModal
  },
  data() {
    return {
      activeKey: '',
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
      modal2Visible: false,
      toRensendIndex: 0,
      onLine: navigator.onLine,
      playingAudioIndex: null,
      isLost: '',
      // 控制聊天记录弹窗显示
      chatRecordVisible: false,
      // 当前查看记录的对象
      infoData: null,
      transmitMsgVisible: false,
      msgInfo: {} // 消息体
    }
  },
  mounted() {
    this.toBottom()
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  },
  destroyed() {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
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
    toResendMsg() {
      //点击确定重发 关闭弹框 重发消息 成功后 改边索引的 消息状态
      // console.log('to-resend')
      this.modal2Visible = false
      this.records[this.toRensendIndex].notResend = false
      this[types.SEND_MSG](this.records[this.toRensendIndex])
    },
    clickStatus(index) {
      //点击重发消息 展示弹框 存需要重发消息的索引
      this.modal2Visible = true
      // console.log(index)
      this.toRensendIndex = index
    },
    updateOnlineStatus(e) {
      const { type } = e
      this.onLine = type === 'online'
      // console.log(this.onLine, 'this.onLine-this.onLine')
    },
    changeAudioIndex(index) {
      if (typeof this.playingAudioIndex != 'number') {
        this.playingAudioIndex = index
        console.log(this.playingAudioIndex, 'first')
        return
      }
      this.records[this.playingAudioIndex].onlyOnePlay = !this.records[this.playingAudioIndex].onlyOnePlay
      this.playingAudioIndex = index
      console.log(this.playingAudioIndex, 'last')
    },
    closeOverModal() {
      overState.show = false
    },
    onCopy(index, item, event) {
      let menus = []
      console.log(index, item, 'oncopy')
      if (item.msgType == 'voice') {
        menus.push({
          label: '转为文字',
          icon: 'transfer',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            this.translateText(index, item)
          }
        })
      }

      menus.push({
        label: '转发',
        icon: 'promotion',
        customClass: 'cus-contextmenu-item',
        onClick: () => {
          this.forwardRecords(index, item)
        }
      })

      menus.push({
        label: '引用',
        icon: 'connection',
        customClass: 'cus-contextmenu-item',
        onClick: () => {
          this.replyRecords(index, item)
        }
      })

      this.$contextmenu({
        items: menus,
        event,
        customClass: 'cus-contextmenu',
        zIndex: 3,
        minWidth: 120
      })
      event.preventDefault()
    },
    replyRecords(index, item) {
      console.log('引用消息', index, item)
      let content = item.defaultContent
      let container = document.createElement('div')
      container.innerHTML = content
      content = container.innerText
      container = null
      content = '"' + content + '"'
      this.$refs.editor.openReply(item.sender.wechatName, content)
    },
    forwardRecords(index, item) {
      console.log('转发消息', index, item)
      this.msgInfo = item
      this.transmitMsgVisible = true
    },
    // 转发
    transmitMsg() {
      this.transmitMsgVisible = false
    },
    showRecordModal() {
      //聊天记录传入数据infoData
      const { wechatName, wechatAvatar, chatType, externalWechatId, accountId, accountName } = this.$route.query
      let info =
        chatType == 2 ? { group: { name: wechatName, avatar: wechatAvatar, groupId: externalWechatId } } : { customerInfo: { name: wechatName, avatar: wechatAvatar, customerId: externalWechatId } }
      this.infoData = {
        ...info,
        wechatAccount: { wechatName: accountName, wechatId: accountId } //tjid user-name
      }
      this.chatRecordVisible = true
    },
    translateText(index, item) {
      console.log(index, item)
      this.records[index].translateShow = true
      this.records[index].translateResult = 'pending'
      this.$forceUpdate()
      axios({
        method: 'post',
        url: 'http://bizchat-chatroom.zmeng123.cn:9091/chatroom/voice/convert',
        data: { url: item.url }
      }).then(res => {
        let { code, data } = res.data
        console.log(code, data)
        if (code == 200) {
          this.records[index].translateText = data.result
          this.records[index].translateResult = 'success'
          // this.records[index].translateShow = true
          this.$forceUpdate()
        } else {
          this.records[index].translateResult = 'fail'
          // this.records[index].translateShow = true
          this.$forceUpdate()
        }
      })
    },
    closeTranslateText(index) {
      this.records[index].translateShow = false
      this.$forceUpdate()
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newVal) {
        const { wechatId, wechatName, memberCount = '', chatType, lost, externalWechatId } = newVal.query
        const { tjId, contactId } = newVal.params
        const accountInfo = this.userDetailsById(tjId)
        this.userId = tjId
        this.chatId = contactId //获取传来的参数
        this.wechatId = wechatId
        this.wechatName = wechatName
        this.memberCount = memberCount ? '(' + memberCount + ')' : ''
        this.chatType = chatType
        this.isLost = lost
        this.sendToBottom()
        console.log(this.records, 'chat-records')
        this.userInfo = {
          corpId: 'wwfc3ae560ee1592d8',
          contactUserId: externalWechatId,
          userId: accountInfo.info.wechatId,
          nickname: wechatName
        }
        this.onLine = navigator.onLine
        if (!this.onLine) {
          this.$refs.editor.netLost()
        } else {
          this.$nextTick(() => {
            this.$refs.editor.netReconnect()
          })
        }
        // 获取群资料
        if (chatType == 2) {
          if (!this.wechatId) {
            this.groupInfo = {
              memberCount: '',
              members: []
            }
            return
          }
          this.activeKey = 'groupInfo'
          this.$socket.emit(`group_info`, { tjId: tjId, groupId: wechatId }, ack => {
            this.groupInfo = ack.data || {}
            // console.log(this.groupInfo, 'ack-data-groupinfo')
          })
          return
        }
        if (chatType == 1) {
          this.activeKey = 'customerInfo'
        }
        if (chatType == 3) {
          this.activeKey = 'customerInfo'
        }
        // 给应用传递当前用户信息
        this.$nextTick(() => {
          console.log(this.chatId)
          this.chatId != '0' && this.sendMessage('InitUserInfo', this.userInfo)
        })
      }
    },
    records() {
      if (this.loadRecord == 1) {
        this.sendToBottom()
      }
    },
    isLostRequest(newVal) {
      this.isLost = newVal && newVal.lost
      // console.log(newVal, 'chat-lost-newVal', this.isLost)
      if (newVal && (newVal.lost == '1' || newVal.lost == '3')) {
        this.$nextTick(() => {
          newVal.lost == '1' ? this.$refs.editor.changePlaceholder() : this.$refs.editor.changePlaceholderS()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.editor.changePlaceholderT()
        })
      }
    },
    onLine: {
      immediate: true,
      handler(newVal) {
        // console.log(newVal, 'onLine')
        if (!newVal) {
          this.$nextTick(() => {
            this.$refs.editor.netLost()
          })
        }
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.editor.netReconnect()
          })
        }
      }
    },
    isLost: {
      immediate: true,
      handler(newVal) {
        if (newVal == '1' || newVal == '3') {
          this.$nextTick(() => {
            newVal == '1' ? this.$refs.editor.changePlaceholder() : this.$refs.editor.changePlaceholderS()
          })
        } else {
          this.$nextTick(() => {
            this.$refs.editor.changePlaceholderT()
          })
        }
      }
    },
    showOverModal(n) {
      console.log(n, 'showOverModal')
    }
  },
  computed: {
    records() {
      return this.$store.getters.getMsgsByChatId(this.chatId).map(item => {
        item.float = item.fromId == this.userId ? 'right' : 'left'
        item.onlyOnePlay = true
        return item
      })
    },
    ...mapGetters(['contactInfoByWechatId', 'userDetailsById']),
    isLostRequest() {
      return this.contactInfoByWechatId(this.userId, this.wechatId)
    },
    showOverModal() {
      return overState.show
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
    .lost-customer-title {
      float: left;
      margin: 25px 0;
      width: 56px;
      height: 18px;
      background: #e1eaff;
      border-radius: 2px;
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
  }

  .mainContainer {
    flex: 1 1 0;
    display: flex;

    .left {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e4e5e7;
      // transform: translateX(0px);
      position: relative;
      .talk-container {
        flex: 1 1 0;
        box-sizing: border-box;
        padding: 40px 10px 10px;
        overflow-y: auto;
        // position: relative;
        &::-webkit-scrollbar {
          display: none;
        }
        .pull-history {
          cursor: pointer;
        }
        .net-lost {
          width: 100%;
          height: 40px;
          background: #f7e7e8;
          // position: fixed;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
          padding: 10px 0;
          span {
            margin-left: 8px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 18px;
          }
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

    .sidebar {
      width: 300px;
      display: flex;
      flex-direction: column;

      iframe {
        width: 100%;
        height: calc(100vh - 129px);
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/deep/ .send-status-modal.ant-modal-mask {
  display: none;
}
/deep/ .ant-modal-wrap.ant-modal-centered.send-status-modal {
  // display: none;
  background-color: rgba(0, 0, 0, 0.65);
  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-content {
    // box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.1);
    // border: 1px solid rgba(0, 0, 0, 0.45);
    width: 480px;
    height: 200px;
    padding-top: 60px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    .ant-modal-header {
      border-bottom: none;
      text-align: center;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      padding: 0;
    }
    .ant-modal-body {
      display: none;
    }
    .ant-modal-footer {
      border-top: none;
      margin-top: 44px;
      text-align: center;
      .ant-btn {
        width: 132px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        &.ant-btn-primary {
          color: #fff;
        }
      }
    }
  }
}
</style>
