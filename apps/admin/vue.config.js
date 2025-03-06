// 提示：修改配置文件后，需要重启项目

const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(config) {
    // 设置 svg-sprite-loader,是 `webpack` 中专门用来处理 `svg` 图标的一个 `loader`，本地svg处理后，会在body标签中svg标签下显示
    config.module.rule('svg').exclude.add(resolve('src/assets/icon')).end()
    config.module
      .rule('icon')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        // 定义id
        symbolId: 'icon-my-[name]'
      })
      .end()
  },
  devServer: {
    hot: true,
    port: 8080, // 项目启动端口号
    client: {
      overlay: false // 关闭 未捕获错误提示蒙层
    },
    proxy: {
      [process.env.VUE_APP_baseUrl]: {
        target: 'http://127.0.0.1:3005', // 目标服务器地址
        changeOrigin: true // 是否改变请求源
        // pathRewrite: {
        //   '^/api/v1': '' // 路径重写，将 /api/v1 替换为空
        // }
      },
      [process.env.VUE_APP_uploadUrl]: {
        target: 'http://127.0.0.1:3005', // 目标服务器地址
        changeOrigin: true // 是否改变请求源
      }
    }
  }
})
