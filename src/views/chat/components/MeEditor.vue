<template>
  <div class="meEditor">
    <div class="emoj">
      <ul>
        <li>表情</li>
        <li>图片</li>
      </ul>
    </div>
    <textarea placeholder="在这里输入....." v-model="editorText" @input="inputEvent($event)" @keydown="keydownEvent($event)" rows="6" />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
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
    ...mapActions('messages', {
      send: 'SEND_MSG'
    }),
    inputEvent() {
      // this.$emit('keyboard-event', e.target.value)
      // console.log('send', e)
    },
    keydownEvent(e) {
      if (e.keyCode == 13 && this.editorText == '') e.preventDefault()
      if (e.keyCode == 13 && this.editorText !== '') {
        // let currentTime = new Date().getTime()
        this.send(this.editorText)
        this.sendToBottom()
        this.editorText = ''
        // this.sendTime = currentTime
        e.preventDefault()
      }
    },
    // clear() {
    //   this.draft_text = this.editorText
    //   this.editorText=''
    // },
    getDraftText(index_name) {
      //1.先获取当前区域内容存起来 2.清空区域  3.给当前区域赋值草稿内容或者空
      // let item = findTalk(index_name)
      // item.draft_text = this.editorText
      // this.editorText = findTalk(index_name).draft_text || ''
      console.log(index_name)
      this.editorText = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.meEditor {
  width: 100%;
  .emoj {
    height: 52px;
    background: lightblue;
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
