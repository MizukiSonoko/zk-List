// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: proto/api.proto

package apiv1connect

import (
	context "context"
	errors "errors"
	connect_go "github.com/bufbuild/connect-go"
	proto "github.com/mizukisonoko/zkmoku/gen/proto"
	http "net/http"
	strings "strings"
)

// This is a compile-time assertion to ensure that this generated file and the connect package are
// compatible. If you get a compiler error that this constant is not defined, this code was
// generated with a version of connect newer than the one compiled into your binary. You can fix the
// problem by either regenerating this code with an older version of connect or updating the connect
// version compiled into your binary.
const _ = connect_go.IsAtLeastVersion0_1_0

const (
	// ZkMokuServiceName is the fully-qualified name of the ZkMokuService service.
	ZkMokuServiceName = "api.v1.ZkMokuService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// ZkMokuServiceHealthCheckProcedure is the fully-qualified name of the ZkMokuService's HealthCheck
	// RPC.
	ZkMokuServiceHealthCheckProcedure = "/api.v1.ZkMokuService/HealthCheck"
	// ZkMokuServiceSetUpProcedure is the fully-qualified name of the ZkMokuService's SetUp RPC.
	ZkMokuServiceSetUpProcedure = "/api.v1.ZkMokuService/SetUp"
	// ZkMokuServiceProveProcedure is the fully-qualified name of the ZkMokuService's Prove RPC.
	ZkMokuServiceProveProcedure = "/api.v1.ZkMokuService/Prove"
	// ZkMokuServiceVerifyProcedure is the fully-qualified name of the ZkMokuService's Verify RPC.
	ZkMokuServiceVerifyProcedure = "/api.v1.ZkMokuService/Verify"
)

// ZkMokuServiceClient is a client for the api.v1.ZkMokuService service.
type ZkMokuServiceClient interface {
	HealthCheck(context.Context, *connect_go.Request[proto.HealthCheckRequest]) (*connect_go.Response[proto.HealthCheckResponse], error)
	SetUp(context.Context, *connect_go.Request[proto.SetUpRequest]) (*connect_go.Response[proto.SetUpResponse], error)
	Prove(context.Context, *connect_go.Request[proto.ProveRequest]) (*connect_go.Response[proto.ProveResponse], error)
	Verify(context.Context, *connect_go.Request[proto.VerifyRequest]) (*connect_go.Response[proto.VerifyResponse], error)
}

// NewZkMokuServiceClient constructs a client for the api.v1.ZkMokuService service. By default, it
// uses the Connect protocol with the binary Protobuf Codec, asks for gzipped responses, and sends
// uncompressed requests. To use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC() or
// connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewZkMokuServiceClient(httpClient connect_go.HTTPClient, baseURL string, opts ...connect_go.ClientOption) ZkMokuServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	return &zkMokuServiceClient{
		healthCheck: connect_go.NewClient[proto.HealthCheckRequest, proto.HealthCheckResponse](
			httpClient,
			baseURL+ZkMokuServiceHealthCheckProcedure,
			opts...,
		),
		setUp: connect_go.NewClient[proto.SetUpRequest, proto.SetUpResponse](
			httpClient,
			baseURL+ZkMokuServiceSetUpProcedure,
			opts...,
		),
		prove: connect_go.NewClient[proto.ProveRequest, proto.ProveResponse](
			httpClient,
			baseURL+ZkMokuServiceProveProcedure,
			opts...,
		),
		verify: connect_go.NewClient[proto.VerifyRequest, proto.VerifyResponse](
			httpClient,
			baseURL+ZkMokuServiceVerifyProcedure,
			opts...,
		),
	}
}

// zkMokuServiceClient implements ZkMokuServiceClient.
type zkMokuServiceClient struct {
	healthCheck *connect_go.Client[proto.HealthCheckRequest, proto.HealthCheckResponse]
	setUp       *connect_go.Client[proto.SetUpRequest, proto.SetUpResponse]
	prove       *connect_go.Client[proto.ProveRequest, proto.ProveResponse]
	verify      *connect_go.Client[proto.VerifyRequest, proto.VerifyResponse]
}

