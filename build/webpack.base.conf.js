var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
function resolve(dir) {
	return path.join(__dirname, '..', dir)
}
var webpack = require('webpack')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
module.exports = {
	externals: {
		jquery: 'window.jQuery',
		axios: 'axios',
		moment: 'moment',
		lodash: '_',
		qs: 'Qs',
		echarts: 'echarts',
		sortablejs: 'Sortable',
		'js-cookie': 'Cookies',
		screenfull: 'screenfull',
		vue: 'Vue',
		vuex: 'Vuex',
		'vue-router': 'VueRouter',
		'vue-i18n': 'VueI18n',
		'element-ui': 'ELEMENT',
		'ecloud-ui': 'ECLOUD'
	},
	entry: {
		app: ['babel-polyfill','./src/main.js']
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
	},
	resolve: {
        extensions: ['.js', '.vue', '.json', '.css'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
			'src': resolve('src'),
			'static': resolve('static'),
			'api': resolve('src/api'),
			'PAGE': resolve('src/page'),
			'VUEX': resolve('src/vuex'),
			'root': resolve(''),
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
                options: vueLoaderConfig,
                include: [resolve('src')]
			},
			{
				test: /\.js$/,
				loader: 'happypack/loader?id=happyBabel',
				include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('images/[name].[hash:7].[ext]')
				},
				include: [resolve('src')]
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				},
				include: [resolve('src')]
			}
		]
    },
    plugins: [
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ]
}