<template>
  <div class="image-message no-select">
    <!-- <a-empty :image="src" /> -->
    <!-- <img :src="src" /> -->

    <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="fileList" @preview="handlePreview"> </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  name: 'ImageMessage',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: this.src
        }
      ]
    }
  },
  methods: {
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

/deep/ .ant-upload-list-picture-card .ant-upload-list-item-info::before {
  position: absolute;
  z-index: 1;
  width: 0;
  height: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: all 0.3s;
  content: ' ';
}
</style>
