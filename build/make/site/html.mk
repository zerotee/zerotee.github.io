album-file = "$(html-pub-dir)/albums/"$$0"/index.html"

html: html-albums

html-albums: Albums
	@make --no-print-directory `awk '{ print $(album-file) }' $<`

html-clean: html-clean-albums

html-clean-albums:
	rm -rfd $(html-pub-dir)/albums

$(html-pub-dir)/albums/%/index.html: \
  $(html-src-dir)/albums/album.html  \
  $(html-deps)
	@mkdir -p $(@D)
	scripts/render.js $< $@

$(html-pub-dir)/about/index.html: $(html-src-dir)/about/about.md

.PHONY: html-albums html-clean-albums
