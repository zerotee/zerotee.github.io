# Custom rules
# ============

album-file     = "$(html-pub-dir)/albums/"$$0"/index.html"
banner-file    = "$(img-src-dir)/meta/og-image-album-"$$0".jpg"
banner-bg-file = $(img-src-dir)/meta/og-image-bg-01-jpg

export db-src-file img-src-dir

html: html-albums

html-albums: Albums
	@make --no-print-directory `awk '{ print $(album-file) }' $<`

html-clean: html-clean-albums

html-clean-albums:
	rm -rfd $(html-pub-dir)/albums

img: img-banners

img-banners: Albums
	@make --no-print-directory `awk '{ print $(banner-file) }' $<`
	@make --no-print-directory img-pub

img-clean: img-clean-banners img-clean-products

img-clean-banners:
	rm -f $(img-src-dir)/meta/og-image-album-*.jpg

img-clean-products:
	rm -rfd $(img-src-dir)/products

clean: clean-albums

clean-albums:
	rm -f Albums

Albums: $(db-src-file)
	jq -r '.collection[].id' $< | tr -d '\015' > $@
	echo all | cat $@ - | sort | uniq > $@

$(html-pub-dir)/albums/%/index.html: \
  $(html-src-dir)/albums/album.html  \
  $(html-deps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(html-pub-dir)/about/index.html: $(html-src-dir)/about/about.md

$(img-src-dir)/meta/og-image-album-%.jpg: $(img-src-dir)/products/%/.touch
	@mkdir -p $(@D)
	gm montage \
	  -background transparent \
	  -tile 4x2 \
	  -geometry 315x315+0+0 \
	  -quality 90 \
	  $(<D)/* $@

$(img-src-dir)/products/%/.touch: $(db-src-file)
	@mkdir -p $(@D)
	@touch $@
	scripts/products.js $*

.PHONY: clean-albums html-albums html-clean-albums img-clean-products img-banners
