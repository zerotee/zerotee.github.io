#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const mkdir = require('mkdirp')
const pEach = require('p-each-series')
const log = require('./stores/lib/log')('products')
const fetch = require('./stores/lib/request')

function main () {
  const albumId = process.argv[2]
  const dbFile = process.env['db-src-file'] || 'db.json'
  const srcDir = process.env['img-src-dir'] || 'src/assets/img'
  const dbPath = Path.join(process.cwd(), dbFile)
  const db = require(dbPath)

  const products = db.products
    .filter((p) => (
      p.image && (
        albumId === 'all'
          ? !p.albums
          : (p.albums && p.albums.includes(albumId))
      )
    ))
    .slice(0, 8)
    .map((p, idx) => Object.assign({}, p, {
      file: Path.join(srcDir, 'products', albumId, p.id)
    }))

  pEach(products, (product, idx) => {
    const url = product.image
    const file = product.file

    log('%s %d: %s', albumId, idx, file)

    return new Promise((resolve, reject) => {
      mkdir(Path.dirname(file), (err) => {
        if (err) {
          reject(err)
          return
        }

        Fs.open(file, 'wx', (err, fd) => {
          if (err) {
            if (err.code === 'EEXIST') {
              log('%s %d: already exists', albumId, idx)
              resolve()
            } else {
              reject(err)
            }
            return
          }

          fetch(url)
            .then((res) => {
              const dest = Fs.createWriteStream(file, { fd })
              res.body.pipe(dest)
                .on('finish', resolve)
                .on('error', reject)
            })
            .catch(reject)
        })
      })
    })
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

if (require.main === module) {
  main()
}
