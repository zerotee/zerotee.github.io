const Lo = require('lodash')
const db = require('../db.json')

module.exports = {
  all: db.albums,
  byId: Lo.keyBy(db.albums, 'id'),
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
}
