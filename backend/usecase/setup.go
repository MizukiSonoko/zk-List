package usecase

import (
	"context"

	b64 "encoding/base64"

	"github.com/MizukiSonoko/zkproofs/go-ethereum/zkproofs"
	apiv1 "github.com/mizukisonoko/zkmoku/gen/proto"
)

func SetUp(ctx context.Context, req *apiv1.SetUpRequest) (*apiv1.SetUpResponse, error) {
	p, _ := zkproofs.SetupSet(req.Ids)
	sigs := make([]*apiv1.Signature, len(p.Signatures))
	for k, v := range p.Signatures {
		sigs[k] = &apiv1.Signature{
			Id:        k,
			Signature: b64.StdEncoding.EncodeToString(v.Marshal()),
		}
	}
	return &apiv1.SetUpResponse{
		H:          b64.StdEncoding.EncodeToString(p.H.Marshal()),
		Signatures: sigs,
		KpPubk:     b64.StdEncoding.EncodeToString(p.Kp.Pubk.Marshal()),
	}, nil
}
