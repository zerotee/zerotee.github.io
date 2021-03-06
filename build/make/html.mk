html-src-dir   = $(src-dir)
html-out-dir   = $(out-dir)
html-pub-dir   = $(pub-dir)
html-src-files = $(shell find $(html-src-dir) -name index.html)
html-pub-files = $(html-src-files:$(html-src-dir)/%=$(html-pub-dir)/%)
html-sub-dirs  = $(dir $(html-src-files))
html-sub-dirs := $(filter-out $(html-src-dir)/,$(html-sub-dirs))
html-sub-dirs := $(filter-out $(assets-src-dir)/,$(html-sub-dirs))
html-sub-dirs := $(html-sub-dirs:$(html-src-dir)/%=$(html-pub-dir)/%)
html-sub-dirs += $(html-sub-dirs:$(html-pub-dir)/%=$(html-out-dir)/%)

# Template dependencies (layouts, includes and context modules)
# ALL templates will be re-built if any of these files are changed
html-deps  = $(shell find $(assets-src-dir) -name '*.html')
html-deps += $(config-file) $(db-src-file) $(html-src-dir)/context.js

export html-src-dir html-out-dir html-pub-dir db-src-file

clean: html-clean

html: html-pub

html-pub: $(html-pub-files)

html-clean:
	rm -f  $(html-pub-files)
	rm -rf $(html-sub-dirs)

$(html-pub-dir)/%.html: $(html-out-dir)/%.html
	@mkdir -p $(@D)
	html-minifier \
	  --collapse-boolean-attributes \
	  --collapse-whitespace \
	  --remove-comments \
	  $< > $@

$(html-out-dir)/%.html:  \
  $(html-src-dir)/%.html \
  $(html-src-dir)/%.js   \
  $(html-deps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(html-src-dir)/%.js:
	@touch $@

.PHONY: html html-pub html-clean
