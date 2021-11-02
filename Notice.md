## 项目部署地址
http://deploy.yhzm.net/view/微客前端/ weike-fe-chat-test  weike-fe-chat-prod

## 模块功能
- 1. 聊天框 chat.vue 
      1.1 各类型消息、转发框-TransitMsgModal.vue、 多选框-MultiSelectModal.vue、 查看聊天记录-ChatRecordModal.vue
      1.2 侧边栏配置 src/mixin/iframeMixin.js 新增页面 项目地址 https://code.yhzm.net/fe-pro/stentor/
- 2. 输入框 meditor.vue 
      2.1 表情收藏发送、文件视频图片发送、
      2.2 群@、 消息引用
- 3. 消息发送、接收、撤回、分发等逻辑 src/store/message.js
- 4. 消息类型  src/class/Msg
