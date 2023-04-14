//nolint:stylecheck
package api

import (
	"context"

	connect_go "github.com/bufbuild/connect-go"
	"github.com/mizukisonoko/zkmoku/errors"
	apiv1 "github.com/mizukisonoko/zkmoku/gen/proto"
	"github.com/mizukisonoko/zkmoku/gen/proto/apiv1connect"
	"github.com/mizukisonoko/zkmoku/log"
	"github.com/mizukisonoko/zkmoku/usecase"
	"github.com/morikuni/failure"
	"go.uber.org/zap"
)

var _ apiv1connect.ZkMokuServiceHandler = (*API)(nil)

type API struct {
}

func NewAPI() *API {
	return &API{}
}

func (a *API) HealthCheck(ctx context.Context, _ *connect_go.Request[apiv1.HealthCheckRequest]) (*connect_go.Response[apiv1.HealthCheckResponse], error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	log.WithContext(ctx).Info("health check")
	return connect_go.NewResponse(&apiv1.HealthCheckResponse{}), nil
}

func (a *API) SetUp(ctx context.Context, req *connect_go.Request[apiv1.SetUpRequest]) (*connect_go.Response[apiv1.SetUpResponse], error) {
	if err := ctx.Err(); err != nil {
		log.WithContext(ctx).Error("failed to run setup", zap.Error(err))
		return nil, err
	}
	resp, err := usecase.SetUp(ctx, req.Msg)
	if err != nil {
		log.WithContext(ctx).Info("failed to set up usecase", zap.Error(err))
		return nil, connect_go.NewError(connect_go.CodeInternal, failure.New(errors.Internal))
	}
	return connect_go.NewResponse(resp), nil
}

func (a *API) Prove(ctx context.Context, req *connect_go.Request[apiv1.ProveRequest]) (*connect_go.Response[apiv1.ProveResponse], error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	resp, err := usecase.Prove(ctx, req.Msg)
	if err != nil {
		return nil, connect_go.NewError(connect_go.CodeInternal, failure.New(errors.Internal))
	}
	return connect_go.NewResponse(resp), nil
}

func (a *API) Verify(ctx context.Context, req *connect_go.Request[apiv1.VerifyRequest]) (*connect_go.Response[apiv1.VerifyResponse], error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	resp, err := usecase.Verify(ctx, req.Msg)
	if err != nil {
		return nil, connect_go.NewError(connect_go.CodeInternal, failure.New(errors.Internal))
	}
	return connect_go.NewResponse(resp), nil
}
