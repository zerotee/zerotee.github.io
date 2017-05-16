#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const Url = require('url')
const Lo = require('lodash')
const pEach = require('p-each-series')
const request = require('./stores/lib/request')
const log = require('./stores/lib/log')('main')

function main () {
  const dbFile = process.env['db-src-file'] || 'db.json'
  const dbPath = Path.join(process.cwd(), dbFile)
  const db = { albums: [], products: [] }

  try {
    Lo.assign(db, require(dbPath))
    log('Opened existing db: %s', dbPath)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    } else {
      log('Create new db: %s', dbPath)
    }
  }

  pEach(
    Fs.readdirSync(Path.join(__dirname, 'stores'))
      .filter((name) => name.endsWith('.js'))
      .map((name) => require('./stores/' + name)),
    (store) => {
      console.error(`[${store.name}] Fetching...`)
      return fetch(store, db)
    }
  )
  .then(() => {
    db.albums = Lo.sortBy(db.albums, 'id')
    db.products = Lo.sortBy(db.products, 'modified')
    Fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

function fetch ({ name, parse, url }, db) {
  const baseURL = url
  const seen = new Set()

  return fetchPage(url)

  function fetchPage (url) {
    url = Url.resolve(baseURL, url)

    if (seen.has(url)) {
      return
    }

    seen.add(url)

    return request(url).then((html) => {
      const { items, links } = parse(html, url)
      return storeItems(items).then(() => (
        pEach(links, fetchPage)
      ))
    }).catch((err) => {
      if (err.response) {
        console.error(
          '[%s] ERROR: %s %s (skipping page)',
          name,
          err.response.status,
          err.response.statusText
        )
      } else {
        throw err
      }
    })
  }

  function storeItems ({ album, products }) {
    if (album) {
      const albumUrl = album.url
      const curAlbum = Lo.find(db.albums, { id: album.id })

      album = Lo.omit(album, 'url')
      album.urls = { [name]: albumUrl }

      if (!curAlbum) {
        db.albums.push(album)
      } else {
        Lo.merge(curAlbum.urls, album.urls)
      }
    }

    products.forEach((product) => {
      if (!String(product.id).startsWith(name)) {
        product.id = `${name}-${product.id}`
      }

      let curProduct = Lo.find(db.products, { id: product.id })
      const isNew = !curProduct

      if (isNew) {
        db.products.push(product)
        curProduct = product
        curProduct.created = Date.now()
      } else {
        if (curProduct.title !== product.title ||
            curProduct.image !== product.image ||
            curProduct.price !== product.price ||
            curProduct.url !== product.url) {
          Lo.assign(curProduct, product)
          curProduct.modified = Date.now()
        }
      }

      if (album) {
        const albumSet = new Set(curProduct.albums)

        if (!albumSet.has(album.id)) {
          albumSet.add(album.id)

          if (!isNew) {
            curProduct.modified = Date.now()
          }
        }

        curProduct.albums = Array.from(albumSet)
      }
    })

    return Promise.resolve()
  }
}

if (require.main === module) {
  main()
}
