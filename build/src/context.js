/**
 * Global context module for all templates.
 */

const Lo = require('lodash')
const db = require('../db.json')

module.exports = {
  albums: {
    all: db.collection,

    byId: Lo.keyBy(db.collection, 'id'),

    sort: [
      'guardians-of-the-galaxy'
    ],

    headers: {
      'guardians-of-the-galaxy': {
        size: 2,
        include: true
      },
      'dungeons-and-dragons': {
        title: 'Dungeons & Things',
        content: '<h1>Dungeons &amp; Things</h1>'
      },
      'macross': {
        title: 'Macross a.k.a Robotech',
        content: '<h1>Macross a.k.a Robotech</h1>'
      }
    }
  },

  products: {
    all: db.product,

    byAlbum: Lo.reduce(db.product, (map, product) => {
      (product.collections || []).forEach((id) => {
        map[id] = map[id] || []
        map[id].push(product)
      })
      return map
    }, {}),

    noAlbum: Lo.filter(db.product, (product) => !product.collections)
  }
}
