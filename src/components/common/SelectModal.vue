<template>
  <!-- 勾选弹窗组件 -->
  <a-modal cancelText="取消" okText="确定" :maskClosable="false" :visible="visible" :title="title" :width="width" @ok="handleOk" @cancel="close">
    <slot name="modalTop"></slot>
    <div class="select-modal">
      <div class="select-modal_item select-modal_left">
        <div class="modal-title">{{ leftTitle }}</div>
        <div class="modal-list">
          <!-- 左侧顶部插槽 -->
          <slot name="leftTop"></slot>
          <div class="left-checkout-all" v-if="showAllCheck">
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="handleCheckAll">全部</a-checkbox>
          </div>
          <div class="modal-list_container left-list_container">
            <a-spin tip="加载中..." :spinning="loading">
              <template v-if="allCheckOptions.length">
                <a-checkbox-group v-model="checkedList" @change="onChange">
                  <a-checkbox
                    :disabled="item.disabled"
                    :value="item[checkOptionKey]"
                    v-for="(item, index) in allCheckOptions"
                    :key="checkOptionKey ? item[checkOptionKey] : index"
                    @change="onItemChange"
                  >
                    <!-- 勾选项自定义插槽 -->
                    <slot name="checkItem" :item="item"></slot>
                  </a-checkbox>
                </a-checkbox-group>
              </template>
              <a-empty :image="simpleImage" v-else />
            </a-spin>
          </div>
        </div>
      </div>
      <div class="select-modal_item select-modal_right">
        <div class="modal-title">
          <div>
            <span>{{ rightTitle }}</span>
            <span v-if="showRightNum && rightList.length">（{{ rightList.length }}）</span>
          </div>
          <div v-if="isLimit">
            <a-input :disabled="!selectedRowKeys.length" v-model="allLimit" style="width:80px" onkeyup="value=value.replace(/^(0+)|[^\d]+/g, '')" />
            <a-button type="link" @click="handleBatchLimit">批量设置添加上限</a-button>
          </div>
          <div v-if="showDeleteAll">
            <a-button type="link" :disabled="!rightList.length" @click="handleDelete()">全部删除</a-button>
          </div>
        </div>
        <div class="modal-list">
          <div>
            <!-- 右侧顶部插槽 -->
            <slot name="rightTop"></slot>
          </div>
          <a-table
            :showHeader="false"
            :rowKey="checkOptionKey"
            :columns="columns.filter(item => item.limit === isLimit || !item.limit)"
            :data-source="rightList"
            :row-selection="isLimit ? { selectedRowKeys, onChange: handleTableCheck } : null"
            :pagination="false"
            size="small"
            :scroll="{ y: 280 }"
            class="select-modal_table"
          >
            <div slot="checkItem" slot-scope="item">
              <slot name="rightItem" :item="item" v-if="isRigthDifferent"></slot>
              <slot name="checkItem" :item="item" v-else></slot>
            </div>
            <div slot="limit" slot-scope="item">
              <a-input v-model="item.limit" style="width:50px" onkeyup="value=value.replace(/^(0+)|[^\d]+/g, '')" />
            </div>
            <div class="right-list_operation" slot="operation" slot-scope="item">
              <a-button type="link" @click="handleDelete(item)">{{ rightBtnText }}</a-button>
            </div>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import deepClone from 'lodash/cloneDeep'
import { Empty } from 'ant-design-vue'

