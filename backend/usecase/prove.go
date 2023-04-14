package usecase

import (
	"context"
	"crypto/rand"
	b64 "encoding/base64"
	"math/big"

	"github.com/MizukiSonoko/zkproofs/go-ethereum/crypto/bn256"
	"github.com/MizukiSonoko/zkproofs/go-ethereum/zkproofs"
	apiv1 "github.com/mizukisonoko/zkmoku/gen/proto"
)

func Prove(ctx context.Context, req *apiv1.ProveRequest) (*apiv1.ProveResponse, error) {
	var r *big.Int
	r, _ = rand.Int(rand.Reader, bn256.Order)
	var pm = new(zkproofs.ParamsSet)
	var pubke = new(bn256.G1)
	var Hke = new(bn256.G2)
	newsigs := make(map[int64]*bn256.G2)
	var myk = new(bn256.G2)
	for _, sig := range req.Signatures {
		sSigs, _ := b64.StdEncoding.DecodeString(sig.Signature)
		newsigs[sig.Id], _ = myk.Unmarshal(sSigs)
	}
	sDec, _ := b64.StdEncoding.DecodeString(req.Pub)
	var val, _ = pubke.Unmarshal([]byte(sDec))
	var h = req.H
	sH, _ := b64.StdEncoding.DecodeString(h)
	var Hval, _ = Hke.Unmarshal([]byte(sH))
	pm.Kp.Pubk = val
	pm.H = Hval
	pm.Signatures = newsigs
	var value = req.Val
	proof_out, _ := zkproofs.ProveSet(value, r, *pm)

	return &apiv1.ProveResponse{
		V:    b64.StdEncoding.EncodeToString(proof_out.V.Marshal()),
		D:    b64.StdEncoding.EncodeToString(proof_out.D.Marshal()),
		C:    b64.StdEncoding.EncodeToString(proof_out.C.Marshal()),
		A:    b64.StdEncoding.EncodeToString(proof_out.A.Marshal()),
		Zsig: proof_out.Zsig.String(),
		Zv:   proof_out.Zv.String(),
		Cc:   proof_out.Cc.String(),
		M:    proof_out.M.String(),
		Zr:   proof_out.Zr.String(),
	}, nil
}
