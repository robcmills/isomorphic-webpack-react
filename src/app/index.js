const React = require('react')
const ReactDOM = require('react-dom')

const app = <div>Hello, World 2!</div>

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  ReactDOM.render(app, document.getElementById('app'))
}

module.exports = app