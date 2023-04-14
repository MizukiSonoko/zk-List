import React, { useState } from 'react';

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
      <div className="p-2 black ">
        <label>SetUp Input:</label>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }

  if (activeTab === 'Prove') {
    return (
      <div>
        <label>Prove Input:</label>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
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