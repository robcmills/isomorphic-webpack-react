const components = {
	ResetPassword: require('./components/ResetPassword'),
}

module.exports.sampleData = {}

Object.keys(components).forEach(type => {
	module.exports.sampleData[type] = require(`./components/${type}/sample-data`)
})

module.exports.components = components