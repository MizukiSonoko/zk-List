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
import { GroupItem } from '@/types/GroupItem';
import { bigIntToAscii } from '@/utils/converters';

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  const [verifyWalletAddr, setVerifyWalletAddr] = useState<string>("");

  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [groupList, setGroupList] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const provider = useProvider();

  useEffect(()=>{
      const zkMoku = new ethers.Contract(contractAddr, ABI.abi, provider);
      if(!loading && verifyWalletAddr.length !== 0) {
        setLoading(true);
        zkMoku.getGroups().then((data: any) => {
          console.log("data: ", data);
          var temp: GroupItem[] = [];
          (data as unknown as any).map((group: any) => {
            const decodedBase64 = decodeBase64(group.signature);
            const belongs: { key: string, value: string, name: string }[]=
              Object.entries(JSON.parse(decodedBase64)).
                map(([key, value]) => ({ key, value: value as string, name: "" }));
            temp.push({
              name: group.name,
              content: belongs.map((v: { key: string, value: string, name: string }) => bigIntToAscii(BigInt(v.key))),
              belongs: belongs.map((v: { key: string, value: string, name: string }) => 
                ({ key: v.key, value: v.value, name: bigIntToAscii(BigInt(v.key)) })),
              signature: group.signature,
              h: group.h,
              pub: group.kpPub,
            });
            setGroupList(temp);
          });
        });
        zkMoku.getTokenUrls(verifyWalletAddr).then((data: any) => {
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
  }, [isConnected, verifyWalletAddr, loading, provider]);
  

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
      <div className='p-4'>
        <VerifyForm setVerifyWalletAddr={setVerifyWalletAddr} groupList={groupList} tokenList={tokenList}/>
      </div>
    );
  }

  return null;
};
export default TabContent;