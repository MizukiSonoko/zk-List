package recovery

import (
	"context"
	"fmt"

	"github.com/bufbuild/connect-go"
)

type HandlerFunc func(p interface{}) (err error)
type HandlerFuncContext func(ctx context.Context, p interface{}) (err error)

func UnaryServerInterceptor() connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (_ connect.AnyResponse, err error) {
			panicked := true

			defer func() {
				if r := recover(); r != nil || panicked {
					err = recoverFrom(ctx, r, nil)
				}
			}()

			resp, err := next(ctx, req)
			panicked = false
			return resp, err
		}
	}
}

func recoverFrom(ctx context.Context, p interface{}, r HandlerFuncContext) error {
	if r == nil {
		return connect.NewError(connect.CodeInternal, fmt.Errorf("%v", p))
	}
	return r(ctx, p)
}
