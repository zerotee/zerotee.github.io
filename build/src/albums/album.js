module.exports = function (context) {
  const id = context.page.name
  const album = context.albums.byId[id]
  const image = context.config.baseURL + '/' + (
    context.asset(`assets/img/meta/og-image-album-${id}.jpg`)
  )
  const title = 'ZeroTee | Albums: ' + (
    (album && album.title) ? album.title : context.page.name
  )

  return {
    title,
    config: {
      openGraph: {
        title,
        image
      },
      twitterCard: {
        card: 'summary_large_image',
        image
      }
    }
  }
}
