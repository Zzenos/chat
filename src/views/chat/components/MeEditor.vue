<template>
  <div class="meEditor">
    <div class="emoj">
      <ul>
        <li v-if="!lost" ref="emojiBox" v-wheel="changeEmojiList" id="emoji-parent" wheel-disabled="0">
          <a-popover
            v-model="emojiVisible"
            :getPopupContainer="
              triggerNode => {
                return triggerNode.parentNode
              }
            "
            trigger="click"
            @visibleChange="hideEmojiSelect"
          >
            <div slot="content" class="emoji-content">
              <a-tabs v-model="activeKey" :default-active-key="activeKey" :tabBarGutter="5" type="card" tab-position="bottom">
                <a-tab-pane key="sys">
                  <span slot="tab">
                    <img src="@/assets/chat_icon_emoticon.png" alt="" />
                  </span>
                  <div style="height:346px; overflow:hidden;">
                    <a-carousel ref="emojiCarousel" :afterChange="changeEnd">
                      <div v-for="(item, index) in emojiPageList" :key="index" class="emoji-page">
                        <span class="emoji-item" v-for="(e, i) in item" :key="i" @click="insertEmoji(e.content)">{{ e.content }}</span>
                      </div>
                      <div slot="customPaging">
                        <span class="carousel-circle"></span>
                      </div>
                    </a-carousel>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="heart">
                  <span slot="tab">
                    <img src="@/assets/chat_emotion_collection.png" alt="" />
                  </span>
                  <div class="heart-wrap" style="height:346px;overflow-y:auto;">
                    <div class="heart-item">
                      <div class="upload-emo" @click="uploadEmotion">
                        <upload
                          :showType="'emotion'"
                          :sendType="'emotion'"
                          :accept="['png', 'jpg', 'jpeg']"
                          :maxSize="20 * 1024 * 1024"
                          :getOssTokenApi="uploadFile.getOssTokenApi"
                          :notifyCheckApi="uploadFile.notifyOssCheck"
                          @uploaded="uploaded"
                        >
                        </upload>
                      </div>
                    </div>
                    <div class="heart-item" v-for="(item, index) in heartList" :key="index">
                      <img :src="item" alt="" @click="sendHeartEmoji(item)" />
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
            <img src="@/assets/chat_icon_emoticon.png" alt="" />
          </a-popover>
        </li>
        <li v-if="!lost">
          <upload
            :showType="'image'"
            :sendType="'iv'"
            :accept="['png', 'jpg', 'JPG', 'jpeg', 'mp4']"
            :maxSize="20 * 1024 * 1024"
            :getOssTokenApi="uploadFile.getOssTokenApi"
            :notifyCheckApi="uploadFile.notifyOssCheck"
            @uploaded="uploaded"
          >
          </upload>
        </li>
        <li v-if="!lost">
          <upload
            :showType="'file'"
            :sendType="'file'"
            :accept="['pdf', 'lpdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'xlsx', 'zip', 'exe']"
            :maxSize="50 * 1024 * 1024"
            :getOssTokenApi="uploadFile.getOssTokenApi"
            :notifyCheckApi="uploadFile.notifyOssCheck"
            @uploaded="uploaded"
          >
          </upload>
        </li>
        <li v-if="!lost && showRecordClick" class="chat-record">
          <img src="@/assets/chat_icon_collection.png" class="collection" alt="" @click="showRecordModal('1')" />
          <img src="@/assets/chat_icon_record.png" alt="" @click="showRecordModal('0')" />
        </li>
        <!-- ?????????????????? -->
        <li v-if="lost">
          <img src="@/assets/chat_icon_emoticon_lost.png" alt="" />
        </li>
        <li v-if="lost">
          <img src="@/assets/chat_icon_image_lost.png" alt="" />
        </li>
        <li v-if="lost && showRecordClick" class="chat-record" @click="showRecordModal('0')">
          <img src="@/assets/chat_icon_record.png" alt="" />
        </li>
      </ul>
    </div>
    <!-- <textarea :placeholder="placeholder" :readonly="readonly" v-model="editorText" @input="inputEvent($event)" @keydown="keydownEvent($event)" rows="6" /> -->
    <div class="meditor-foot">
      <div
        ref="messagInput"
        class="message-input"
        id="message-input"
        tabindex="1"
        :contentEditable="!readonly"
        :placeholder="placeholder"
        @keydown="keydownEvent($event)"
        @input="changeText"
        @blur="editBlur"
        rows="6"
      ></div>
      <div class="reply" v-show="replyShow">
        <div class="reply-content">
          <div class="meditor-reply-content">{{ replyName }}:{{ replyContent }}</div>
        </div>
        <div class="close-reply" @click="closeReply">
          <img src="@/assets/close.png" alt="" />
        </div>
      </div>
    </div>
    <div class="at-container" id="selectuser" v-show="atShow && chatType == 2">
      <div class="at-all" @click="choose('all')">
        <img src="@/assets/icon_all.png" alt="" />
        <div>?????????</div>
      </div>
      <div class="note">?????????</div>
      <div class="at-item" v-for="item in filterAtList" :key="item.wechatId" @click="choose(item)">
        <a-avatar shape="square" :size="28" :src="item.wechatAvatar" />
        <span class="name ellipsis"> {{ item.wechatName }} </span>
      </div>
    </div>
  </div>
