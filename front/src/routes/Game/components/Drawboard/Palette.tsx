import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const palette = [
  'aqua',
  'black',
  'blue',
  'fuchsia',
  'gray',
  '#eebb99',
  'green',
  'lime',
  'maroon',
  'navy',
  'olive',
  'purple',
  'red',
  'silver',
  'teal',
  'white',
  'yellow',
];

const Palette = ({ setColor }) => {
  return (
    <Colors>
      {palette.map((color) => (
        <Color key={color} color={color} onClick={() => setColor(color)} />
      ))}
    </Colors>
  );
};

const Colors = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 500px;

  margin-bottom: 10px;
`;

const colorSize = 20;
const Color = styled.div`
  width: ${colorSize}px;
  height: ${colorSize}px;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

export default Palette;
