// components/ProveRequestForm.tsx
import React, { useState } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';

type Signature = {
  id: number;
  signature: string;
};

const ProveForm: React.FC = () => {
  const [H, setH] = useState('');
  const [pub, setPub] = useState('');
  const [signature, setSignature] = useState('');
  const [val, setVal] = useState(0);
  const client = useClient(ZkMokuService);
  const [response, setResponse] = useState('');

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted ProveRequest:', { H, pub, signature, val });

    client
      .prove({
        H: H,
        pub: pub,
        signature: signature,
        val: BigInt(val),        
      })
      .then((resp) => {
        console.log("OK!", resp.toJsonString());
        setResponse(resp.toJsonString());
      }).catch((err) => { console.log(err) })
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="H">H:</label>
        <input
          id="H"
          type="text"
          value={H}
          onChange={(e) => setH(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="pub">pub:</label>
        <input
          id="pub"
          type="text"
          value={pub}
          onChange={(e) => setPub(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="sig">sig:</label>
        <input
          id="sig"
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="val">val:</label>
        <input
          id="val"
          type="number"
          value={val}
          onChange={(e) => setVal(parseInt(e.target.value))}
        />
      </div>
      <button type="submit">Submit</button>
      {response && <p>{response}</p>}
    </form>
  );
};

export default ProveForm;

/*
{"H":"IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=","signature":"eyIxNjM0MzAyNTgxIjoiRW16UUUwZ3REM0lpZVRxYlJ0M1NwY3Q2TjF3UytiQnVDMG5DOUFDL2Vib2lxeE1jTVpCcnBjODFqU3pqWjJGYWtMa3NkWGoyWVJhcjRzMHhhSHM4RkFmNmFBb0hYY2pod2xJdU9Ra0JacG9uNGhod0VvWHgxKy9XR0RlenBiTCtCdmc4RWlIN2o2bEhzcUZxa1FBUzhxWjhYMlF6N0NtNU12MzA5M1RWNTA0PSIsIjQ2OTkyMDUzODk4NSI6IkZwN0hhTTQwdVlRSVBWYk1qR2doRkQ1UlNxMWZ6akhtdVJpVVdISnRxcEFPZGVDQjVNRGFYenUrNVo2TUF4YnJab3hCdkFLcjVrcnR2RzNaU3lSTlNDU083ODhTN2xxaWdaaEJPc0lheTNGRzdGNXZJbmJaQUNWeHhxeGF0akRmR3kwdDl4SGdnOFZINTJmQlBwbk12VXY0aGFBYm5kYzZJSk44N1JSY2M0ST0iLCI1MDAwODU1MjA3NTEiOiJIQTdFcmZvRnliMmg1azEzY1B3aU1tSVBYb2FWRXpvaG9uTE10T01wRGN3YXhoaC92VjZnTEhoNUdDcTloOFJGMm1ZeStrV3p1a2ZKMFZWRWtEWGNZU1hFd2pFNlZtMWRjTnlBZTRmUDMxWG9MbE5NMVFVY0dvK3U3MTJPcm0zOEtzMGVKeVd1SWs3eHVPWW8vNkJiQnFQRVFHYll0N2V4OHJIdnBMWmlJUUE9In0=","KpPubk":"CvSHjD9bd52qs1sxTB9d+vDWtWHXlCzLPLGx61e22OUE5QX8jEg/7PNkHhR6cmrHqtIOXHvN5N2ERq0gfQY7/w=="}
*/