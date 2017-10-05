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
    <div id='app'>${body}</div>
    <script src='/static/app.js'></script>
  </body>
</html>`

app.get('/', (req, res) => {
  const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const bundle = evalBundleCode(requestUrl)
  const app = renderToStaticMarkup(bundle)
  res.send(renderFullPage(app))
})

app.listen(8000)