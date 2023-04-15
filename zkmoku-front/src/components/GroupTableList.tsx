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
    v: 'v',
    d: 'd',
    c: 'c',
    a: 'a',
    zSig: 'zSig',
    zv: 'zv',
    cc: 'cc',
    m: 'm',
    zr: 'zr'
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
        write?.();
      }).catch((err) => { console.log(err) })
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Content</th>
          <th>Select Content</th>
          <th>Input Text</th>
          <th>Submit</th>
        </tr>
      </thead>
      <tbody>
        {groupList.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.content.join(', ')}</td>
            <td>
              <select value={selectedContent[index] || ''} onChange={(e) => handleSelectChange(e, index)}>
                <option value="" disabled>
                  Select...
                </option>
                {item.content.map((contentItem, contentIndex) => (
                  <option key={contentIndex} value={contentItem}>
                    {contentItem}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input type="text" value={addresses[index]} onChange={(e) => handleInputChange(e, index)} />
            </td>
            <td>
              <button onClick={() => handleSubmit(index)}>Submit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableList;
