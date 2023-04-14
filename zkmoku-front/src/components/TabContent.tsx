import React, { useState } from 'react';
import { SetupContainer } from '@/styles/setup';
import SetUpForm from '@/components/SetUpForm';
import ProveForm from '@/components/ProveForm';

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    console.log(`${activeTab} form submitted with value: ${inputValue}`);
  };

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
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }

  return null;
};
export default TabContent;