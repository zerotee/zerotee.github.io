# Custom targets
# ==============

read-prereq = $(file < $<)
album-file  = $(html-pub-dir)/albums/%/index.html

html: html-albums

html-albums: Albums
	@make --no-print-directory $(patsubst %,$(album-file),$(read-prereq))

Albums: $(db-src-file)
	jq -r '.albums[].id' $< | tr -d '\015' > $@
	echo all >> $@

$(html-pub-dir)/albums/%/index.html: \
  $(html-src-dir)/albums/album.html  \
  $(html-deps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(html-pub-dir)/about/index.html: $(html-src-dir)/about/about.md

.PHONY: html-albums
