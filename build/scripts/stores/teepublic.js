const Url = require('url')
const cheerio = require('cheerio')
const slugify = require('slugify')
const config = require('../../config')
const log = require('./lib/log')('TeePublic')

function parseProducts ($, url) {
  const res = {}

  res.products = $('.design-container').map((idx, elem) => {
    const $elem = $(elem)
    const $meta = $elem.find('.meta-data')
    const $title = $meta.find('.meta-data-title>p>a')

    return {
      id: $elem.data('id'),
      image: $elem.find('.design>.preview>img').attr('src'),
      title: $title.text(),
      url: Url.resolve(config.teePublicURL, $title.attr('href')),
      artist: $meta.find('.designer-info').text().trim().replace(/^by\s+/, ''),
      price: parseInt(
        $meta.find('.price>p>span').text().trim().replace(/\$/, ''),
        10
      )
    }
  }).get()

  if (/\?album=/.test(url)) {
    const $title = $('#content>.container h2.tiles')
    const title = $title.length ? $title.text().trim() : undefined
    res.album = {
      url,
      title,
      id: slugify(title).toLowerCase()
    }
  }

  log('album: %s', res.album ? res.album.title : '(none)')
  log('products: %d', res.products.length)

  return res
}

function parseLinks ($) {
  return $('.nav a[href*=album], .pagination>.page>a').map((idx, elem) => (
    $(elem).attr('href')
  )).get()
}

function parse (html, url) {
  const $ = cheerio.load(html)
  return {
    items: parseProducts($, url),
    links: parseLinks($, url)
  }
}

module.exports = {
  name: 'TeePublic',
  url: config.teePublicURL,
  parse
}
