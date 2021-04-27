<template>
  <div class="meEditor">
    <div class="emoj">
      <ul>
        <!-- <li v-if="!lost">
          <img src="@/assets/chat_icon_emoticon.png" alt="" />
        </li> -->
        <li v-if="!lost" @click="$refs.restFile.click()">
          <img src="@/assets/chat_icon_image.png" alt="" />
        </li>
        <!-- <li v-if="!lost" @click="$refs.restFile2.click()">
          <img src="@/assets/chat_icon_image.png" alt="" />
        </li> -->
        <!-- 客户流失显示 -->
        <!-- <li v-if="lost">
          <img src="@/assets/chat_icon_emoticon_lost.png" alt="" />
        </li> -->
        <li v-if="lost">
          <img src="@/assets/chat_icon_image_lost.png" alt="" />
        </li>
      </ul>
      <form enctype="multipart/form-data" style="display: none" ref="fileFrom">
        <input type="file" ref="restFile" @change="uploadImageChange" />
        <input type="file" ref="restFile2" accept="video/*" @change="uploadVideoChange" />
      </form>
    </div>
    <textarea :placeholder="placeholder" :readonly="readonly" v-model="editorText" @input="inputEvent($event)" @keydown="keydownEvent($event)" rows="6" />
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
import axios from 'axios'
import { mapActions } from 'vuex'
import * as types from '@/store/actionType'

export default {
  name: 'MeEditor',
  props: ['sendToBottom'],
  data() {
    return {
      placeholder: '输入内容，shift+enter换行，enter发送',
      editorText: '',
      readonly: false,
      lost: false,
      noValidVisible: false,
      noValidTitle: ''
    }
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
      if (e.keyCode == 13 && this.editorText == '') e.preventDefault()
      if (e.keyCode == 13 && this.editorText !== '' && e.shiftKey == false) {
        let { contactId, tjId } = this.$route.params
        let { wechatName, wechatAvatar } = this.userInfo.info
        this[types.SEND_MSG]({
          msgType: 'text',
          chatId: contactId,
          chatType: this.$route.query.chatType,
          fromId: tjId,
          toId: tjId == contactId.split('&')[0] ? contactId.split('&')[1] : contactId.split('&')[0],
          content: this.editorText,
          sender: {
            wechatName: wechatName,
            wechatAvatar: wechatAvatar
          },
          notResend: true
        })
        this.sendToBottom()
        this.editorText = ''
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
    // 选择图片文件后回调方法
    uploadImageChange(e) {
      let file = e.target.files[0]
      let type = file.type.split('/')[0]
      let size = Math.ceil(file.size / 1024 / 1024)
      console.log(file, type, size)
      //不是图片和视频
      if (type !== 'image' && type !== 'video') {
        this.noValidVisible = true
        this.noValidTitle = '目前只支持发送图片视频'
        return
      }
      //视频格式
      if (type == 'video') {
        if (file.type.split('/')[1] != 'mp4') {
          this.noValidVisible = true
          this.noValidTitle = '只支持上传mp4格式的视频'
          return
        }
        if (size >= 25) {
          this.noValidVisible = true
          this.noValidTitle = '只支持25M以内的视频'
          return
        }
      }
      let fileType = type == 'image' ? 1 : 2
      let fileData = new FormData()
      fileData.append('file', file)
      fileData.append('fileType', fileType)
      axios({
        method: 'post',
        url: 'http://bizchat-chatroom.zmeng123.cn:9091/file/upload',
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
            // url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
            //url: "http://kfpt.oss-cn-hangzhou.aliyuncs.com/pc/pcwork/msgfile/20210426/502ee1258775a1607501078e5c3e089d/bbb4f60860704d27978ab31e205f9c16.jpg"
            // url: 'http://zm-weike.oss-cn-beijing.aliyuncs.com/app/13fac4f421984182aa871cf13b3dc02b.jpg',
            // coverUrl: 'http://zm-weike.oss-cn-beijing.aliyuncs.com/app/13fac4f421984182aa871cf13b3dc02b.jpg',
            url: url,
            coverUrl: coverUrl,
            notResend: true
          })
        }
      })
    },
    // 选择视频文件后回调方法
    uploadVideoChange() {
      // let file = e.target.files[0]
      // let reader = new FileReader()
      // let fileSize = Math.ceil(file.size / 1024)
      // let fileName = file.name
      // reader.onload = () => {
      //   this.src = reader.result
      //   console.log(this.src)
      // }
      // reader.readAsDataURL(file)
    },
    changePlaceholder() {
      this.placeholder = '客户已流失，不能发送消息'
      this.readonly = true
      this.lost = true
    },
    changePlaceholderT() {
      this.placeholder = '输入内容，shift+enter换行，enter发送'
      this.readonly = false
      this.lost = false
    },
    netLost() {
      this.readonly = true
    },
    netReconnect() {
      this.readonly = false
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
    box-sizing: border-box;
    border-top: 1px solid #e4e5e7;
    ul {
      display: flex;
      padding-left: 23px;
      list-style: none;
      margin: 0;
      li {
        margin-right: 20px;
        height: 52px;
        line-height: 52px;
        cursor: pointer;
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
</style>
