css-pub-dir     = $(assets-pub-dir)/css
css-src-dir     = $(assets-src-dir)/css
css-main        = $(css-src-dir)/main.sass

css-deps        = $(wildcard $(css-src-dir)/*.sass)
css-deps       += $(node-modules-dir)/bulma/bulma.sass

css-libs        = $(node-modules-dir)/font-awesome/css
css-libs       += $(node-modules-dir)/font-awesome/fonts

css-pub-files  = $(css-main:$(css-src-dir)/%.sass=$(css-pub-dir)/%.css)
css-pub-files += $(css-libs:$(node-modules-dir)/%=$(css-pub-dir)/lib/%)

all: css

clean: css-clean

css: $(css-pub-dir) $(css-pub-files)

css-clean:
	rm -rf $(css-pub-dir)

$(css-pub-dir):
	mkdir -p $@

$(css-pub-dir)/%.css: $(css-deps)
	node-sass \
	  --output-style expanded \
	  --source-map true \
	  --include-path ../node_modules \
	  $(css-main) $@
	postcss --map --use autoprefixer --output $@ $@

$(css-pub-dir)/lib/font-awesome/%: $(node-modules-dir)/font-awesome/%
	@mkdir -p $(@D)
	cp -r $< $@

.PHONY: css css-clean
