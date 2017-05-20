img-banner-out-dir  = $(img-out-dir)/meta
img-banner-pub-dir  = $(img-pub-dir)/meta
img-banner-files    = $(album-ids:%=$(img-banner-pub-dir)/og-image-album-%.jpg)
img-product-out-dir = $(img-out-dir)/products
img-product-pub-dir = $(img-pub-dir)/products
img-product-ids     = $(shell jq -r .product[].id $(db-src-file)|tr -d '\015')
img-product-paths   = $(subst -,/,$(img-product-ids))
img-product-files   = $(img-product-paths:%=$(img-product-pub-dir)/%)
img-jq-filter       = '.product[]|select(.id=="$(subst /,-,$*)").image'

img: img-banners

img-banners: $(img-banner-files)

$(img-product-pub-dir)/%:
	@mkdir -p $(@D)
	curl -L --progress-bar "`jq -r $(img-jq-filter) $(db-src-file)`" \
	  | imagemin > $@

$(img-banner-out-dir)/og-image-album-%.jpg: \
  $(img-product-out-dir)/%.list \
  $(img-product-files)
	@mkdir -p $(@D)
	gm montage \
	  -background transparent \
	  -tile 4x2 \
	  -geometry 315x315+0+0 \
	  -quality 90 \
	  `cat $<` \
	  $@

$(img-product-out-dir)/%.list: $(db-src-file)
	@mkdir -p $(@D)
	( if [ "$*" = "all" ]; \
	  then jq -r '.product[]|select(.collections|not).id' $<; \
	  else jq -r '.product[]|select(.collections|contains(["$*"])?).id' $<; \
	  fi; \
	) | awk -F - '{ print "$(img-product-pub-dir)/"$$1"/"$$2 }' \
	  | head -n8 > $@

.PHONY: img img-banners
