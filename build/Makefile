space :=
space +=
comma := ,

all:

clean:
	rm -rfd $(assets-pub-dir)

print-%:
	@echo "$($*)"

include config.mk
include make/*.mk
include site.mk

.PHONY: all clean
