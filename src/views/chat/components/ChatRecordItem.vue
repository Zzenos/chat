<template>
  <a-list class="chat-record_item" :data-source="list" :rowKey="row => row.seq">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta>
        <span slot="title">{{ item.sender.name }}</span>
        <img class="user-avatar" slot="avatar" :src="item.sender.avatar" />
        <template slot="description">
          <div class="word-wrap" v-if="item.msgtype === 'text'" v-html="item.content"></div>
          <div class="word-wrap" v-else-if="item.msgtype === 'link'">
            <a :href="item.content" target="blank">
              <div v-if="item.coverUrl" class="link-container">
                <img :src="item.coverUrl" />
                <div class="link-text">
                  <div class="link-title">{{ item.title || '无标题文档' }}</div>
                  <div class="link-desc">{{ item.desc || item.content }}</div>
                  <div class="link-desc">{{ item.content | urlOrigin }}</div>
                </div>
              </div>
              <span v-else>{{ item.content }}</span>
            </a>
          </div>
          <div v-else-if="item.msgtype === 'image'">
            <a :href="item.fileUrl || item.content" target="blank">
              <img class="content-image" :src="item.fileUrl || item.content" alt="未加载..." />
            </a>
          </div>
          <div v-else-if="item.msgtype === 'video'">
            <video class="content-video" :src="item.fileUrl" :poster="item.coverUrl" controls="controls" />
          </div>
          <div v-else-if="item.msgtype === 'file'">
            <a-button type="link" @click="downFile(item)">
              <a-icon type="file" />
              {{ item.title }}
            </a-button>
          </div>
          <div v-else-if="item.msgtype === 'voice'">
            <a-button type="link" @click="downFile(item)">音频文件下载</a-button>
          </div>
          <div class="word-wrap" v-else-if="item.msgtype === 'system'" v-html="`<span style='color:rgba(0,0,0,.45)'>系统提示：</span>${item.content}`"></div>
          <div v-else>[暂不支持该类型查看]</div>
        </template>
      </a-list-item-meta>
      <div class="chat-time">
        <div>{{ item.msgtime | formatDate }}</div>
        <div class="view-context">
          <slot name="rightOperation" :row="item"></slot>
        </div>
      </div>
    </a-list-item>
    <div v-if="loading" class="demo-loading-container">
      <a-spin />
    </div>
  </a-list>
</template>

<script>
import moment from 'moment'

export default {
  props: ['list', 'loading'],
  filters: {
    // 格式化时间
    formatDate(value) {
      const time = moment(value).format('YYYY-MM-DD')
      const today = moment(new Date()).format('YYYY-MM-DD')
      const yesterday = moment(new Date().getTime() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
      if (time === today) {
        return `今天 ${moment(value).format('HH:mm:ss')}`
      } else if (time === yesterday) {
        return `昨天 ${moment(value).format('HH:mm:ss')}`
      } else {
        return moment(value).format('YYYY年MM月DD日 HH:mm:ss')
      }
    },
    // 获取url根路径
    urlOrigin(value) {
      return value?.split('/')[2]
    }
  },
  methods: {
    /**
     * @author 王泽
     * @time  2021-04-16
     * @param
     * @description 下载文件
     */
    downFile(val) {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = val.fileUrl
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }
}
</script>

<style scoped lang="scss">
.chat-record_item {
  .content-image,
  .content-video {
    width: 50%;
  }
  .word-wrap {
    word-break: break-all;
  }
  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 4px;
  }
  /deep/ .ant-list-item {
    align-items: start;
    &:hover {
      .view-context {
        display: inline-block;
      }
    }
  }
  .ant-list-item-meta-title {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
  .ant-list-item-meta-description {
    color: rgba(0, 0, 0, 0.85);
  }
  .chat-time {
    font-size: 12px;
    width: 200px;
    text-align: right;
    color: rgba(0, 0, 0, 0.45);
  }
  .demo-loading-container {
    padding-top: 20px;
    text-align: center;
  }
  .view-context {
    display: none;
    color: #1d61ef;
    cursor: pointer;
  }
  .link-container {
    display: flex;
    img {
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
    .link-text {
      flex: 1;
      position: relative;
    }
    .link-title,
    .link-desc {
      position: absolute;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .link-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
    .link-desc {
      color: #ccc;
      font-size: 12px;
      &:nth-child(2) {
        top: 20px;
      }
      &:nth-child(3) {
        top: 40px;
      }
    }
  }
}
</style>
