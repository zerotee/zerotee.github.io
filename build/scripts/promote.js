#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const Lo = require('lodash')
const BufferAPI = require('buffer-node')
const args = require('yargs').argv
const pEach = require('p-each-series')
const truncate = require('tweet-truncator').truncate
const log = require('./lib/log')(__filename)
const config = require('../config.json')

const requiredProps = [
  'title',
  'artist',
  'urls.product'
]

function main () {
  const bufferToken = process.env['BUFFER_API_ACCESS_TOKEN']

  if (!bufferToken) {
    log('error: env var BUFFER_API_ACCESS_TOKEN not defined')
    process.exit(1)
    return
  }

  const buffer = BufferAPI(bufferToken)
  const dbFile = args.db || 'db.json'
  const dryRun = args.dryrun || args.n || false
  const db = require(Path.join(process.cwd(), dbFile))
  const products = db.product.slice().reverse()

  buffer.profiles
    .get()
    .then((profiles) => pEach(profiles, sendPromo))
    .then(() => {
      Fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))
    })
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })

  function sendPromo (profile) {
    const ids = [profile.id]
    const service = profile.service
    const count = Lo.max(profile.schedules.map((s) => s.times.length))
    const unshared = products
      .filter((p) => !p.shared || !p.shared[profile.id])
      .slice(0, count)

    if (!unshared.length) {
      log(`all products have been shared to ${service}`)
      return Promise.resolve()
    }

    return pEach(unshared, (product) => {
      const [ store, id ] = product.id.split('-')

      if (!requiredProps.every((prop) => Lo.has(product, prop))) {
        return Promise.reject(new Error(`product ${id} missing some props`))
      }

      const content = {
        url: product.urls.product,
        desc: `${product.title} by ${product.artist}`,
        tags: config.promote.tags
      }

      if (config.stores[store].twitter) {
        const mention = config.stores[store].twitter.replace('@', '')
        content.desc = content.desc + ` @${mention}`
      }

      const media = {
        link: product.urls.product,
        title: product.title,
        photo: product.image
      }

      const text = truncate(content, config.promote.truncator)

      log(
        '%sing %s: "%s" to %s',
        Lo.capitalize(profile.verb),
        id,
        text,
        profile.formatted_username
      )

      if (!dryRun) {
        return buffer.updates.create(text, ids, { media }).then((res) => {
          product.shared = product.shared || {}
          res.updates.forEach((update) => {
            product.shared[update.profile_id] = update.id
          })
        })
      }
    })
  }
}

if (require.main === module) {
  main()
}
