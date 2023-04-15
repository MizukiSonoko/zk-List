import React, { useState, useEffect } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import { Token } from '@/types/Token';
import NextImage from 'next/image';

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
    <>
      {tokenList.map((item, index) => (
        <div
          key={index}
          className="p-6 my-3 bg-white border border-gray-200 rounded-lg shadow">
          <div className='flex justify-start'>
            <NextImage
              src={item.image}
              alt={item.name}
              width={50}
              height={50}
            />
            <h5 className="mx-4 mt-2 text-2xl font-bold tracking-tight text-gray-900">{item.name}</h5>
          </div>
          <p className="mb-3 font-normal text-gray-700">{item.description}</p>
          <div className='flex justify-end'>
            <button
              className="inline-flex items-end px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              onClick={() => handleSubmit(index)}>Verify It!</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default TableList;
