#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const Lo = require('lodash')
const nunjucks = require('nunjucks')
const nunjucksMd = require('nunjucks-markdown')
const md = require('markdown-it')()
const config = require('../config')

const prog = Path.basename(process.argv[1])
const env = nunjucks.configure()
const htmlDir = process.env.htmlDir || '..'

nunjucksMd.register(env, (text) => md.render(text))

function main () {
  const file = process.argv[2]
  const dest = process.argv[3]

  if (!dest) {
    console.error(`Usage: ${prog} [FILE] [DEST]`)
    process.exit(1)
    return
  }

  const path = Path.parse(file)
  const ctxFile = Path.resolve(process.cwd(), Path.join(path.dir, path.name))
  const pagePath = dest.replace(new RegExp(`^${htmlDir}/?`), '')
  const destPath = Path.parse(pagePath)
  const pageId = Path.join(destPath.dir, destPath.name).replace(/\\|\//g, '-')
  const pageName = Path.basename(destPath.dir)

  const context = {
    date: new Date(),
    config,
    pageId,
    pageName,
    pagePath,
    pageCanonicalPath: pagePath.replace(/index\.html$/, '')
  }

  try {
    Lo.merge(context, require(ctxFile))
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    } else {
      console.error('WARN: Context module %s not found', ctxFile)
    }
  }

  console.error('[render] %s -> %s', file, dest)
  console.error('[render] ctxFile:', ctxFile)
  console.error('[render] pageId:', pageId)
  console.error('[render] pageName:', pageName)
  console.error('[render] pagePath:', pagePath)

  const html = nunjucks.render(file, context)
  Fs.writeFileSync(dest, html)
}

if (require.main === module) {
  main()
}
