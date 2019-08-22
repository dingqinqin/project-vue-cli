require('./check-versions')()
process.env.NODE_ENV = 'production'

var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
var startTime = new Date().getTime();

var spinner = ora('building for production...')
spinner.start()

webpack(webpackConfig, function (err, stats) {
	spinner.stop()
	if (err) throw err
	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false
	}) + '\n\n')
    var endTime = new Date().getTime();
	console.log('  Build complete.\n')
	console.log('   Time : ' + parseInt((endTime - startTime) / 1000) + ' s')
	console.log(
		'  Tip: built files are meant to be served over an HTTP server.\n' +
		'  Opening index.html over file:// won\'t work.\n'
	)
})
