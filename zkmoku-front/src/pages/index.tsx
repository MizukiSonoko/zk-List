import { ZkMokuService } from '@/proto/api_connectweb';
import { useClient } from '@/components/Backend/BackendProvider';
import React, { useState } from 'react';
import Header from '@/components/Header';
import TabSwitcher from '@/components/TabSwitcher';
import TabContent from '@/components/TabContent';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('SetUp');
  const client = useClient(ZkMokuService);
  client
    .healthCheck({})
    .then(({}) => {
      console.log("OK");
    }).catch((err) => { console.log(err) })
  return (
    <div className="bg-white">
      <Header />
      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent activeTab={activeTab} />
    </div>
  );
};

export default Home;