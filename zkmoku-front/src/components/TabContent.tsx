import React, { useState } from 'react';
import { SetupContainer } from '@/styles/setup';
import SetUpForm from '@/components/SetUpForm';
import ProveForm from '@/components/ProveForm';
import VerifyForm from './VefifyForm';

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {

  if (activeTab === 'SetUp') {
    return (
      <SetupContainer>
        <label className="name" >SetUp Group:</label><br/>
        <SetUpForm />
      </SetupContainer>
    );
  }

  if (activeTab === 'Prove') {
    return (
      <div>
        <label>Prove Input:</label>
        <ProveForm />
      </div>
    );
  }

  if (activeTab === 'Verify') {
    return (
      <div>
        <label>Verify Input:</label>
        <VerifyForm />
      </div>
    );
  }

  return null;
};
export default TabContent;