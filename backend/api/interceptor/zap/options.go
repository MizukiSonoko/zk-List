//nolint:stylecheck,revive
package connect_zap

import (
	"time"
)

var (
	defaultOptions = &options{
		timestampFormat: time.RFC3339,
	}
)

type options struct {
	timestampFormat string
}

type Option func(*options)

func evaluateServerOpt(opts []Option) *options {
	optCopy := &options{}
	*optCopy = *defaultOptions
	for _, o := range opts {
		o(optCopy)
	}
	return optCopy
}

// WithTimestampFormat customizes the timestamps emitted in the log fields.
func WithTimestampFormat(format string) Option {
	return func(o *options) {
		o.timestampFormat = format
	}
}
