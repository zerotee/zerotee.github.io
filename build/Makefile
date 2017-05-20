space :=
space +=
comma := ,

config-file      = config.json
src-dir          = src
out-dir          = out
pub-dir          = ..
assets-src-dir   = $(src-dir)/assets
assets-out-dir   = $(out-dir)/assets
assets-pub-dir   = $(pub-dir)/assets
node-modules-dir = $(pub-dir)/node_modules

PATH := $(node-modules-dir)/.bin:$(node-modules-dir)/node-jq/bin:$(PATH)

export src-dir pub-dir out-dir assets-src-dir assets-out-dir assets-pub-dir

all: css db img js html

clean:
	rm -rf $(assets-pub-dir)
	rm -rf $(assets-out-dir)

test:
	true

print-%:
	@echo "$($*)"

include make/*.mk
include make/site/*.mk

.PHONY: all clean
