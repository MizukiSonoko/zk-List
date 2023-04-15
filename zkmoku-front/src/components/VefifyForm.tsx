// components/SetUpForm.tsx
import React, { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { decodeBase64 } from '@/utils/base64';
import { contractAddr } from '@/utils/contract';
import { Token } from '@/types/Token';
import ProofTableList from './ProofTableList';
import { ethers } from 'ethers';
import { useProvider } from 'wagmi';

interface ProofTableListProps {
  tokenList: Token[];
}

const VerifyForm: React.FC<ProofTableListProps> = ({tokenList}) => {
  return (
    <div className="w-full bg-gray-100 shadow px-8 py-4 max-w-xl mx-auto">
      <label className="font-bold text-xl" >I belong to a group of </label>
      <p className="text-base">Current Groups</p>
      <br/>
      <ProofTableList tokenList={tokenList}/>
    </div>
  );
}

export default VerifyForm;