export default {
  props: {
    // 控制弹窗显示
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗宽度
    width: {
      type: String || Number,
      default: '980px'
    },
    // 弹窗标题
    title: {
      type: String,
      default: ''
    },
    // 左侧标题
    leftTitle: {
      type: String,
      default: ''
    },
    // 显示全部按钮
    showAllCheck: {
      type: Boolean,
      default: true
    },
    // 右侧标题
    rightTitle: {
      type: String,
      default: ''
    },
    // 左侧勾选项
    allCheckOptions: {
      type: Array,
      default: () => []
    },
    // 选项key值
    checkOptionKey: {
      type: String,
      default: ''
    },
    // 左侧数据加载loading
    loading: {
      type: Boolean,
      default: false
    },
    // 右侧列表顶部信息
    rightTopText: {
      type: String,
      default: ''
    },
    // 右侧操作按钮名称
    rightBtnText: {
      type: String,
      default: '删除'
    },
    // 右侧过滤方法
    rightFilter: {
      type: Function,
      default: item => item
    },
    // 展示删除全部按钮
    showDeleteAll: {
      type: Boolean,
      default: false
    },
    // 展示右侧勾选数量
    showRightNum: {
      type: Boolean,
      default: false
    },
    // 是否显示设置上限
    isLimit: {
      type: Boolean,
      default: false
    },
    // 设置上限的最大值
    maxLimit: {
      type: Number || null,
      default: null
    },
    // 右侧单个选项是否和左侧相同
    isRigthDifferent: {
      type: Boolean,
      default: false
    },
    // 需要回显勾选列表
    echodCheckedList: {
      type: Array,
      default: () => []
    },
    // 单选
    isRadio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 左侧勾选列表
      checkedList: [],
      // 全选勾选是否半选
      indeterminate: false,
      // 全选勾选是否勾选
      checkAll: false,
      // 右侧列表
      checkedRightList: [],
      // 右侧表格表头
      columns: [
        {
          title: this.rightTopText,
          scopedSlots: { customRender: 'checkItem' }
        },
        {
          title: '邀请上限',
          width: 100,
          limit: true,
          scopedSlots: { customRender: 'limit' }
        },
        {
          title: '操作',
          width: 60,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 设置勾选项限制数
      allLimit: '',
      // 右侧表格勾选项
      selectedRowKeys: []
    }
  },
  computed: {
    // 右侧显示列表
    rightList() {
      this.isLimit &&
        this.checkedRightList.forEach((item, index) => {
          this.$set(this.checkedRightList[index], 'limit', this.checkedRightList[index].limit || '')
        })
      return this.rightFilter(this.checkedRightList)
    },
    // 过滤掉左侧禁用选项
    checkOptions() {
      return this.allCheckOptions.filter(item => !item.disabled)
    }
  },
  watch: {
    checkOptions() {
      // 获取右侧已经勾选的列表
      const checkedKeyList = this.checkedRightList.map(item => item[this.checkOptionKey])
      // 获取传入的勾选列表中存在的右侧列表中的值
      const checkedList = checkedKeyList.filter(item => this.checkOptions.some(e => e[this.checkOptionKey] === item))
      // 初始化勾选状态
      this.checkedList = checkedList
      this.indeterminate = !!checkedList.length && checkedList.length < this.checkOptions.length
      this.checkAll = this.checkOptions.length ? checkedList.length === this.checkOptions.length : false
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  mounted() {
    this.echoSelect()
  },
  methods: {
    /**
     * @author 王泽
     * @time  2021-04-22
     * @param
     * @description 回显数据
     */
    echoSelect() {
      // 无需回显数据不处理
      if (!this.echodCheckedList.length) return
      // 回显勾选的数据
      this.checkedRightList = deepClone(this.echodCheckedList)
      this.checkedList = this.echodCheckedList.map(item => item[this.checkOptionKey])
      // 处理全选勾选框
      this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.checkOptions.length
      this.checkAll = this.checkOptions.length ? this.checkedList.length === this.checkOptions.length : false
    },
    /**
     * @author 王泽
     * @time  2021-04-22
     * @param {v: 勾选项}
     * @description 右侧表格勾选
     */
    handleTableCheck(v) {
      if (!v.length) this.allLimit = ''
      this.selectedRowKeys = v
    },
    /**
     * @author 王泽
     * @time  2021-03-19
     * @param
     * @description 初始化勾选数据
     */
    initeCheckedData() {
      this.checkedList = []
      this.checkedRightList = []
      this.indeterminate = false
      this.checkAll = false
      this.allLimit = ''
    },
    /**
     * @author 王泽
     * @time  2021-03-18
     * @param
     * @description 关闭弹窗
     */
    close() {
      this.initeCheckedData()
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    /**
     * @author 王泽
     * @time  2021-03-18
     * @param
     * @description 点击确定按钮
     */
    handleOk() {
      if (this.isLimit && this.checkedRightList.some(e => !e.limit)) {
        return this.$message.error('请将勾选上限设置信息全部填写')
      }
      if (this.maxLimit && this.checkedRightList.some(e => e.limit > this.maxLimit)) {
        return this.$message.error(`上限设置的最大值为${this.maxLimit}`)
      }
      this.$emit('confirm', this.checkedRightList)
      this.close()
    },
    /**
     * @author 王泽
     * @time  2021-03-18
     * @param
     * @description 勾选全部
     */
    handleCheckAll(e) {
      // 改变多选勾选框状态
      const checkAll = e.target.checked
      Object.assign(this, {
        indeterminate: false,
        checkAll
      })
      // 获取全部的勾选的列表
      const chekList = this.checkOptions.map(item => item[this.checkOptionKey])
      if (checkAll) {
        // 全选状态下 将右侧没有的数据添加到右侧
        this.checkedList = chekList
        const rightList = this.checkedRightList.map(item => item[this.checkOptionKey])
        const newList = this.checkOptions.filter(item => !rightList.includes(item[this.checkOptionKey]))
        this.checkedRightList = [...this.checkedRightList, ...newList]
      } else {
        // 非全选状态下 将右侧过滤掉勾选列表中的数据
        this.checkedList = []
        this.checkedRightList = this.checkedRightList.filter(item => !chekList.includes(item[this.checkOptionKey]))
      }
    },
    /**
     * @author 王泽
     * @time  2021-03-18
     * @param
     * @description 勾选选项
     */
    onChange(v) {
      this.indeterminate = !!v.length && v.length < this.checkOptions.length
      this.checkAll = v.length === this.checkOptions.length
    },
    /**
     * @author 王泽
     * @time  2021-03-25
     * @param
     * @description 单个勾选框勾选触发的事件
     */
    onItemChange(e) {
      const { value, checked } = e.target
      if (checked) {
        // 勾选状态 右侧列表添加数据
        if (this.isRadio) {
          this.checkedRightList = []
          const v = this.checkOptions.filter(item => item[this.checkOptionKey] === value)[0]
          this.checkedRightList.push(v)
          this.checkedList.shift()
        } else {
          const v = this.checkOptions.filter(item => item[this.checkOptionKey] === value)[0]
          this.checkedRightList.push(v)
        }
      } else {
        // 非勾选状态 右侧去除勾选值
        this.checkedRightList = this.checkedRightList.filter(item => item[this.checkOptionKey] !== value)
      }
    },
    /**
     * @author 王泽
     * @time  2021-03-18
     * @param
     * @description 删除勾选
     */
    handleDelete(item) {
      if (!item) {
        this.checkedList = []
        this.checkedRightList = []
        this.onChange(this.checkedList)
        return
      }
      this.checkedList = this.checkedList.filter(e => e !== item[this.checkOptionKey])
      this.checkedRightList = this.checkedRightList.filter(e => e !== item)
      this.onChange(this.checkedList)
    },
    /**
     * @author 王泽
     * @time  2021-04-01
     * @param
     * @description 点击批量设置上限
     */
    handleBatchLimit() {
      this.checkedRightList.forEach(item => {
        this.selectedRowKeys.some(e => e === item[this.checkOptionKey]) && (item.limit = Number(this.allLimit))
      })
      this.allLimit = ''
    }
  }
}
</script>

<style scoped lang="scss">
.select-modal {
  display: flex;
  .select-modal_item {
    // flex: 1;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  .select-modal_left {
    margin-right: 20px;
    width: 400px;
  }
  .select-modal_right {
    flex: 1;
  }
  .left-checkout-all {
    padding-bottom: 5px;
  }
  .modal-title {
    display: flex;
    justify-content: space-between;
    background-color: #f4f6f9;
    line-height: 40px;
    padding-left: 20px;
    .ant-btn-link {
      font-size: 12px;
    }
  }
  .modal-list {
    padding: 10px 20px;
    height: 350px;
    display: flex;
    flex-direction: column;
  }
  /deep/.ant-checkbox-wrapper {
    display: flex;
    align-items: center;
    .ant-checkbox + span {
      display: inline-block;
    }
  }
  .modal-list_container {
    overflow: auto;
    flex: 1;
  }
  // .left-list_container {}
  .right-list_top {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    font-size: 12px;
    line-height: 24px;
    border-bottom: 1px solid #ccc;
    padding-top: 10px;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0px;
  }
  .modal-right-item {
    display: flex;
    justify-content: space-between;
  }
  .right-list_operation {
    display: flex;
    align-items: center;
  }
  .no-data {
    text-align: center;
    line-height: 36px;
    color: #ccc;
    font-size: 16px;
    padding-top: 50px;
  }
  .select-modal_table {
    .ant-btn-link {
      font-size: 12px;
      padding: 0;
    }
    /deep/.ant-table-small {
      border: none;
      td {
        padding: 0px 16px !important;
      }
    }
  }
}
</style>
