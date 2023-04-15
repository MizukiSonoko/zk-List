// components/SetUpForm.tsx
import React, { useState } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';

const VerifyForm: React.FC = () => {
  const client = useClient(ZkMokuService);
  const [response, setResponse] = useState('');

  const [H, setH] = useState('');
  const [pub, setPub] = useState('');
  const [V, setV] = useState('');
  const [D, setD] = useState('');
  const [C, setC] = useState('');
  const [A, setA] = useState('');
  const [Zsig, setZsig] = useState('');
  const [Zv, setZv] = useState('');
  const [Cc, setCc] = useState('');
  const [M, setM] = useState('');
  const [Zr, setZr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted VerifyRequest:', { H, pub, V, D, C, A, Zsig, Zv, Cc, M, Zr });
    client
      .verify({
        H, pub, V, D, C, A, Zsig, Zv, Cc, M, Zr
      })
      .then((resp) => {
        console.log("OK!", resp.toJsonString());
        setResponse(resp.toJsonString());
      }).catch((err) => { console.log(err) })
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        H:
        <input type="text" value={H} onChange={(e) => setH(e.target.value)} />
      </label>
      <br />
      <label>
        pub:
        <input type="text" value={pub} onChange={(e) => setPub(e.target.value)} />
      </label>
      <br />
      <label>
        V:
        <input type="text" value={V} onChange={(e) => setV(e.target.value)} />
      </label>
      <br />
      <label>
        D:
        <input type="text" value={D} onChange={(e) => setD(e.target.value)} />
      </label>
      <br />
      <label>
        C:
        <input type="text" value={C} onChange={(e) => setC(e.target.value)} />
      </label>
      <br />
      <label>
        A:
        <input type="text" value={A} onChange={(e) => setA(e.target.value)} />
      </label>
      <br />
      <label>
        Zsig:
        <input type="text" value={Zsig} onChange={(e) => setZsig(e.target.value)} />
      </label>
      <br />
      <label>
        Zv:
        <input type="text" value={Zv} onChange={(e) => setZv(e.target.value)} />
      </label>
      <br />
      <label>
        Cc:
        <input type="text" value={Cc} onChange={(e) => setCc(e.target.value)} />
      </label>
      <br />
      <label>
        M:
        <input type="text" value={M} onChange={(e) => setM(e.target.value)} />
      </label>
      <br />
      <label>
        Zr:
        <input type="text" value={Zr} onChange={(e) => setZr(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit</button>
      {response && <p>{response}</p>}
    </form>
  );
}

export default VerifyForm;