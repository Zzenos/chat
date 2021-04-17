<template>
  <div class="chatCotainer" v-if="chatId != 0">
    <!-- header -->
    <header>
      <!-- title -->
      <div class="title" style="height: 100%">
        <div v-if="records.length">
          <!-- 好友名字 -->
          <span v-if="records[0].chatType == 1" class="friendName">
            <!-- {{ records[0].fromId == userId ? records[0].to.wechatName : records[0].sender.wechatName }} -->
            {{ $route.query.wechatName }}
            <span style="color: #0ead63; font-size: 12px; line-height: 18px; font-weight: 400;"> @微信</span>
          </span>
          <!-- 群聊名称 -->
          <span v-else class="groupName">
            <!-- {{ groupInfo[0].groupName }}
            <span class="num">{{ memberCount }}</span> -->
            {{ $route.query.wechatName }}
            <span class="num">{{ memberCount }}</span>
          </span>
        </div>

        <div v-else>
          <!-- 暂无消息时的头部显示 好友名字 或 群聊名称 -->
          <span class="friendName">
            <span>{{ wechatName }}</span>
            <span style="color: #0ead63; font-size: 12px; line-height: 18px"> @微信</span>
          </span>
        </div>
      </div>
    </header>
    <!-- main -->
    <div class="noRecords" v-if="!records.length">
      <div class="left">
        <div class="talk-container" id="chatScrollbar" ref="list" @scroll="talkScroll($event)"></div>

        <div class="foot">
          <me-editor :sendToBottom="sendToBottom" ref="editor" />
        </div>
      </div>
      <div class="talk-record">
        <div class="top" style="padding:20px;text-align:left">聊天记录</div>
        <div class="search">
          <a-input-search placeholder="搜索" style="width: 260px; height: 32px; margin: 30px 18px" />
        </div>
        <div class="foot">
          <!-- <span>全部</span> -->
          <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" style="margin:100px auto" />
        </div>
      </div>
    </div>
    <main class="mainContainer" v-else>
      <div class="left">
        <div class="talk-container" id="chatScrollbar" ref="list" @scroll="talkScroll($event)">
          <!-- 数据加载状态栏 -->
          <div class="loading-toolbar">
            <span v-if="loadRecord == 1" class="pointer color-blue" @click="loadChatRecords"> <i class="el-icon-bottom" /> 查看更多消息... </span>

            <span v-else> 没有更多消息了... </span>
          </div>

          <!-- 消息主体 -->
          <div v-for="(item, index) in records" :key="item.msgId">
            <!-- 群消息 加入退出群聊-->
            <!-- <div v-if="item.msg_type == 2" class="message-box"></div> -->

            <!-- 消息时间 -->

            <div class="datetime no-select" v-text="sendTime(item.time)" v-show="compareTime(index, item.time)"></div>

            <!-- 系统通知 -->
            <div class="sysInfo" v-if="item.msgType == 'system'" v-text="item.content"></div>

            <!-- 对话消息 -->
            <div v-else class="message-box" :class="{ 'direction-rt': item.float == 'right' }">
              <!-- 头像 -->
              <div class="avatar-column">
                <a-avatar shape="square" :size="36" :src="item.sender.wechatAvatar" />
              </div>
              <div class="main-column">
                <!-- 昵称 只有在群聊时显示 必须消息来源是群聊且在左边盒子-->
                <div class="talk-title" :class="{ show: item.chatType == 2 && item.float == 'left' }">
                  <span class="nickname" v-show="item.chatType == 2" v-text="item.sender.wechatName"></span>
                </div>
                <!-- 内容 -->
                <div class="talk-content">
                  <!-- 文本消息 -->
                  <text-message v-if="item.msgType == 'text'" :content="item.content" :float="item.float" />

                  <!-- 图片消息 -->
                  <image-message v-else-if="item.msgType == 'image'" :src="item.url" />

                  <!-- 文件消息 -->
                  <file-message v-else-if="item.msgType == 'file'" :url="item.url" :title="item.title" />

                  <!-- 视频消息 -->
                  <video-message v-else-if="item.msgType == 'video'" :vid="item.msgId" :url="item.url" :coverurl="item.coverUrl" />

                  <!-- 个人名片 -->
                  <card-message v-else-if="item.msgType == 'card'" :src="item.content.profile_photo" :name="item.content.name" />

                  <!-- 语音消息 -->
                  <audio-message v-else-if="item.msgType == 'voice'" :float="item.float" :url="item.url" :vtime="item.voiceTime" />

                  <!-- 链接消息 -->
                  <link-message v-else-if="item.msgType == 'link'" :href="item.href" :desc="item.desc" :title="item.title" :coverurl="item.coverUrl" />

                  <!-- 小程序消息 -->
                  <webapp-message
                    v-else-if="item.msgType == 'weapp'"
                    :des="item.content.des"
                    :iconurl="item.content.weappiconurl"
                    :title="item.content.title"
                    :url="item.content.pagepath"
                    :coverurl="item.coverUrl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <me-editor :sendToBottom="sendToBottom" ref="editor" />
        </div>
      </div>
      <div class="talk-record" v-if="records[0].chatType == 2">
        <div class="top">
          <span class="groupInfo">群资料</span>
          <span>快捷回复</span>
        </div>
        <div class="search">
          <a-input-search placeholder="搜索群成员" style="width: 260px; height: 32px; margin: 16px 20px" />
        </div>
        <!-- <div class="memberList" v-for="item in groupInfo" :key="item.groupId">
          群成员({{ item.memberCount }})
          <div class="memberInfo" v-for="itm in item.members" :key="itm.wechatId">

            <a-avatar shape="square" :size="36" icon="user" :src="itm.wechatAvatar" />

            <span class="name"> itm.wechatName </span>
            <span style="color: #0ead63; font-size: 12px; margin-left: 8px">@微信</span>
          </div>
        </div> -->
      </div>
      <div class="talk-record" v-else></div>
    </main>
  </div>
  <div class="chatCotainer" v-else>
    <header></header>
    <div class="noRecords">
      <div class="left">
        <div class="talk-container" id="chatScrollbar" ref="list" @scroll="talkScroll($event)" style="position:relative">
          <div style="position:absolute;left: 50%;top: calc(50% + 32px); transform: translate(-50%, -50%);">
            <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
          </div>
        </div>
      </div>
      <div class="talk-record" style="position:relative">
        <!-- <div style="width:100%;height:64px;position:absolute"></div> -->
        <div style="position:absolute;left: 50%;top: calc(50% + 32px); transform: translate(-50%, -50%);">
          <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formateTime, parseTime } from '@/util/util'
