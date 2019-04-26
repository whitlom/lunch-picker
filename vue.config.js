// vue.config.js
module.exports = {
    configureWebpack: config => {
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        }
    }
  }