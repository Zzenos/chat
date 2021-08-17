<template>
  <div class="multi-select">
    <div class="multi-title">
      <span>已选中：{{ value }} 条消息</span>
    </div>
    <div class="multi-main">
      <div class="operate-btn">
        <div class="icon" @click="$emit('event', 'merge_forward')">
          <img src="@/assets/icon_addmembers.png" alt="" />
        </div>
        <div>合并转发</div>
      </div>
      <div class="operate-btn">
        <div class="icon" @click="$emit('event', 'forward')">
          <img src="@/assets/icon_addmembers.png" alt="" />
        </div>
        <div>逐条转发</div>
      </div>
      <div class="operate-btn">
        <div class="icon" @click="$emit('event', 'delete')">
          <img src="@/assets/icon_addmembers.png" alt="" />
        </div>
        <div>转发</div>
      </div>
      <div class="operate-btn">
        <div class="icon" @click="$emit('event', 'close')">
          <img src="@/assets/关闭 (1).png" alt="" />
        </div>
        <div>关闭</div>
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
    .operate-btn {
      margin-right: 40px;
    }
  }
}
</style>
