<template>
  <div class="default" v-if="wechatId != 0">
    <div class="contact-info" v-if="type == 1 || type == 3">
      <div class="top">
        <!-- 头像  -->
        <a-avatar shape="square" :size="112" :src="info.wechatAvatar" />
        <!-- 名字 -->
        <div class="name">{{ info.wechatName }}</div>
        <div style="color: #FF8000; font-size: 12px; margin-top: 8px" v-if="allInfo && allInfo.company">@{{ allInfo.company }}</div>
        <div style="color: #0ead63; font-size: 12px; margin-top: 8px" v-else>@微信</div>
      </div>
      <div class="bottom">
        <div class="info">
          <!-- 备注 -->
          <div>
            <div class="left">备注<i></i></div>
            <span v-if="allInfo && allInfo.remarkAlias">{{ allInfo.remarkAlias }}</span>
            <!-- <span class="edit"><a-icon type="edit"/></span> -->
          </div>
          <!-- 电话 -->
          <div v-if="type == 1">
            <div class="left">电话<i></i></div>
            <span v-if="allInfo && allInfo.mobilephones">{{ allInfo.mobilephones }}</span>
          </div>
          <!-- 添加时间 -->
          <div v-if="type == 1">
            <div class="left">添加时间<i></i></div>
            <span v-if="allInfo && allInfo.addTime">{{ allInfo.addTime }}</span>
          </div>
          <!-- 标签 -->
          <div v-if="type == 1">
            <div class="left">标签<i></i></div>
            <span>一般用户</span>
            <!-- <span class="edit"><a-icon type="edit"/></span> -->
          </div>
          <!-- 部门 -->
          <div v-if="type == 3">
            <div class="left">部门<i></i></div>
            <span v-if="allInfo && allInfo.department">{{ allInfo.department }}</span>
          </div>
          <!-- 描述 -->
          <div v-if="type == 3">
            <div class="left">描述<i></i></div>
            <span v-if="allInfo && allInfo.description">{{ allInfo.description }}</span>
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
        <a-avatar shape="square" :size="112" icon="user" :src="info.wechatAvatar" />
        <div class="nameNum">
          <div class="name">{{ info.wechatName }}</div>
          <div class="num">
            <span>成员</span>
            <span style="color:rgba(0, 0, 0, 0.85)" v-if="allInfo && allInfo.memberCount"> {{ allInfo.memberCount }}人</span>
          </div>
          <div class="owner">
            <span>群主</span>
            <span style="color:rgba(0, 0, 0, 0.85)" v-if="allInfo && allInfo.ownerName"> {{ allInfo.ownerName }}</span>
          </div>
        </div>
      </div>
      <div class="sendmsg" @click="tochat">发消息</div>
    </div>
  </div>
  <no-data v-else />
  <!-- <div class="default" v-else>
    <img class="none" src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
  </div> -->
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'contactInfo',
  data() {
    return {
      wechatId: this.$route.params.contactId,
      //type 1 客户  2 群聊 3 成员
      type: this.$route.query.type,
      info: [],
      allInfo: {}
    }
  },
  computed: {
    ...mapGetters(['customerDetailsById', 'groupDetailsById', 'memberDetailsById']),
    ainfo() {
      return this.type == 1 ? this.customerDetailsById(this.wechatId) : this.type == 2 ? this.groupDetailsById(this.wechatId) : this.memberDetailsById(this.wechatId)
    }
  },
  created() {
    // 解决第一次点击头像 显示不出来
    this.wechatId = this.$route.params.contactId
    this.type = this.$route.query.type
    this.info.wechatAvatar = this.$route.query.wechatAvatar
    this.info.wechatName = this.$route.query.wechatName
    this.allInfo = this.ainfo || {}
  },
  watch: {
    $route() {
      this.wechatId = this.$route.params.contactId
      this.type = this.$route.query.type
      this.info.wechatAvatar = this.$route.query.wechatAvatar
      this.info.wechatName = this.$route.query.wechatName
      this.allInfo = this.ainfo || {}

      console.log(this.$route.params, this.$route.query)
      console.log(this.allInfo, this.allInfo.remarkAlias, 777)
      // console.log(this.info)
    }
  },
  methods: {
    tochat() {
      this.$router.push({
        path: `/chatframe/${this.$route.params.tjId}/recent/${this.$route.params.tjId + '&' + this.wechatId}`,
        query: { ...this.$route.query }
      })
    }
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
          .left {
            margin-top: 20px;
            margin-right: 40px;
            width: 80px;
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
            margin-top: 21px;
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
    padding-left: 160px;
    .group {
      display: flex;
      .nameNum {
        margin-left: 40px;
        .name {
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          line-height: 42px;
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
