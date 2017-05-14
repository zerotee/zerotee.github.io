const Lo = require('lodash')
const db = require('../db.json')

module.exports = {
  all: db.products,

  byAlbum: Lo.reduce(db.products, (map, product) => {
    (product.albums || []).forEach((id) => {
      map[id] = map[id] || []
      map[id].push(product)
    })
    return map
  }, {}),

  noAlbum: Lo.filter(db.products, (product) => !product.albums)
}
