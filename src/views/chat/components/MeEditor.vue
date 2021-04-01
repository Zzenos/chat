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
let aaa = 5555
// function findTalk(index_name){return wechat_account.find(item=>item.wechat_id==index_name)}
export default {
  name: 'MeEditor',
  props: ['send'],
  data() {
    return {
      editorText: '',
      sendTime: 0
    }
  },
  methods: {
    inputEvent(e) {
      // this.$emit('keyboard-event', e.target.value)
      console.log('send', e)
    },
    keydownEvent(e) {
      if (e.keyCode == 13 && this.editorText == '') e.preventDefault()
      if (e.keyCode == 13 && this.editorText !== '') {
        let currentTime = new Date().getTime()
        // this.$emit('send', this.editorText)
        this.send({
          id: '' + aaa++,
          msgType: 2001,
          fromId: '1',
          toId: 'sadafqfdwqdwdq',
          chatType: '1',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          float: 'right',
          sender: {
            id: '098',
            avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0',
            city: '',
            country: '',
            customDescription: '',
            customId: 'LiuDongXia',
            favorite: false,
            gender: 1,
            isVirtual: 0,
            mobilephones: null,
            nickname: '刘东霞'
          },
          unread: false,
          content: this.editorText
        })
        console.log('send', e, this.editorText)
        this.editorText = ''
        this.sendTime = currentTime
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
