// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report,
        overwriteAssetsPublicPath: true
    },
    dev: {
        env: require('./dev.env'),
        port: '9977',
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // '/api/': {
            //     target: 'http://10.0.0.248:18900',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': '/api'
            //     }
            // },
            '/common/': {
                target: 'http://1.shiyuesoft.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/common': '/common'
                }
            }
        },
        cssSourceMap: false
    }
}