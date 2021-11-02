## 项目部署地址
jenkins
http://deploy.yhzm.net/view/微客前端/ weike-fe-chat-test(测试线)  weike-fe-chat-prod(正式线) 选择分支即可部署
https://code.yhzm.net/fe-pro/atalanta/-/branches

## 项目开发
localhost:8080/chat/#/transit/token  token在平台登录时控制台输出即可获取
平台地址 http://test-bizchat.zmeng123.cn/login 测试线 
登陆账号密码(两个)  
1. ltgj  zm123456
2. qijieceshi  zm123456


## 设计图地址
幕客
https://app.mockplus.cn/app/Zkw_yq6ql-7I/specs/design/35cUdhu1ovZF

## 需求文档
飞书文档
https://zmt123.feishu.cn/sheets/shtcnxpzTRFpKHic3rGjzHRtQvH
## 后端负责人
@黎召红

## 测试
@张健

## 模块功能
 src/views/chat
- 1. 聊天框 chat.vue 
      1.1 各类型消息、转发框-TransitMsgModal.vue、 多选框-MultiSelectModal.vue、 查看聊天记录-ChatRecordModal.vue
      1.2 侧边栏配置 src/mixin/iframeMixin.js 新增页面 项目地址 https://code.yhzm.net/fe-pro/stentor/
- 2. 输入框 meditor.vue 
      2.1 表情收藏发送、文件视频图片发送、
      2.2 群@、 消息引用
- 3. 消息发送、接收、撤回、分发等逻辑 src/store/message.js
- 4. 消息类型  src/class/Msg
