const Path = require('path')

module.exports = function logger (prefix) {
  prefix = Path.basename(prefix, '.js')
  return (msg, ...args) => console.error(`[${prefix}] ${msg}`, ...args)
}
