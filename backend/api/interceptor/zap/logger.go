//nolint:stylecheck,revive
package connect_zap

import (
	"context"
	"path"
	"time"

	"github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/mizukisonoko/zkmoku/log"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	SystemField = zap.String("system", "connect")
	ServerField = zap.String("span.kind", "server")
)

func newLogger(ctx context.Context, logger *zap.Logger, procedure string, start time.Time, timestampFormat string) *zap.Logger {
	var f []zapcore.Field
	f = append(f, zap.String("connect.start_time", start.Format(timestampFormat)))
	if d, ok := ctx.Deadline(); ok {
		f = append(f, zap.String("connect.request.deadline", d.Format(timestampFormat)))
	}
	return logger.With(append(f, serverCallFields(procedure)...)...)
}

func serverCallFields(procedure string) []zapcore.Field {
	service := path.Dir(procedure)[1:]
	method := path.Base(procedure)
	return []zapcore.Field{
		SystemField,
		ServerField,
		zap.String("connect.service", service),
		zap.String("connect.method", method),
	}
}

func ContextualLoggerUnaryServerInterceptor(logger *zap.Logger) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			ctx = log.NewContext(ctx, logger, zap.String("request_id", uuid.NewString()))
			resp, err := next(ctx, req)
			return resp, err
		}
	}
}

func UnaryServerInterceptor(logger *zap.Logger, opts ...Option) connect.UnaryInterceptorFunc {
	o := evaluateServerOpt(opts)
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			startTime := time.Now()

			logger = log.WithContext(ctx)
			logger = newLogger(ctx, logger, req.Spec().Procedure, startTime, o.timestampFormat)
			duration := durationToTimeMillisField(time.Since(startTime))

			resp, err := next(ctx, req)
			logger.Check(zap.InfoLevel, "finished unary call").Write(
				zap.Error(err),
				duration,
			)
			return resp, err
		}
	}
}

func durationToTimeMillisField(duration time.Duration) zapcore.Field {
	return zap.Float32("connect.time_ms", durationToMilliseconds(duration))
}

func durationToMilliseconds(duration time.Duration) float32 {
	return float32(duration.Nanoseconds()/1000) / 1000
}
