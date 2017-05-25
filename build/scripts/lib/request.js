const Lo = require('lodash')
const fetch = require('node-fetch')
const pThrottle = require('p-throttle')
const config = require('../../../config')
const log = require('./log')('request')

const BASE_OPTIONS = {
  headers: {
    'user-agent': config.userAgent
  }
}

function request (url, options = {}) {
  log(url)
  const mergedOptions = Lo.merge({}, BASE_OPTIONS, options)
  return fetch(url, mergedOptions).then(validate)
}

function validate (res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  }

  const error = new Error(res.statusText)
  error.response = res
  throw error
}

module.exports = pThrottle(request, 2, 1000)
