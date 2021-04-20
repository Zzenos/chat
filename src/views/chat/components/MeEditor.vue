<template>
  <div class="meEditor">
    <div class="emoj">
      <ul>
        <li @click="$refs.restFile.click()">
          <i>图片</i>
        </li>
        <li @click="$refs.restFile2.click()">
          <i>视频</i>
        </li>
      </ul>
      <form enctype="multipart/form-data" style="display: none" ref="fileFrom">
        <input type="file" ref="restFile" accept="image/*" @change="uploadImageChange" />
        <input type="file" ref="restFile2" accept="video/*" @change="uploadVideoChange" />
      </form>
    </div>
    <textarea placeholder="输入内容，shift+enter换行，enter发送" v-model="editorText" @input="inputEvent($event)" @keydown="keydownEvent($event)" rows="6" />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import * as types from '@/store/actionType'
// import {getSendMsg} from '@/class/Msg'
// function findTalk(index_name){return wechat_account.find(item=>item.wechat_id==index_name)}
export default {
  name: 'MeEditor',
  props: ['sendToBottom'],
  data() {
    return {
      editorText: '',
      sendTime: 0
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
      // this.$emit('keyboard-event', e.target.value)
      // console.log('send', e)
    },
    keydownEvent(e) {
      if (e.keyCode == 13 && this.editorText == '') e.preventDefault()
      if (e.keyCode == 13 && this.editorText !== '' && e.shiftKey == false) {
        this[types.SEND_MSG]({
          msgType: 'text',
          chatId: this.$route.params.contactId,
          chatType: this.$route.query.chatType,
          fromId: this.$route.params.tjId,
          toId: this.$route.params.tjId == this.$route.params.contactId.split('&')[0] ? this.$route.params.contactId.split('&')[1] : this.$route.params.contactId.split('&')[0],
          content: this.editorText,
          sender: {
            wechatName: this.userInfo.info.wechatName,
            wechatAvatar: this.userInfo.info.wechatAvatar
          }
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
      console.log(e.target.files[0])
      // this.openImageViewer(e.target.files[0])
      this.$refs.restFile.value = null
      // const { source, receive_id } = this.$store.state.dialogue

      let fileData = new FormData()
      console.log(fileData)
      // fileData.append('source', source) //tj-id
      // fileData.append('receive_id', receive_id) // target-id
      // fileData.append('img', e.target.files[0])
      // let ref = this.$refs.imageViewer

      // ServeSendTalkImage(fileData)
      //   .then(res => {
      //     ref.loading = false
      //     if (res.code == 200) {
      //       ref.closeBox()
      //     }
      //   })
      //   .finally(() => {
      //     ref.loading = false
      //   })
    },
    // 选择视频文件后回调方法
    uploadVideoChange(e) {
      console.log(e.target.files[0])
      var url = URL.createObjectURL(e.target.files[0])
      console.log('video url ' + url)
      // this.openImageViewer(e.target.files[0])
      this.$refs.restFile.value = null
      // const { source, receive_id } = this.$store.state.dialogue

      let fileData = new FormData()
      console.log(fileData)
      // fileData.append('source', source) //tj-id
      // fileData.append('receive_id', receive_id) // target-id
      // fileData.append('img', e.target.files[0])
      // let ref = this.$refs.imageViewer

      // ServeSendTalkImage(fileData)
      //   .then(res => {
      //     ref.loading = false
      //     if (res.code == 200) {
      //       ref.closeBox()
      //     }
      //   })
      //   .finally(() => {
      //     ref.loading = false
      //   })
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
      padding-left: 24px;
      list-style: none;
      margin: 0;
      li {
        margin-right: 20px;
        height: 52px;
        line-height: 52px;
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
</style>
