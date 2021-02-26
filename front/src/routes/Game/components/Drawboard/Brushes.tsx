import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const sizes = [10, 20, 35];
const maxSize = sizes[sizes.length - 1];

const Brushes = ({ setBrushSize }) => {
  return (
    <Sizes>
      {sizes.map((size) => (
        <SizeWrapper key={size} onClick={() => setBrushSize(size)}>
          <Size size={size} />
        </SizeWrapper>
      ))}
    </Sizes>
  );
};

const Sizes = styled.div`
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  background-color: black;
  gap: 8px;
  padding: 6px;
  border-radius: 4px;
  height: 100%;
`;

const SizeWrapper = styled.div`
  border: 1px solid white;
  width: ${maxSize + 4}px;
  height: ${maxSize + 4}px;
  padding: 2px;
  border-radius: 2px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  & > * {
    cursor: pointer;
  }
`;

const Size = styled.div`
  border-radius: 100%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: white;
`;

export default Brushes;
