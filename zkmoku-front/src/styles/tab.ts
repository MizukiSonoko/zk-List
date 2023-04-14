import styled from 'styled-components';

interface TabItemProps {
  active?: boolean;
}

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #dee2e6;
`;

export const TabItem = styled.div<TabItemProps>`
  padding: 1rem;
  cursor: pointer;
  color: ${(props) => (props.active ? '#495057' : '#6c757d')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  border-bottom: ${(props) => (props.active ? '3px solid #007bff' : 'none')};
`;