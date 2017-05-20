#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const log = require('./stores/lib/log')('delete-album')

function main () {
  const pubDir = process.env['img-product-pub-dir']
  const albumId = process.argv[2]
  const dbFile = process.argv[3] || process.env['db-src-file'] || 'db.json'

  if (!albumId) {
    console.error('Usage: delete-album.js [db-file] [album-id]')
    process.exit(1)
    return
  }

  const dbPath = Path.join(process.cwd(), dbFile)
  const db = require(dbPath)
  const products = db.product.filter((p) => (
    p.collections && p.collections.length === 1 && p.collections[0] === albumId
  ))

  db.product = db.product.map((p) => {
    if (p.collections) {
      p.collections = p.collections.filter((id) => id !== albumId)
      if (p.collections.length === 0) {
        delete p.collections
      }
    }
    return p
  })

  db.collection = db.collection.filter((album) => (
    album.id !== albumId
  ))

  products.forEach((p) => {
    const parts = [pubDir].concat(p.id.split('-'))
    const path = Path.join(...parts)
    Fs.unlinkSync(path)
  })

  log('deleted %d products', products.length)

  Fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

if (require.main === module) {
  main()
}
