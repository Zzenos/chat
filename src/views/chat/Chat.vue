<template>
  <div class="chat-cotainer" v-if="chatId != 0">
    <div class="main-container">
      <div class="wrap-title">
        <div style="display:flex;align-items:center;">
          <!-- 官方 -->
          <span v-if="chatType == 0" class="friend ellipsis">
            {{ wechatName }}
            <span class="system common">官方</span>
          </span>
          <!-- 客户名称 -->
          <span v-if="chatType == 1" class="friend ellipsis">
            {{ wechatName }}
            <span v-if="company" class="company common">{{ '@' + company }}</span>
            <span v-else class="we-chat common"> @微信</span>
          </span>
          <!-- 群聊名称 -->
          <span v-if="chatType == 2" class="group ellipsis">
            {{ groupInfo.groupName }}
            <span class="num" v-if="groupInfo.memberCount">{{ '(' + groupInfo.memberCount + ')' }}</span>
            <span class="out common" v-if="groupInfo.isInner === 0">外部</span>
            <span class="inner common" v-if="groupInfo.isInner === 1">内部</span>
          </span>
          <!-- 成员名称 -->
          <span v-if="chatType == 3" class="member ellipsis">
            {{ wechatName }}
            <span class="company common">{{ '@' + company }}</span>
          </span>
          <!-- 流失状态显示 -->
          <span class="lost-customer-title" v-if="[1, 3].includes(isLost)">
            <span class="text" v-text="isLost == 1 ? '流失客户' : '删除客户'"></span>
          </span>
        </div>
        <div style="color:rgba(0,0,0,0.45);margin-top:4px;" v-if="chatType == 2">由企业微信用户创建的{{ groupInfo.isInner === 0 ? '外部' : '内部' }}群 ｜ 群主：{{ groupData.ownerName }}</div>
      </div>
      <div class="wrap-body">
        <div class="talk-container" id="chatScrollbar" ref="list">
          <!-- 数据加载状态栏 -->
          <div class="loading-toolbar">
            <span class="pointer color-blue pull-history" @click="loadChatRecords">查看更多消息... </span>
            <a-icon v-show="loadingHistory" type="sync" :spin="true" />
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
            <!-- 消息时间 -->
            <div class="datetime no-select" v-text="sendTime(item.time)" v-show="compareTime(index, item.time)"></div>

            <!-- 系统通知 -->
            <div class="sys-info" v-if="item.msgType == 'system'" v-html="item.content" @click="reEdit(item)"></div>

            <!-- 对话消息 -->
            <div v-else class="message-box" :class="{ 'direction-rt': item.float == 'right' }">
              <!-- 多选框 'location', 'voice', 'card'暂不支持发送 -->
              <div
                v-if="multiSelect.isOpen && !['location', 'voice', 'card'].includes(item.msgType)"
                class="select-box"
                :class="{ selected: verifyMultiSelect(item) }"
                @click="triggerMultiSelect($event, item)"
              >
                <a-icon v-show="verifyMultiSelect(item)" class="select-icon" type="check-square" />
              </div>
              <!-- 头像 -->
              <div class="avatar-column">
                <a-avatar shape="square" :size="36" :src="item.sender.wechatAvatar" />
              </div>
              <div class="main-column">
                <!-- 昵称 在群聊时显示-->
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
                      :ref="'audio' + item.msgId"
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

                    <!-- 位置消息 -->
                    <location-message
                      v-else-if="item.msgType == 'location'"
                      :title="item.content.title"
                      :des="item.content.des"
                      :latitude="item.content.latitude"
                      :longitude="item.content.longitude"
                      @contextmenu.native="onCopy(index, item, $event)"
                    />

                    <!-- 视频号消息 -->
                    <video-num-message
                      v-else-if="item.msgType == 'videoNum'"
                      :vid="item.msgId"
                      :title="item.title"
                      :coverurl="item.coverUrl"
                      :des="item.desc"
                      :iconurl="item.content.icon"
                      :url="item.url"
                      @contextmenu.native="onCopy(index, item, $event)"
                    />

                    <!-- 转发会话记录消息 -->
                    <forward-message v-else-if="item.msgType == 'chatRecord'" :item="item" @click.native="catChatRecordMsg(item.content)" />

                    <!-- 消息发送状态 -->
                    <div class="status" v-if="item.status == 2" @click="clickStatus(index)">
                      <div class="center-fail">
                        <img src="@/assets/icon_resend.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <!-- 引用消息 -->
                  <reply-message v-if="item.msgType == 'text' && item.content != item.defaultContent" :float="item.float" :content="dealContent(item.content)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 客户流失 -->
        <div class="lost-customer" v-if="[1, 3].includes(isLost)">
          <div class="lost-text" v-text="isLost == 1 ? '客户已流失，消息无法送达，无法编辑内容' : '客户已删除，消息无法送达，无法编辑内容'"></div>
        </div>
        <div class="foot">
          <multi-select-modal v-if="multiSelect.isOpen" v-model="multiSelect.items.length" @event="handleMultiMode" />
          <me-editor v-else :chatType="chatType" :atList="groupData.members" :sendToBottom="sendToBottom" @showRecordModal="showRecordModal" :showRecordClick="!company" ref="editor" />
        </div>
      </div>
      <!-- 聊天记录弹窗 -->
      <chat-record-modal
        v-if="!company"
        :visible.sync="chatRecordVisible"
        :type="chatType == 2"
        :infoData="infoData"
        :title="chatRcordTitle"
        :recordType="recordType"
        :chatType="chatType"
        :isForwardMsg="isForwardMsg"
        :forwardMsgList="forwardMsgList"
      ></chat-record-modal>
      <!-- 选择群聊窗口 -->
      <transmit-msg-modal v-if="transmitMsgVisible" title="转发消息" :defaultList="defaultList" :msg="msgInfo" :visible.sync="transmitMsgVisible" @confirmSelect="transmitMsg"></transmit-msg-modal>
    </div>
    <div class="sidebar-container" v-if="chatType != 0">
      <div class="sidebar-top">
        <div class="avatar"><img :src="$route.query.wechatAvatar" alt="" /></div>
        <div class="info">
          <div>
            <span class="nickname ellipsis" v-if="chatType == 1 || chatType == 3">{{ wechatName }}</span>
            <span v-if="chatType == 1">
              <img v-if="allInfo.gender == 1" src="@/assets/icon_man.png" alt="" />
              <img v-else src="@/assets/icon_woman.png" alt="" />
            </span>
            <span v-if="chatType == 2 && editableGroupName">
              <a-input v-model="groupInfo.groupName" placeholder="" style="width: 150px; height: 24px;padding-left: 8px;" />
              <span class="edit-groupname confirm" @click="editGroupName('ok')">确认</span>
              <span class="edit-groupname" @click="editGroupName('cal')">取消</span>
            </span>
            <span v-if="chatType == 2 && !editableGroupName">
              <span class="nickname ellipsis">{{ groupInfo.groupName || '未命名' }}</span>
              <span class="edit-groupname" @click="openEditGroupName">编辑</span>
            </span>
          </div>
          <div class="source" v-if="chatType == 1 || chatType == 3">
            <span v-if="company" class="company common">{{ '@' + company }}</span>
            <span v-else class="we-chat common"> @微信</span>
          </div>
          <div v-else style="font-size: 14px;color: rgba(0,0,0,0.85);line-height: 22px;text-align: left;">群主: {{ groupInfo.ownerName }}</div>
        </div>
      </div>
      <a-tabs v-model="activeKey" :default-active-key="activeKey" :tabBarGutter="5" type="card" v-if="chatType == 2">
        <a-tab-pane key="groupInfo" tab="群资料">
          <div class="group-container" v-if="groupInfo.memberCount">
            <div class="notice-container">
              <div class="title">群公告</div>
              <div class="content">
                <div class="detail ellipsis">{{ groupInfo.groupNotice || '暂无群公告' }}</div>
                <div class="edit" v-if="isManager()" @click="editNotice">></div>
              </div>
              <a-modal v-model="editNoticeShow" wrapClassName="edit-notice-modal" title="群公告" centered @ok="completeEditNotice" @cancel="cancelEditNotice" ok-text="完成" cancel-text="取消">
                <div class="write-notice">
                  <textarea ref="groupNotice" placeholder="" v-model="groupInfo.groupNotice"></textarea>
                </div>
              </a-modal>
            </div>
            <div class="search">
              <a-input-search v-model="searchMember" placeholder="搜索群成员" style="width: 260px; height: 32px; margin: 16px 20px" />
            </div>
            <div class="member-count">群成员({{ groupInfo.memberCount }})</div>
            <div class="operate" @click="changeMembers('add')">
              <img src="@/assets/icon_addmembers.png" alt="" />
              <span>添加成员</span>
            </div>
            <div class="operate last" v-if="isManager()" @click="changeMembers('del')">
              <img src="@/assets/icon_deletemembers.png" alt="" />
              <span>删除成员</span>
            </div>
            <operate-group-meb
              v-if="operateMebVisible"
              :title="operateTitle"
              :visible.sync="operateMebVisible"
              :operateType="operateType"
              :groupList="groupInfo.members"
              :groupType="groupInfo.isInner"
              @confirmSelect="operateMeb"
            />
            <div class="member-container">
              <group-member :tjId="tjId" :members="groupInfo.members" :groupId="groupInfo.groupId" :ownerId="groupInfo.ownerId" />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="verbalTrick" tab="话术库">
          <iframe ref="verbalTrickFrame" title="话术库" :src="sidebarConfig.verbalTrick.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
        <a-tab-pane key="mediaLibrary" tab="素材库">
          <iframe ref="mediaLibraryFrame" title="素材库" :src="sidebarConfig.mediaLibrary.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
        <a-tab-pane key="redPacket" tab="小红包">
          <iframe ref="redPacketFrame" title="小红包" :src="sidebarConfig.redPacket.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
      </a-tabs>
      <a-tabs v-model="activeKey" :default-active-key="activeKey" :tabBarGutter="5" type="card" v-else>
        <a-tab-pane key="customerInfo" tab="客户画像">
          <iframe ref="customerInfoFrame" title="客户画像" :src="sidebarConfig.customerInfo.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
        <a-tab-pane key="orderDynamic" tab="订单动态">
          <iframe ref="orderDynamicFrame" title="订单动态" :src="sidebarConfig.orderDynamic.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
        <a-tab-pane key="verbalTrick" tab="话术库">
          <iframe ref="verbalTrickFrame" title="话术库" :src="sidebarConfig.verbalTrick.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
        <a-tab-pane key="mediaLibrary" tab="素材库">
          <iframe ref="mediaLibraryFrame" title="素材库" :src="sidebarConfig.mediaLibrary.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
        <a-tab-pane key="redPacket" tab="小红包">
          <iframe ref="redPacketFrame" title="小红包" :src="sidebarConfig.redPacket.src + '?userInfo=' + encodeURIComponent(JSON.stringify(userInfo))" frameborder="0">
            <p>Your Browser dose not support iframes</p>
          </iframe>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <div class="chat-cotainer" v-else>
    <div class="no-records">
      <div class="wrap-body">
        <div class="talk-container" id="chatScrollbar" ref="list" style="position:relative">
          <div style="position:absolute;left: 50%;top: calc(50% + 32px); transform: translate(-50%, -50%);">
            <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
          </div>
        </div>
        <div class="foot" style="display:none">
          <me-editor :sendToBottom="sendToBottom" ref="editor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import deepClone from 'lodash/cloneDeep'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/actionType'
