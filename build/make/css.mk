css-src-dir = $(assets-src-dir)/css
css-out-dir = $(assets-out-dir)/css
css-pub-dir = $(assets-pub-dir)/css
css-lib-dir = $(css-pub-dir)/lib
css-main    = $(css-src-dir)/main.sass

css-deps  = $(wildcard $(css-src-dir)/*.sass)
css-deps += $(node-modules-dir)/bulma/bulma.sass

css-libs  = $(node-modules-dir)/font-awesome/css
css-libs += $(node-modules-dir)/font-awesome/fonts

css-pub-files  = $(css-main:$(css-src-dir)/%.sass=$(css-pub-dir)/%.css)
css-pub-files += $(css-libs:$(node-modules-dir)/%=$(css-lib-dir)/%)

css: $(css-pub-files)

$(css-pub-dir)/%.css: $(css-out-dir)/%.css
	@mkdir -p $(@D)
	postcss --map --use autoprefixer --output $@ $<

$(css-out-dir)/%.css: $(css-deps)
	@mkdir -p $(@D)
	node-sass \
	  --output-style expanded \
	  --source-map true \
	  --include-path ../node_modules \
	  $(css-main) $@

$(css-pub-dir)/lib/font-awesome/%: $(node-modules-dir)/font-awesome/%
	@mkdir -p $(@D)
	cp -r $< $@

.PHONY: css
