banner-file    = "$(img-src-dir)/meta/og-image-album-"$$0".jpg"
banner-bg-file = $(img-src-dir)/meta/og-image-bg-01-jpg

img: img-banners

img-banners: $(db-src-file)
	$(gen-albums)
	@make --no-print-directory `awk '{ print $(banner-file) }' .albums`
	@make --no-print-directory img-pub
	@rm .albums

img-clean: img-clean-banners img-clean-products

img-clean-banners:
	rm -f $(img-src-dir)/meta/og-image-album-*.jpg

img-clean-products:
	rm -rfd $(img-src-dir)/products

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

.PHONY: img img-banners img-clean-banners img-clean-products
