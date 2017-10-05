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

const renderFullPage = body => `
<!doctype html>
<html>
  <head></head>
  <body>
    ${body}
  </body>
</html>`

app.get('/:componentName', (req, res) => {
  const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const bundle = evalBundleCode(requestUrl)
  const name = req.params.componentName
  const component = bundle[name]
  const app = renderToStaticMarkup(component())
  res.send(renderFullPage(app))
})

app.listen(8000)