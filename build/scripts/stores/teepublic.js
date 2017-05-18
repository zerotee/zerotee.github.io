const Url = require('url')
const config = require('../../config.json')
const slugify = require('slugify')
const storeId = 'teepublic'
const storeURL = config.stores[storeId].url

function parseLinks ($, url) {
  const albums = $('.nav a[href*=album]').map((i, e) => ({
    uri: Url.resolve(url, $(e).attr('href').trim()),
    parse: parseAlbum
  })).get()
  const pages = $('.pagination>.page>a').map((i, e) => ({
    uri: Url.resolve(url, $(e).attr('href').trim()),
    parse: parseAlbum
  })).get()
  return albums.concat(pages)
}

function parseAlbum ($, url) {
  const products = parseProducts($, url)
  const $title = $('#content>.container h2.tiles')
  const title = $title.length ? $title.text().trim() : undefined

  if (title) {
    const album = {
      id: slugify(title).toLowerCase(),
      kind: 'collection',
      title,
      urls: {
        [storeId]: url
      }
    }

    return products
      .map((product) => Object.assign(product, {
        collections: [album.id]
      }))
      .concat(album)
  }

  return products
}

function parseProducts ($, baseURL) {
  return $('.design-container').map((idx, elem) => {
    const $elem = $(elem)
    const $meta = $elem.find('.meta-data')
    const $title = $meta.find('.meta-data-title>p>a')

    return {
      id: storeId + '-' + $elem.data('id'),
      kind: 'product',
      image: $elem.find('.design>.preview>img').attr('src'),
      title: $title.text(),
      artist: $meta.find('.designer-info').text().trim().replace(/^by\s+/, ''),
      price: parseInt(
        $meta.find('.price>p>span').text().trim().replace(/\$/, ''),
        10
      ),
      urls: {
        product: Url.resolve(baseURL, $title.attr('href'))
      }
    }
  }).get()
}

function parseStorePage ($, url) {
  return parseProducts($, url).concat(parseLinks($, url))
}

module.exports = {
  disabled: false,
  name: storeId,
  startRequests: [
    { uri: storeURL,
      parse: parseStorePage }
  ]
}
