space :=
space +=
comma := ,

config-file      = config.json
src-dir          = src
pub-dir          = ..
assets-src-dir   = $(src-dir)/assets
assets-pub-dir   = $(pub-dir)/assets
node-modules-dir = $(pub-dir)/node_modules

PATH := $(node-modules-dir)/.bin:$(PATH)

export src-dir pub-dir assets-src-dir assets-pub-dir

all:

clean:
	rm -rfd $(assets-pub-dir)

print-%:
	@echo "$($*)"

include make/*.mk
include make/site/*.mk

.PHONY: all clean
