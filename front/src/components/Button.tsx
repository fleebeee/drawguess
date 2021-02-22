import React from 'react';
import styled from 'styled-components';

const Button = ({ children, onClick, fontSize }) => (
  <Container onClick={onClick} fontSize={fontSize}>
    {children}
  </Container>
);

const Container = styled.button`
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 4px;
  color: var(--primary-300);
  background-color: var(--secondary-300);
  font-size: ${(props) => props.fontSize || 16}px;
`;

export default Button;
