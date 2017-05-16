#!/usr/bin/env node

const Path = require('path')

function main () {
  const htmlDir = process.env['html-dest-dir'] || '..'
  const dbFile = process.env['db-src-file'] || 'db.json'
  const dbPath = Path.join(process.cwd(), dbFile)
  const db = require(dbPath)
  const albums = db.albums.map(
    (album) => `${htmlDir}/albums/${album.id}/index.html`
  )

  albums.push(`${htmlDir}/albums/all/index.html`)
  process.stdout.write(albums.join('\n'))
}

if (require.main === module) {
  main()
}
