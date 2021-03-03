import React from 'react';
import styled from 'styled-components';

import Button from './Button';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (value: string) => void;
}

const FieldWithButton = ({
  label,
  placeholder,
  value,
  onChange,
  handleSubmit,
}: Props) => {

  const handleChange = (event) => {
    event.preventDefault();
    onChange(event.target.value);
  }

  const handleClick = (event) => {
    event.preventDefault();
    handleSubmit(value);
  }

  return (
  <Wrapper onSubmit={handleClick}>
    <InputField
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
    <Button onClick={handleClick}>{label || 'Submit'}</Button>
  </Wrapper>
);}

const Wrapper = styled.form`
  display: flex;
`;

const InputField = styled.input`
  margin-right: 10px;
`;

export default FieldWithButton;
