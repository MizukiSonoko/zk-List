package log

import (
	"context"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type loggerMarker struct{}

var (
	loggerMarkerKey = &loggerMarker{}
)

func NewContext(ctx context.Context, logger *zap.Logger, fields ...zapcore.Field) context.Context {
	return context.WithValue(ctx, loggerMarkerKey, logger.With(fields...))
}

// WithContext returns a logger from the given context
func WithContext(ctx context.Context) *zap.Logger {
	if ctx == nil {
		return zap.NewNop()
	}
	if ctxLogger, ok := ctx.Value(loggerMarkerKey).(*zap.Logger); ok {
		return ctxLogger
	}
	return zap.NewNop()
}
