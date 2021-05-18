<template>
  <div class="meEditor">
    <div class="emoj">
      <ul>
        <li v-if="!lost" v-wheel="changeEmojiList" id="emoji-parent">
          <a-popover v-model="emojiVisible" :getPopupContainer="() => parentNode" trigger="click" @visibleChange="hideEmojiSelect">
            <div slot="content" class="emoji-content">
              <a-carousel ref="emojiCarousel" :afterChange="changeEnd" :wheel-disabled="emojiCarouselDisabled">
                <div v-for="(item, index) in emojiPageList" :key="index" class="emoji-page">
                  <span class="emoji-item" v-for="(e, i) in item" :key="i" @click="insertEmoji(e.content)">{{ e.content }}</span>
                </div>
                <div slot="customPaging">
                  <span class="carousel-circle"></span>
                </div>
              </a-carousel>
            </div>
            <!-- <a-icon type="smile" :class="['icon-emoji', disabled && 'icon-emoji_disabled']" /> -->
            <img src="@/assets/chat_icon_emoticon.png" alt="" />
          </a-popover>
        </li>
        <li v-if="!lost" @click="$refs.restFile.click()">
          <img src="@/assets/chat_icon_image.png" alt="" />
        </li>
        <li v-if="!lost">
          <upload :getOssTokenApi="uploadFile.getOssTokenApi" :notifyCheckApi="uploadFile.notifyOssCheck" @uploaded="uploaded"> </upload>
        </li>
        <li v-if="!lost && showRecordClick" class="chat-record" @click="showRecord">
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
      <!-- ------------- -->
      <form enctype="multipart/form-data" style="display: none" ref="fileFrom">
        <input type="file" ref="restFile" @change="uploadImageChange" />
      </form>
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
        <!-- <span class="close-reply" @click="closeReply">&times;</span> -->
        <div class="reply-content">{{ replyName }}:{{ replyContent }}</div>
        <div class="close-reply" @click="closeReply">
          <img src="@/assets/关闭 (1).png" alt="" />
        </div>
      </div>
    </div>
    <a-modal
      v-model="noValidVisible"
      wrapClassName="send-status-modal"
      getPopupContainer="triggerNode => {
        return triggerNode.parentNode
      }"
      :title="noValidTitle"
      centered
      @ok="() => (noValidVisible = false)"
      ok-text="确认"
      cancel-text="取消"
    >
    </a-modal>
  </div>
</template>
<script>
import deepClone from 'lodash/cloneDeep'
import axios from 'axios'
import { mapActions } from 'vuex'
import * as types from '@/store/actionType'
import Upload from './Upload.vue'
import filesLibrary from '@/apis/library'
import { emojiList } from '@/util/emojiList'
import { wheel } from '@/util/wheel.js'

