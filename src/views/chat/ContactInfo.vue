<template>
  <div class="default" v-if="wechatId != 0">
    <div class="contact-info" v-if="type == 1 || type == 3">
      <div class="top">
        <!-- 头像  -->
        <a-avatar shape="square" :size="112" :src="allInfo.wechatAvatar" />
        <!-- 名字      -->
        <div class="name">
          <span>{{ allInfo.wechatName }}</span>
          <span style="margin-left:8px">
            <img v-if="allInfo.gender == 1" src="../../assets/icon_men.png" alt="" />
            <img v-if="allInfo.gender == 2" src="../../assets/icon_women.png" alt="" />
          </span>
          <span v-if="type == 1 && lost == 1" class="lost-customer-sty">流失客户</span>
          <span v-if="type == 1 && lost == 3" class="lost-customer-sty">删除客户</span>
        </div>
        <div style="color: #FF8000; font-size: 14px; margin-top: 8px; line-height:22px; font-weight: 400;">{{ company }}</div>
        <div v-if="type == 1 && !company" style="color: #0ead63; font-size: 14px; margin-top: 8px; line-height:22px">@微信</div>
      </div>
      <div class="bottom">
        <div class="info">
          <!-- 备注 -->
          <div>
            <div class="left">备注<i></i></div>
            <span>{{ allInfo.remarkAlias }}</span>
            <!-- <span class="edit"><a-icon type="edit"/></span> -->
          </div>
          <!-- 电话 -->
          <div v-if="type == 1">
            <div class="left">电话<i></i></div>
            <span>{{ allInfo.mobilephones }}</span>
          </div>
          <!-- 添加时间 -->
          <div v-if="type == 1">
            <div class="left">添加时间<i></i></div>
            <span>{{ addTime }}</span>
          </div>
          <!-- 标签 -->
          <div v-if="type == 1">
            <div class="left">标签<i></i></div>
            <div class="tag-box">
              <span v-for="(item, index) in allInfo.tags" v-text="item" :key="index" class="tags"></span>
            </div>
            <!-- <span class="edit"><a-icon type="edit"/></span> -->
          </div>
          <!-- 部门 -->
          <div v-if="type == 3">
            <div class="left">部门<i></i></div>
            <span>{{ allInfo.department }}</span>
          </div>
          <!-- 描述 -->
          <div v-if="type == 3">
            <div class="left">描述<i></i></div>
            <span>{{ allInfo.description }}</span>
            <!-- <span class="edit"><a-icon type="edit"/></span> -->
          </div>
        </div>
        <div class="sendmsg" @click="tochat">
          发消息
        </div>
      </div>
    </div>
    <div class="groupBox" v-else>
      <div class="group">
        <a-avatar shape="square" :size="112" icon="user" :src="allInfo.wechatAvatar" />
        <div class="nameNum">
          <div class="name">
            <span>{{ allInfo.wechatName || '未命名' }}</span>
            <span class="out common" v-if="allInfo.isInner === 0">外部</span>
            <span class="inner common" v-if="allInfo.isInner === 1">内部</span>
          </div>
          <div class="num">
            <span>成员</span>
            <span style="color:rgba(0, 0, 0, 0.85)"> {{ memberCount }}</span>
          </div>
          <div class="owner">
            <span>群主</span>
            <span style="color:rgba(0, 0, 0, 0.85)"> {{ allInfo.ownerName }}</span>
          </div>
        </div>
      </div>
      <div class="sendmsg" style="margin:80px auto" @click="tochat">发消息</div>
    </div>
  </div>
  <no-data v-else />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import * as types from '@/store/actionType'

