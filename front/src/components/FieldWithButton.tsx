import React from 'react';
import styled from 'styled-components';

import Button from './Button';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (value?: string) => void;
}

const FieldWithButton = ({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
}: Props) => {
  const handleChange = (event) => {
    event.preventDefault();
    onChange(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.length > 0 && value.length < 256) {
      onSubmit();
    } else {
      console.error('Invalid field value', value);
    }
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <InputField
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      <Button onClick={handleSubmit}>{label || 'Submit'}</Button>
    </Wrapper>
  );
};

const Wrapper = styled.form`
  display: flex;
`;

const InputField = styled.input`
  margin-right: 10px;
`;

export default FieldWithButton;
