package usecase

import (
	"context"

	b64 "encoding/base64"

	"github.com/MizukiSonoko/zkproofs/go-ethereum/zkproofs"
	apiv1 "github.com/mizukisonoko/zkmoku/gen/proto"
)

func SetUp(ctx context.Context, req *apiv1.SetUpRequest) (*apiv1.SetUpResponse, error) {
	p, err := zkproofs.SetupSet(req.Ids)
	if err != nil {
		return nil, err
	}
	var sigs []*apiv1.Signature
	for k, v := range p.Signatures {
		// Memo: p.Signatures is map[int]*bn256.G1, not slice!
		sigs = append(sigs, &apiv1.Signature{
			Id:        k,
			Signature: b64.StdEncoding.EncodeToString(v.Marshal()),
		})
	}
	return &apiv1.SetUpResponse{
		H:          b64.StdEncoding.EncodeToString(p.H.Marshal()),
		Signatures: sigs,
		KpPubk:     b64.StdEncoding.EncodeToString(p.Kp.Pubk.Marshal()),
	}, nil
}
