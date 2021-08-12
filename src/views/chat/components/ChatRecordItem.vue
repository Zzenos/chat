<template>
  <a-list class="chat-record_item" :data-source="list" :rowKey="row => row.seq">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta>
        <span slot="title">{{ item.sender.name }}</span>
        <img class="user-avatar" slot="avatar" :src="item.sender.avatar" />
        <template slot="description">
          <!-- 文字 -->
          <div class="word-wrap" v-if="item.msgtype === 'text'" v-html="item.content"></div>
          <!-- 链接 -->
          <div class="word-wrap" v-else-if="item.msgtype === 'link'">
            <a :href="item.content || item.href" target="blank">
              <div v-if="item.coverUrl" class="link-container">
                <img :src="item.coverUrl" />
                <div class="link-text">
                  <div class="link-title">{{ item.title || '无标题文档' }}</div>
                  <div class="link-desc">{{ item.desc || item.content }}</div>
                  <div class="link-desc">{{ (item.content || item.href) | urlOrigin }}</div>
                </div>
              </div>
              <span v-else>{{ item.content }}</span>
            </a>
          </div>
          <!-- 图片 -->
          <div v-else-if="item.msgtype === 'image'">
            <a :href="item.fileUrl || item.content" target="blank">
              <img class="content-image" :src="item.fileUrl || item.content" alt="未加载..." />
            </a>
          </div>
          <!-- 视频 -->
          <div v-else-if="item.msgtype === 'video'">
            <video class="content-video" :src="item.fileUrl" :poster="item.coverUrl" controls="controls" />
          </div>
          <!-- 文件 -->
          <div v-else-if="item.msgtype === 'file'">
            <a-button class="file-text" type="link" @click="downFile(item)">
              <a-icon type="file" />
              {{ item.title }}
            </a-button>
          </div>
          <!-- 语音 -->
          <div v-else-if="item.msgtype === 'voice'" class="chat-record_voice">
            <chat-voice :voiceUrl="item.fileUrl"></chat-voice>
            <a-button type="link" @click="downFile(item)" class="voice-link">音频文件下载</a-button>
          </div>
          <!-- 系统 -->
          <div class="word-wrap" v-else-if="item.msgtype === 'system'" v-html="`<span style='color:rgba(0,0,0,.45)'>系统提示：</span>${item.content}`"></div>
          <!-- 视频号 -->
          <div v-else-if="item.msgtype === 'videoNum'" class="video-num_container">
            <div class="video-cover">
              <img :src="item.thumbUrl" alt="" />
            </div>
            <div class="video-info">
              <div class="video-user_info">
                <div class="video-user_avatar">
                  <img :src="item.icon" alt="" />
                </div>
                <span class="video-user_name">{{ item.title }}</span>
              </div>
              <div class="video-desc">{{ item.desc }}</div>
              <div class="video-type_name">
                <span class="video-icon"></span>
                视频号
              </div>
            </div>
          </div>
          <!-- 地图位置 -->
          <div v-else-if="item.msgtype === 'location'" class="map-location">
            <div class="map-icon">
              <img src="@/assets/icon_map.png" alt="" />
            </div>
            <div class="location-text">
              <div class="location-title">{{ item.title }}</div>
              <div class="location-address">{{ item.address }}</div>
            </div>
          </div>
          <div v-else>[暂不支持该类型查看]</div>
          <div v-if="item.recall" class="recall-message">(此消息已撤回)</div>
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
import ChatVoice from './ChatVoice.vue'

export default {
  props: ['list', 'loading'],
  components: {
    ChatVoice
  },
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
      link.href = val.msgtype == 'voice' ? val.fileUrl : val.href
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
  /deep/ .file-text {
    span {
      word-break: break-all;
      white-space: normal;
      text-align: left;
      vertical-align: middle;
    }
  }
  .chat-record_voice {
    display: flex;
    justify-content: space-between;
    &:hover {
      .voice-link {
        visibility: visible;
      }
    }
  }
  .voice-link {
    visibility: hidden;
  }
  .video-num_container {
    width: 224px;
    background: #ffffff;
    border-radius: 4px;
    display: inline-block;
    vertical-align: top;
    box-shadow: #dfdbda 0 0 5px;
    overflow: hidden;
    .video-cover {
      width: 100%;
      height: 230px;
      overflow: hidden;
      img {
        width: 100%;
        // height: 100%;
        vertical-align: top;
      }
    }
    .video-info {
      padding: 10px;
    }
    .video-user_avatar {
      display: inline-block;
      vertical-align: middle;
      width: 24px;
      height: 24px;
      margin-right: 5px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .video-user_name {
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
      width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .video-desc {
      width: 100%;
      padding: 5px 0px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 1px solid #efefef;
    }
    .video-type_name {
      padding-top: 5px;
      color: #999;
      font-size: 12px;
    }
    .video-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../../assets/icon_shipinhao.png') no-repeat center center;
      background-size: 20px 20px;
      margin-right: 8px;
      vertical-align: top;
    }
  }
  .map-location {
    display: flex;
    width: 340px;
    background: #fff;
    // border: 1px solid rgba(0,0,0,0.15);
    border-radius: 4px;
    padding: 10px;
    box-shadow: -3px 3px 10px #dfdbda;
  }
  .map-icon {
    width: 48px;
    height: 48px;
    margin-right: 12px;
    img {
      width: 100%;
    }
  }
  .location-text {
    flex: 1;
  }
  .location-title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    margin-top: 2px;
  }
  .location-address {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 18px;
    margin-top: 4px;
  }
  .recall-message {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    user-select: none;
  }
}
</style>
