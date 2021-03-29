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
export default {
  name: 'MeEditor',
  data() {
    return {
      editorText: '',
      sendTime: 0
    }
  },
  methods: {
    InputEvent(e) {
      this.$emit('keyboard-event', e.target.value)
    },
    keydownEvent(e) {
      if (e.keycode == 13 && this.editorText == '') e.preventDefault()
      if (e.keycode == 13) {
        let currentTime = new Date().getTime()

        this.$emit('send', this.editorText)

        this.editorText = ''
        this.sendTime = currentTime
        e.preventDefault()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.meEditor {
  .emoj {
    width: 752px;
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
    width: 752px;
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
