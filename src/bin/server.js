const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfiguration = require('../webpack.config')

const { renderToStaticMarkup } = require('react-dom/server')
const { createIsomorphicWebpack } = require('isomorphic-webpack')

const compiler = webpack(webpackConfiguration)
const app = express()

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  publicPath: '/static',
  quiet: false,
  stats: { colors: true },
}))

const {
  createCompilationPromise,
  evalBundleCode
} = createIsomorphicWebpack(webpackConfiguration, {
  useCompilationPromise: true
})

app.use(async (req, res, next) => {
  await createCompilationPromise()
  next()
})

const renderTemplate = body => `
<!doctype html>
<html>
  <head></head>
  <body>
    ${body}
  </body>
</html>`

app.get('/:type', (req, res) => {
  const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const bundle = evalBundleCode(requestUrl)
  const type = req.params.type
  const component = bundle.components[type]
  const sampleData = bundle.sampleData[type]
  const body = renderToStaticMarkup(component(sampleData))
  res.send(renderTemplate(body))
})

app.listen(8000)