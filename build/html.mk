htmlDir   = $(publicDir)
htmlSrc   = src
htmlFiles = $(shell find $(htmlSrc) -name index.html)
htmlBuild = $(htmlFiles:$(htmlSrc)/%=$(htmlDir)/%)

# Template dependencies (layouts and includes)
# ALL templates will be re-built if any of these files are changed
htmlTplDeps  = $(shell find src/assets -name '*.html')
htmlTplDeps += $(dbFile)

export htmlDir dbFile

all: html

clean: html-clean

html: $(htmlDir) $(htmlBuild)

html-clean:
	rm -f $(htmlBuild)

$(htmlDir):
	mkdir -p $@

$(htmlDir)/%.html: $(htmlSrc)/%.html $(htmlSrc)/%.js $(htmlTplDeps)
	@mkdir -p $(@D)
	scripts/render.js $< > $@

$(htmlDir)/albums/%.html: src/album.html $(htmlTplDeps)
	@mkdir -p $(@D)
	scripts/render.js $< > $@

$(htmlSrc)/%.js::
	touch $@

$(htmlDir)/about/index.html: $(htmlSrc)/about/about.md

.PHONY: html html-clean html-albums