import { formateTime, parseTime } from '@/util/util'
import api from '@/apis/chatRecord.js'
import iframeMixin from '@/mixin/iframeMixin'
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
import LocationMessage from '@/views/chat/components/LocationMessage'
import VideoNumMessage from '@/views/chat/components/VideoNumMessage'
import overTimeModal from '@/util/overTime'
import ChatRecordModal from '@/views/chat/components/ChatRecordModal'
import TransmitMsgModal from '@/views/chat/components/TransmitMsgModal'
import OperateGroupMeb from '@/views/chat/components/OperateGroupMeb'
import GroupMember from '@/views/chat/components/GroupMember'
import MultiSelectModal from '@/views/chat/components/MultiSelectModal'
import ForwardMessage from '@/views/chat/components/ForwardMessage'

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
    TransmitMsgModal,
    LocationMessage,
    VideoNumMessage,
    OperateGroupMeb,
    GroupMember,
    MultiSelectModal,
    ForwardMessage
  },
  data() {
    return {
      activeKey: '',
      loadRecord: 1,
      tjId: '',
      chatId: '',
      wechatId: '',
      wechatName: '',
      chatType: '',
      company: '',
      allInfo: {}, //客户信息 gender图标
      groupInfo: {
        groupName: '',
        memberCount: '',
        members: [],
        groupNotice: ''
      },
      modal2Visible: false,
      toRensendIndex: 0,
      onLine: navigator.onLine,
      isLost: '',
      // 控制聊天记录弹窗显示
      chatRecordVisible: false,
      // 当前查看记录的对象
      infoData: null,
      transmitMsgVisible: false,
      msgInfo: {}, // 消息体
      defaultList: [],
      searchMember: '',
      editNoticeShow: false,
      operateMebVisible: false,
      operateTitle: '添加群成员',
      operateType: 'add',
      editGroupNameVisible: {},
      editableGroupName: false,
      loadingHistory: false,
      groupData: '', // 群信息的原始数据
      multiSelect: {
        isOpen: false,
        items: []
      },
      chatRcordTitle: '聊天记录',
      recordType: 0, // 0 聊天记录 1 收藏记录
      isForwardMsg: false,
      forwardMsgList: []
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
    ...mapMutations([types.ADD_CHAT_LIST]),
    ...mapActions([types.SEND_MSG, types.PULL_HISTORY_MSG, types.RECALL_MSG, types.PULL_GROUP_DETAILS]),
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
    loadChatRecords() {
      if (this.loadRecord == 2) return
      this.loadingHistory = true
      this.loadRecord = 2
      this[types.PULL_HISTORY_MSG](this.chatId, this.chatType).then(() => {
        this.changeloadRocrd()
        this.loadingHistory = false
      })
    },
    changeloadRocrd() {
      this.loadRecord = 1
    },
    toResendMsg() {
      this.modal2Visible = false
      this.records[this.toRensendIndex].notResend = false
      this[types.SEND_MSG](this.records[this.toRensendIndex])
    },
    clickStatus(index) {
      this.modal2Visible = true
      this.toRensendIndex = index
    },
    updateOnlineStatus(e) {
      const { type } = e
      this.onLine = type === 'online'
    },
    closeOverModal() {
      overState.show = false
    },
    // 鼠标右键点击菜单选项
    onCopy(index, item, event) {
      let menus = []
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
      if (item.msgType == 'image') {
        menus.push({
          label: '添加表情',
          icon: 'collect',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            this.$refs.editor.collectEmotion(item)
          }
        })
      }
      if (item.fromId == this.tjId) {
        let time = new Date().getTime() - item.time
        if (Math.floor(time / 1000) < 115 && item.seq !== 0) {
          menus.push({
            label: '撤回',
            icon: 'icon-s-flag',
            customClass: 'cus-contextmenu-item',
            onClick: () => {
              this.revokeRecords(index, item)
            }
          })
        }
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
      menus.push({
        label: '多选',
        icon: 'finished',
        customClass: 'cus-contextmenu-item',
        onClick: () => {
          this.openMultiSelect()
        }
      })
      if (['1', '2'].includes(this.chatType)) {
        menus.push({
          label: '收藏',
          icon: 'collect',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            this.collectMsg([item])
          }
        })
      }
      this.$contextmenu({
        items: menus,
        event,
        customClass: 'cus-contextmenu',
        zIndex: 3,
        minWidth: 120
      })
      event.preventDefault()
    },
    // 引用消息
    replyRecords(index, item) {
      let content = item.defaultContent
      let container = document.createElement('div')
      container.innerHTML = content
      content = container.innerText
      container = null
      content = '"' + content + '"'
      this.$refs.editor.openReply(item.sender.wechatName, content)
    },
    // 引用消息中来自个微和企微消息的处理 '\n------\n' \n- - - - - - - - - - - - - - -\n
    dealContent(content) {
      return content.split('\n------\n').lenght > 1
        ? content.split('\n------\n').shift()
        : content.split('\n- - - - - - - - - - - - - - -\n').length > 1
        ? content.split('\n- - - - - - - - - - - - - - -\n').shift()
        : content.split('\n------\n').shift()
    },
    // 右键转发
    forwardRecords(index, item) {
      this.msgInfo = [item]
      if (['card', 'voice', 'location'].includes(this.msgInfo.msgType)) {
        this.$message.warning('该类型消息暂不支持转发')
        return
      }
      this.transmitMsgVisible = true
    },
    // 撤回消息
    revokeRecords(index, item) {
      this[types.RECALL_MSG]({ tjId: this.tjId, msg: item })
    },
    // 转发框
    transmitMsg() {
      this.transmitMsgVisible = false
      this.closeMultiSelect()
    },
    //聊天记录 0  我的收藏 1
    showRecordModal(type) {
      const { wechatName, wechatAvatar, chatType, externalWechatId, accountId, accountName, chatId } = this.$route.query
      let info =
        chatType == 2
          ? { group: { name: wechatName, avatar: wechatAvatar, groupId: this.chatId.split('&')[1] } }
          : { customerInfo: { name: wechatName, avatar: wechatAvatar, customerId: chatType == 0 ? chatId.split('&')[1] : externalWechatId } }
      this.infoData = {
        ...info,
        wechatAccount: { wechatName: accountName, wechatId: accountId }
      }
      this.chatRcordTitle = type == 0 ? '聊天记录' : '我的收藏'
      this.recordType = type
      this.isForwardMsg = false
      this.chatRecordVisible = true
    },
    // 语音转文字
    translateText(index, item) {
      this.$refs[`audio${item.msgId}`][0].audioToText()
    },
    closeTranslateText(index) {
      this.records[index].translateShow = false
      this.$forceUpdate()
    },
    editNotice() {
      this.editNoticeShow = true
      this.$nextTick(() => {
        this.$refs.groupNotice.innerText = ''
      })
    },
    // 确认编辑群公告
    completeEditNotice() {
      this.editNoticeShow = false
      if (!this.groupInfo.groupNotice) {
        this.$message.warning('群公告不能为空！')
        this.groupInfo.groupNotice = this.groupData.groupNotice
        return
      }
      this.$socket.emit('modify_group_notice', { tjId: this.tjId, groupId: this.groupInfo.groupId, groupNotice: this.groupInfo.groupNotice })
    },
    cancelEditNotice() {
      this.groupInfo.groupNotice = this.groupData.groupNotice
    },
    // 添加/删除 群成员
    changeMembers(type) {
      this.operateMebVisible = true
      this.operateTitle = type == 'add' ? '添加群成员' : '删除群成员'
      this.operateType = type
    },
    operateMeb(list, type) {
      this.operateMebVisible = false
      let ids = list.map(item => item.wechatId)
      if (type == 'add') {
        this.$socket.emit('inviter_join_group', { tjId: this.tjId, groupId: this.groupInfo.groupId, memberIds: ids })
      } else {
        this.$socket.emit('remove_member', { tjId: this.tjId, groupId: this.groupInfo.groupId, memberIds: ids })
      }
    },
    // 确认编辑群名称
    editGroupName(type) {
      this.editGroupNameVisible.meb = false
      this.editableGroupName = false
      if (type == 'ok') {
        this.$socket.emit('modify_group_name', { tjId: this.tjId, groupId: this.groupInfo.groupId, groupName: this.groupInfo.groupName })
      } else {
        this.groupInfo.groupName = this.groupData.groupName
      }
    },
    openEditGroupName() {
      this.editableGroupName = true
    },
    getGroupDetail() {
      this[types.PULL_GROUP_DETAILS]({ tjId: this.tjId, groupId: this.wechatId })
    },
    // 撤回了一条消息 重新编辑
    reEdit(item) {
      if (item.content.indexOf('撤回了一条消息') > -1) {
        let m = this.$store.getters.getRecallMsg(item.seq)
        if (!m || m.msgType !== 'text') return
        this.$refs.editor.addRecallMsg(m.content)
      }
    },
    // 开启多选模式
    openMultiSelect() {
      this.multiSelect.isOpen = true
    },
    verifyMultiSelect(i) {
      return this.multiSelect.items.some(item => item.msgId === i.msgId)
    },
    // 多选 勾选
    triggerMultiSelect(e, v) {
      // ['talk-content', 'text-message', 'SVGAnimatedString'] 改变多选点击区域
      // if (!['talk-content', 'text-message left', 'text-message right', 'SVGAnimatedString'].includes(e.target.className) || !this.multiSelect.isOpen) return
      let flag = false
      let index = 0
      this.multiSelect.items.forEach((item, i) => {
        if (item.msgId === v.msgId) {
          flag = true
          index = i
        }
      })
      if (flag) {
        this.multiSelect.items.splice(index, 1)
      } else {
        if (this.multiSelect.items.length >= 30) {
          this.$message.warning('批量操作最大支持30条数据')
          return false
        }
        this.multiSelect.items.push(v)
      }
    },
    handleMultiMode(value) {
      if (value === 'close') {
        this.closeMultiSelect()
      }
      if (value === 'collect') {
        this.collectMsg(this.multiSelect.items)
        this.closeMultiSelect()
      }
      if (value === 'forward') {
        console.log(this.multiSelect.items)
        this.msgInfo = this.multiSelect.items
        this.transmitMsgVisible = true
      }
    },
    closeMultiSelect() {
      this.multiSelect.isOpen = false
      this.multiSelect.items = []
    },
    // 收藏消息 []
    collectMsg(v) {
      v.forEach(item => {
        let id = { msgId: item.msgId.split('&')[0] + item.msgId.split('&')[2] }
        api.collectChatRecord(id)
      })
    },
    // 判断是否是群管理员
    isManager() {
      let flag = false
      this.groupData.members.forEach(i => {
        if (i.tjId === this.tjId) {
          flag = i.type != 0
        }
      })
      return flag
    },
    catChatRecordMsg(list) {
      this.isForwardMsg = true
      this.forwardMsgList = [
        { msgtype: 'text', content: 'text-msg12', sender: {} },
        { msgtype: 'text', content: 'text-msg2', sender: {} },
        { msgtype: 'link', content: 'https://www.baidu.com/', sender: {} },
        { msgtype: 'image', fileUrl: 'http://zm-weike.oss-cn-beijing.aliyuncs.com/app/1430093156275326976.gif', sender: {} }
      ]
      console.log(list)
      // this.forwardMsgList = []
      this.chatRcordTitle = '聊天记录'
      this.chatRecordVisible = true
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal === oldVal) return
        const { wechatId, wechatName, chatType, lost, externalWechatId, alias, company } = newVal.query
        const { tjId, contactId } = newVal.params
        const accountInfo = this.userDetailsById(tjId)
        this.tjId = tjId
        this.chatId = contactId //获取传来的参数
        this.wechatId = wechatId
        this.wechatName = alias || wechatName
        this.chatType = chatType
        this.company = company
        this.isLost = lost
        this.sendToBottom()
        this.closeMultiSelect()
        console.log(this.records, 'chat-records')
        this.defaultList = [newVal.query]
        this.onLine = navigator.onLine
        this.userInfo = {
          corpId: this.$store.state.userInfo.corpId || 'wwfc3ae560ee1592d8',
          userId: accountInfo.info.wechatId,
          nickname: chatType == 2 ? '' : wechatName
        }
        // 获取群资料
        if (chatType == 2) {
          this.activeKey = 'groupInfo'
          this.userInfo.groupId = externalWechatId
          if (!this.groupInfoI) {
            this.getGroupDetail()
          }
        }
        if (chatType == 1) {
          this.activeKey = 'customerInfo'
          this.$socket.emit(`customer_info`, { tjId: tjId, customerId: wechatId }, ack => {
            this.allInfo = ack.data || {}
            this.userInfo.contactUserId = this.allInfo.externalWechatId
          })
        }
        if (chatType == 3) {
          this.activeKey = 'customerInfo'
          this.userInfo.contactUserId = externalWechatId
        }
      }
    },
    records(n, o) {
      if (n.length === o.length) return
      if (this.loadRecord == 1) {
        this.sendToBottom()
      }
    },
    isLostRequest(newVal) {
      this.isLost = newVal && newVal.lost
      if (newVal && (newVal.lost == '1' || newVal.lost == '3')) {
        this.$nextTick(() => {
          this.$refs.editor.changePlaceholder(newVal.lost)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.editor.changePlaceholderT()
        })
      }
    },
    searchMember: {
      immediate: true,
      handler(n) {
        if (this.chatType != 2) return
        this.groupInfo.members = n ? this.groupData.members.filter(ele => ele.wechatName && ele.wechatName.indexOf(n) > -1) : this.groupData.members
      }
    },
    groupInfoI: {
      immediate: true,
      handler(n) {
        this.groupInfo = n
        this.groupData = deepClone(n)
      }
    }
  },
  computed: {
    records() {
      return this.$store.getters.getMsgsByChatId(this.chatId).map(item => {
        item.float = item.fromId == this.tjId ? 'right' : 'left'
        if (
          item.msgType == 'system' &&
          item.content.indexOf('撤回了一条消息') > -1 &&
          new Date().getTime() / 1000 - item.time / 1000 < 300 &&
          item.fromId == this.tjId &&
          item.content.indexOf('重新编辑') == -1 &&
          this.$store.getters.getRecallMsg(item.seq) &&
          this.$store.getters.getRecallMsg(item.seq).msgType == 'text'
        ) {
          item.content = item.content + '<span style="color:#1d61ef;cursor:pointer;">重新编辑</span>'
        }
        return item
      })
    },
    ...mapGetters(['contactInfoByWechatId', 'userDetailsById', 'groupDetailsById']),
    isLostRequest() {
      return this.contactInfoByWechatId(this.tjId, this.wechatId)
    },
    showOverModal() {
      return overState.show
    },
    groupInfoI() {
      return this.groupDetailsById(this.wechatId) || ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chat-cotainer {
  display: flex;
  height: 100vh;
  font-weight: 400;
  line-height: 18px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;

  .no-records {
    flex: 1 1 0;
    display: flex;
    .wrap-body {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e4e5e7;
      .talk-container {
        flex: 1 1 0;
      }
    }
  }

  .main-container {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    .wrap-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 68px;
      padding-left: 20px;
      text-align: left;
      border-bottom: 1px solid #e4e5e7;

      .friend,
      .group,
      .member {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        max-width: 450px;
      }
      .out {
        padding: 1px 4px;
        margin-left: 4px;
        background: #daf2e8;
        color: #0ea860;
      }
      .inner {
        padding: 1px 4px;
        margin-left: 4px;
        background: #e1eaff;
        color: #1d61ef;
      }
      .lost-customer-title {
        width: 56px;
        height: 18px;
        background: #dcdee0;
        margin-left: 8px;
        border-radius: 2px;
        text-align: center;
        .text {
          color: rgba(0, 0, 0, 0.65);
          font-size: 11px;
          line-height: 16px;
        }
      }
    }
    .wrap-body {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e4e5e7;
      position: relative;
      .talk-container {
        flex: 1 1 0;
        box-sizing: border-box;
        padding: 40px 10px 10px;
        overflow-y: auto;
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
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
          padding: 10px 0;
          span {
            margin-left: 8px;
            color: rgba(0, 0, 0, 0.65);
          }
        }

        .talk-title {
          display: none;
          height: 15px;
          margin-bottom: 4px;
          color: rgba(0, 0, 0, 0.45);
          text-align: left;
          &.show {
            display: block;
          }
        }

        .datetime {
          height: 18px;
          color: rgba(0, 0, 0, 0.45);
          text-align: center;
          margin-top: 40px;
          margin-bottom: 40px;
        }

        .sys-info {
          width: 300px;
          color: rgba(0, 0, 0, 0.45);
          text-align: center;
          margin: 20px auto;
          cursor: pointer;
        }

        .message-box {
          width: 100%;
          min-height: 46px;
          margin-top: 20px;
          display: flex;

          .select-box {
            width: 16px;
            height: 16px;
            align-self: center;
            margin-right: 10px;
            cursor: pointer;
            font-size: 16px;
            background: #ffffff;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            &.selected {
              background: #fff;
              color: #1d61ef;
              border: none;
            }
            .select-icon {
              display: block;
            }
          }

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
          color: rgba(0, 0, 0, 0.85);
          margin: 11px auto;
        }
      }
      .foot {
        height: 160px;
      }
    }
  }
  .sidebar-container {
    width: 350px;
    display: flex;
    flex-direction: column;
    .sidebar-top {
      display: flex;
      padding-top: 40px;
      height: 140px;
      background: linear-gradient(180deg, rgba(29, 97, 239, 0.2), rgba(29, 97, 239, 0));
      .avatar {
        margin-left: 28px;
        margin-right: 16px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 12px;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        margin-top: 8px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        .nickname {
          margin-right: 8px;
          max-width: 150px;
          display: block;
          float: left;
        }
        .edit-groupname {
          position: absolute;
          right: 50px;
          font-size: 12px;
          cursor: pointer;
          &.confirm {
            right: 20px;
          }
        }
        .source {
          text-align: left;
          font-size: 12px;
          color: #0ead63;
          line-height: 18px;
          margin-top: 4px;
        }
      }
    }
    /deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
      height: 80px;
    }
    /deep/.ant-tabs-bar {
      margin: 0;
      margin-bottom: 20px;
      border-bottom: none;
      .ant-tabs-nav {
        > div {
          display: flex;
          flex-wrap: wrap;
          // justify-content: center;
          align-content: flex-start;
          padding-left: 14px;
          .ant-tabs-tab {
            width: 107px;
            box-sizing: border-box;
            border-color: #1d61ef;
            background: #fff;
            margin: 0 !important;
            font-size: 14px;
            padding: 0px 15px;
            &:nth-of-type(1) {
              border-radius: 4px 0px 0px 0px;
            }
            &:nth-of-type(2) {
              border-radius: 0px;
              border-left: 0px;
            }
            &:nth-of-type(3) {
              border-radius: 0px 4px 4px 0px;
              border-left: 0px;
            }
            &:nth-of-type(3n + 4) {
              border-radius: 0px 0px 0px 4px;
              border-top: none;
            }
            &:nth-of-type(3n + 5) {
              border-radius: 0px 0px 0px 0px;
              border-left: 0px;
              border-top: 0px;
            }
            &:nth-of-type(3n + 6) {
              border-radius: 0px 0px 4px 0px;
              border-left: 0px;
              border-top: 0px;
            }
          }
          .ant-tabs-tab-active {
            background: #1d61ef;
            color: #fff;
          }
        }
      }
    }
    /deep/.ant-tabs-tab .ant-tabs-tab-active {
      border-color: #000;
      background: #fff;
    }
    iframe {
      width: 100%;
      height: calc(100vh - 215px);
    }

    .group-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 215px);
      padding: 20px;
      text-align: left;
      flex: 1 1 0;
      overflow-y: auto;
      .notice-container {
        font-family: PingFangSC, PingFangSC-Regular;
        .title {
          color: rgba(0, 0, 0, 0.45);
          margin-bottom: 8px;
        }
        .content {
          display: flex;
          justify-content: space-between;
          padding-right: 10px;
          color: rgba(0, 0, 0, 0.65);
          .detail {
            max-width: 250px;
          }
          .edit {
            color: rgba(0, 0, 0, 0.25);
            cursor: pointer;
          }
        }
      }
      .member-count {
        font-weight: 600;
        margin: 10px 0;
      }
      .search {
        /deep/.ant-input-search.ant-input-affix-wrapper {
          margin: 16px 0px !important;
          width: 280px !important;
        }
      }
      .operate {
        height: 36px;
        margin-top: 20px;
        margin-bottom: 10px;
        cursor: pointer;
        span {
          margin-left: 12px;
        }
      }
      .last {
        margin-bottom: 10px;
      }
      .member-container {
        flex: 1 1 0;
        overflow-y: auto;
      }
    }
  }
  .common {
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
  }
  .system {
    width: 30px;
    background: #e1eaff;
    padding: 1px 2px;
    color: #1d61ef;
  }
  .company {
    color: #ff8000;
  }
  .we-chat {
    color: #0ead63;
  }
}

/deep/ .send-status-modal.ant-modal-mask,
/deep/ .edit-notice-modal.ant-modal-mask {
  display: none;
}
/deep/ .ant-modal-wrap.ant-modal-centered.send-status-modal {
  background-color: transparent;
  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-content {
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
/deep/ .ant-modal-wrap.ant-modal-centered.edit-notice-modal {
  background-color: transparent;
  .ant-modal-close-x {
    display: none;
  }
  .ant-modal {
    width: 350px !important;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    width: 480px;
    height: 400px;
    padding: 24px;
    border-radius: 4px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
    .ant-modal-header {
      border-bottom: none;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      padding: 0;
    }
    .ant-modal-body {
      flex: 1 1 0;
      padding: 24px 0px 0px;
      .write-notice {
        textarea {
          width: 432px;
          height: 248px;
          border: none;
          outline: none;
          resize: none;
        }
      }
    }
    .ant-modal-footer {
      border-top: none;
      text-align: center;
      .ant-btn {
        width: 120px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        border: none;
        background: #ffffff;
        color: rgba(0, 0, 0, 0.65);
        border: 1px solid #d9d9d9;
        line-height: 22px;
        &.ant-btn-primary {
          margin-left: 20px;
          background: #1d61ef;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
