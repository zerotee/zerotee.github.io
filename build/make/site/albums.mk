clean: clean-albums

clean-albums:
	rm -f Albums

Albums: $(db-src-file)
	jq -r '.collection[].id' $< | tr -d '\015' > $@
	echo all | cat $@ - | sort | uniq > $@

.PHONY: clean-albums