export default {
  name: 'contactInfo',
  data() {
    return {
      wechatId: this.$route.params.contactId,
      groupId: this.$route.query.tjId,
      tjId: this.$route.params.tjId,
      //type 1 客户  2 群聊 3 成员
      type: this.$route.query.type,
      // info: [],
      allInfo: {
        wechatAvatar: '',
        wechatName: '',
        company: '',
        memberCount: ''
      },
      lost: ''
    }
  },
  computed: {
    ...mapGetters(['customerDetailsById', 'groupDetailsById', 'memberDetailsById']),
    ainfo() {
      const type = Number(this.type)
      let data = {}
      if (!this.wechatId) return data
      if (type === 1) {
        data = this.customerDetailsById(this.wechatId)
      }
      if (type === 2) {
        data = this.groupDetailsById(this.groupId)
      }
      if (type === 3) {
        data = this.memberDetailsById(this.wechatId)
      }
      if (typeof data == 'object' && Object.keys(data).length) {
        for (const key in data) {
          this.$set(this.allInfo, key, data[key])
        }
      }
      return data
    },
    company() {
      return this.allInfo.company ? '@' + this.allInfo.company : ''
    },
    memberCount() {
      return this.allInfo.memberCount ? this.allInfo.memberCount + '人' : ''
    },
    addTime() {
      return this.allInfo.addTime ? this.allInfo.addTime.replace('T', ' ') : ''
    }
  },
  watch: {
    ainfo(newVal) {
      if (typeof newVal == 'object' && Object.keys(newVal).length) {
        for (const key in newVal) {
          this.$set(this.allInfo, key, newVal[key])
        }
      }
    },
    $route: {
      immediate: true,
      handler(newVal) {
        const { type, wechatAvatar, wechatName, company, memberCount, tjId, lost } = newVal.query
        this.wechatId = newVal.params.contactId
        this.tjId = newVal.params.tjId
        this.type = type
        this.groupId = tjId
        this.allInfo.wechatAvatar = wechatAvatar
        this.allInfo.wechatName = wechatName
        this.allInfo.company = company
        this.allInfo.memberCount = memberCount
        this.lost = lost
        // console.log(this.allInfo, 'allinfo')
      }
    }
  },
  methods: {
    tochat() {
      const { tjId } = this.$route.params
      const chatId = `${tjId + '&' + this.wechatId}`
      this.setCurChatId(chatId)
      this.$router.push({
        path: `/chatframe/${tjId}/recent/${chatId}`,
        query: { ...this.$route.query }
      })
      this[types.ADD_CHAT_LIST]({
        tjId,
        chatList: [
          {
            chatId,
            ...this.$route.query,
            isTop: this.allInfo.isTop || 0,
            company: this.allInfo.company, // 解决通讯录成员新建会话@未显示公司问题
            chatType: Number(this.type),
            wechatAvatar: this.allInfo.wechatAvatar,
            wechatName: this.allInfo.wechatName,
            lastActiveTime: new Date().getTime()
          }
        ]
      })
    },
    ...mapMutations([types.ADD_CHAT_LIST, 'setCurChatId'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.default {
  font-family: PingFangSC-Regular, PingFang SC;
  .contact-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    .top {
      background: #f4f6f9;
      height: 320px;
      padding-top: 80px;
      font-size: 28px;
      color: rgba(0, 0, 0, 0.85);
      .name {
        margin-top: 16px;
        height: 42px;
        line-height: 42px;
        font-weight: 400;
        .lost-customer-sty {
          width: 56px;
          height: 18px;
          display: inline-block;
          border-radius: 2px;
          background: #dcdee0;
          color: rgba(0, 0, 0, 0.65);
          font-size: 11px;
          line-height: 16px;
          font-weight: 400;
          margin-left: 8px;
          padding-top: 3px;
        }
      }
      /deep/ .ant-avatar > img {
        display: block;
        width: 100%;
        height: 100%;
        -o-object-fit: cover;
        object-fit: cover;
        border-radius: 16px;
      }
    }
    .bottom {
      flex: 1 1 0;
      padding-top: 60px;
      // padding-left: 226px;
      // padding-right: 226px;

      .info {
        max-width: 600px;
        margin: 0 auto;
        & > div {
          // display: flex;
          position: relative;
          height: 22px;
          margin-bottom: 20px;
          // overflow: hidden;
          text-overflow: ellipsis;
          .left {
            // margin-top: 20px;
            float: left;
            margin-right: 40px;
            width: 56px;
            text-align: justify;
            height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
            line-height: 22px;

            // 用来两端对齐文字
            i {
              display: inline-block;
              padding-left: 100%;
            }
          }
          span {
            // display: block;
            float: left;
            // margin-top: 21px;
            line-height: 22px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.85);
            &.tags {
              background: #e6f4ff;
              border-radius: 2px;
              padding: 0 8px;
              margin-right: 8px;
              margin-bottom: 15px;
              // width: 64px
            }
          }
          .edit {
            //  align-items: flex-end;
            position: absolute;
            right: 0;
          }
        }
      }
      .sendmsg {
        width: 200px;
        height: 40px;
        background: #1d61ef;
        margin: 60px auto;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 40px;
        cursor: pointer;
        border-radius: 4px;
      }
    }
  }
  .groupBox {
    height: 100%;
    padding-top: 200px;
    // padding-left: 160px;
    .group {
      display: flex;
      padding-left: 160px;
      .nameNum {
        margin-left: 40px;
        .name {
          display: flex;
          align-items: center;
          font-size: 28px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          line-height: 42px;
          text-align: left;
        }
        .common {
          // width: 30px;
          height: 18px;
          border-radius: 2px;
          font-size: 11px;
          line-height: 16px;
          margin-left: 4px;
          &.out {
            padding: 1px 4px;
            background: #daf2e8;
            color: #0ea860;
          }
          &.inner {
            padding: 1px 4px;
            background: #e1eaff;
            color: #1d61ef;
          }
        }
        .num,
        .owner {
          margin-top: 14px;
          text-align: left;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          line-height: 22px;
          span {
            margin-right: 20px;
          }
        }
        .owner {
          margin-top: 12px;
        }
      }
    }
    .sendmsg {
      width: 200px;
      height: 40px;
      background: #1d61ef;
      margin: 80px auto;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      padding-top: 9px;
      cursor: pointer;
      border-radius: 4px;
    }
  }

  .none {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
