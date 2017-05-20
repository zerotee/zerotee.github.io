#!/usr/bin/env node

const Crypto = require('crypto')
const Fs = require('fs')
const Path = require('path')
const Lo = require('lodash')
const nunjucks = require('nunjucks')
const nunjucksMd = require('nunjucks-markdown')
const md = require('markdown-it')()
const config = require('../config.json')

const prog = Path.basename(process.argv[1])
const env = nunjucks.configure()
const srcDir = process.env['src-dir'] || 'src'
const htmlDir = process.env['html-out-dir'] || 'out'
const pubDir = process.env['html-pub-dir'] || '..'

function getAsset (file) {
  let data
  try {
    data = Fs.readFileSync(file)
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    }
    throw e
  }
  return data
}

function assetHash (path) {
  const data = getAsset(Path.join(pubDir, path))
  if (data) {
    return Crypto.createHash('md5').update(data).digest('hex')
  }
}

function asset (path) {
  const hash = assetHash(path)
  return path + (hash ? `?${hash}` : '')
}

nunjucksMd.register(env, (text) => md.render(text))

function main () {
  const file = process.argv[2]
  const dest = process.argv[3]

  if (!dest) {
    console.error(`Usage: ${prog} [FILE] [DEST]`)
    process.exit(1)
    return
  }

  const srcDirPath = Path.resolve(process.cwd(), srcDir)
  const rootCtx = require(Path.join(srcDirPath, 'context.js'))
  const path = Path.parse(file)
  const ctxFile = Path.resolve(process.cwd(), Path.join(path.dir, path.name))
  const destPath = dest.replace(new RegExp(`^${htmlDir}/?`), '')
  const destParsed = Path.parse(destPath)
  const pagePath = Path.join(destParsed.dir, destParsed.name)
  const pageId = pagePath.replace(/\\|\//g, '-')
  const pageName = Path.basename(destParsed.dir)

  const context = Object.assign({}, rootCtx, {
    date: new Date(),
    asset,
    config,
    page: {
      id: pageId,
      path: destPath,
      name: pageName,
      canonical: pagePath.replace(/index\.html$/, '')
    }
  })

  let locals

  try {
    locals = require(ctxFile)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    } else {
      console.error('WARN: Context module %s not found', ctxFile)
    }
  }

  if (Lo.isFunction(locals)) {
    locals = locals(context)
  }

  Lo.merge(context, locals)

  console.error('[render] %s: template: %s', pageId, file)
  console.error('[render] %s: dest: %s', pageId, dest)
  console.error('[render] %s: context: %s', pageId, ctxFile)
  console.error('[render] %s: page.name: %s', pageId, pageName)
  console.error('[render] %s: page.path: %s', pageId, pagePath)

  const html = nunjucks.render(file, context)
  Fs.writeFileSync(dest, html)
}

if (require.main === module) {
  main()
}
