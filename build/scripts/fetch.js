#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const Lo = require('lodash')
const Crawler = require('crawler')
const args = require('yargs').argv
const config = require('../config.json')
const log = require('./lib/log')(__filename)

const crawler = new Crawler({
  maxConnections: 5,
  rateLimit: 1000,
  headers: {
    'user-agent': config.userAgent
  }
})

function main () {
  const dbFile = args.db || process.env['db-src-file'] || 'db.json'
  const dbPath = Path.join(process.cwd(), dbFile)
  const db = {}

  try {
    const flat = require(dbPath)
    Object.assign(db, Lo.mapValues(flat, (items) => (
      Lo.keyBy(items, 'id')
    )))
    log('Opened existing db: %s', dbPath)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    } else {
      log('Create new db: %s', dbPath)
    }
  }

  Fs.readdirSync(Path.join(__dirname, 'stores'))
    .filter((name) => name.endsWith('.js'))
    .map((name) => require('./stores/' + name))
    .forEach((store) => {
      if (!store.disabled) {
        log('%s: Fetching...', store.name)
        return crawl(store, db)
      } else {
        log('%s: Disabled', store.name)
      }
    })

  crawler.on('drain', () => {
    const flat = Lo.mapValues(db, (items) => (
      Lo.sortBy(Lo.values(items), (item) => -item.created)
    ))
    Fs.writeFileSync(dbPath, JSON.stringify(flat, null, 2))
  })

  crawler.on('request', (req) => {
    log('request:', req.uri)
  })
}

function crawl ({ name, startRequests }, db) {
  queue(startRequests)

  function queue (reqs) {
    crawler.queue(reqs.map(createRequest))
  }

  function createRequest (req) {
    return Object.assign({}, req, {
      callback: createCallback(req)
    })
  }

  function createCallback ({ uri, parse }) {
    return function reqCallback (err, res, done) {
      if (err) {
        log('ERROR:', err)
        return
      }

      const results = parse(res.$ || res.body, uri)
      const [ reqs, items ] = Lo.partition(results, isRequest)

      if (reqs.length) {
        queue(reqs)
      }

      log('%s: %d items', name, items.length)

      items
        .filter(isItem)
        .forEach(addItem)

      done()
    }
  }

  function addItem (item) {
    const id = item.id
    const kin = item.kind
    const col = db[kin] || (db[kin] = {})
    const doc = Lo.omit(item, 'kind')

    if (col[id]) {
      Lo.assignWith(col[id], doc, (val, src, key) => {
        if (key === 'collections' && val) {
          return Array.from(new Set(val.concat(src)))
        }
        if (key === 'urls') {
          return Object.assign({}, val, src)
        }
      })
    } else {
      col[id] = doc
    }

    if (!col[id].created) {
      col[id].created = Date.now()
    }
  }
}

function isItem (item) {
  return item.kind && item.id
}

function isRequest (item) {
  return item.uri && typeof item.parse === 'function'
}

if (require.main === module) {
  main()
}
