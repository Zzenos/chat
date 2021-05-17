/**
 * @author 王泽
 * @time  2021-03-20
 * @param
 * @description 日期范围选择结束时间在开始时间+90时间范围内mixin
 * 示例：
  <a-range-picker
    :disabledDate="disabledDate"
    @calendarChange="hanleCalendarChange"
    @openChange="initStartTime"/>
  </ a-range-picker>
 */
export default {
  data() {
    return {
      // 选择的开始时间
      startTime: null,
      // 结束时间范围为多少天(想要禁用多少天后修改此值)
      endDayNum: 90,
      // 是否禁用未来时间
      isDisabledFuture: false
    }
  },
  methods: {
    /**
     * @author 王泽
     * @time  2021-03-20
     * @param
     * @description 禁用时间
     */
    disabledDate(currentDate) {
      // 获取是否禁用未来时间
      const isFuture = this.isDisabledFuture ? new Date(currentDate).getTime() > new Date().getTime() : false
      // 获取禁用开始到结束{{endDayNum}}天之后时间
      if (!this.startTime) return isFuture
      const startTime = this.startTime.getTime()
      const endTime = startTime + this.endDayNum * 24 * 60 * 60 * 1000
      const currentTime = new Date(currentDate).getTime()
      const rangDisable = currentTime < startTime || currentTime > endTime
      return isFuture || rangDisable
    },
    /**
     * @author 王泽
     * @time  2021-03-20
     * @param
     * @description 处理日期范围选择器选择事件
     */
    hanleCalendarChange(date) {
      this.startTime = date.length === 1 ? new Date(date[0]) : null
    },
    /**
     * @author 王泽
     * @time  2021-03-22
     * @param
     * @description 初始化开始时间
     */
    initStartTime() {
      this.startTime = null
    }
  }
}
