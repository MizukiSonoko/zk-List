// components/SetUpForm.tsx
import React, { useState } from 'react';
import { useContractRead } from 'wagmi'
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { decodeBase64 } from '@/utils/base64';
import { contractAddr } from '@/utils/contract';
import { Token } from '@/types/Token';
import ProofTableList from './ProofTableList';




const VerifyForm: React.FC = () => {
  const tokenList: Token[] = [];


  const { data, isError, isLoading, refetch } = useContractRead({
    address: contractAddr,
    abi: ABI.abi,
    functionName: 'tokenURI',
    args:[1]
  })
  tokenList.push(JSON.parse(
    decodeBase64(data.split('data:application/json;base64,')[1])))

    
  const { data, isError, isLoading, refetch } = useContractRead({
    address: contractAddr,
    abi: ABI.abi,
    functionName: 'tokenURI',
    args:[1]
  })
  tokenList.push(JSON.parse(
    decodeBase64(data.split('data:application/json;base64,')[1])))

  return (
    <ProofTableList tokenList={tokenList}/>
  );
}

export default VerifyForm;