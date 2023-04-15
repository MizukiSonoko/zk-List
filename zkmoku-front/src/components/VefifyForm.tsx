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
    <ProofTableList tokenList={tokenList}/>
  );
}

export default VerifyForm;