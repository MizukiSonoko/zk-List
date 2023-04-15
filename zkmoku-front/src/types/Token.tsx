
export interface Token {
  name: string;
  description: string;
  image: string,
  proof: {
    h: string;
    kpPub: string;
    v: string;
    d: string;
    c: string;
    a: string;
    zSig: string;
    zv: string;
    cc: string;
    m: string;
    zr: string
  }
}
