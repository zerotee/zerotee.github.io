const Lo = require('lodash')
const Url = require('url')
const Path = require('path')
const cheerio = require('cheerio')
const slugify = require('slugify')
const config = require('../../config')
const storeId = 'zazzle'
const storeURL = config.stores[storeId].url
const assocId = config.stores[storeId].id

const TRE = /^zazzle\.com\s+collection:\s+/i

const TSEL = (
  '.ZazzleWwwWidgetsCollectionItemCellIdeaBoardCard-titleLink' +
  '[href*=collections]'
)

// eslint-disable-next-line no-template-curly-in-string
const rss = Lo.template('https://feed.zazzle.com/collections/${id}/rss')

function parseLinkId (url) {
  const parsed = Url.parse(url)
  const name = Path.basename(parsed.path)
  const splat = name.split('-')
  return splat[splat.length - 1]
}

function parseRSSLink (url) {
  return rss({ id: parseLinkId(url) })
}

function makeLink (url) {
  const parsed = Url.parse(url, true)
  parsed.query = parsed.query || {}
  parsed.query.rf = assocId
  parsed.search = undefined
  return Url.format(parsed)
}

function parseRSSPage (body, url) {
  const $ = cheerio.load(body, { xmlMode: true })
  const fullTitle = $('channel>title').text().trim()
  const title = fullTitle.replace(TRE, '')
  const id = slugify(title).toLowerCase()
  const pageURL = $('channel>link').text().trim()

  const products = $('channel>item').map((i, e) => {
    const $e = $(e)
    return {
      kind: 'product',
      id: storeId + '-' + parseLinkId($e.find('guid').text().trim()),
      title: $e.find('title').text().trim(),
      artist: $e.find('author').text().trim(),
      image: encodeURI($e.find('media\\:content').attr('url').trim()),
      price: parseInt(
        $e.find('price').text().trim().replace(/\$/, ''),
        10
      ),
      urls: {
        product: makeLink($e.find('link').text().trim())
      },
      collections: [id]
    }
  }).get()

  return products.concat({
    id,
    title,
    kind: 'collection',
    urls: {
      [storeId]: makeLink(pageURL)
    }
  })
}

function parseCollectionsPage ($, url) {
  return $(TSEL).map((i, e) => ({
    uri: parseRSSLink($(e).attr('href').trim()),
    parse: parseRSSPage,
    jQuery: false
  })).get()
}

module.exports = {
  disabled: false,
  name: storeId,
  startRequests: [
    { uri: storeURL,
      parse: parseCollectionsPage }
  ]
}
