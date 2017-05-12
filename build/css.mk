cssDir   = $(assetsDir)/css
cssSrc   = src/assets/css
cssDeps  = $(wildcard $(cssSrc)/*.sass)
cssDeps += ../node_modules/bulma/bulma.sass
cssMain  = $(cssSrc)/main.sass
cssBuild = $(cssMain:$(cssSrc)/%.sass=$(cssDir)/%.css)

all:: css

css: $(cssBuild)

$(cssDir)/%.css: $(cssDeps)
	node-sass --output-style expanded --source-map true --include-path ../node_modules/bulma $(cssMain) $@
	postcss --use autoprefixer --map --output $@ $@

.PHONY: css
