db-src-file = db.json
db-pub-file = $(pub-dir)/$(db-src-file)

export db-src-file

all: db

clean: db-clean

db: $(db-pub-file)

db-clean:
	rm -f $(db-src-file) $(db-pub-file)

$(db-src-file):
	scripts/fetch.js

$(db-pub-file): $(db-src-file)
	node -p "JSON.stringify(require('./$<'))" > $@

.PHONY: db db-clean
