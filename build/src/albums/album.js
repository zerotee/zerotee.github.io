/* global $context */

const Lo = require('lodash')
const index = require('./index')
const albumId = $context.pageName
const album = index.albums.byId[albumId]
const image = $context.config.baseURL + '/' + (
  $context.asset(`assets/img/meta/og-image-album-${albumId}.jpg`)
)

const context = Lo.merge(index, {
  config: {
    openGraph: {
      title: 'Zero Tee | Tees' + (
        (album && album.title) ? `: ${album.title}` : ''
      ),
      image
    },
    twitterCard: {
      card: 'summary_large_image',
      image
    }
  }
})

module.exports = context
