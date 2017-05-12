imgDir   = $(assetsDir)/img
imgSrc   = src/assets/img
imgTypes = png jpg jpeg svg gif
imgGlob  = *.{$(subst $(space),$(comma),$(imgTypes))}
imgFiles = $(foreach type, $(imgTypes), $(wildcard $(imgSrc)/*.$(type)))
imgBuild = $(imgFiles:$(imgSrc)/%=$(imgDir)/%)

all:: img

img: $(imgDir) $(imgBuild)

img-import:
ifdef from
	cp -vu $(from)/$(imgGlob) $(imgSrc) || true
endif

$(imgDir):
	mkdir -p $@

$(imgDir)/%.svg: $(imgSrc)/%.svg
	imagemin $< > $@

$(imgDir)/%.png: $(imgSrc)/%.png
	imagemin --plugin=pngquant $< > $@

.PHONY: img img-import
