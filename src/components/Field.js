import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MdClose } from "react-icons/lib/md";

import "typeface-roboto";

const Container = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding: 0px 4px;
  box-sizing: border-box;
`;

const Select = styled.select`
  background: #333;
  color: white;
  font-family: Roboto;
  font-size: 11px;
  outline: none;
  width: 100%;
  height: 24px;
  cursor: pointer;

  &:disabled {
    color: #777;
    border-color: #333;
    cursor: auto;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 24px;
  color: white;
  background: #111;
  border: 0px;
  outline: none;
  font-family: Roboto;
  font-size: 12px;
  box-sizing: border-box;
  padding: 0px 8px;
`;

const CloseButton = styled(MdClose)`
  color: #444;
  font-size: 16px;
  padding: 8px;
  cursor: pointer;
`;

const Column = styled.div`
  flex: 1;
  padding: 4px;
`;

const Field = ({
  name,
  type,
  types,
  onClickRemove,
  onChangeName,
  onChangeType,
  isTypeDisabled,
}) => (
  <Container>
    <Column>
      <Input type="text" value={name} onChange={onChangeName} />
    </Column>
    <Column>
      <Select value={type} onChange={onChangeType} disabled={isTypeDisabled}>
        {types.map((type) => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </Select>
    </Column>
    <CloseButton onClick={onClickRemove} />
  </Container>
);

Field.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  types: PropTypes.array,
  onClickRemove: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeType: PropTypes.func,
  isTypeDisabled: PropTypes.bool,
};

Field.defaultProps = {
  name: "field",
  types: [],
};

export default Field;
