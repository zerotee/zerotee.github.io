# Custom targets
# ==============

# html

html: html-albums

html-albums: Albums
	@make --no-print-directory $$(cat $<)

$(html-pub-dir)/albums/%/index.html: \
  $(html-src-dir)/albums/album.html  \
  $(html-deps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(html-pub-dir)/about/index.html: $(html-src-dir)/about/about.md

Albums: $(db-src-file)
	scripts/albums.js > $@

.PHONY: html-albums
