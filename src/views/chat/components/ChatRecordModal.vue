<template>
  <a-modal title="聊天记录" width="960px" :visible="visible" :footer="null" @cancel="handleCancel" class="chat-record_modal" :bodyStyle="{ padding: '20px 0px' }" :maskClosable="false">
    <div class="record-modal_top" v-if="infoData">
      <template v-if="type">
        <!-- <svg-icon icon-class="icon-group" class="info-avatar" /> -->
        <img :src="infoData.group && infoData.group.avatar" class="info-avatar" />
        <span class="infoData-name">{{ infoData.group && infoData.group.name }}</span>
        <span class="infoData-object">所属员工：{{ infoData.wechatAccount.wechatName }}</span>
      </template>
      <template v-else>
        <img :src="infoData.customerInfo.avatar" class="info-avatar" />
        <span class="infoData-name">{{ infoData.customerInfo.name }}</span
        ><span class="wechat-flag">@微信</span>
        <span class="infoData-object">对话员工：{{ infoData.wechatAccount.wechatName }}</span>
      </template>
    </div>
    <div class="record-modal_searchbar">
      <a-range-picker class="m-t-10" v-model="searchData.date" :placeholder="['开始日期', '结束日期']" :disabledDate="disabledDate" @calendarChange="hanleCalendarChange" @openChange="initStartTime">
        <a-icon slot="suffixIcon" type="calendar" />
      </a-range-picker>
      <a-input-search v-model="searchData.nameSearch" placeholder="请输入搜索内容" class="m-l-10 m-t-10 m-r-10" style="width: 300px;margin-left:10px;margin-right:10px" allowClear />
      <a-button class="m-t-10" type="primary" ghost @click="handleSearch">查询</a-button>
      <a-button class="m-l-10 m-t-10" style="margin-left:10px" type="primary" :loading="exportLoading" ghost @click="handleExport">导出</a-button>
    </div>
    <div v-if="currentKey === 0">
      <div class="go-back" v-show="isShowBack">
        <span class="go-back_btn" @click="goBackSearch">
          <a-icon type="left" class="go-back_icon" />
          <span>返回</span>
        </span>
      </div>
      <div v-scroll-load="handleScrollLoad" v-scroll-top-load="topLoad" :scroll-distance="10" :scroll-disabled="busy" class="modal-chat_list">
        <chat-record-item :list="chatList" :loading="busy"></chat-record-item>
      </div>
    </div>
    <div v-if="currentKey === 1" v-scroll-load="handleSearchScroll" :scroll-distance="20" :scroll-disabled="busy" class="modal-chat_list">
      <chat-record-item :list="searchList" :loading="busy">
        <span slot="rightOperation" slot-scope="{ row }" v-show="isShowView" @click="viewContext(row)">查看上下文</span>
      </chat-record-item>
    </div>
  </a-modal>
</template>

<script>
import api from '@/apis/chatRecord.js'
import disabledDateRangeMixin from '@/util/disabledDateRangeMixin.js'
import { scrollLoad, scrollTopLoad } from '@/util/scrollLoadDirectives.js'
import { exportFile } from '@/util/util'
import ChatRecordItem from './ChatRecordItem.vue'

