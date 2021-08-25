<template>
  <div class="multi-select">
    <div class="multi-title">
      <span>已选中：{{ value }} 条消息</span>
    </div>
    <div class="multi-main">
      <!-- <div class="operate-btn">
        <div class="icon" @click="$emit('event', 'merge_forward')">
          <img src="@/assets/icon_addmembers.png" alt="" />
        </div>
        <div>合并转发</div>
      </div> -->
      <div class="operate-btn">
        <div class="icon forward" @click="$emit('event', 'forward')"></div>
        <div class="text">逐条转发</div>
      </div>
      <div class="operate-btn">
        <div class="icon collect" @click="$emit('event', 'collect')"></div>
        <div class="text">收藏</div>
      </div>
      <!-- <div class="operate-btn">
        <div class="icon close" @click="$emit('event', 'close')"></div>
        <div class="text">关闭</div>
      </div> -->
      <div class="close" @click="$emit('event', 'close')">
        &times;
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MultiSelectModal',
  props: {
    value: {
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.multi-select {
  width: 100%;
  height: 160px;
  box-sizing: border-box;
  padding: 20px;
  border-top: 1px solid #e4e5e7;
  .multi-title {
    height: 30px;
  }
  .multi-main {
    height: 90px;
    width: 100%;
    display: flex;
    // justify-content: space-between;
    justify-content: center;
    align-items: center;
    position: relative;
    .operate-btn {
      margin-right: 40px;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
      line-height: 18px;
      .icon {
        width: 52px;
        height: 52px;
        margin-bottom: 8px;
        border-radius: 50%;
        background-color: #edeef2;
        background-position: center center;
        background-repeat: no-repeat;
        &.forward {
          background-image: url('../../../assets/multiselect_icon_forward.png');
        }
        &.collect {
          background-image: url('../../../assets/chat_icon_collection.png');
        }
        &.close {
          background-image: url('../../../assets/关闭 (1).png');
          background-size: 20px 20px;
        }
      }
      .text {
        width: 48px;
        text-align: center;
      }
    }
    .close {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
}
</style>