// HealthCheck calls api.v1.ZkMokuService.HealthCheck.
func (c *zkMokuServiceClient) HealthCheck(ctx context.Context, req *connect_go.Request[proto.HealthCheckRequest]) (*connect_go.Response[proto.HealthCheckResponse], error) {
	return c.healthCheck.CallUnary(ctx, req)
}

// SetUp calls api.v1.ZkMokuService.SetUp.
func (c *zkMokuServiceClient) SetUp(ctx context.Context, req *connect_go.Request[proto.SetUpRequest]) (*connect_go.Response[proto.SetUpResponse], error) {
	return c.setUp.CallUnary(ctx, req)
}

// Prove calls api.v1.ZkMokuService.Prove.
func (c *zkMokuServiceClient) Prove(ctx context.Context, req *connect_go.Request[proto.ProveRequest]) (*connect_go.Response[proto.ProveResponse], error) {
	return c.prove.CallUnary(ctx, req)
}

// Verify calls api.v1.ZkMokuService.Verify.
func (c *zkMokuServiceClient) Verify(ctx context.Context, req *connect_go.Request[proto.VerifyRequest]) (*connect_go.Response[proto.VerifyResponse], error) {
	return c.verify.CallUnary(ctx, req)
}

// ZkMokuServiceHandler is an implementation of the api.v1.ZkMokuService service.
type ZkMokuServiceHandler interface {
	HealthCheck(context.Context, *connect_go.Request[proto.HealthCheckRequest]) (*connect_go.Response[proto.HealthCheckResponse], error)
	SetUp(context.Context, *connect_go.Request[proto.SetUpRequest]) (*connect_go.Response[proto.SetUpResponse], error)
	Prove(context.Context, *connect_go.Request[proto.ProveRequest]) (*connect_go.Response[proto.ProveResponse], error)
	Verify(context.Context, *connect_go.Request[proto.VerifyRequest]) (*connect_go.Response[proto.VerifyResponse], error)
}

// NewZkMokuServiceHandler builds an HTTP handler from the service implementation. It returns the
// path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewZkMokuServiceHandler(svc ZkMokuServiceHandler, opts ...connect_go.HandlerOption) (string, http.Handler) {
	mux := http.NewServeMux()
	mux.Handle(ZkMokuServiceHealthCheckProcedure, connect_go.NewUnaryHandler(
		ZkMokuServiceHealthCheckProcedure,
		svc.HealthCheck,
		opts...,
	))
	mux.Handle(ZkMokuServiceSetUpProcedure, connect_go.NewUnaryHandler(
		ZkMokuServiceSetUpProcedure,
		svc.SetUp,
		opts...,
	))
	mux.Handle(ZkMokuServiceProveProcedure, connect_go.NewUnaryHandler(
		ZkMokuServiceProveProcedure,
		svc.Prove,
		opts...,
	))
	mux.Handle(ZkMokuServiceVerifyProcedure, connect_go.NewUnaryHandler(
		ZkMokuServiceVerifyProcedure,
		svc.Verify,
		opts...,
	))
	return "/api.v1.ZkMokuService/", mux
}

// UnimplementedZkMokuServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedZkMokuServiceHandler struct{}

func (UnimplementedZkMokuServiceHandler) HealthCheck(context.Context, *connect_go.Request[proto.HealthCheckRequest]) (*connect_go.Response[proto.HealthCheckResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("api.v1.ZkMokuService.HealthCheck is not implemented"))
}

func (UnimplementedZkMokuServiceHandler) SetUp(context.Context, *connect_go.Request[proto.SetUpRequest]) (*connect_go.Response[proto.SetUpResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("api.v1.ZkMokuService.SetUp is not implemented"))
}

func (UnimplementedZkMokuServiceHandler) Prove(context.Context, *connect_go.Request[proto.ProveRequest]) (*connect_go.Response[proto.ProveResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("api.v1.ZkMokuService.Prove is not implemented"))
}

func (UnimplementedZkMokuServiceHandler) Verify(context.Context, *connect_go.Request[proto.VerifyRequest]) (*connect_go.Response[proto.VerifyResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("api.v1.ZkMokuService.Verify is not implemented"))
}