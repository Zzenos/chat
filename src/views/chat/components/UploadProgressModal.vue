<template>
  <a-modal title="上传进度" :visible="showProgressModel" :footer="null" :maskClosable="false" :closable="false" :centered="true">
    <div class="table-wrapper">
      <a-table :columns="columns" :dataSource="uploadingFilesList" :rowKey="uploadingTableKey" :pagination="false">
        <span slot="state" slot-scope="state">
          <a-tag :color="state.color">
            <span>{{ state.text }}{{ state.message }}</span>
          </a-tag>
        </span>
      </a-table>
    </div>
    <p class="tips">
      <span>注：文件上传过程中，请勿关闭/刷新页面</span>
    </p>
    <div class="btn-wrapper">
      <a-button @click="close" :disabled="!isUploadComplete" type="primary">确定</a-button>
    </div>
  </a-modal>
</template>
<script>
const columns = [
  {
    title: '文件名',
    dataIndex: 'file.name',
    key: 'name',
    width: '60%'
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    key: 'state',
    width: '40%'
  }
]

export default {
  name: 'UploadProgressModal',
  props: {
    uploadingFilesList: Array,
    showProgressModel: {
      type: Boolean,
      default: false
    },
    isUploadComplete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns,
      uploadingTableKey: 'id'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  },
  mounted() {
    // console.log('UploadProgressModal mounted', this.$listeners, this.$attrs, this.$slots)
  }
}
</script>

<style scoped>
.table-wrapper {
  margin-bottom: 10px;
  max-height: 60vh;
  overflow: scroll;
}
.tips {
  font-size: 12px;
  margin-bottom: 10px;
}
.btn-wrapper {
  text-align: center;
}
</style>