</template>
<script>
import deepClone from 'lodash/cloneDeep'
import { mapActions, mapMutations } from 'vuex'
import * as types from '@/store/actionType'
import Upload from '@/views/chat/components/Upload.vue'
import filesLibrary from '@/apis/library'
import { emojiList } from '@/util/emojiList'
import { wheel } from '@/util/wheel.js'
import { downloadImg } from '@/util/util'

export default {
  components: { Upload },
  name: 'MeEditor',
  props: {
    sendToBottom: {
      type: Function,
      default: () => {}
    },
    showRecordClick: {
      type: Boolean,
      default: true
    },
    chatType: {
      type: String,
      default: '1'
    },
    atList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      placeholder: '???????????????shift+enter?????????enter??????',
      editorText: '',
      readonly: false,
      lost: false,
      // ????????????
      uploadFile: {
        getOssTokenApi: filesLibrary.getOssToken,
        notifyCheckApi: filesLibrary.notifyOssCheck
      },
      isfocus: false,
      isChange: true,
      sendText: '',
      value: '',
      // ???????????????
      prefix: ['{', '}'],
      // ????????????
      disabled: false,
      // ??????emoji????????????
      emojiVisible: false,
      // emoji????????????
      parentNode: null,
      // emoji??????
      emojiList,
      // emoji????????????
      emojiPageList: [],
      rangeOfInputBox: null,
      timer: null,
      replyShow: false,
      replyName: '',
      replyContent: '',
      atShow: false,
      filterAtList: [],
      atContactSerialNos: [],
      inputFlag: true,
      arr: [], // @????????????
      heartList: [],
      activeKey: 'sys'
    }
  },
  directives: {
    wheel
  },
  created() {
    this.handleEmojiList()
  },
  computed: {
    userInfo() {
      return this.$store.getters.userDetailsById
    }
  },
  methods: {
    ...mapActions([types.SEND_MSG]),
    ...mapMutations(['setDraft', 'clearDraft']),
    inputEvent() {
      // console.log('send', e)
    },
    async keydownEvent(e) {
      if (e.code == 'Digit2' && e.shiftKey == true) {
        setTimeout(() => {
          if (this.$refs.messagInput.innerText[this.$refs.messagInput.innerText.length - 1] == '@') {
            this.atShow = true
          }
        }, 0)
      }
      if (e.keyCode == 13 && e.shiftKey == false) {
        e.preventDefault()
        let allnodes = [...this.$refs.messagInput.childNodes]
        let curText = ''
        let curTextList = []
        let imgList = []
        for (let i = 0; i < allnodes.length; i++) {
          if (allnodes[i].nodeName === 'IMG') {
            // ???????????????????????????
            if (allnodes[i].src.indexOf('data:image/png;base64') != -1) {
              imgList.push(allnodes[i].src)
            } else {
              let url = await downloadImg(allnodes[i].src)
              imgList.push(url)
            }
            if (curText) {
              curTextList.push(curText)
              curText = ''
            }
          } else if (allnodes[i].nodeName === '#comment') {
            // ???????????????????????????
          } else if (allnodes[i].nodeName === '#text') {
            //???????????????????????????  textContent  wholeText
            curText = curText + allnodes[i].textContent
          } else if (allnodes[i].nodeName === 'BR') {
            //???????????????????????????
            curText = curText + '\n'
          } else if (allnodes[i].nodeName === 'DIV') {
            //????????????  ????????????????????? ???div??? ??????
            curText = curText + allnodes[i].textContent + '\n'
          } else {
            //????????????  ??????????????????????????? span
            curText = curText + allnodes[i].textContent
          }
          if (i == allnodes.length - 1 && curText) {
            curTextList.push(curText)
          }
        }
        // console.log(curTextList, imgList)
        this.sendTextMsg(curTextList)
        this.sendImgMsg(imgList)
        this.sendToBottom()
        this.atContactSerialNos = []
        this.arr = []
        this.editorText = ''
        this.replyContent = ''
        this.$refs.messagInput.innerHTML = ''
        this.closeReply()
        this.clearDraft({ chatId: this.$route.query.chatId })
      }
    },
    changePlaceholder(type) {
      this.placeholder = type == 1 ? '?????????????????????????????????????????????????????????' : '?????????????????????????????????????????????????????????'
      this.readonly = true
      this.lost = true
    },
    changePlaceholderT() {
      this.placeholder = '???????????????shift+enter?????????enter??????'
      this.readonly = false
      this.lost = false
    },
    showRecordModal(type) {
      this.$emit('showRecordModal', type)
    },
    // ?????????????????????????????????
    uploaded(e, type) {
      console.log(e, type)
      let { contactId, tjId } = this.$route.params
      let { wechatName, wechatAvatar } = this.userInfo.info
      let sendData = {
        chatId: contactId,
        chatType: this.$route.query.chatType,
        fromId: tjId,
        toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
        sender: {
          wechatName: wechatName,
          wechatAvatar: wechatAvatar
        },
        notResend: true
      }
      if (type == 'file') {
        sendData.msgType = 'file'
        sendData.url = e.OssInfo.host + '/' + e.OssInfo.key
        sendData.title = e.OssInfo.filename
      }
      if (type == 'iv') {
        sendData.msgType = e.file.type.split('/')[0]
        sendData.url = e.OssInfo.host + '/' + e.OssInfo.key
        sendData.coverUrl = e.OssInfo.host + '/' + e.OssInfo.key + '?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0'
      }
      if (type == 'emotion') {
        let url = e.OssInfo.host + '/' + e.OssInfo.key
        this.$socket.emit('upload_emoticon', { token: this.$store.state.token, emoticonUrl: url }, ack => {
          console.log(ack, 'upload_emoticon')
          this.getEmoction()
        })
        return
      }
      console.log(sendData, 'sendData')
      this[types.SEND_MSG](sendData)
    },
    // ???????????? @ ??? ??????
    changeText() {
      setTimeout(() => {
        if (!this.inputFlag) return
        const value = deepClone(this.$refs.messagInput.innerText)
        this.value = value
        this.editorText = this.value
        // console.log(this.editorText, '----', this.$route.query.chatId)
        this.setDraft({ chatId: this.$route.query.chatId, draft: this.editorText })
        this.filterAtList = this.atList
        if (this.atShow) {
          this.filterAtList = this.value && this.value.split('@').pop() ? this.atList.filter(ele => ele.wechatName && ele.wechatName.indexOf(this.value.split('@').pop()) > -1) : this.atList
        }
        if (this.filterAtList.length == 0 || !this.value) {
          this.atShow = false
        }
      }, 0)
    },
    editBlur() {
      this.isChange = true
    },
    changeEmojiList(isNext) {
      this.$refs.emojiCarousel[isNext ? 'next' : 'prev']()
    },
    changeEnd() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.emojiBox.setAttribute('wheel-disabled', '0')
      }, 300)
    },
    insertSpecialText(text) {
      if (this.disabled) return
      const content = `${(text.prefix && text.prefix[0]) || this.prefix[0] || ''}${text.content || text}${(text.prefix && text.prefix[1]) || this.prefix[1] || ''}`
      this.insertEmoji(content)
    },
    insertEmoji(emoji, isFocus = true) {
      this.getEndFocus()
      const emojiEl = document.createTextNode(emoji)
      if (!this.rangeOfInputBox) {
        this.rangeOfInputBox = new Range()
        this.rangeOfInputBox.selectNodeContents(this.$refs.messagInput)
        // ?????????????????????
        this.rangeOfInputBox.collapse(false)
      }
      // ????????????????????????
      if (this.rangeOfInputBox.collapsed) {
        this.rangeOfInputBox.insertNode(emojiEl)
      } else {
        this.rangeOfInputBox.deleteContents()
        this.rangeOfInputBox.insertNode(emojiEl)
      }
      this.emojiVisible = false
      this.changeText()
      this.rangeOfInputBox.collapse(false)
      // ??????????????????????????????
      if (isFocus && this.rangeOfInputBox) {
        const selection = getSelection()
        selection.removeAllRanges()
        selection.addRange(this.rangeOfInputBox)
      }
    },
    hideEmojiSelect() {
      if (this.disabled) {
        this.emojiVisible = false
      }
    },
    handleEmojiList() {
      const eachPage = 72
      const page = Math.ceil(this.emojiList.length / eachPage)
      for (let i = 0; i < page; i++) {
        this.$set(this.emojiPageList, i, this.emojiList.slice(i * eachPage, (i + 1) * eachPage))
      }
    },
    handleClick(event) {
      const target = event.target
      if (target.tagName.toLowerCase() === 'img') {
        const range = new Range()
        range.setStartBefore(target)
        range.collapse(true)
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(range)
      }
    },
    getEndFocus() {
      // ????????????????????????
      document.onselectionchange = () => {
        const selection = document.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          if (this.$refs.messagInput?.contains(range.commonAncestorContainer)) {
            this.rangeOfInputBox = range
          }
        }
      }
    },
    closeReply() {
      this.replyShow = false
    },
    openReply(name, content) {
      this.replyShow = true
      this.replyName = name
      this.replyContent = content
    },
    // ????????????@??????
    choose(v) {
      this.atShow = false
      if (v == 'all') {
        this.atContactSerialNos.unshift('all')
      } else {
        this.atContactSerialNos.push(v.tjId)
      }
      this.filterAtList = this.atList
      this.$refs.messagInput.innerHTML = this.$refs.messagInput.innerHTML.replace(this.$refs.messagInput.innerHTML.split('@').pop(), '')
      this.rangeOfInputBox = new Range()
      this.rangeOfInputBox.selectNodeContents(this.$refs.messagInput)
      this.rangeOfInputBox.collapse(false)
      let replaceText = v == 'all' ? '?????????' : v.wechatName
      let b = '@' + replaceText
      this.arr.push(b)
      let spanNode = document.createTextNode(replaceText)
      if (this.rangeOfInputBox.collapsed) {
        this.rangeOfInputBox.insertNode(spanNode)
      } else {
        this.rangeOfInputBox.deleteContents()
        this.rangeOfInputBox.insertNode(spanNode)
      }
      this.changeText()
      this.rangeOfInputBox.collapse(false)
      // ??????????????????????????????
      if (this.rangeOfInputBox) {
        const selection = getSelection()
        selection.removeAllRanges()
        selection.addRange(this.rangeOfInputBox)
      }
    },
    onCompositionStart() {
      this.inputFlag = false
    },
    onCompositionEnd() {
      this.inputFlag = true
    },
    sendTextMsg(curTextList) {
      //??????????????????
      if (curTextList.length == 0) return
      for (let i = 0; i < curTextList.length; i++) {
        if (!curTextList[i]) return
        let { contactId, tjId } = this.$route.params
        let { wechatName, wechatAvatar } = this.userInfo.info
        let { chatType } = this.$route.query
        let msg = {
          chatId: contactId,
          chatType: chatType,
          fromId: tjId,
          toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
          sender: {
            wechatName: wechatName,
            wechatAvatar: wechatAvatar
          },
          notResend: true
        }
        let content = null
        //?????????????????????????????????????????????
        if (i == 0) {
          if (chatType == 1) {
            //??????
            content = this.replyContent ? this.replyContent + '\n- - - - - - - - - - - - - - -\n' + curTextList[i] : curTextList[i]
          } else {
            content = this.replyContent ? this.replyContent + '\n------\n' + curTextList[i] : curTextList[i]
          }
        } else {
          content = curTextList[i]
        }
        msg.content = content
        // ??????@id
        if (chatType == 2) {
          let copyIds = []
          this.atContactSerialNos.forEach(item => {
            if (item == 'all') copyIds.unshift('all')
            this.atList.forEach(val => {
              if (val.tjId == item) {
                // console.log(val.wechatName, curTextList[i].indexOf(val.wechatName) > -1, curTextList[i], curTextList[i].indexOf(val.wechatName), this.atContactSerialNos.indexOf(val.tjId))
                if (curTextList[i] && curTextList[i].indexOf(val.wechatName) == -1) {
                  // this.atContactSerialNos.splice(this.atContactSerialNos.indexOf(val.tjId), 1)
                } else {
                  copyIds.push(val.tjId)
                }
              }
            })
          })
          msg.atLocation = 1
          if (copyIds.includes('all')) {
            copyIds.shift()
            msg.atContactSerialNos = copyIds
            msg.at = 1
          } else {
            msg.atContactSerialNos = copyIds
            msg.at = copyIds.length == 0 ? 0 : 2
          }
          msg.grpContent = content
          this.arr.forEach(val => {
            // @????????? content.indexOf(val) == 0  @????????? content.length == content.indexOf(val) + val.length
            if (content.indexOf(val) == 0) msg.atLocation = 0
            content = content.replace(val, '')
          })
          msg.content = content
        }
        msg.msgType = 'text'
        this[types.SEND_MSG](msg)
      }
    },
    // ????????????
    sendImgMsg(imgList) {
      if (imgList.length == 0) return
      for (let i = 0; i < imgList.length; i++) {
        let { contactId, tjId } = this.$route.params
        let { wechatName, wechatAvatar } = this.userInfo.info
        let { chatType } = this.$route.query
        let msg = {
          chatId: contactId,
          chatType: chatType,
          fromId: tjId,
          toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
          sender: {
            wechatName: wechatName,
            wechatAvatar: wechatAvatar
          },
          notResend: true
        }
        msg.msgType = 'image'
        filesLibrary.getImgUrl({ base64_image: imgList[i] }).then(res => {
          if (res.code == 200) {
            msg.url = res.data.url
            this[types.SEND_MSG](msg)
          }
        })
      }
    },
    // ??????????????????
    addRecallMsg(v) {
      this.$refs.messagInput.innerHTML = this.$refs.messagInput.innerHTML + v
      this.focus()
    },
    // ??????
    focus() {
      this.$refs.messagInput.focus()
      this.rangeOfInputBox = new Range()
      this.rangeOfInputBox.selectNodeContents(this.$refs.messagInput)
      this.rangeOfInputBox.collapse(false)
      this.changeText()
      const selection = getSelection()
      selection.removeAllRanges()
      selection.addRange(this.rangeOfInputBox)
    },
    // ???????????????
    sendHeartEmoji(item) {
      this.emojiVisible = false
      this.activeKey = 'sys'
      let { contactId, tjId } = this.$route.params
      let { wechatName, wechatAvatar } = this.userInfo.info
      let sendData = {
        chatId: contactId,
        chatType: this.$route.query.chatType,
        fromId: tjId,
        toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
        sender: {
          wechatName: wechatName,
          wechatAvatar: wechatAvatar
        },
        notResend: true
      }
      sendData.msgType = 'image'
      sendData.url = item
      this[types.SEND_MSG](sendData)
    },
    // ???????????????
    getEmoction() {
      this.$socket.emit('download_emoticon', { token: this.$store.state.token }, ack => {
        this.heartList = ack.data
      })
    },
    uploadEmotion() {
      this.emojiVisible = false
    },
    // ????????????
    collectEmotion(e) {
      if (!this.heartList.includes(e.url)) {
        this.$socket.emit('upload_emoticon', { token: this.$store.state.token, emoticonUrl: e.url }, ack => {
          if (ack) {
            this.getEmoction()
          }
        })
      }
    }
  },
  mounted() {
    // ??????emoji????????????????????? ????????????????????????
    this.parentNode = document.getElementById('emoji-parent')
    this.getEndFocus()
    this.value && this.insertEmoji(this.value, false)
    this.$refs.messagInput.addEventListener('compositionstart', this.onCompositionStart)
    this.$refs.messagInput.addEventListener('compositionend', this.onCompositionEnd)
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.editorText = ''
        this.replyContent = ''
        this.replyName = ''
        this.replyShow = false
        this.atShow = false
        this.$nextTick(() => {
          this.$refs.messagInput.innerHTML = this.$store.getters.getDraftByChatId(this.$route.query.chatId)
          this.focus()
        })
        this.activeKey = 'sys'
        this.getEmoction()
      }
    },
    value: {
      immediate: true,
      handler(n) {
        this.editorText = n
      }
    },
    atList: {
      immediate: true,
      handler: function() {
        this.filterAtList = this.atList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.meEditor {
  width: 100%;
  height: 160px;
  position: relative;
  display: flex;
  flex-direction: column;

  .emoj {
    height: 52px;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid #e4e5e7;
    ul {
      display: flex;
      height: 52px;
      width: 100%;
      padding-left: 23px;
      list-style: none;
      margin: 0;
      li {
        margin-right: 20px;
        height: 52px;
        line-height: 52px;
        cursor: pointer;
        &.chat-record {
          margin-left: auto;
          .collection {
            margin-right: 20px;
          }
        }
      }
    }
  }
  textarea {
    width: 100%;
    flex: 1 1 0;
    border: 0 none;
    outline: none;
    resize: none;
    font-size: 12px;
    overflow-y: auto;
    color: #000;
    box-sizing: border-box;
    padding: 0 24px;
  }
  textarea::-webkit-input-placeholder {
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    font-weight: 400;
  }
  .meditor-foot {
    width: 100%;
    flex: 1 1 0;
    overflow-y: auto;
    .message-input {
      width: 100%;
      max-width: 100%;
      min-height: 21px;
      text-align: left;
      font-size: 14px;
      padding: 0 24px;
      position: relative;
      word-break: break-word;
      letter-spacing: 1px;
      font-size: 14px;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.85);
      /deep/ img {
        max-width: 200px;
        width: auto;
        height: 60px;
        vertical-align: bottom;
      }
      &:focus {
        outline: none;
      }
      &:empty::before {
        content: attr(placeholder);
        position: absolute;
        left: 24px;
        top: 0;
        color: rgba(0, 0, 0, 0.25);
        font-size: 12px;
        font-weight: 400;
      }
      /deep/ span {
        font-family: PingFangSC-Regular, PingFang SC !important;
        color: rgba(0, 0, 0, 0.85) !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        background-color: transparent !important;
        font-weight: normal !important;
        // white-space: pre-wrap !important;
      }
      // fix: ???????????????????????????????????????????????????
      /deep/ * {
        white-space: pre-wrap !important;
      }
    }
    .reply {
      text-align: left;
      min-height: 34px;
      padding-left: 24px;
      margin-top: 12px;
      display: flex;
      align-items: center;
      .reply-content {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        padding: 8px 8px 8px 12px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
        .meditor-reply-content {
          max-width: 320px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .close-reply {
        width: 14px;
        margin-left: 8px;
        line-height: 1;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.25);
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  .at-container {
    position: absolute;
    left: 0;
    top: -320px;
    width: 320px;
    height: 320px;
    padding: 16px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    overflow-y: auto;
    .at-all {
      display: flex;
      cursor: pointer;
      img {
        margin-right: 12px;
      }
      &:hover {
        background: #f0f1f2;
      }
    }
    .note {
      text-align: left;
      margin-top: 12px;
      margin-bottom: 5px;
    }
    .at-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-bottom: 8px;
      .name {
        margin-left: 12px;
        max-width: 200px;
      }
      &:hover {
        background: #f0f1f2;
      }
    }
  }
}
/deep/ .ant-modal-content {
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
.icon-emoji {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  user-select: none;
  &.icon-emoji_disabled {
    cursor: not-allowed;
    &:active {
      color: rgba(0, 0, 0, 0.45);
    }
  }
  &:active {
    color: rgba(0, 0, 0, 0.85);
  }
}
.emoji-page {
  padding-bottom: 10px;
  height: 340px;
  overflow: hidden;
}
.emoji-content {
  width: 368px;
  height: 405px;
  overflow: hidden;
  /deep/ .ant-tabs-nav.ant-tabs-nav-animated {
    margin-top: 5px;
  }
  /deep/ .ant-tabs .ant-tabs-card-bar.ant-tabs-bottom-bar .ant-tabs-tab {
    border: none;
    margin-right: 26px !important;
    .anticon {
      margin-right: 0px;
    }
  }
  /deep/ .ant-tabs .ant-tabs-card-bar.ant-tabs-bottom-bar .ant-tabs-tab-active {
    padding-top: 0px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
}
.carousel-circle {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #e5e5e5;
}
.slick-active {
  .carousel-circle {
    background-color: #b2b2b2;
  }
}
.emoji-item {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 22px;
  color: #000;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: #efefef;
  }
}
.heart-wrap {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 346px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .heart-item {
    display: flex;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin-right: 16px;
    margin-bottom: 16px;
    overflow: hidden;
    cursor: pointer;
    &:nth-child(5n) {
      margin-right: 0px;
    }
    .upload-emo {
      align-self: center;
    }
  }
}
</style>
