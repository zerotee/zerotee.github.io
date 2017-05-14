module.exports = function logger (prefix) {
  return (msg, ...args) => console.error(`[${prefix}] ${msg}`, ...args)
}
