import React from 'react';
import styled from 'styled-components';

import Button from './Button';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const FieldWithButton = ({
  label,
  placeholder,
  value,
  onChange,
  handleSubmit,
}: Props) => (
  <Wrapper onSubmit={handleSubmit}>
    <InputField
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <Button onClick={handleSubmit}>{label || 'Submit'}</Button>
  </Wrapper>
);

const Wrapper = styled.form`
  display: flex;
`;

const InputField = styled.input`
  margin-right: 10px;
`;

export default FieldWithButton;
