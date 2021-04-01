<template>
  <div class="chatCotainer">
    <!-- header -->
    <header>
      <!-- title -->
      <div class="title" style="height: 100%">
        <!-- 好友名字 -->
        <span v-if="records[0].chatType == 1" class="friendName">
          {{ records[0].sender.nickname }}
          <span style="color: #0ead63; font-size: 12px; line-height: 18px"> @微信</span>
        </span>

        <!-- 群聊名称 -->
        <span v-else class="groupName">
          {{ records[0].sender.nickname }}
          <span class="num">群聊人数{{ groupNum }}</span>
        </span>
      </div>
    </header>
    <!-- main -->
    <div class="noRecords" v-if="records.length == 0"></div>
    <main class="mainContainer" v-else>
      <div class="left">
        <div class="talk-container" id="chatScrollbar" ref="list">
          <!-- 消息主体 -->
          <div v-for="(item, index) in records" :key="item.id">
            <!-- 群消息 加入退出群聊-->
            <!-- <div v-if="item.msg_type == 2" class="message-box"></div> -->

            <!-- 消息时间 -->

            <div class="datetime no-select" v-text="sendTime(item.time)" v-show="compareTime(index, item.time)"></div>

            <!-- 系统通知 -->
            <div class="sysInfo" v-if="item.msgType == 10000" v-text="item.content"></div>

            <!-- 对话消息 -->
            <div v-else class="message-box" :class="{ 'direction-rt': item.float == 'right' }">
              <!-- 头像 -->
              <div class="avatar-column">
                <a-avatar shape="square" :size="36" icon="user" :src="item.sender.avatar" />
              </div>
              <div class="main-column">
                <!-- 昵称 只有在群聊时显示 必须消息来源是群聊且在左边盒子-->
                <div class="talk-title" :class="{ show: item.chatType == 2 && item.float == 'left' }">
                  <span class="nickname" v-show="item.chatType == 2" v-text="item.sender.nickname"></span>
                </div>
                <!-- 内容 -->
                <div class="talk-content">
                  <!-- 文本消息 -->
                  <text-message v-if="item.msgType == 2001" :content="item.content" :float="item.float" />

                  <!-- 图片消息 -->
                  <image-message v-else-if="item.msgType == 2002" :src="item.href" />

                  <!-- 文件消息 -->
                  <file-message v-else-if="item.msgType == 2010" :href="item.href" :desc="item.desc" />

                  <!-- 视频消息 -->
                  <video-message v-else-if="item.msgType == 2004" :vid="item.id" :url="item.url" />

                  <!-- 个人名片 -->
                  <card-message v-else-if="item.msgType == 2006" :src="item.sender.avatar" :name="item.sender.nickname" />

                  <!-- 语音消息 -->
                  <!-- <voice-message/> -->

                  <!-- 链接消息 -->
                  <link-message v-else-if="item.msgType == 2005" :url="item.url" :desc="item.desc" />

                  <!-- 小程序消息 -->
                  <!-- <weapp-message/> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <me-editor :send="sendMsg" />
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
        <div class="memberList">
          群成员 数量{{ groupNum }}
          <div class="memberInfo">
            <!-- 头像 -->
            <a-avatar shape="square" :size="36" icon="user" src="https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0" />
            <!-- 昵称 -->
            <span class="name"> 次倩润item.group_name </span>
            <span style="color: #0ead63; font-size: 12px; margin-left: 8px">@微信</span>
          </div>
          <div class="memberInfo">
            <!-- 头像 -->
            <a-avatar shape="square" :size="36" icon="user" src="https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0" />
            <!-- 昵称 -->
            <span class="name"> 次倩润item.group_name </span>
            <span style="color: #0ead63; font-size: 12px; margin-left: 8px">@微信</span>
          </div>
        </div>
      </div>
      <div class="talk-record" v-else></div>
    </main>
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
import LinkMessage from './components/LinkMessage.vue'

