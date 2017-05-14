#!/usr/bin/env node

const Path = require('path')

function main () {
  const htmlDir = process.env.htmlDir || '..'
  const dbFile = process.env.dbFile || 'db.json'
  const dbPath = Path.join(process.cwd(), dbFile)
  const db = require(dbPath)

  process.stdout.write(
    db.albums
      .map((album) => `${htmlDir}/albums/${album.id}/index.html`)
      .join('\n')
  )
}

if (require.main === module) {
  main()
}
