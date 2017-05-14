const context = module.exports = {
  title: 'ZeroTee',
  subtitle: 'Minimal Geek Tees',
  products: require('./products'),
  albums: require('./albums')
}

if (require.main === module) {
  console.log(JSON.stringify(context, null, 2))
}
