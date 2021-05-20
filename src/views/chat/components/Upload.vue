<template>
  <span>
    <a-upload :customRequest="putRequest" :accept="acceptType" :multiple="multiple" :showUploadList="false">
      <!-- <a-button class="addnew__button" :loading="loading" type="primary">
        {{ this.text }}
      </a-button> -->
      <img v-if="showType == 'image'" src="@/assets/chat_icon_image.png" alt="" />
      <img v-if="showType == 'file'" src="@/assets/chat_icon_file.png" alt="" />
    </a-upload>
    <uplaodProgressModal :uploadingFilesList="uploadingFilesList" :showProgressModel="showProgressModel" :isUploadComplete="uploadFullfilled" @close="closeProgressModal" />
  </span>
</template>
<script>
import qs from 'qs'
import filesLibrary from '@/apis/library'
import utils from '@/util/util'
import uplaodProgressModal from './UploadProgressModal.vue'

class FileCell {
  constructor() {
    this.statusArr = [
      {
        status: 'preupload',
        text: '准备上传',
        color: 'cyan',
        message: ''
      },
      {
        status: 'uploading',
        text: '正在上传',
        color: 'blue',
        message: ''
      },
      {
        status: 'done',
        text: '已上传',
        color: 'green',
        message: ''
      },
      {
        status: 'failed',
        text: '上传失败',
        color: 'red',
        message: ''
      }
    ]
    ;[this.state] = this.statusArr
    this.complete = false
    this.hasToken = false
    this.OssInfo = {}
    this.id = Math.random()
      .toString(32)
      .slice(2)
    this.init()
  }

  init() {
    ;[this.state] = this.statusArr
  }

