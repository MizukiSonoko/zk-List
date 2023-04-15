package usecase

import (
	"context"
	b64 "encoding/base64"
	"fmt"

	"github.com/MizukiSonoko/zkproofs/go-ethereum/crypto/bn256"
	"github.com/MizukiSonoko/zkproofs/go-ethereum/zkproofs"
	apiv1 "github.com/mizukisonoko/zkmoku/gen/proto"
)

type verifData struct {
	H   string `json:"H"`
	Pub string `json:"Pub"`

	A    string `json:"A"`
	C    string `json:"C"`
	Cc   string `json:"Cc"`
	D    string `json:"D"`
	M    string `json:"M"`
	V    string `json:"V"`
	Zr   string `json:"Zr"`
	Zsig string `json:"Zsig"`
	Zv   string `json:"Zv"`
}

func Verify(ctx context.Context, req *apiv1.VerifyRequest) (*apiv1.VerifyResponse, error) {
	var result bool

	var verifDataObject verifData
	verifDataObject.A = req.A
	verifDataObject.C = req.C
	verifDataObject.Cc = req.Cc
	verifDataObject.D = req.D
	verifDataObject.M = req.M
	verifDataObject.V = req.V
	verifDataObject.Zr = req.Zr
	verifDataObject.Zsig = req.Zsig
	verifDataObject.Zv = req.Zv
	verifDataObject.H = req.H
	verifDataObject.Pub = req.Pub

	var pm = new(zkproofs.ParamsSet)
	var pubke = new(bn256.G1)
	var pb = verifDataObject.Pub
	sDec, _ := b64.StdEncoding.DecodeString(pb)
	var val, _ = pubke.Unmarshal([]byte(sDec))
	pm.Kp.Pubk = val

	var Hke = new(bn256.G2)
	var h = verifDataObject.H
	sH, _ := b64.StdEncoding.DecodeString(h)
	var Hval, _ = Hke.Unmarshal([]byte(sH))
	pm.H = Hval

	var proof_out = new(zkproofs.ProofSet)

	var new_A = new(bn256.GT)
	var str = verifDataObject.A
	sstr, _ := b64.StdEncoding.DecodeString(str)
	var data, _ = new_A.Unmarshal([]byte(sstr))
	proof_out.A = data

	var new_V = new(bn256.G2)
	var strV = verifDataObject.V
	sstrV, _ := b64.StdEncoding.DecodeString(strV)
	var dataV, _ = new_V.Unmarshal([]byte(sstrV))
	proof_out.V = dataV

	var new_D = new(bn256.G2)
	var strD = verifDataObject.D
	sstrD, _ := b64.StdEncoding.DecodeString(strD)
	var dataD, _ = new_D.Unmarshal([]byte(sstrD))
	proof_out.D = dataD

	var new_C = new(bn256.G2)
	var strC = verifDataObject.C
	sstrC, _ := b64.StdEncoding.DecodeString(strC)
	var dataC, _ = new_C.Unmarshal([]byte(sstrC))
	proof_out.C = dataC

	proof_out.Zr = zkproofs.GetBigInt(verifDataObject.Zr)
	proof_out.Zsig = zkproofs.GetBigInt(verifDataObject.Zsig)
	proof_out.Zv = zkproofs.GetBigInt(verifDataObject.Zv)
	proof_out.Cc = zkproofs.GetBigInt(verifDataObject.Cc)

	// spew.Dump(proof_out)
	result, _ = zkproofs.VerifySet(proof_out, pm)
	fmt.Printf("result::%v", result)
	return &apiv1.VerifyResponse{
		Result: result,
	}, nil
}
