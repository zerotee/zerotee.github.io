jsDir  = $(assetsDir)/js
jsLibs = $(jsDir)/lib/autotrack.js

all: js

clean: js-clean

js: $(jsLibs)

js-clean:
	rm -f $(jsLibs)

$(jsDir)/lib/autotrack.js: $(jsNom)/autotrack/autotrack.js
	@mkdir -p $(@D)
	cp $< $@

.PHONY: js js-clean
