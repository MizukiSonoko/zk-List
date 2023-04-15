import React, { useState, useEffect } from 'react';
import { useClient } from '@/components/Backend/BackendProvider';
import { ZkMokuService } from '@/proto/api_connectweb';
import { Token } from '@/types/Token';
import NextImage from 'next/image';
import { GroupItem } from '@/types/GroupItem';
import Modal from './ResultModal';

interface ProofTableListProps {
  targetAddr: string;
  tokenList: Token[];
  groupList: GroupItem[];
}

const TableList: React.FC<ProofTableListProps> = ({tokenList, groupList}) => {
  const [selectedContent, setSelectedContent] = useState(-1); 
  const [result, setResult] = useState('');  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const client = useClient(ZkMokuService);

  const getElements = (kpPub: string) => {
    const gi =  groupList.filter((item) => item.pub === kpPub).at(0);
    return gi ? gi.content.join(", ") : "";
  }
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
          setResult("🎉 Belong! Congratulations! 🎉");
        } else {
          setResult("not belong");
        }
        setIsModalOpen(true);
      }).catch((err) => { console.log(err) })
  };

  const handlePreView = (index: number) => {
    if(selectedContent === index) {
      setSelectedContent(-1);
    }else{
      setSelectedContent(index);
    }
  }

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
          <div className='flex justify-start'>
            <p>{getElements(item.proof.kpPub)}</p>
          </div>
          <div className='flex justify-end my-2'>
            <button
              className="inline-flex items-end px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              onClick={() => handleSubmit(index)}>Verify It!</button>
          </div>
          <hr/>
          <div className='flex justify-end my-2'>
            <button onClick={() => handlePreView(index)}>view meta data</button>
          </div>
          {
            selectedContent === index &&
            <div className='flex justify-start'>
              <div className='my-2 border-2 border-gray-300 p-2 text-xs break-all'>
                {JSON.stringify(item, null , "\t")}
              </div>
            </div>
          }
        </div>
      ))}
      <Modal result={result} isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
        <p>Modal Content</p>
        <button
          onClick={handleCloseModal}
          className="bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Close Modal
        </button>
      </Modal>
    </>
  );
};

export default TableList;
