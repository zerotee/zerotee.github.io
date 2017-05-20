img-src-dir   = $(assets-src-dir)/img
img-out-dir   = $(assets-out-dir)/img
img-pub-dir   = $(assets-pub-dir)/img
img-types     = png jpg svg
img-glob      = *.{$(subst $(space),$(comma),$(img-types))}
img-find      = $(shell find $(img-src-dir) -name '*.$(type)')
img-src-files = $(foreach type, $(img-types), $(img-find))
img-pub-files = $(img-src-files:$(img-src-dir)/%=$(img-pub-dir)/%)

img: img-pub

img-pub: $(img-pub-files)

$(img-pub-dir)/%.png: $(img-out-dir)/%.png
	@mkdir -p $(@D)
	imagemin --plugin=pngquant $< > $@

$(img-pub-dir)/%.jpg: $(img-out-dir)/%.jpg
	@mkdir -p $(@D)
	imagemin $< > $@

$(img-pub-dir)/%.svg: $(img-out-dir)/%.svg
	@mkdir -p $(@D)
	imagemin $< > $@

$(img-out-dir)/%: $(img-src-dir)/%
	@mkdir -p $(@D)
	cp $< $@

.PHONY: img img-pub
