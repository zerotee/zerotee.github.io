const baseURL = 'https://zerotee.space'

module.exports = {
  facebook: {
    appId: '1651962031485452'
  },
  openGraph: {
    title: 'ZeroTee | Minimal Geek Tees',
    image: baseURL + '/assets/img/meta/og-image-01.jpg',
    description: 'ZeroTee is a curated collection of T-shirt sales accross the web with a niche towards minimalist geek designs'
  },
  twitterCard: {
    card: 'summary',
    image: baseURL + '/assets/img/meta/card-summary-01.jpg',
    site: '@zerotee_'
  },
  baseURL,
  teePublicURL: 'https://www.teepublic.com/stores/zerotee',
  userAgent: (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) ' +
    'Gecko/20100101 Firefox/53.0'
  )
}
