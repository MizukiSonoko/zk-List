// components/SetUpForm.tsx
import React, { useState } from 'react';
import { useContractRead, useContractReads } from 'wagmi'
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { decodeBase64 } from '@/utils/base64';
import { contractAddr } from '@/utils/contract';
import { Token } from '@/types/Token';
import ProofTableList from './ProofTableList';

const VerifyForm: React.FC = () => {
  const tokenList: Token[] = [];
  const tokenIds: BigInt[] = [];
  const [loaded, setLoaded] = useState(false);
  {
    const { data } = useContractRead({
      address: contractAddr,
      abi: ABI.abi,
      functionName: 'getTokenUrls',
      args:["0xDB10E4a083B87e803594c12c679422dCe5FCCCB9"]
    })

    (data as unknown as BigInt[]).forEach((id) => {
      tokenIds.push(id);
    });
    for (let i = 0; i < tokenIds.length; i++) {
      const { data } = useContractRead({
        address: contractAddr,
        abi: ABI.abi,
        functionName: 'tokenURI',
        args: [tokenIds[i]],
      });
      tokenList.push(JSON.parse(
        decodeBase64(data.split('data:application/json;base64,')[1])));
    }
  }
 
  return (
    <ProofTableList tokenList={tokenList}/>
  );
}

export default VerifyForm;