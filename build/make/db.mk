db-src-file = db.json
db-pub-file = $(pub-dir)/$(db-src-file)

export db-src-file

clean: db-clean

db: $(db-pub-file)

db-clean:
	rm -f   $(db-pub-file)

$(db-pub-file): $(db-src-file)
	node -p "JSON.stringify(require('./$<'))" > $@

.PHONY: db db-clean
