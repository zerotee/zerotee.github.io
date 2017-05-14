cssDir   = $(assetsDir)/css
cssSrc   = src/assets/css
cssDeps  = $(wildcard $(cssSrc)/*.sass)
cssDeps += ../node_modules/bulma/bulma.sass
cssMain  = $(cssSrc)/main.sass
cssBuild = $(cssMain:$(cssSrc)/%.sass=$(cssDir)/%.css)

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
	  --include-path ../node_modules/bulma \
	  --include-path ../node_modules/bulmaswatch \
	  $(cssMain) $@
	postcss --map --use autoprefixer --output $@ $@

.PHONY: css css-clean
