img-pub-dir   = $(assets-pub-dir)/img
img-src-dir   = $(assets-src-dir)/img
img-types     = png jpg svg gif
img-glob      = *.{$(subst $(space),$(comma),$(img-types))}
img-find      = $(shell find $(img-src-dir) -name '*.$(type)')
img-src-files = $(foreach type, $(img-types), $(img-find))
img-pub-files = $(img-src-files:$(img-src-dir)/%=$(img-pub-dir)/%)

all: img

clean: img-clean

img: img-pub

img-pub: $(img-pub-files)

img-clean:
	rm -rf $(img-pub-dir)

$(img-pub-dir)/%.svg: $(img-src-dir)/%.svg
	@mkdir -p $(@D)
	imagemin $< > $@

$(img-pub-dir)/%.jpg: $(img-src-dir)/%.jpg
	@mkdir -p $(@D)
	imagemin $< > $@

$(img-pub-dir)/%.png: $(img-src-dir)/%.png
	@mkdir -p $(@D)
	imagemin --plugin=pngquant $< > $@

.PHONY: img img-pub img-clean
