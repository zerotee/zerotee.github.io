dbFile  = db.json
dbBuild = $(publicDir)/$(dbFile)

export dbFile

all: db

clean: db-clean

db: $(dbBuild)

db-clean:
	rm -f $(dbFile) $(dbBuild)

$(dbFile):
	scripts/fetch.js

$(dbBuild): $(dbFile)
	node -p "JSON.stringify(require('./$<'))" > $@

.PHONY: db
