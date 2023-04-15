import React, { useState, useEffect } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import { Token } from '@/types/Token';
import { contractAddr } from '@/utils/contract';
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'

interface ProofTableListProps {
  tokenList: Token[];
}

const TableList: React.FC<ProofTableListProps> = ({tokenList}) => {
  const [selectedContent, setSelectedContent] = useState<Array<string | undefined>>(Array(0).fill(undefined));  
  const [result, setResult] = useState('');  

  const client = useClient(ZkMokuService);

  const handleSubmit = (index: number) => {
    client
      .verify({
        H: tokenList[index].proof.h,
        pub: tokenList[index].proof.kpPub,
        V: tokenList[index].proof.v,
        D: tokenList[index].proof.d,
        C: tokenList[index].proof.c,
        A: tokenList[index].proof.a,
        Zsig: tokenList[index].proof.zSig,
        Zv: tokenList[index].proof.zv,
        Cc: tokenList[index].proof.cc,
        M: tokenList[index].proof.m,
        Zr: tokenList[index].proof.zr,
      })
      .then((resp) => {
        console.log("resp", resp);
        if(resp) {
          setResult("belong");
        } else {
          setResult("not belong");
        }
      }).catch((err) => { console.log(err) })
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Content</th>
          <th>Submit</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {tokenList.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>
              <button onClick={() => handleSubmit(index)}>Submit</button>
            </td>
            <td>{result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableList;
