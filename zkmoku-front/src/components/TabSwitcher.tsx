import React from 'react';
import { TabContainer, TabItem } from '../styles/tab';

interface TabSwitcherProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, setActiveTab }) => {
  return (
    <TabContainer>
      <TabItem active={activeTab === 'SetUp'} onClick={() => setActiveTab('SetUp')}>
        SetUp
      </TabItem>
      <TabItem active={activeTab === 'Prove'} onClick={() => setActiveTab('Prove')}>
        Prove
      </TabItem>
      <TabItem active={activeTab === 'Verify'} onClick={() => setActiveTab('Verify')}>
        Verify
      </TabItem>
    </TabContainer>
  );
};

export default TabSwitcher;