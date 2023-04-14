
.PHONY: build
build:
	CGO_ENABLED=1  go build -o app app.go 

.PHONY: run
run:
	./app

.PHONY: install-go-tools
install-go-tools:
	cat tools.go | awk -F'"' '/_/ {print $$2}' | GOBIN=$(BIN) xargs -tI {} go install {}

.PHONY: gen
gen:
	@buf generate
