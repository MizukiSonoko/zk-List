package usecase

import (
	"context"

	b64 "encoding/base64"
	"encoding/json"

	"github.com/MizukiSonoko/zkproofs/go-ethereum/zkproofs"
	apiv1 "github.com/mizukisonoko/zkmoku/gen/proto"
)

func SetUp(ctx context.Context, req *apiv1.SetUpRequest) (*apiv1.SetUpResponse, error) {
	p, err := zkproofs.SetupSet(req.Ids)
	if err != nil {
		return nil, err
	}
	sigs := make(map[int64]interface{})
	for k, v := range p.Signatures {
		sigs[k] = v.Marshal()
	}
	jsonSigs, _ := json.Marshal(sigs)
	return &apiv1.SetUpResponse{
		H:         b64.StdEncoding.EncodeToString(p.H.Marshal()),
		Signature: b64.StdEncoding.EncodeToString(jsonSigs),
		KpPubk:    b64.StdEncoding.EncodeToString(p.Kp.Pubk.Marshal()),
	}, nil
}
