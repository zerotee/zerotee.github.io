htmlDir   = $(publicDir)
htmlSrc   = src
htmlFiles = $(shell find $(htmlSrc) -name index.html)
htmlBuild = $(htmlFiles:$(htmlSrc)/%=$(htmlDir)/%)

# Template dependencies (layouts, includes and context modules)
# ALL templates will be re-built if any of these files are changed
htmlTplDeps  = $(shell find src/assets -name '*.html')
htmlTplDeps += $(shell find src -name '*.js')
htmlTplDeps += $(dbFile)

export htmlDir htmlSrc dbFile

all: html html-albums

clean: html-clean

html: $(htmlDir) $(htmlBuild)

html-albums: Albums
	@make --no-print-directory $$(cat $<)

html-clean:
	rm -f $(htmlBuild)

$(htmlDir):
	mkdir -p $@

$(htmlDir)/%.html: $(htmlSrc)/%.html $(htmlSrc)/%.js $(htmlTplDeps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(htmlDir)/albums/%/index.html: src/albums/album.html $(htmlTplDeps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(htmlDir)/about/index.html: $(htmlSrc)/about/about.md

$(htmlSrc)/%.js:
	@touch $@

Albums: $(dbFile)
	scripts/albums.js > $@

.PHONY: html html-clean html-albums
