package main

import (
	"context"
	"fmt"
	"net/http"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/bufbuild/connect-go"
	"github.com/mizukisonoko/zkmoku/api"
	"github.com/mizukisonoko/zkmoku/api/interceptor/recovery"
	connect_zap "github.com/mizukisonoko/zkmoku/api/interceptor/zap"
	"github.com/mizukisonoko/zkmoku/gen/proto/apiv1connect"
	"github.com/rs/cors"
	"go.uber.org/zap"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"os"
)

const (
	exitOK  = 0
	exitErr = 1
)

func main() {
	os.Exit(realMain())
}

func realMain() int {
	logger, err := zap.NewDevelopment()
	if err != nil {
		_, _ = fmt.Fprintf(os.Stderr, "failed to create a zap logger: %v\n", err)
		return exitErr
	}
	defer func() {
		_ = logger.Sync()
	}()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGINT)
	defer stop()
	wg := &sync.WaitGroup{}

	api := api.NewAPI()
	mux := http.NewServeMux()
	interceptors := connect.WithInterceptors(
		recovery.UnaryServerInterceptor(),
		connect_zap.ContextualLoggerUnaryServerInterceptor(logger),
		connect_zap.UnaryServerInterceptor(logger),
	)

	mux.Handle(apiv1connect.NewZkMokuServiceHandler(api, interceptors))

	server := &http.Server{
		Addr:              fmt.Sprintf("0.0.0.0:%v", 8080),
		Handler:           cors.AllowAll().Handler(h2c.NewHandler(mux, &http2.Server{})),
		IdleTimeout:       120 * time.Second,
		ReadHeaderTimeout: 20 * time.Second,
		ReadTimeout:       20 * time.Second,
		WriteTimeout:      200 * time.Second,
	}

	go func() {
		defer wg.Done()
		<-ctx.Done()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		logger.Info("received a signal and starting shutdown a server gracefully")
		if err := server.Shutdown(ctx); err != nil {
			logger.Error("failed to shutdown a server",
				zap.Error(err),
			)
		}
		logger.Info("succeeded to shutdown a server gracefully")
	}()

	logger.Info("starting a server",
		zap.String("addr", server.Addr),
	)
	wg.Add(1)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logger.Fatal("failed to listen and serve server",
			zap.String("addr", server.Addr),
			zap.Error(err),
		)
	}

	wg.Wait()
	return exitOK
}
