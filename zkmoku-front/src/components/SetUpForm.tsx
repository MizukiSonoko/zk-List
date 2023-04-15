// components/SetUpForm.tsx
import React, { use, useState } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import { asciiToBigInt, bigIntToAscii } from '@/utils/converters';
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { contractAddr } from '@/utils/contract';

interface SetUpResp {
  H: string;
  KpPubk: string;
  signature: string;
};

const SetUpForm: React.FC = () => {
  const [names, setNames] = useState(['', '', '']);
  const [response, setResponse] = useState<SetUpResp>({
    H: '',
    KpPubk: '',
    signature: ''    
  });
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
        setResponse(JSON.parse(resp.toJsonString()));
        setH(resp.H);
        setPub(resp.KpPubk);
        setSig(resp.signature);
      }).catch((err) => { console.log(err) })
  };

  return (
    <div className="w-full bg-gray-100 shadow px-8 py-4 max-w-lg mx-auto">
      <label className="font-bold text-xl" >CreateGroup</label>
      <p className="text-base">Create New Group with Some Elements</p>
      <br/>
      <form onSubmit={handleSubmit}>
      <div className='my-4'>
        <label htmlFor="group_name" className="block mb-2 text-base font-medium text-gray-900">Group Name</label>
        <input 
          type="text"
          id="group_name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)} />
      </div>
      <div className='mt-4 mb-1'>
        <label htmlFor="group_name" className="block mb-2 text-base font-medium text-gray-900">Group Elements</label>
        <table className="hover:table-auto w-full">
          <thead>
            <tr>
              <th>No.</th>
              <th>Elements</th>
            </tr>
          </thead>
          <tbody>
            {names.map((name, index) => (
              <tr key={index}>
                <td className='mx-4'>
                  {index + 1}
                </td>
                <td>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={name}
                    onChange={(e) => handleNumberChange(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-end'>
        <button className="rounded-md mx-2 px-3 py-1 bg-blue-200" type="button" onClick={handleAddNumber}>+</button>
        <button className="rounded-md px-3 py-1 bg-red-200" type="button" onClick={handleRemoveNumber}>-</button>
      </div>
      <hr className='my-3'/>
      <p className="text-right text-xs">Only SetUp. not send tx</p>
      <div className='my-1 flex justify-end'>
        <div>
          <button className="text-right rounded-md px-3 py-1 bg-blue-500 text-white font-bold" type="submit">MakeProof</button>
        </div>
      </div>
      {response.H.length !== 0 && 
        <div className='my-4 border-2 border-gray-300 p-2 break-words'>
          <p>H:</p>
          <p className="text-xs">{ response.H } </p>
          <br/>
          <p>KpPublicKey:</p>
          <p className="text-xs">{ response.KpPubk } </p>
          <br/>
          <p>signature:</p>
          <p className="text-xs">{ response.signature } </p>
        </div>
      }
    </form>
      <div className='my-4 flex justify-end'>
        <button 
          className="text-right rounded-md px-3 py-1 bg-red-500 text-white font-bold" disabled={!write || isLoading} onClick={handleWrite}>
          {isLoading ? 'Waiting...' : 'Register Group'}
        </button>
      </div>
    </div>
  );
};

export default SetUpForm;
