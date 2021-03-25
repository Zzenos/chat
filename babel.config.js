// antd
const plugins = [
  ["import", {
    "libraryName": "ant-design-vue",
    "libraryDirectory": "es",
    "style": true
  }]
]

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins
}