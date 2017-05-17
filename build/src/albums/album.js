/* global $context */

const Lo = require('lodash')
const index = require('./index')
const album = $context.pageName

const context = Lo.merge(index, {
  config: {
    openGraph: {
      image: $context.config.baseURL + '/' + (
        $context.asset(`assets/img/meta/og-image-album-${album}.jpg`)
      )
    }
  }
})

module.exports = context
