const Lo = require('lodash')
const db = require('../db.json')

module.exports = {
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
