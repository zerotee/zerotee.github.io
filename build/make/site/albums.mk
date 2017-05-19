define gen-albums
	@jq -r '.collection[].id' $< | tr -d '\015' > .albums
	@echo all | cat .albums - | sort | uniq > .albums
endef