import TextMessage from '@/views/chat/components/TextMessage'
import ImageMessage from '@/views/chat/components/ImageMessage'
import FileMessage from '@/views/chat/components/FileMessage'
import VideoMessage from '@/views/chat/components/VideoMessage'
import CardMessage from '@/views/chat/components/CardMessage'
import MeEditor from '@/views/chat/components/MeEditor'
import LinkMessage from '@/views/chat/components/LinkMessage.vue'
import AudioMessage from '@/views/chat/components/AudioMessage'
import WebappMessage from '@/views/chat/components/WebappMessage'
import { mapActions } from 'vuex'
import * as types from '@/store/actionType'

export default {
  name: 'chat',
  components: {
    TextMessage,
    ImageMessage,
    FileMessage,
    MeEditor,
    VideoMessage,
    CardMessage,
    LinkMessage,
    AudioMessage,
    WebappMessage
  },
  data() {
    return {
      loadRecord: 1,
      userId: this.$route.params.tjId,
      chatId: this.$route.params.contactId,
      wechatId: this.$route.query.wechatId,
      wechatName: this.$route.query.wechatName,
      memberCount: ''
    }
  },
  mounted() {
    this.toBottom()
  },
  methods: {
    parseTime,
    sendTime: formateTime,
    compareTime(index, datetime) {
      if (datetime == undefined) return false
      let time = Math.floor(datetime / 1000)
      if (index == 0) return true
      // if (index == this.records.length - 1) {
      let frontDate = Math.floor(this.records[index - 1].time / 1000)
      if (time - frontDate > 300) return true

      // }
      //对不是最后一条消息的处理
      // if (index != this.records.length - 1) {
      //   let nextDate = Math.floor(this.records[index + 1].time / 1000)
      //   if (nextDate - time < 300) return false
      //   return true
      // }
      //对最后一条消息的处理
      // if (currTime - time > 300) return true
      // return false
      //距离当前时间五分钟以内不显示消息时间
      // if (currTime - time < 300) return false
      // if (index == this.records.length - 1 && currTime - time > 300) return true
      // if (index == this.records.length - 1) return false
      // let nextDate = this.records[index + 1].time.replace(/-/g, '/')
      // let nextDate = Math.floor(this.records[index + 1].time / 1000)
      //两条消息相近五分钟以内 不显示
      // if (nextDate - time < 300) return false
      // return true
      // return !(parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}') == parseTime(new Date(nextDate), '{y}-{m}-{d} {h}:{i}'))
      // return !(parseTime(datetime, '{y}-{m}-{d} {h}:{i}') == parseTime(nextDate, '{y}-{m}-{d} {h}:{i}'))
    },
    toBottom() {
      let scrollHeight = document.getElementById('chatScrollbar').offsetHeight
      let el = document.getElementById('chatScrollbar')
      if (this.records.length == 0) {
        el.scrollTop = el.scrollHeight
      } else {
        el.scrollTop = el.scrollHeight - scrollHeight
      }
    },
    sendToBottom() {
      // this.records.push(txt)
      // console.log(this.records)
      // this.send()
      setTimeout(() => ((this.$refs.list.scrollTop = this.$refs.list.scrollHeight), this.changeloadRocrd()), 0)
    },
    talkScroll(e) {
      if (e.target.scrollTop == 0 && this.loadRecord == 1) {
        // console.log('到达顶部需要请求更多消息')
        return
      }
    },
    ...mapActions([types.PULL_HISTORY_MSG]),
    loadChatRecords() {
      // ('去请求更多聊天记录')
      // this.records.unshift(this[types.PULL_HISTORY_MSG](this.chatId, this.records[0].chatType))
      this.loadRecord = 2
      this[types.PULL_HISTORY_MSG](this.chatId, this.records[0].chatType)
    },
    changeloadRocrd() {
      this.loadRecord = 1
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newVal) {
        const { wechatId, wechatName, memberCount = '' } = newVal.query
        const { tjId, contactId } = newVal.params
        this.userId = tjId
        this.chatId = contactId //获取传来的参数
        this.wechatId = wechatId
        this.wechatName = wechatName
        this.memberCount = memberCount ? '(' + memberCount + ')' : ''
        this.sendToBottom()
        console.log(this.records, 'chat-records')
        // console.log(this.$route, 'chat-route')
        // console.log(this.chatId.split('&')[1],'======',this.userId,'=========',this.wechatId);
        // console.log(this.$route.params,this.$route.query.wechatName);
        // if (this.records.length > 0) {
        //   this.loadRecord = 1
        // } else {
        //   this.loadRecord = 2
        // }
        // this.$refs.editor.clear()
        // this.$refs.editor.getDraftText(this.chatId)
      }
    }
  },
  computed: {
    records() {
      console.log(this.loadRecord, 307)
      if (this.loadRecord == 1) {
        this.sendToBottom()
      }
      return this.$store.getters.getMsgsByChatId(this.chatId).map(item => {
        item.float = item.fromId == this.userId ? 'right' : 'left'
        return item
      })
    },
    groupInfo() {
      return this.$store.getters.groupDetailsById(this.wechatId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chatCotainer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: PingFangSC-Regular, PingFang SC;

  header {
    height: 68px;
    border-bottom: 1px solid #e4e5e7;

    .friendName,
    .groupName {
      float: left;
      margin: 22px 8px 22px 20px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 400;
    }
  }
  .noRecords {
    flex: 1 1 0;
    display: flex;
    .left {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      .talk-container {
        flex: 1 1 0;
      }
    }

    .talk-record {
      width: 300px;
      border-left: 1px solid #e4e5e7;
    }
    .none {
      width: 96px;
      height: 96px;
      margin: 300px auto;
    }
  }
  .mainContainer {
    flex: 1 1 0;
    display: flex;

    .left {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e4e5e7;
      .talk-container {
        flex: 1 1 0;
        box-sizing: border-box;
        padding: 40px 10px 10px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }

        .talk-title {
          display: none;
          height: 15px;
          margin-bottom: 4px;
          color: rgba(0, 0, 0, 0.45);
          font-weight: 400;
          line-height: 18px;
          font-size: 12px;
          text-align: left;
          &.show {
            display: block;
          }
        }

        .datetime {
          height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-weight: 400;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
          margin-top: 40px;
          margin-bottom: 40px;
        }

        .sysInfo {
          width: 252px;
          height: 18px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          line-height: 18px;
          text-align: center;
          margin: 20px auto;
        }

        .message-box {
          width: 100%;
          min-height: 46px;
          margin-top: 20px;
          display: flex;
          flex-direction: row;

          .avatar-column {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            order: 2;
          }

          .main-column {
            order: 3;
            flex: 1 auto;

            .talk-content {
              display: flex;
              align-items: flex-start;
              flex-direction: column;
            }
          }

          &.direction-rt {
            .avatar-column {
              order: 3;
              margin-right: 0;
              margin-left: 10px;
            }

            .main-column {
              order: 2;

              .talk-content {
                align-items: flex-end;
              }
            }
          }
        }
      }

      .foot {
        height: 160px;
      }
    }

    .talk-record {
      width: 300px;

      .top {
        width: 300px;
        height: 60px;
        font-size: 14px;
        color: #000;
        line-height: 22px;
        padding-top: 26px;
        padding-left: 21px;
        border-bottom: 1px solid #e4e5e7;

        .groupInfo {
          margin-right: 34px;
          padding-bottom: 12px;
          color: #1d61ef;
          border-bottom: 1px solid #1d61ef;
        }
      }

      // .search {
      //     padding:16px 20px;
      // }

      .memberList {
        padding-left: 20px;
        text-align: left;
        .memberInfo {
          margin-top: 20px;
          margin-bottom: 20px;
          .name {
            font-size: 14px;
            margin-left: 12px;
            margin-right: 8x;
          }
        }
      }
    }
  }
}
</style>
