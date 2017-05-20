js-pub-dir   = $(assets-pub-dir)/js
js-lib-dir   = $(js-pub-dir)/lib
js-pub-files = $(js-lib-dir)/autotrack.js

js: $(js-pub-files)

$(js-lib-dir)/autotrack.js: $(node-modules-dir)/autotrack/autotrack.js
	@mkdir -p $(@D)
	cp $< $@

.PHONY: js
