const Lo = require('lodash')

module.exports = function StatusText (options = {}) {
  options = Lo.defaults(options, {
    parts: ['text', 'mentions', 'hashtags', 'url'],
    template: '${title} by ${artist}'
  })

  return function buildStatusText (context) {
  }
}
