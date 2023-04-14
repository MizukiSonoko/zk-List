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
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [val, setVal] = useState(0);
  const client = useClient(ZkMokuService);
  const [response, setResponse] = useState('');

  const handleAddSignature = () => {
    setSignatures([...signatures, { id: 0, signature: '' }]);
  };

  const handleRemoveSignature = (index: number) => {
    setSignatures(signatures.filter((_, i) => i !== index));
  };

  const handleSignatureChange = (index: number, field: keyof Signature, value: string | number) => {
    setSignatures((prevSignatures) => {
      const newSignatures = [...prevSignatures];
      newSignatures[index] = { ...newSignatures[index], [field]: value };
      return newSignatures;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted ProveRequest:', { H, pub, signatures, val });

    client
      .prove({
        H: H,
        pub: pub,
        signatures: signatures.map((signature) => ({
          id: BigInt(signature.id),
          signature: signature.signature,
        })),
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
        {signatures.map((signature, index) => (
          <div key={index}>
            <label htmlFor={`id-${index}`}>ID:</label>
            <input
              id={`id-${index}`}
              type="number"
              value={signature.id}
              onChange={(e) => handleSignatureChange(index, 'id', parseInt(e.target.value))}
            />
            <label htmlFor={`signature-${index}`}>Signature:</label>
            <input
              id={`signature-${index}`}
              type="text"
              value={signature.signature}
              onChange={(e) => handleSignatureChange(index, 'signature', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveSignature(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddSignature}>
          Add Signature
        </button>
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
