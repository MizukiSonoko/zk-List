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
import { GroupItem } from '@/types/GroupItem';

interface ProofTableListProps {
  tokenList: Token[];
  groupList: GroupItem[];
  setVerifyWalletAddr: (addr: string) => void;
}

const VerifyForm: React.FC<ProofTableListProps> = ({tokenList,groupList,setVerifyWalletAddr}) => {
  const [walletAddr, setWalletAddr] = useState<string>("");


  useEffect(
    () => setVerifyWalletAddr(walletAddr),
    [setVerifyWalletAddr, walletAddr]
  );

  const { address } = useAccount();

  return (
    <div className="w-full bg-gray-100 shadow px-8 py-4 max-w-3xl mx-auto">
      <label className="font-bold text-xl mb-4" >Verify NFT</label>
      <p className='py-3'>Input Target Wallet Addr or <button 
        className="bg-gray-200 py-1 px-2 rounded hover:bg-gray-300"
        onClick={() => setWalletAddr(address!)}
      >Input Own Address</button></p>
      <input 
          type="text"
          id="group_name"
          className="shadow appearance-none border rounded w-1/2 py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={walletAddr}
          onChange={(e) => setWalletAddr(e.target.value)} />          
      <p className="text-base">Current Groups</p>
      <br/>
      <ProofTableList targetAddr={walletAddr} groupList={groupList} tokenList={tokenList}/>
    </div>
  );
}

export default VerifyForm;