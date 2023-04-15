import React, { useState, useEffect } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import { GroupItem } from '@/types/GroupItem';
import { contractAddr } from '@/utils/contract';
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'

interface TableListProps {
  groupList: GroupItem[];
}

interface Proof {
  v: string;
  d: string;
  c: string;
  a: string;
  zSig: string;
  zv: string;
  cc: string;
  m: string;
  zr: string;
}

const TableList: React.FC<TableListProps> = ({groupList}) => {
  const [selectedContent, setSelectedContent] = useState<Array<string | undefined>>(Array(0).fill(undefined));
  const [addresses, setAddresses] = useState<Array<string>>(Array(0).fill(''));
  const [selectedAddress, setSelectedAddress] = useState(""); 
  
  const [groupId, setGroupId] = useState(0);
  const [proof, setProof] = useState<Proof>({
    v: '',
    d: '',
    c: '',
    a: '',
    zSig: '',
    zv: '',
    cc: '',
    m: '',
    zr: ''
  });
  
  const client = useClient(ZkMokuService);
  const { config } = usePrepareContractWrite({
    address: contractAddr,
    abi: ABI.abi,
    functionName: 'mintProof',
    args: [groupId, proof, selectedAddress],
    enabled:
      selectedAddress.length != 0 && proof.v.length != 0 &&
      proof.d.length != 0 && proof.c.length != 0 &&
      proof.a.length != 0 && proof.zSig.length != 0 &&
      proof.zv.length != 0 && proof.cc.length != 0 &&
      proof.m.length != 0 && proof.zr.length != 0
  })
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const newSelectedContent = [...selectedContent];
    newSelectedContent[index] = e.target.value;
    setSelectedContent(newSelectedContent);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newInputText = [...addresses];
    newInputText[index] = e.target.value;
    setAddresses(newInputText);
  };

  const handleSubmit = (index: number) => {
    console.log('Submitted:', {
      selectedContent: selectedContent[index],
      inputText: addresses[index],
      groupList: groupList[index],
      H: groupList[index].h,
      pub: groupList[index].pub,
      signature: groupList[index].signature,
      val: groupList[index].belongs.filter((item) => item.name === selectedContent[index]).map((item) => BigInt(item.key))[0],
    });

    client
      .prove({
        H: groupList[index].h,
        pub: groupList[index].pub,
        signature: groupList[index].signature,
        val: groupList[index].belongs.filter((item) => item.name === selectedContent[index]).map((item) => BigInt(item.key))[0],
      })
      .then((resp) => {
        console.log("resp", resp);
        setProof({
          v: resp.V,
          d: resp.D,
          c: resp.C,
          a: resp.A,
          zSig: resp.Zsig,
          zv: resp.Zv,
          cc: resp.Cc,
          m: resp.M,
          zr: resp.Zr
        })
        setGroupId(index);
        setSelectedAddress(addresses[index])
        // write?.();
      }).catch((err) => { console.log(err) })
  };

  const handleWrite = () => {
    write?.();
  }

  return (    
    <>
      <table className="hover:table-auto w-full rounded-sm">
        <thead className="text-xs py-2 text-black uppercase bg-gray-50">
          <tr>
            <th className="py-2">Name</th>
            <th>Elements</th>
            <th>Select Content</th>
            <th>Target Wallet Addr</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {groupList.map((item, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="text-center p-3">{item.name}</td>
              <td className="text-center" >{item.content.join(', ')}</td>
              <td>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                  value={selectedContent[index] || ''} onChange={(e) => handleSelectChange(e, index)}>
                  <option value="" disabled>
                    Select One
                  </option>
                  {item.content.map((contentItem, contentIndex) => (
                    <option key={contentIndex} value={contentItem}>
                      {contentItem}
                    </option>
                  ))}
                </select>
              </td>
              <td className='px-4'>
                <input 
                  className="shadow text-xs appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text" value={addresses[index]} onChange={(e) => handleInputChange(e, index)} />
              </td>
              <td className="text-center">
                <button
                  disabled={selectedContent[index] === undefined || addresses[index] === undefined}
                  className={`${
                    selectedContent[index] === undefined || addresses[index] === undefined ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 active:bg-blue-800'
                  } text-right rounded-md px-3 py-1 bg-blue-500 text-white font-bold`}
                  onClick={() => handleSubmit(index)}>Make Proof</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr/>
      {proof.v.length !== 0 && 
        <div className="mt-5">
          <p className="font-bold text-xl">Generated Proof</p>
          <div className='my-2 border-2 border-gray-300 p-2 break-words'>
            {Object.entries(proof).map(([key, value]) => (
              <div key={key}>
                <p>{key}:</p>
                <p className="text-xs mb-1">{value}</p>
              </div>
            ))}
          </div>
          <div className='my-4 flex justify-end'>
            <button 
              className="text-right rounded-md px-3 py-1 bg-red-500 text-white font-bold" disabled={!write || isLoading} onClick={handleWrite}>
              {isLoading ? 'Waiting...' : 'Mint Proof NFT'}
            </button>
          </div>
        </div>
      }
    </>
  );
};

export default TableList;