  set(status, message) {
    let inArr = null
    switch (status) {
      default:
        this.statusArr.forEach(i => {
          if (i.status === status) inArr = i
        })
        if (!inArr) {
          // console.warn(`${status} is not a valid state`)
          return
        }
        this.state = inArr
        if (message) this.state.message = message
      // console.log('colorchange:', this.state)
    }
  }
}
export default {
  props: {
    // 是否展示上传列表
    showUploadList: {
      type: Boolean,
      default: true
    },
    // 按钮文案
    text: {
      type: String,
      default: '上传文件'
    },
    // 当前文件夹id
    folderId: {
      type: [String, Number],
      default: '0'
    },
    // MIME类型
    accept: {
      type: Array,
      default() {
        return ['jpg', 'png', 'gif', 'avi', 'mp4', '3gp', 'mpeg']
      }
    },
    // 最大 单位MB
    maxSize: {
      type: Number,
      default: 100 * 1024 * 1024 // 单位字节
    },
    // 校验条件
    checkInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    // 获取OSS上传凭证 APi
    getOssTokenApi: {
      type: Function,
      default: filesLibrary.getOssTokenApi
    },
    // 上传完毕校验API
    notifyCheckApi: {
      type: Function,
      // default: filesLibrary.notifyOssCheck
      default: null
    },
    // 是否支持多选,要求IE10+
    multiple: {
      type: Boolean,
      default: true
    },
    // 是否会显示进度面板
    showProgress: {
      type: Boolean,
      default: true
    },
    //展示类型
    showType: {
      type: String
    },
    //消息发送类型
    sendType: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      parentId: 0,
      showUploadModel: false, // 显示上传进度提示
      uploadingFilesList: [], // 正在上传的文件列表
      uploadedList: [], // 上传成功的文件列表,
      resultStatus: false
    }
  },
  components: {
    uplaodProgressModal
  },
  computed: {
    acceptType() {
      const mapping = this.accept.map(i => `.${i}`)
      // console.log('可上传格式', mapping.join(','))
      return mapping.join(',')
    },
    showProgressModel() {
      return this.showProgress && this.showUploadModel
    },
    uploadFullfilled() {
      let res = this.uploadingFilesList.length > 0
      this.uploadingFilesList.forEach(item => {
        if (item.state.status !== 'done' && item.state.status !== 'failed') res = false
      })
      return res
    }
  },
  watch: {
    uploadFullfilled: {
      handler(n) {
        if (!n) return
        this.loading = false
        const tempArr = []
        this.uploadingFilesList.forEach(i => {
          if (Object.prototype.hasOwnProperty.call(i, 'fileInfo')) {
            tempArr.push(i.fileInfo)
          }
        })
        this.uploadedList = tempArr
        // this.$emit('uploaded', this.uploadedList)
        this.uploadedList = []
        // console.log('after uploaded emit', this.uploadingFilesList[0], this.uploadedList)
      }
    }
  },
  methods: {
    closeProgressModal() {
      let a = this.uploadingFilesList[0].OssInfo
      let b = a.host + '/' + a.key
      console.log('clos-li', this.uploadingFilesList[0], this.uploadingFilesList[0].file, this.uploadingFilesList[0].OssInfo, b)
      // this.$emit('uploaded', this.uploadingFilesList[0], 'file')
      if (this.resultStatus) {
        this.$emit('uploaded', this.uploadingFilesList[0], this.sendType)
        this.resultStatus = false
      }
      this.showUploadModel = false
      this.uploadingFilesList = []
      this.$emit('close')
      // , this.uploadingFilesList[0].file, this.uploadingFilesList[0].OssInfo
    },
    /**
     * 获取OSS上传凭证
     */
    getUploadToken() {
      // if (this.loading) return false
    },
    /**
     * 上传 && 通知校验
     */
    async putRequest(fileAssemble) {
      this.loading = true
      this.showUploadModel = true
      this.parentId = this.folderId
      const { file } = fileAssemble
      const fileCell = new FileCell()
      // console.log(33333333, fileAssemble, fileCell)
      fileCell.file = file
      this.uploadingFilesList.push(fileCell)
      fileCell.set('uploading')
      try {
        await this.isUploadFileValidate(fileCell.file)
        await this.getOssToken(fileCell)
        await this.uploadOss(fileCell)
        await this.checkFile(fileCell)
      } catch (err) {
        if (err && err.response) {
          fileCell.set('failed', err.response.data)
        } else {
          fileCell.set('failed', err.message)
        }
      }
    },
    // 上传前校验
    isUploadFileValidate(file) {
      let valid = true
      let message = ''
      const isSizeOk = file.size <= this.maxSize
      const ext = file.name.substr(file.name.lastIndexOf('.') + 1)
      const isFormatOk = this.accept.includes(ext)
      if (!isSizeOk) {
        message = `文件大小超出${utils.autoSize(this.maxSize)}`
      } else if (!isFormatOk) {
        message = `不支持的文件格式:${ext}`
      }
      valid = isSizeOk && isFormatOk
      return valid ? Promise.resolve() : Promise.reject(new Error(message))
    },
    // 获取token
    getOssToken(fileCell) {
      return new Promise((resolve, reject) => {
        this.getOssTokenApi()
          .then(res => {
            console.log(res, 'get - oss')
            //  res.status >= 200 && res.status < 300
            if (res) {
              fileCell.OssInfo = {
                policy: res.policy,
                OSSAccessKeyId: res.accessid,
                signature: res.signature,
                key: `${res.dir}${fileCell.file.name}`,
                host: res.host,
                filename: fileCell.file.name,
                directory: res.dir
              }
              fileCell.hasToken = true
              resolve(fileCell)
            } else {
              console.log('上传失败111')
              this.resultStatus = false
              reject(new Error(res.data))
            }
          })
          .catch(err => {
            this.resultStatus = false
            console.log('上传失败报错222')
            reject(err)
          })
      })
    },
    // 上传oss
    uploadOss(fileCell) {
      if (!fileCell.hasToken) return Promise.reject(new Error('未获取到该文件的上传凭证'))
      const fd = new FormData()
      fd.append('policy', fileCell.OssInfo.policy)
      fd.append('OSSAccessKeyId', fileCell.OssInfo.OSSAccessKeyId)
      fd.append('signature', fileCell.OssInfo.signature)
      fd.append('key', fileCell.OssInfo.key)
      fd.append('file', fileCell.file)
      // 上传OSS
      const uploadParams = {
        url: fileCell.OssInfo.host,
        onUploadProgress: progressEvent => {
          fileCell.set('uploading', `${((progressEvent.loaded / progressEvent.total) * 100).toFixed(0)}%`)
        },
        data: fd
      }
      return new Promise((resolve, reject) => {
        filesLibrary
          .uploadOss(uploadParams)
          .then(res => {
            // if (res && res.status === 204) {
            console.log(res, '上传成功-----')
            this.resultStatus = true
            resolve()
            // } else {
            //   reject(new Error('上传失败'))
            // }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 文件校验
    checkFile(fileCell) {
      // 上传完毕通知校验
      const notifyParams = qs.parse(
        qs.stringify({
          parent_id: this.parentId,
          filename: fileCell.OssInfo.filename,
          oss_path: `${fileCell.OssInfo.directory}${fileCell.OssInfo.filename}`,
          verify: this.checkInfo
        })
      )
      return new Promise((resolve, reject) => {
        if (this.notifyCheckApi === null) {
          fileCell.set('done', '')
          fileCell.fileInfo = {
            filename: fileCell.filename,
            OssInfo: fileCell.OssInfo
          }
          resolve()
        } else {
          this.notifyCheckApi(notifyParams)
            .then(res => {
              if (res && res.status >= 200 && res.status < 300) {
                fileCell.set('done', '')
                fileCell.fileInfo = res.data
                resolve(res.data)
              } else {
                reject(new Error(res.data))
              }
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    }
  }
}
</script>