export default {
  components: { Upload },
  name: 'MeEditor',
  props: ['sendToBottom', 'showRecordModal', 'showRecordClick'],
  data() {
    return {
      placeholder: '输入内容，shift+enter换行，enter发送',
      editorText: '',
      readonly: false,
      lost: false,
      noValidVisible: false,
      noValidTitle: '',
      // 上传素材
      uploadFile: {
        // loading: false,
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
      emojiCarouselDisabled: false,
      replyShow: false,
      replyName: '',
      replyContent: ''
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
    keydownEvent(e) {
      if (e.keyCode == 13 && e.shiftKey == false) {
        // console.log(e, 'eeeeeee')
        e.preventDefault()
        // console.log(this.editorText, 'enter-down')
        let { contactId, tjId } = this.$route.params
        let { wechatName, wechatAvatar } = this.userInfo.info
        this[types.SEND_MSG]({
          msgType: 'text',
          chatId: contactId,
          chatType: this.$route.query.chatType,
          fromId: tjId,
          toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
          content: this.replyContent ? this.replyContent + '------' + this.editorText : this.editorText,
          sender: {
            wechatName: wechatName,
            wechatAvatar: wechatAvatar
          },
          notResend: true
        })
        this.sendToBottom()
        this.editorText = ''
        this.$refs.messagInput.innerHTML = ''
        this.closeReply()
        e.preventDefault()
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
    // 选择图片视频文件后回调方法
    uploadImageChange(e) {
      let file = e.target.files[0]
      let type = file.type.split('/')[0]
      let size = Math.ceil(file.size / 1024 / 1024)
      console.log(file, type, size)
      //不是图片和视频
      if (type !== 'image' && type !== 'video') {
        this.noValidVisible = true
        this.noValidTitle = '目前只支持发送图片视频'
        this.$refs.restFile.value = ''
        return
      }
      //视频格式
      if (type == 'video') {
        if (file.type.split('/')[1] != 'mp4') {
          this.noValidVisible = true
          this.noValidTitle = '只支持上传mp4格式的视频'
          this.$refs.restFile.value = ''
          return
        }
        if (size >= 25) {
          this.noValidVisible = true
          this.noValidTitle = '只支持25M以内的视频'
          this.$refs.restFile.value = ''
          return
        }
      }
      //图片格式
      if (type == 'image') {
        if (file.type.split('/')[1] != 'jpg' && file.type.split('/')[1] != 'png' && file.type.split('/')[1] != 'jpeg') {
          this.noValidVisible = true
          this.noValidTitle = '只支持上传jpg,png,jpeg格式的图片'
          this.$refs.restFile.value = ''
          return
        }
        if (size >= 25) {
          this.noValidVisible = true
          this.noValidTitle = '只支持25M以内的图片'
          this.$refs.restFile.value = ''
          return
        }
      }
      let fileType = type == 'image' ? 1 : 2
      let fileData = new FormData()
      fileData.append('file', file)
      fileData.append('fileType', fileType)
      axios({
        method: 'post',
        // url: 'http://bizchat-chatroom.zmeng123.cn:9091/file/upload',
        url: 'http://bizchat-chatroom.zmeng123.cn/file/upload',
        data: fileData
      }).then(res => {
        let { code, data } = res.data
        console.log(code, data)
        if (code == 200) {
          let { url, coverUrl = '' } = data
          console.log(url, coverUrl)
          let { contactId, tjId } = this.$route.params
          let { wechatName, wechatAvatar } = this.userInfo.info
          this[types.SEND_MSG]({
            msgType: type,
            chatId: contactId,
            chatType: this.$route.query.chatType,
            fromId: tjId,
            toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
            content: '',
            sender: {
              wechatName: wechatName,
              wechatAvatar: wechatAvatar
            },
            url: url,
            coverUrl: coverUrl,
            notResend: true
          })
        }
        this.$refs.restFile.value = ''
      })
    },
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
    showRecord() {
      this.showRecordModal()
    },
    uploaded(e) {
      // if (e.length > 0) this.listByDir() e ==> this.uploadedList  ==> url + title
      console.log(e)
      let { contactId, tjId } = this.$route.params
      let { wechatName, wechatAvatar } = this.userInfo.info
      this[types.SEND_MSG]({
        msgType: 'file',
        chatId: contactId,
        chatType: this.$route.query.chatType,
        fromId: tjId,
        toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
        url: '',
        title: '',
        sender: {
          wechatName: wechatName,
          wechatAvatar: wechatAvatar
        },
        notResend: true
      })
    },
    changeText() {
      // this.sendText = this.$refs.messagInput.innerText
      // console.log(this.sendText, this.$refs.messagInput.innerText, 'this.$refs.messagInput.inner')
      // if (this.isChange) {
      //   const value = deepClone(this.$refs.messagInput.innerHTML)
      //   this.editorText = value
      // }
      // var range = document.selection.createRange()
      // range.collapse(false)
      const value = deepClone(this.$refs.messagInput.innerHTML)
      this.value = value
    },
    editBlur() {
      // console.log('editBlur')
      this.isChange = true
    },
    changeEmojiList(isNext) {
      this.emojiCarouselDisabled = true
      this.$refs.emojiCarousel[isNext ? 'next' : 'prev']()
    },
    changeEnd() {
      this.emojiCarouselDisabled = false
    },
    insertSpecialText(text) {
      if (this.disabled) return
      const content = `${(text.prefix && text.prefix[0]) || this.prefix[0] || ''}${text.content || text}${(text.prefix && text.prefix[1]) || this.prefix[1] || ''}`
      this.insertEmoji(content)
    },
    insertEmoji(emoji, isFocus = true) {
      this.getEndFocus()
      // const emojiEl = document.createElement('img');
      // emojiEl.src = '/static/img/emoji01.jpeg';
      // const emojiEl = document.createElement('span');
      // emojiEl.innerHTML = emoji
      const emojiEl = document.createTextNode(emoji)
      if (!this.rangeOfInputBox) {
        this.rangeOfInputBox = new Range()
        this.rangeOfInputBox.selectNodeContents(this.$refs.messagInput)
        // 设为非折叠状态
        this.rangeOfInputBox.collapse(false)
        // return this.$refs.inputBox.appendChild(emojiEl)
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
        // range.setStartAfter(target);
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
    }
  },
  mounted() {
    // 获取emoji弹窗父元素位置 用来固定弹窗位置
    this.parentNode = document.getElementById('emoji-parent')
    this.getEndFocus()
    this.value && this.insertEmoji(this.value, false)
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        // console.log('value-1')
        this.editorText = ''
        this.$nextTick(() => {
          this.$refs.messagInput.innerHTML = ''
        })
      }
    },
    value: {
      immediate: true,
      handler(n) {
        // console.log('value-change', n)
        this.editorText = n
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.meEditor {
  width: 100%;
  height: 160px;
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
      // flex: 1 1 0;
      // overflow-y: auto;
      min-height: 21px;
      text-align: left;
      padding: 0 24px;
      // border: 1px solid #ccc;
      position: relative;
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
    }
    .reply {
      text-align: left;
      height: 34px;
      padding-left: 24px;
      margin-top: 12px;
      .reply-content {
        float: left;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        padding: 8px 8px 8px 12px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
        // display: inline-block;
        max-width: 550px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .close-reply {
        width: 14px;
        height: 14px;
        float: left;
        margin: 10px 8px;
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
}
/deep/ .ant-modal-content {
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
  // background-color: #3a4d76;
  // width: 400px;
  width: 360px;
  height: 340px;
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
  // width: 30px;
  // height: 30px;
  // margin: 5px;
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
  // img {
  //   display: inline-block;
  //   width: 25px;
  //   height: 25px;
  //   vertical-align: middle;
  // }
}
</style>
