import Vue from 'vue'
import moment from 'moment'

import 'moment/locale/zh-cn'

import {
  Layout,
  Menu,
  Button,
  Input,
  Table,
  Popconfirm,
  Modal,
  Select,
  Tabs,
  ConfigProvider,
  Form,
  Icon,
  DatePicker,
  Radio,
  Checkbox,
  Row,
  Col,
  Transfer,
  Switch,
  Alert,
  Dropdown,
  Pagination,
  Empty,
  Slider,
  Popover,
  Breadcrumb,
  message,
  Steps,
  Tag,
  Tooltip,
  Spin,
  Upload,
  Card,
  Cascader,
  Tree,
  FormModel,
  AutoComplete,
  InputNumber,
  notification,
  TreeSelect,
  Collapse,
  TimePicker,
  PageHeader,
  Statistic,
  Progress,
  Divider,
  Badge
} from 'ant-design-vue'

moment.locale('zh-cn')

Vue.prototype.$confirm = Modal.confirm
message.config({
  duration: 1.5,
  maxCount: 1
})
Vue.prototype.$message = message

notification.config({
  duration: 3
})
Vue.prototype.$notification = notification

moment.locale('zh-cn')
Vue.use(Popover)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Tree)
Vue.use(FormModel)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(Divider.name, Divider)
Vue.component(Breadcrumb.Item.name, Breadcrumb.Item)
Vue.component(Button.name, Button)
Vue.component(Button.Group.name, Button.Group)
Vue.component(Checkbox.name, Checkbox)
Vue.component(DatePicker.name, DatePicker)
Vue.component(TimePicker.name, TimePicker)
Vue.component(Input.name, Input)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Input.Search.name, Input.Search)
Vue.component(Input.Group.name, Input.Group)
Vue.component(Table.name, Table)
Vue.component(Tag.name, Tag)
Vue.component(Pagination.name, Pagination)
Vue.component(Popconfirm.name, Popconfirm)
Vue.component(Modal.name, Modal)
Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(Select.OptGroup.name, Select.OptGroup)
Vue.component(Tabs.name, Tabs)
Vue.component(Tabs.TabPane.name, Tabs.TabPane)
Vue.component(ConfigProvider.name, ConfigProvider)
Vue.component(Form.name, Form)
Vue.component(Form.Item.name, Form.Item)
Vue.component(Icon.name, Icon)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Radio.name, Radio)
Vue.component(Radio.Button.name, Radio.Button)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Checkbox.Group.name, Checkbox.Group)
Vue.component(Layout.name, Layout)
Vue.component(Layout.Header.name, Layout.Header)
Vue.component(Layout.Content.name, Layout.Content)
Vue.component(Layout.Footer.name, Layout.Footer)
Vue.component(Layout.Sider.name, Layout.Sider)
Vue.component(Menu.name, Menu)
Vue.component(Menu.SubMenu.name, Menu.SubMenu)
Vue.component(Menu.ItemGroup.name, Menu.ItemGroup)
Vue.component(Menu.Item.name, Menu.Item)
Vue.component(Radio.Group.name, Radio.Group)
Vue.component(Transfer.name, Transfer)
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
Vue.component(Switch.name, Switch)
Vue.component(Alert.name, Alert)
Vue.component(Input.Search.name, Input.Search)
Vue.component(Pagination.name, Pagination)
Vue.component(Empty.name, Empty)
Vue.component(Slider.name, Slider)
Vue.component(Steps.name, Steps)
Vue.component(Steps.Step.name, Steps.Step)
Vue.component(Upload.name, Upload)
Vue.component(Tag.name, Tag)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Spin.name, Spin)
Vue.component(Radio.Button.name, Radio.Button)
Vue.component(Popover.name, Popover)
Vue.component(Cascader.name, Cascader)
Vue.component(Dropdown.name, Dropdown)
Vue.component(ConfigProvider.name, ConfigProvider)
Vue.component(AutoComplete.name, AutoComplete)
Vue.component(TreeSelect.name, TreeSelect)
Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode)
Vue.component(Collapse.name, Collapse)
Vue.component(Collapse.Panel.name, Collapse.Panel)
Vue.component(PageHeader.name, PageHeader)
Vue.component(Statistic.name, Statistic)
Vue.component(Progress.name, Progress)
Vue.component(Badge.name, Badge)
