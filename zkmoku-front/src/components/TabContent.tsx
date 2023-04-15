import React, { useEffect, useState } from 'react';
import SetUpForm from '@/components/SetUpForm';
import ProveForm from '@/components/ProveForm';
import VerifyForm from './VefifyForm';
import { useAccount } from 'wagmi'
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { decodeBase64 } from '@/utils/base64';
import { contractAddr } from '@/utils/contract';
import { Token } from '@/types/Token';
import { ethers } from 'ethers';
import { useProvider } from 'wagmi';

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {

  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const provider = useProvider();

  useEffect(()=>{
    if (isConnected) {
      const zkMoku = new ethers.Contract(contractAddr, ABI.abi, provider);
    
      if(!loading) {
        setLoading(true);
        zkMoku.getTokenUrls(address).then((data: any) => {
          var tokenIds: BigInt[] = [];
          if (data){
            (data as unknown as BigInt[]).forEach((id) => {
              tokenIds.push(id);
            });
            var temp: Token[] = [];
            for (let i = 0; i < tokenIds.length; i++) {
              zkMoku.tokenURI(tokenIds[i]).then((data: any) => {
                if(data){
                  temp.push(JSON.parse(
                    decodeBase64((data as string).split('data:application/json;base64,')[1])));  
                }
              });
            }  
            setTokenList(temp);
          }
        }); 
        setLoading(false);
      }
    }
  }, [isConnected, address, loading, provider]);
  

  if (activeTab === 'SetUp') {
    return (
      <div className='p-4'>
        <SetUpForm />
      </div>
    );
  }

  if (activeTab === 'Prove') {
    return (
      <div className='p-4'>
        <ProveForm />
      </div>
    );
  }

  if (activeTab === 'Verify') {
    return (
      <div>
        <label>Verify Input:</label>
        <VerifyForm tokenList={tokenList}/>
      </div>
    );
  }

  return null;
};
export default TabContent;