export default {
  props: ['visible', 'type', 'infoData'],
  mixins: [disabledDateRangeMixin],
  components: {
    ChatRecordItem
  },
  directives: {
    scrollLoad,
    scrollTopLoad
  },
  created() {
    // 开启禁用现在时间之后日期设置
    this.isDisabledFuture = true
  },
  data() {
    return {
      // 当前显示内容
      currentKey: 0,
      // 是否加载
      busy: false,
      // 当前获取记录的seq
      chatRecordParams: {
        seq: null,
        direction: 0,
        includeSeq: 0
      },
      // 聊天记录列表
      chatList: [],
      // 搜索列表
      searchList: [],
      // 聊天总数
      total: null,
      // 搜索总数
      searchTotal: null,
      // 搜索条件
      searchData: {
        nameSearch: '',
        date: [],
        pageNum: 1,
        pageSize: 10
      },
      // 控制是否显示返回
      isShowBack: false,
      // 控制是否显示上下文
      isShowView: false,
      // 上加载禁用
      topDisabled: false,
      // 下加载禁用
      bottomDisabled: false,
      // 搜索的关键字
      keyword: '',
      exportLoading: false
    }
  },
  computed: {
    wechatId() {
      return this.infoData?.wechatAccount?.wechatId
    },
    customerUserId() {
      return this.infoData?.customerInfo?.customerUserId
    },
    chatId() {
      return this.infoData?.group?.groupId
    }
  },
  watch: {
    infoData() {
      console.log(this.infoData)
      this.initData()
      this.getChatList()
    }
  },
  methods: {
    /**
     * @author 王泽
     * @time  2021-04-07
     * @param
     * @description 初始化数据
     */
    initData() {
      this.currentKey = 0
      this.isShowBack = false
      this.chatRecordParams.direction = 0
      this.chatRecordParams.seq = null
      this.chatList = []
      this.searchList = []
      this.searchData = {
        nameSearch: '',
        date: [],
        pageNum: 1,
        pageSize: 10
      }
      this.topDisabled = false
      this.bottomDisabled = false
    },
    /**
     * @author 王泽
     * @time  2021-04-02
     * @param
     * @description 关闭弹窗
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },
    /**
     * @author 王泽
     * @time  2021-04-07
     * @param
     * @description 点击查询 搜索聊天记录
     */
    handleSearch() {
      const result = this.searchData.date.length || this.searchData.nameSearch
      if (result) {
        this.searchData.pageNum = 1
        this.searchList = []
        this.searchChatRecord()
      } else {
        this.initData()
        this.getChatList()
        this.currentKey = 0
      }
      // this.currentKey = Number(result)
    },
    /**
     * @author 王泽
     * @time  2021-04-12
     * @param
     * @description 导出聊天记录
     */
    handleExport() {
      this.exportLoading = true
      const { nameSearch, date } = this.searchData
      const params = {
        wechatId: this.wechatId,
        customerUserId: this.customerUserId,
        chatId: this.chatId,
        nameSearch
      }
      if (date.length) {
        params.startDate = date[0]
        params.endDate = date[1]
      }
      api
        .exportChatRecord(params)
        .then(data => {
          exportFile(data, '聊天记录')
          // console.log(data, '导出聊天记录')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('导出失败')
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    /**
     * @author 王泽
     * @time  2021-04-07
     * @param
     * @description 获取搜索聊天记录
     */
    searchChatRecord() {
      if (this.searchTotal && this.searchList.length >= this.searchTotal) return
      const { nameSearch, date, pageSize, pageNum } = this.searchData
      const searchData = {
        wechatId: this.wechatId,
        customerUserId: this.customerUserId,
        chatId: this.chatId,
        nameSearch,
        pageSize,
        pageNum
      }
      if (date.length) {
        searchData.startDate = date[0]
        searchData.endDate = date[1]
      }
      api
        .searchChatRecord(searchData)
        .then(data => {
          const { list, total } = data
          this.keyword = nameSearch
          list.forEach(item => {
            if (item.msgtype === 'text') {
              item.content = item.content.split(this.keyword).join(`<span style="color:#00AAFF;">${this.keyword}</span>`)
            }
          })
          console.log(list)
          this.searchList = this.searchList.concat(list)
          this.isShowView = !!this.searchData.nameSearch
          // this.currentKey = Number(this.searchData.date.length || this.searchData.nameSearch)
          this.currentKey = 1
          this.isShowBack = false
          this.searchTotal = total
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * @author 王泽
     * @time  2021-04-07
     * @param
     * @description 搜索列表滚动底部加载
     */
    handleSearchScroll() {
      this.searchData.pageNum++
      this.searchChatRecord()
    },
    /**
     * @author 王泽
     * @time  2021-04-07
     * @param
     * @description 获取聊天列表
     */
    getChatList() {
      // if (this.total && this.chatList.length >= this.total) return;
      this.busy = true
      const params = {
        pageSize: 10,
        wechatId: this.wechatId,
        customerUserId: this.customerUserId,
        chatId: this.chatId,
        ...this.chatRecordParams
      }
      return api
        .getChatRecordList(params)
        .then(data => {
          const { list, total } = data
          this.total = total
          console.log(data)
          const direction = this.chatRecordParams.direction
          if (!list.length) {
            this[direction ? 'topDisabled' : 'bottomDisabled'] = true
          }
          this.chatList = direction ? list.concat(this.chatList) : this.chatList.concat(list)
          this.$nextTick(() => {
            this.busy = false
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * @author 王泽
     * @time  2021-04-08
     * @param
     * @description 查看上下文
     */
    async viewContext({ seq }) {
      this.topDisabled = false
      this.bottomDisabled = false
      this.currentKey = 0
      this.isShowBack = true
      this.chatList = []
      // this.getChatList();
      this.busy = true
      const params = {
        pageSize: 10,
        wechatId: this.wechatId,
        customerUserId: this.customerUserId,
        chatId: this.chatId,
        includeSeq: 1,
        direction: 0,
        seq
      }
      const { list, total } = await api.getChatRecordList(params)
      if (list[0].msgtype === 'text') {
        list[0].content = list[0].content.split(this.keyword).join(`<span style="color:#00AAFF;">${this.keyword}</span>`)
      }
      this.chatList = list
      this.total = total
      const len = list.length
      if (len < 10) {
        params.pageSize = 10 - len
        params.includeSeq = 0
        params.direction = 1
        const { list: topList, total: topTotal } = await api.getChatRecordList(params)
        this.chatList = topList.concat(this.chatList)
        this.total = topTotal
      }
      this.busy = false
    },
    /**
     * @author 王泽
     * @time  2021-04-08
     * @param
     * @description 返回搜索列表
     */
    goBackSearch() {
      this.currentKey = 1
    },
    /**
     * @author 王泽
     * @time  2021-04-06
     * @param
     * @description 向下滚动加载
     */
    handleScrollLoad() {
      console.log('bottom')
      if (this.bottomDisabled) return
      this.chatRecordParams.direction = 0
      const len = this.chatList.length
      if (len) {
        this.chatRecordParams.seq = this.chatList[len - 1].seq
        this.chatRecordParams.includeSeq = 0
      }
      this.getChatList()
    },
    /**
     * @author 王泽
     * @time  2021-04-06
     * @param { back:返回原来高度回调函数 }
     * @description 向上加载
     */
    topLoad(back) {
      console.log('top')
      if (this.topDisabled) return
      this.chatRecordParams.direction = 1
      const len = this.chatList.length
      if (len) {
        this.chatRecordParams.seq = this.chatList[0].seq
        this.chatRecordParams.includeSeq = 0
      }
      this.getChatList().then(() => {
        back()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chat-record_modal {
  .record-modal_top {
    padding: 0px 20px;
    .info-avatar {
      width: 40px;
      height: 40px;
      margin-right: 15px;
      border-radius: 4px;
      vertical-align: middle;
    }
    .infoData-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      margin-right: 8px;
    }
    .infoData-object {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    }
    .wechat-flag {
      color: #1aad19;
      font-size: 12px;
      margin-right: 8px;
    }
  }
  .record-modal_searchbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    padding: 10px 20px 20px;
  }
  .go-back {
    padding: 10px 48px;
    background-color: #fff;
    .go-back_btn {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      user-select: none;
      cursor: pointer;
      &:active {
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .go-back_icon {
      font-size: 16px;
      margin-right: 5px;
      vertical-align: sub;
    }
  }
  .modal-chat_list {
    padding: 24px 48px;
    min-height: 15vh;
    max-height: 45vh;
    overflow: auto;
  }
}
</style>
