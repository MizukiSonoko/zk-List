// components/SetUpForm.tsx
import React, { useState } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { decodeBase64 } from '@/utils/base64';
import { contractAddr } from '@/utils/contract';
import { Token } from '@/types/Token';
import ProofTableList from './ProofTableList';

const VerifyForm: React.FC = () => {
  const tokenList: Token[] = [];
  const tokenIds: BigInt[] = [];
  const { address, isConnected } = useAccount();
  if (isConnected) {
    const { data } = useContractRead({
      address: contractAddr,
      abi: ABI.abi,
      functionName: 'getTokenUrls',
      args:[address]
    })
    console.log("data1", data);
    if (data){
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
        console.log("tokenURI data", data);
        if(data){
          tokenList.push(JSON.parse(
            decodeBase64((data as string).split('data:application/json;base64,')[1])));  
        }
      }  
    }
  }
 
  return (
    <ProofTableList tokenList={tokenList}/>
  );
}

export default VerifyForm;