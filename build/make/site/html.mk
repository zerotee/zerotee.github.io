html-album-src-dir = $(html-src-dir)/albums
html-album-out-dir = $(html-out-dir)/albums
html-album-pub-dir = $(html-pub-dir)/albums
html-album-files   = $(album-ids:%=$(html-album-pub-dir)/%/index.html)

html: html-albums

html-albums: $(html-album-files)

html-clean: html-clean-albums

html-clean-albums:
	rm -f  $(html-album-files)

rm-album::
ifdef id
	rm -rf $(html-album-out-dir)/$(id)
	rm -rf $(html-album-pub-dir)/$(id)
endif

$(html-album-out-dir)/%/index.html: \
  $(html-album-src-dir)/album.html  \
  $(html-deps) \
  $(db-src-file)
	@mkdir -p $(@D)
	scripts/render.js $< $@

.PHONY: html-albums html-clean-albums
