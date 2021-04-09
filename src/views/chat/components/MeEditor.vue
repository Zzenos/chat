<template>
  <div class="meEditor">
    <div class="emoj">
      <ul>
        <li></li>
        <li></li>
      </ul>
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
  methods: {
    ...mapActions([types.SEND_MSG]),
    inputEvent() {
      // this.$emit('keyboard-event', e.target.value)
      // console.log('send', e)
    },
    keydownEvent(e) {
      if (e.keyCode == 13 && this.editorText == '') e.preventDefault()
      if (e.keyCode == 13 && this.editorText !== '') {
        let currentTime = new Date().getTime()
        console.log(currentTime)
        this[types.SEND_MSG]({
          msgType: 'text',
          // msgId: '222',
          chatId: this.$route.query.wechatName,
          chatType: this.$route.query.chatType,
          fromId: this.$route.params.tjId,
          toId: this.$route.params.tjId == this.$route.params.contactId.split('&')[0] ? this.$route.params.contactId.split('&')[1] : this.$route.params.contactId.split('&')[0],
          content: this.editorText,
          msg_time: currentTime
        })
        // getSendMsg({
        //     msgType: 'text',
        //     msgId: '222',
        //     chatId: this.$route.query.wechatName,
        //     chatType: this.$route.query.chatType,
        //     fromId: this.$route.params.tjId,
        //     toId: this.$route.params.tjId == this.$route.params.contactId.split('&')[0] ? this.$route.params.contactId.split('&')[1] : this.$route.params.contactId.split('&')[0],
        //     content: this.editorText,
        //     msg_time: currentTime
        //   })
        this.sendToBottom()
        this.editorText = ''
        e.preventDefault()
      }
    }
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
  }
}
</script>
<style lang="scss" scoped>
.meEditor {
  width: 100%;
  .emoj {
    height: 51px;
    border-top: 1px solid #e4e5e7;
    ul {
      display: flex;
      padding-left: 24px;
      list-style: none;
      li {
        margin-right: 20px;
        height: 52px;
        line-height: 52px;
      }
    }
  }
  textarea {
    width: 100%;
    height: 108px;
    border: 0 none;
    outline: none;
    resize: none;
    font-size: 12px;
    overflow-y: auto;
    color: #000;
    padding-left: 24px;
    position: relative;
  }
  textarea::-webkit-input-placeholder {
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
