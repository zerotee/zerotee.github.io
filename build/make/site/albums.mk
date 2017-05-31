album-ids-db = $(shell jq -r '.collection[].id' $(db-src-file) | tr -d '\015')
album-ids    = $(album-ids-db) all
