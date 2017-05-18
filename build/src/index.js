const config = require('../config.json')

const context = module.exports = {
  title: config.openGraph.title,
  products: require('./products'),
  albums: require('./albums')
}

if (require.main === module) {
  console.log(JSON.stringify(context, null, 2))
}
