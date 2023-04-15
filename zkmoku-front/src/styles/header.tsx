import styled from 'styled-components';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;

  .login-btn {
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    font-weight: bold;
    border-radius: 0.25rem;
  }

  .login-btn:hover {
    background-color: #0069d9;
  }
`;