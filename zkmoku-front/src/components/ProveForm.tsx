// components/ProveRequestForm.tsx
import React, { useState } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import GroupTableList from '@/components/GroupTableList';
import { useContractRead } from 'wagmi'
import ABI from "@/contracts/ZkMoku.sol/ZkMoku.json";
import { decodeBase64 } from '@/utils/base64';
import { bigIntToAscii } from '@/utils/converters';
import { GroupItem } from '@/types/GroupItem';
import { contractAddr } from '@/utils/contract';

const ProveForm: React.FC = () => {
  const groupList: GroupItem[] = [];
  
  const { data, isError, isLoading, refetch } = useContractRead({
    address: contractAddr,
    abi: ABI.abi,
    functionName: 'getGroups',
    onSuccess: (data: any) => {
      console.log("data: ", data);
      (data as unknown as any).map((group: any) => {
        const decodedBase64 = decodeBase64(group.signature);
        const belongs: { key: string, value: string, name: string }[]=
          Object.entries(JSON.parse(decodedBase64)).
            map(([key, value]) => ({ key, value: value as string, name: "" }));
        groupList.push({
          name: group.name,
          content: belongs.map((v: { key: string, value: string, name: string }) => bigIntToAscii(BigInt(v.key))),
          belongs: belongs.map((v: { key: string, value: string, name: string }) => 
            ({ key: v.key, value: v.value, name: bigIntToAscii(BigInt(v.key)) })),
          signature: group.signature,
          h: group.h,
          pub: group.kpPub,
        });
      });    
    }
  });

  return (
    <GroupTableList groupList={groupList}/>
  );
};

export default ProveForm;

/*
{"H":"IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=","signature":"eyIxNjM0MzAyNTgxIjoiRW16UUUwZ3REM0lpZVRxYlJ0M1NwY3Q2TjF3UytiQnVDMG5DOUFDL2Vib2lxeE1jTVpCcnBjODFqU3pqWjJGYWtMa3NkWGoyWVJhcjRzMHhhSHM4RkFmNmFBb0hYY2pod2xJdU9Ra0JacG9uNGhod0VvWHgxKy9XR0RlenBiTCtCdmc4RWlIN2o2bEhzcUZxa1FBUzhxWjhYMlF6N0NtNU12MzA5M1RWNTA0PSIsIjQ2OTkyMDUzODk4NSI6IkZwN0hhTTQwdVlRSVBWYk1qR2doRkQ1UlNxMWZ6akhtdVJpVVdISnRxcEFPZGVDQjVNRGFYenUrNVo2TUF4YnJab3hCdkFLcjVrcnR2RzNaU3lSTlNDU083ODhTN2xxaWdaaEJPc0lheTNGRzdGNXZJbmJaQUNWeHhxeGF0akRmR3kwdDl4SGdnOFZINTJmQlBwbk12VXY0aGFBYm5kYzZJSk44N1JSY2M0ST0iLCI1MDAwODU1MjA3NTEiOiJIQTdFcmZvRnliMmg1azEzY1B3aU1tSVBYb2FWRXpvaG9uTE10T01wRGN3YXhoaC92VjZnTEhoNUdDcTloOFJGMm1ZeStrV3p1a2ZKMFZWRWtEWGNZU1hFd2pFNlZtMWRjTnlBZTRmUDMxWG9MbE5NMVFVY0dvK3U3MTJPcm0zOEtzMGVKeVd1SWs3eHVPWW8vNkJiQnFQRVFHYll0N2V4OHJIdnBMWmlJUUE9In0=","KpPubk":"CvSHjD9bd52qs1sxTB9d+vDWtWHXlCzLPLGx61e22OUE5QX8jEg/7PNkHhR6cmrHqtIOXHvN5N2ERq0gfQY7/w=="}
*/