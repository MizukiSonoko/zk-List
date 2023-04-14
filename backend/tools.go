//go:build tools

package tools

import (
	_ "github.com/bufbuild/buf/cmd/buf"
	_ "github.com/bufbuild/connect-go/cmd/protoc-gen-connect-go"
	_ "github.com/cosmtrek/air"
	_ "github.com/deepmap/oapi-codegen/cmd/oapi-codegen"
	_ "github.com/fullstorydev/grpcurl/cmd/grpcurl"
	_ "github.com/mgechev/revive"
	_ "golang.org/x/tools/cmd/goimports"
	_ "google.golang.org/protobuf/cmd/protoc-gen-go"
)
