/* global $context */

const Lo = require('lodash')
const index = require('./index')
const album = $context.pageName
const image = $context.config.baseURL + '/' + (
  $context.asset(`assets/img/meta/og-image-album-${album}.jpg`)
)

const context = Lo.merge(index, {
  config: {
    openGraph: {
      image
    },
    twitterCard: {
      card: 'summary_large_image',
      image
    }
  }
})

module.exports = context
