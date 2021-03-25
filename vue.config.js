const path = require('path');


function resolve(dir) {
  return path.join(__dirname, dir);
}
const isProd = process.env.NODE_ENV === 'production'
const TARGET = process.env.npm_lifecycle_event
const port = 8080;

module.exports = {
  productionSourceMap: !isProd,
  integrity: TARGET !== 'serve',
  // integrity: false,
  // crossorigin: TARGET !== 'serve' ? 'anonymous' : undefined,
  devServer: {
    port,
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1D61EF'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.module.rule('svg')
      .exclude
      .add(resolve('src/assets/icons/svg'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
    if (!isProd) {
      config.output
        .filename('[name].[hash].js')
        .chunkFilename('[chunkhash:8].chunk.js')
        .end()
    }
  }
}