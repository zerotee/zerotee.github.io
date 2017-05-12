htmlDir    = $(publicDir)
htmlSrc    = src
htmlTpl    = pug
htmlTypes  = $(htmlTpl) html
htmlFiles  = $(foreach type, $(htmlTypes), $(wildcard $(htmlSrc)/*.$(type)))
htmlBuild  = $(htmlFiles:.pug=.html)
htmlBuild := $(htmlBuild:$(htmlSrc)/%=$(htmlDir)/%)

# Template dependencies (layouts and includes)
# ALL templates will be re-built if any of these files is changed
htmlTplDeps  = $(wildcard $(htmlSrc)/layouts/*.$(htmlTpl))
htmlTplDeps += $(wildcard $(htmlSrc)/includes/*.$(htmlTpl))

all:: html

html: $(htmlDir) $(htmlBuild)

$(htmlDir):
	mkdir -p $@

$(htmlDir)/%.html: $(htmlSrc)/%.pug $(htmlSrc)/%.js $(htmlTplDeps)
	pug -p $< -O $(word 2,$^) < $< > $@

$(htmlSrc)/%.js::
	touch $@

.PHONY: html
