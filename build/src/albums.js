const Lo = require('lodash')
const db = require('../db.json')

module.exports = {
  all: db.albums,
  byId: Lo.keyBy(db.albums, 'id'),
  sort: [
    'guardians-of-the-galaxy'
  ],
  titles: {
    'dungeons-and-dragons': '<h1>Dungeons & Things</h1>',
    'macross': '<h1>Macross a.k.a Robotech</h1>'
  }
}
