html-pub-dir   = $(pub-dir)
html-src-dir   = $(src-dir)

html-src-files = $(shell find $(html-src-dir) -name index.html)
html-pub-files = $(html-src-files:$(html-src-dir)/%=$(html-pub-dir)/%)

html-sub-dirs  = $(dir $(html-src-files))
html-sub-dirs := $(filter-out $(html-src-dir)/,$(html-sub-dirs))
html-sub-dirs := $(filter-out $(assets-src-dir)/,$(html-sub-dirs))
html-sub-dirs := $(html-sub-dirs:$(html-src-dir)/%=$(html-pub-dir)/%)

# Template dependencies (layouts, includes and context modules)
# ALL templates will be re-built if any of these files are changed
html-deps  = $(shell find $(assets-src-dir) -name '*.html')
html-deps += $(shell find $(src-dir) -name '*.js')
html-deps += $(db-src-file) config.js

# Export required env vars for scripts
export html-pub-dir html-src-dir db-src-file

all: html

clean: html-clean

html: html-pub

html-pub: $(html-pub-files)

html-clean:
	rm -f $(html-pub-files)
	rm -rfd $(html-sub-dirs)

$(html-pub-dir)/%.html:  \
  $(html-src-dir)/%.html \
  $(html-src-dir)/%.js   \
  $(html-deps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(html-src-dir)/%.js:
	@touch $@

.PHONY: html html-pub html-clean
