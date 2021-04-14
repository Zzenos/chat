<template>
  <div class="default" v-if="wechatId != 0">
    <div class="contact-info" v-if="type == 1 || type == 3">
      <div class="top">
        <!-- 头像  -->
        <a-avatar shape="square" :size="112" :src="allInfo.wechatAvatar" />
        <!-- 名字 -->
        <div class="name">
          <span>{{ allInfo.wechatName }}</span>
          <span style="margin-left:8px">
            <img v-if="allInfo.gender == 1" src="../../assets/icon_men.png" alt="" />
            <img v-if="allInfo.gender == 2" src="../../assets/icon_women.png" alt="" />
          </span>
        </div>
        <div style="color: #FF8000; font-size: 14px; margin-top: 8px; line-height:22px">{{ company }}</div>
        <!-- <div style="color: #0ead63; font-size: 14px; margin-top: 8px; line-height:22px" v-else>@微信</div> -->
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
            <!-- <span>一般用户</span> -->
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
          <div class="name">{{ allInfo.wechatName }}</div>
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
  <!-- <div class="default" v-else>
    <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
  </div> -->
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import * as types from '@/store/actionType'

export default {
  name: 'contactInfo',
  data() {
    return {
      wechatId: this.$route.params.contactId,
      //type 1 客户  2 群聊 3 成员
      type: this.$route.query.type,
      // info: [],
      allInfo: {
        wechatAvatar: '',
        wechatName: '',
        company: ''
      }
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
        data = this.groupDetailsById(this.wechatId)
      }
      if (type === 3) {
        data = this.memberDetailsById(this.wechatId)
      }
      return data
    },
    company() {
      return this.allInfo.company ? '@' + this.allInfo.company : ''
    },
    memberCount() {
      return this.allInfo.memberCount ? this.allInfo.company + '人' : ''
    },
    addTime() {
      return this.allInfo.addTime ? this.allInfo.addTime.replace('T', ' ') : ''
    }
  },
  watch: {
    ainfo(newVal) {
      console.log(typeof newVal)
      if (typeof newVal == 'object' && Object.keys(newVal).length) {
        for (const key in newVal) {
          this.$set(this.allInfo, key, newVal[key])
        }
      }
    },
    $route: {
      immediate: true,
      handler(newVal) {
        const { type, wechatAvatar, wechatName, company } = newVal.query
        this.wechatId = newVal.params.contactId
        this.type = type
        this.allInfo.wechatAvatar = wechatAvatar
        this.allInfo.wechatName = wechatName
        this.allInfo.company = company
        console.log(this.allInfo, 'allinfo')
      }
    }
  },
  methods: {
    tochat() {
      const chatId = `${this.$route.params.tjId + '&' + this.wechatId}`
      this.$router.push({
        path: `/chatframe/${this.$route.params.tjId}/recent/${chatId}`,
        query: { ...this.$route.query }
      })
      this[types.ADD_CHAT_LIST]({
        tjId: this.$route.params.tjId,
        chatList: [
          {
            chatId,
            chatType: Number(this.type),
            wechatAvatar: this.allInfo.wechatAvatar,
            wechatName: this.allInfo.wechatName,
            lastActiveTime: new Date().getTime()
          }
        ]
      })
    },
    ...mapMutations([types.ADD_CHAT_LIST])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.default {
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
      font-family: PingFangSC-Regular, PingFang SC;
      .name {
        margin-top: 16px;
        // width: 192px;
        // height: 42px;
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
      padding-left: 226px;
      padding-right: 226px;

      .info {
        & > div {
          display: flex;
          position: relative;
          height: 22px;
          margin-bottom: 20px;
          .left {
            // margin-top: 20px;
            margin-right: 40px;
            width: 56px;
            text-align: justify;
            height: 22px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
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
            display: block;
            // margin-top: 21px;
            line-height: 22px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.85);
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
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 40px;
        cursor: pointer;
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
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          line-height: 42px;
          text-align: left;
        }
        .num,
        .owner {
          margin-top: 14px;
          text-align: left;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
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
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 40px;
      cursor: pointer;
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
