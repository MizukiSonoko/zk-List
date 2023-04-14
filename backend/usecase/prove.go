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

/*
{
	"H":"IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=",
	"signatures":[
		{"id":"1","signature":
		"JILgk0NhYYnSPuQOoZ8pvFrXWYhBsGC95zUIT8p5LKAIJTjd77Is4BsB9lYQfGXHFggXo8kjRgoRlFtr+5IZrCE1hcwiigDX7RcdzaOGQSqH+ablgcJOVPJ8lZDRKFGBGMwB5nLWVdWMtWYzaau3Jaq9VdcAiGsHcZ7nfIYkEEU="
		},
		{"id":"3","signature":"AR84ETY385KFI1v3ykOgSb7pA+mJcVPraahuy1F3s5IEGwBEMYdLIkG0vSmfrPXT6qbTIm0QQaxEvQrwzAuGyhGxfwivPyplxxDv+26eR8yUzhoToDyo0fOOACYBv1CwCVx1UEQkmuooD/0DEL0+pBrTm9Y9LKW0LpLyNV9P0U8="
		},
		{"id":"4","signature":"I25JGLJymwRwQHyrz9qvFdrRoPxQROXyjnib2yfp2QgB03AuMSXnK8aG0nxfbdYUiMUVvBrZ/MbttJILgZpoRhrKkf6VxBEQ1k0FEQaqdXJfuYFnRnkPMf2XV50+1jXHFPgZBJsBxzpsl+3+zT39BXuWHPHhWLAJldGlCy54TKU="}],"KpPubk":"DlDM44f47gmHOxv03H7xsangbXLB6McrrEEHOILt60oER5V/h3/vrNtxmtKKfaDaokoHuEHtbxRk4u2X2MZZ4Q=="}


{"V":"JYG8wQ7RlbXl0e4GarKiY2Jyw8ZsDkuuBcMF01Ug7/Aaz6Z2Xbe1zNsjBSEcmtVO6r/qt4wjxGrxl2FYGMT1KhuEMlESCCBchh439b8smSiJ1t1PH3ck0oK4701A2OPzErW3zG655I9/r88Ci31lUmtO3lStQyAIKYETF7SZ7AQ=","D":"K//ZysINjg752+ErJ2tTu3VcuADR4WQriy3TjgFJntcp6TTbv5+YaYqmcERvJ9Sl3hBtiXKhCtiTWCAw9wGTFgg7oGnw4oxppiklQG5H8gEnuIx+c5XCXXGOJLcCd0eyAMXTTRzXazGWS/eJzRauwBX4Un9K0DTOezkCdvnUKEs=","C":"A9WlyUpzOWK1ALF+9HTL6rrjIlReeP0ka4Z+nA4TUnIupJTjuW8nxaQ6ZLWpjoUezUZ3gcvvKxa+sBq0wVAB+gOy7fsbkXV85Lq671AM6LI2g/Osmm50diMQX+gbs0cCDp4/bWCn6MXoAueCEhmQbKS2Xf1YV1zTYb0K5fOQWho=","A":"DdUdntVvBntIZjO/xOCyrAwOSbQQsSMlGDLhYn7EAA4e07LVimfveWNSm0NDNPv1YSMB4bOWHivbkwOHDzrcIh72+c/Y1c8atqfQfkbZnktjJO+57PEcWcupQ5O5ZzsGBPMWdsOSVWyRr3gDFxPGE7pHAhPHorQJaTd4s1FnZwIl4oxMuGEADwKEkjOZbtghPlIv1SXQR7BkrU4IEc5+tQPKqkNY2RfflFhuxAVHtBWkxINSMZVwW8XFUCbLVjESLxZ90EPq7/0ofuavJjeNYDJJfQGHXF26+FNBcwG5gK0QzHJ8Hpsx1ve7H+RPh3mQUi5IIZ6MA5pi4NmGC7LD9ilVo61qBhxHBKniWEPRt9ftLvEEe6SGoAJMWedC5z5PDpoE3QPmSp5mogWBJ4VWD7gqpbsoO/xa0jK2do3r47AFqblYCWlJr9pPe28KlEWWBeqlqgwkMeNZju81PdHbbyafyseRhgQHESG22JHY1YGxyFpyG59aDul1NkvlqaWf","Zsig":"3633280120284388084151239116264511421512423848059637711488211249983309949100","Zv":"21548312798902315223629998917628978725899429134728630008114473771445913275972","Cc":"7427473865608125116953458470970231252314691536408409690718527916854367712817","M":"20113580901572808075537104012389254785392245389566405969145098112142519389120","Zr":"13993749384294727535662928151397328751607037268611011752277258569104228430893"}

*/