export default {
  name: 'chat',
  components: {
    TextMessage,
    ImageMessage,
    FileMessage,
    MeEditor,
    VideoMessage,
    CardMessage,
    LinkMessage
  },
  data() {
    return {
      records: [
        {
          id: '535',
          msgType: 2001,
          fromId: '1',
          toId: 'dsadafqfdwqdwdq',
          chatType: '2',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          sender: {
            id: '334',
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
          content: '你好1',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '6754',
          msgType: 2001,
          fromId: '2',
          toId: '87667',
          chatType: '1',
          atLocation: '',
          time: '2021-03-26 15:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          sender: {
            id: '455665',
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
          content: '你好',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '6757',
          msgType: 2004,
          fromId: '3',
          toId: 'dsadafqfdwqdwdq',
          chatType: '2',
          atLocation: '',
          time: '2021-03-20 11:23:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          // float: "right",
          sender: {
            id: '7668',
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
          content: '你好',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '6456',
          msgType: 2001,
          fromId: '4',
          toId: 'sadafqfdwqdwdq',
          chatType: '1',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          // float: "right",
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
          content: '你好',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '645226',
          msgType: 10000,
          fromId: '5',
          toId: 'sadafqfdwqdwdq',
          chatType: '1',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          // float: "right",
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
          content: '这是系统通知消息',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '76',
          msgType: 2006,
          fromId: '3',
          toId: 'sadafqfdwqdwdq',
          chatType: '1',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          // float: "right",
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
          content: '这是系统通知消息',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '564',
          msgType: 2002,
          fromId: '3',
          toId: '23',
          chatType: '1',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          // float: "right",
          sender: {
            id: '89',
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
          content: '你好',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '53',
          msgType: 2010,
          fromId: '2',
          toId: '65',
          chatType: '1',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          // float: "right",
          sender: {
            id: '65453434',
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
          content: '你好',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '531',
          msgType: 2005,
          fromId: '3',
          toId: '65',
          chatType: '1',
          atLocation: '',
          time: '2021-03-20 11:13:05.000',
          at: '',
          atIds: 'id1,id2,id3,id4...',
          // float: "right",
          sender: {
            id: '65453434',
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
          content: '你好',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        }
      ],
      groupNum: 0,
      userId: this.$route.params.userId,
      chatId: this.$route.params.contactId
    }
  },
  mounted() {
    let scrollHeight = document.getElementById('chatScrollbar').offsetHeight
    let el = document.getElementById('chatScrollbar')
    if (this.records.length == 0) {
      el.scrollTop = el.scrollHeight
    } else {
      el.scrollTop = el.scrollHeight - scrollHeight
    }
  },
  created() {
    this.records.forEach(item => {
      item.float = item.fromId == this.userId ? 'right' : 'left'
    })
  },
  methods: {
    parseTime,
    sendTime: formateTime,
    compareTime(index, datetime) {
      if (datetime == undefined) return false
      datetime = datetime.replace(/-/g, '/')
      let time = Math.floor(Date.parse(datetime) / 1000)
      let currTime = Math.floor(new Date().getTime() / 1000)
      if (currTime - time < 60) return false
      if (index == this.records.length - 1) return true
      let nextDate = this.records[index + 1].time.replace(/-/g, '/')
      return !(parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}') == parseTime(new Date(nextDate), '{y}-{m}-{d} {h}:{i}'))
    },
    sendMsg(txt) {
      this.records.push(txt)
    }
  },
  watch: {
    $route() {
      this.chatId = this.$route.params.contactId //获取传来的参数
      this.records = this.$store.getters.getMsgsByChatId(this.chatId).map(item => {
        item.float = item.fromId == this.userId ? 'right' : 'left'
        return item
      })
    },
    records() {
      setTimeout(() => (this.$refs.list.scrollTop = this.$refs.list.scrollHeight), 0)
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

  header {
    height: 68px;
    border-bottom: 1px solid #e4e5e7;

    .friendName,
    .groupName {
      float: left;
      margin: 22px 8px 22px 20px;
    }
  }
  .noRecords {
    flex: 1 1 0;
  }
  .mainContainer {
    flex: 1 1 0;
    display: flex;

    .left {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      .talk-container {
        flex: 1 1 0;
        box-sizing: border-box;
        padding-top: 40px;
        padding-left: 10px;
        padding-right: 10px;
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
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          line-height: 18px;
          text-align: center;
          margin: 0 auto;
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
        // height: 160px;
        // background: pink;
        position: relative;
        border-top: 1px solid #e4e5e7;
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
        background: lightblue;
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
