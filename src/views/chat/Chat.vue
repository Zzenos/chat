<template>
  <div>
    <!-- header -->
    <header>
      <!-- title -->
      <div class="title" style="height: 100%">
        <!-- <p class="pointer" style="height: 100%"> -->
        <!-- 好友名字 -->
        <span v-if="!records[0].gId" class="friendName">
          {{ records[0].sender.nickname }}
          <span style="color: #0ead63; font-size: 12px; line-height: 18px"> @微信</span>
        </span>

        <!-- 群聊名称 -->
        <span v-else class="groupName">
          {{ records[0].sender.nickname }}
          <span class="num">0{{ groupNum }}0</span>
        </span>
        <!-- </p> -->
      </div>
    </header>
    <!-- main -->
    <div class="noRecords" v-if="records.length == 0"></div>
    <main class="mainContainer" v-else>
      <div class="left">
        <div class="talk-container" id="chatScrollbar">
          <!-- 消息主体 -->
          <div v-for="(item, index) in records" :key="item.id">
            <!-- 群消息 加入退出群聊-->
            <!-- <div v-if="item.msg_type == 2" class="message-box"></div> -->

            <!-- 消息时间 -->

            <div class="datetime no-select" v-text="sendTime(item.time)" v-show="compareTime(index, item.time)"></div>

            <!-- 对话消息 -->
            <div class="message-box" :class="{ 'direction-rt': item.float == 'right' }">
              <!-- 头像 -->
              <div class="avatar-column">
                <a-avatar shape="square" :size="36" icon="user" :src="item.sender.avatar" />
              </div>
              <div class="main-column">
                <!-- 昵称 只有在群聊时显示 必须消息来源是群聊且在左边盒子-->
                <div class="talk-title" :class="{ show: item.gId }">
                  <span class="nickname" v-show="item.gId" v-text="item.sender.nickname"></span>
                </div>
                <!-- 内容 -->
                <div class="talk-content">
                  <!-- 文本消息 -->
                  <text-message v-if="item.type == 2001" :content="item.content" :float="item.float" />

                  <!-- 图片消息 -->
                  <image-message v-else-if="item.type == 2002" :src="item.href" />

                  <!-- 文件消息 -->

                  <file-message v-else-if="item.type == 2010" :title="item.title" :url="item.url" :desc="item.desc" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <me-editor />
        </div>
      </div>
      <div class="talk-record" v-if="records[1].gId">这里是群聊成员列表</div>
      <div class="talk-record" v-else></div>
    </main>
  </div>
</template>

<script>
import { formateTime, parseTime } from '@/util/util'
import TextMessage from '@/views/chat/components/TextMessage'
import ImageMessage from '@/views/chat/components/ImageMessage'
import FileMessage from '@/views/chat/components/FileMessage'
import MeEditor from '@/views/chat/components/MeEditor'
export default {
  name: 'chat',
  props: {
    // 企微号
    userId: {
      type: String,
      required: false,
      default: '222'
    },
    contactId: {
      type: String,
      required: true,
      default: '1'
    }
  },
  components: {
    TextMessage,
    ImageMessage,
    FileMessage,
    MeEditor
  },
  data() {
    return {
      records: [
        {
          id: '535',
          type: 2001,
          fromId: '78',
          toId: 'dsadafqfdwqdwdq',
          gId: '',
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
          content: '你好',
          url: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0', //h5
          title: '文件/链接标题',
          voice_time: 72,
          desc: '链接描述',
          href: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          id: '6754',
          type: 2001,
          fromId: '',
          toId: '87667',
          gId: '34',
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
          type: 2001,
          fromId: '222',
          toId: 'dsadafqfdwqdwdq',
          gId: '',
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
          type: 2001,
          fromId: '3',
          toId: 'sadafqfdwqdwdq',
          gId: '',
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
          id: '564',
          type: 2002,
          fromId: '3',
          toId: '23',
          gId: '',
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
          type: 2010,
          fromId: '3',
          toId: '65',
          gId: '',
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
      groupNum: 0
    }
  },
  mounted() {
    // this.loadChatRecords();
    let scrollHeight = document.getElementById('chatScrollbar').offsetHeight
    // console.log(scrollHeight, 1);
    let el = document.getElementById('chatScrollbar')
    if (this.records.length == 0) {
      el.scrollTop = el.scrollHeight
      // console.log(el.scrollTop, 2)
    } else {
      el.scrollTop = el.scrollHeight - scrollHeight
      // console.log(el.scrollTop, 3)
    }
  },
  created() {
    console.log(this.userId)
    this.records.forEach(item => {
      item.float = item.fromId == this.userId ? 'right' : 'left'
    })
  },
  methods: {
    parseTime,
    sendTime: formateTime,
    loadChatRecords() {},
    compareTime(index, datetime) {
      if (datetime == undefined) return false
      datetime = datetime.replace(/-/g, '/')
      let time = Math.floor(Date.parse(datetime) / 1000)
      let currTime = Math.floor(new Date().getTime() / 1000)

      if (currTime - time < 60) return false
      if (index == this.records.length - 1) return true

      let nextDate = this.records[index + 1].time.replace(/-/g, '/')

      return !(parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}') == parseTime(new Date(nextDate), '{y}-{m}-{d} {h}:{i}'))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
header {
  width: 1052px;
  height: 68px;
  background: rgba(0, 0, 0, 0.3);

  .friendName,
  .groupName {
    float: left;
    margin: 22px 8px 22px 20px;
  }
}
.noRecords {
  width: 752px;
  height: 956px;
  background: lightblue;
}
.mainContainer {
  display: flex;

  .talk-title {
    display: none;
    height: 15px;
    // background: #000;
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

  .talk-container {
    width: 752px;
    // height: 956px;
    height: 796px;
    background: rgba(20, 20, 20, 0.2);
    box-sizing: border-box;
    padding-top: 40px;
    padding-left: 10px;
    padding-right: 10px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
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

  .talk-record {
    width: 300px;
    height: 956px;
    background: rgba(100, 100, 100, 0.2);
  }
}
.foot {
  // width: 752px;
  width: 100%;
  height: 160px;
  background: pink;
  position: relative;
  // top: 752px;
  border-top: 1px solid #e4e5e7;
}
</style>
