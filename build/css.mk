cssDir    = $(assetsDir)/css
cssSrc    = src/assets/css
cssDeps   = $(wildcard $(cssSrc)/*.sass)
cssDeps  += ../node_modules/bulma/bulma.sass
cssMain   = $(cssSrc)/main.sass
cssLibs   = $(jsNom)/font-awesome/css
cssLibs  += $(jsNom)/font-awesome/fonts
cssBuild  = $(cssMain:$(cssSrc)/%.sass=$(cssDir)/%.css)
cssBuild += $(cssLibs:$(jsNom)/%=$(cssDir)/lib/%)

all: css

clean: css-clean

css: $(cssDir) $(cssBuild)

css-clean:
	rm -rf $(cssDir)

$(cssDir):
	mkdir -p $@

$(cssDir)/%.css: $(cssDeps)
	node-sass \
	  --output-style expanded \
	  --source-map true \
	  --include-path ../node_modules \
	  $(cssMain) $@
	postcss --map --use autoprefixer --output $@ $@

$(cssDir)/lib/font-awesome/%: $(jsNom)/font-awesome/%
	@mkdir -p $(@D)
	cp -r $< $@

.PHONY: css css-clean
