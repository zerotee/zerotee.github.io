#!/usr/bin/env node

const Path = require('path')
const nunjucks = require('nunjucks')
const nunjucksMd = require('nunjucks-markdown')
const md = require('markdown-it')()

const prog = Path.basename(process.argv[1])
const env = nunjucks.configure()
const htmlSrc = process.env.htmlSrc || 'src'

nunjucksMd.register(env, (text) => md.render(text))

function main () {
  const file = process.argv[2]

  if (!file) {
    console.error(`Usage: ${prog} [FILE]`)
    process.exit(1)
    return
  }

  const path = Path.parse(file)
  const ctxFile = Path.resolve(process.cwd(), Path.join(path.dir, path.name))
  const pathRel = path.dir.replace(new RegExp(`^${htmlSrc}/?`), '')
  const context = {
    date: new Date(),
    currentPage: pathRel + (pathRel.length ? '-' : '') + path.name
  }

  try {
    Object.assign(context, require(ctxFile))
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
  }

  console.error('Render:', file)
  const html = nunjucks.render(file, context)
  process.stdout.write(html)
}

if (require.main === module) {
  main()
}
