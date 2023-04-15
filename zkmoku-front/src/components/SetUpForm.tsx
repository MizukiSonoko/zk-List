// components/SetUpForm.tsx
import React, { use, useState } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import { asciiToBigInt, bigIntToAscii } from '@/utils/converters';
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { contractAddr } from '@/utils/contract';

const SetUpForm: React.FC = () => {
  const [names, setNames] = useState(['', '', '']);
  const [response, setResponse] = useState('');
  const client = useClient(ZkMokuService);

  const [groupName, setGroupName] = React.useState('')
  const [h, setH] = React.useState('')
  const [pub, setPub] = React.useState('')
  const [sig, setSig] = React.useState('')

  const { config } = usePrepareContractWrite({
    address: contractAddr,
    abi: ABI.abi,
    functionName: 'regiserGroup',
    args: [groupName, h, pub, sig],
    enabled: h.length != 0 && pub.length != 0 && sig.length != 0
  })
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  
  
  const handleNumberChange = (index: number, value: string) => {
    setNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = value;
      return newNames;
    });
  };

  const handleAddNumber = () => {
    setNames([...names, '']);
  };

  const handleRemoveNumber = () => {
    if (names.length > 1) {
      setNames(names.slice(0, -1));
    }
  };

  const handleWrite = () => {
    write?.();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted numbers:', names);
    client
      .setUp({
        ids: names.map((number) => asciiToBigInt(number)),
      })
      .then((resp) => {
        console.log("OK!", resp.toJsonString());
        setResponse(resp.toJsonString());
        setH(resp.H);
        setPub(resp.KpPubk);
        setSig(resp.signature);
      }).catch((err) => { console.log(err) })
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      GroupName: <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)} />
      <hr/>
      <table>
        <tbody>
          {names.map((name, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={handleAddNumber}>+</button>
      <button type="button" onClick={handleRemoveNumber}>-</button>
      <button type="submit">Submit</button>
      {response && <p>{response}</p>}
    </form>
      <button disabled={!write || isLoading} onClick={handleWrite}>
        {isLoading ? 'Minting...' : 'Mint'}
      </button>
    </>
  );
};

export default SetUpForm;
