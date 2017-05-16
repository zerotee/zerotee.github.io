# Config
# ======

src-dir           = src
pub-dir           = ..
assets-src-dir    = $(src-dir)/assets
assets-pub-dir    = $(pub-dir)/assets
node-modules-dir  = $(pub-dir)/node_modules

PATH := $(node-modules-dir)/.bin:$(node-modules-dir)/node-jq/bin:$(PATH)

export src-dir pub-dir assets-src-dir assets-pub-dir
