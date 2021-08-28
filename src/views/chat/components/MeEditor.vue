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
              <a-carousel ref="emojiCarousel" :afterChange="changeEnd">
                <div v-for="(item, index) in emojiPageList" :key="index" class="emoji-page">
                  <span class="emoji-item" v-for="(e, i) in item" :key="i" @click="insertEmoji(e.content)">{{ e.content }}</span>
                </div>
                <div slot="customPaging">
                  <span class="carousel-circle"></span>
                </div>
              </a-carousel>
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
        <li v-if="!lost && showRecordClick" class="chat-record" @click="showRecord($event)">
          <img src="@/assets/chat_icon_record.png" alt="" />
        </li>
        <!-- 客户流失显示 -->
        <li v-if="lost">
          <img src="@/assets/chat_icon_emoticon_lost.png" alt="" />
        </li>
        <li v-if="lost">
          <img src="@/assets/chat_icon_image_lost.png" alt="" />
        </li>
        <li v-if="lost && showRecordClick" class="chat-record" @click="showRecord">
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
          <img src="@/assets/关闭 (1).png" alt="" />
        </div>
      </div>
    </div>
    <div class="at-container" id="selectuser" v-show="atShow && chatType == 2">
      <div class="at-all" @click="choose('all')">
        <img src="@/assets/icon_all.png" alt="" />
        <div>所有人</div>
      </div>
      <div class="note">群成员</div>
      <div class="at-item" v-for="item in filterAtList" :key="item.wechatId" @click="choose(item)">
        <a-avatar shape="square" :size="28" :src="item.wechatAvatar" />
        <span class="name"> {{ item.wechatName }} </span>
      </div>
    </div>
  </div>
</template>
<script>
import deepClone from 'lodash/cloneDeep'
import { mapActions } from 'vuex'
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
    showRecordModal: {
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
      placeholder: '输入内容，shift+enter换行，enter发送',
      editorText: '',
      readonly: false,
      lost: false,
      // 上传素材
      uploadFile: {
        getOssTokenApi: filesLibrary.getOssToken,
        notifyCheckApi: filesLibrary.notifyOssCheck
      },
      isfocus: false,
      isChange: true,
      sendText: '',
      value: '',
      // 替换占位符
      prefix: ['{', '}'],
      // 是否禁用
      disabled: false,
      // 控制emoji弹窗显示
      emojiVisible: false,
      // emoji父级弹窗
      parentNode: null,
      // emoji列表
      emojiList,
      // emoji分页列表
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
      arr: []
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
      return this.$store.getters.userDetailsById(this.$route.params.tjId)
    }
  },
  methods: {
    ...mapActions([types.SEND_MSG]),
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
        console.log(allnodes)
        for (let i = 0; i < allnodes.length; i++) {
          if (allnodes[i].nodeName === 'IMG') {
            // 当前节点为图片节点
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
            // 当前节点为注释节点
          } else {
            //当前节点为文字节点  textContent  wholeText
            curText = curText + allnodes[i].textContent
          }
          if (i == allnodes.length - 1 && curText) {
            curTextList.push(curText)
          }
        }
        console.log(curTextList, imgList)
        // console.log(this.editorText, 'enter-down')
        this.sendTextMsg(curTextList)
        this.sendImgMsg(imgList)
        this.sendToBottom()
        this.atContactSerialNos = []
        this.arr = []
        this.editorText = ''
        this.replyContent = ''
        this.$refs.messagInput.innerHTML = ''
        this.closeReply()
      }
    },
    // clear() {
    //   this.draft_text = this.editorText
    //   this.editorText=''
    // },
    //1.先获取当前区域内容存起来 2.清空区域  3.给当前区域赋值草稿内容或者空
    // let item = findTalk(index_name)
    // item.draft_text = this.editorText
    // this.editorText = findTalk(index_name).draft_text || ''
    // getDraftText(index_name) {
    //   console.log(index_name)
    //   this.editorText = ''
    // }
    changePlaceholder() {
      this.placeholder = '客户已流失，消息无法送达，无法编辑内容'
      this.readonly = true
      this.lost = true
    },
    changePlaceholderS() {
      this.placeholder = '客户已删除，消息无法送达，无法编辑内容'
      this.readonly = true
      this.lost = true
    },
    changePlaceholderT() {
      this.placeholder = '输入内容，shift+enter换行，enter发送'
      this.readonly = false
      this.lost = false
    },
    netLost() {
      // this.placeholder = '当前网络不可用'
      // this.readonly = true
      // console.log('当前网络不可用')
    },
    netReconnect() {
      // this.placeholder = '输入内容，shift+enter换行，enter发送'
      // this.readonly = false
      // console.log('当前网络链接成功')
    },
    showRecord(e) {
      console.log('showRecordModal', e)
      this.showRecordModal()
    },
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
      console.log(sendData, 'sendData')
      this[types.SEND_MSG](sendData)
    },
    changeText() {
      setTimeout(() => {
        if (!this.inputFlag) return
        const value = deepClone(this.$refs.messagInput.innerText)
        this.value = value
        this.editorText = this.value
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
        // 设为非折叠状态
        this.rangeOfInputBox.collapse(false)
      }
      // 判断是否折叠状态
      if (this.rangeOfInputBox.collapsed) {
        this.rangeOfInputBox.insertNode(emojiEl)
      } else {
        this.rangeOfInputBox.deleteContents()
        this.rangeOfInputBox.insertNode(emojiEl)
      }
      this.emojiVisible = false
      this.changeText()
      this.rangeOfInputBox.collapse(false)
      // 光标选中当前插入位置
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
      // 获取输入光标位置
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
      let replaceText = v == 'all' ? '所有人' : v.wechatName
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
      // 光标选中当前插入位置
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
      //发送文本消息
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
        //引用消息只会发出第一条文本消息
        if (i == 0) {
          if (chatType == 1) {
            //个微
            content = this.replyContent ? this.replyContent + '\n- - - - - - - - - - - - - - -\n' + curTextList[i] : curTextList[i]
          } else {
            content = this.replyContent ? this.replyContent + '\n------\n' + curTextList[i] : curTextList[i]
          }
        } else {
          content = curTextList[i]
        }
        msg.content = content
        // 判断@id
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
            //content.indexOf(val) == 0  content.length == content.indexOf(val) + val.length
            if (content.indexOf(val) == 0) msg.atLocation = 0
            content = content.replace(val, '')
          })
          msg.content = content
        }
        msg.msgType = 'text'
        // console.log(msg.grpContent, msg.content, msg.atContactSerialNos)
        console.log(msg)
        this[types.SEND_MSG](msg)
      }
    },
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
            console.log(msg, 'ImgMsg')
            this[types.SEND_MSG](msg)
          }
        })
      }
    }
  },
  mounted() {
    // 获取emoji弹窗父元素位置 用来固定弹窗位置
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
          this.$refs.messagInput.innerHTML = ''
        })
      }
    },
    value: {
      immediate: true,
      handler(n) {
        // let container = document.createElement('div')
        // container.innerHTML = n
        // this.editorText = container.innerText
        // container = null
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
          // align-items: flex-end;
          margin-left: auto;
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
      padding: 0 24px;
      position: relative;
      word-break: break-word;
      letter-spacing: 1px;
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
        color: #2c3e50 !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        background-color: transparent !important;
        font-weight: normal !important;
        // white-space: pre-wrap !important;
      }
      // fix: 外部粘贴的带格式内容引起的换行问题
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
        // height: 14px;
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
        max-width: 45px;
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
}
.emoji-content {
  width: 360px;
  height: 340px;
  overflow: hidden;
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
</style>
