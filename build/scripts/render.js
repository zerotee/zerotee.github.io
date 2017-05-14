#!/usr/bin/env node

const Path = require('path')
const nunjucks = require('nunjucks')
const nunjucksMd = require('nunjucks-markdown')
const md = require('markdown-it')()

const prog = Path.basename(process.argv[1])
const env = nunjucks.configure()

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
  const context = {}

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
