package usecase

import (
	"context"
	b64 "encoding/base64"

	"github.com/MizukiSonoko/zkproofs/go-ethereum/crypto/bn256"
	"github.com/MizukiSonoko/zkproofs/go-ethereum/zkproofs"
	apiv1 "github.com/mizukisonoko/zkmoku/gen/proto"
)

func Verify(ctx context.Context, req *apiv1.VerifyRequest) (*apiv1.VerifyResponse, error) {
	var pm = new(zkproofs.ParamsSet)
	var pubke = new(bn256.G1)
	sDec, _ := b64.StdEncoding.DecodeString(req.Pub)
	var val, _ = pubke.Unmarshal([]byte(sDec))
	pm.Kp.Pubk = val

	var Hke = new(bn256.G2)
	sH, _ := b64.StdEncoding.DecodeString(req.H)
	var Hval, _ = Hke.Unmarshal([]byte(sH))
	pm.H = Hval

	var proof_out = new(zkproofs.ProofSet)

	var new_A = new(bn256.GT)
	sstr, _ := b64.StdEncoding.DecodeString(req.A)
	var data, _ = new_A.Unmarshal([]byte(sstr))
	proof_out.A = data

	var new_V = new(bn256.G2)
	sstrV, _ := b64.StdEncoding.DecodeString(req.V)
	var dataV, _ = new_V.Unmarshal([]byte(sstrV))
	proof_out.V = dataV

	var new_D = new(bn256.G2)
	sstrD, _ := b64.StdEncoding.DecodeString(req.D)
	var dataD, _ = new_D.Unmarshal([]byte(sstrD))
	proof_out.D = dataD

	var new_C = new(bn256.G2)
	sstrC, _ := b64.StdEncoding.DecodeString(req.C)
	var dataC, _ = new_C.Unmarshal([]byte(sstrC))
	proof_out.C = dataC

	proof_out.Zr = zkproofs.GetBigInt(req.Zr)
	proof_out.Zsig = zkproofs.GetBigInt(req.Zsig)
	proof_out.Zv = zkproofs.GetBigInt(req.Zv)
	proof_out.Cc = zkproofs.GetBigInt(req.Cc)

	result, _ := zkproofs.VerifySet(proof_out, pm)

	return &apiv1.VerifyResponse{
		Result: result,
	}, nil
}
