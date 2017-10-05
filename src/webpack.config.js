const path = require('path')

module.exports = {
	context: __dirname,
	entry: {
		app: [path.resolve(__dirname, './app')],
	},
	module: {
		loaders: [{
			include: path.resolve(__dirname, './app'),
			loader: 'babel-loader',
			query: {
				presets: ['env', 'react'],
			},
			test: /\.js$/
		}]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist')
	}
}