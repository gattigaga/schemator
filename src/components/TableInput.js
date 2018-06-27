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

export const Select = styled.select`
  background: #333;
  color: white;
  font-family: Roboto;
  font-size: 11px;
  outline: none;
  width: 100%;
  height: 24px;
`;

export const Input = styled.input`
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

export const CloseButton = styled(MdClose)`
  color: #444;
  font-size: 16px;
  padding: 8px;
  cursor: pointer;
`;

const Column = styled.div`
  flex: 1;
  padding: 4px;
`;

const TableInput = ({
  name,
  type,
  onClickRemove,
  onChangeName,
  onChangeType
}) => {
  const types = [
    "BINARY",
    "BOOLEAN",
    "CHAR",
    "DATE",
    "DATE_TIME",
    "DATE_TIME_TZ",
    "DECIMAL",
    "DOUBLE",
    "ENUM",
    "FLOAT",
    "INTEGER",
    "IP_ADDRESS",
    "JSON",
    "JSONB",
    "MAC_ADDRESS",
    "MORPHS",
    "NULLABLE_MORPHS",
    "STRING",
    "TEXT",
    "TIME",
    "TIME_TZ",
    "TIMESTAMP",
    "TIMESTAMP_TZ",
    "UUID"
  ];

  return (
    <Container>
      <Column>
        <Input type="text" value={name} onChange={onChangeName} />
      </Column>
      <Column>
        <Select value={type} onChange={onChangeType}>
          {types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </Column>
      <CloseButton onClick={onClickRemove} />
    </Container>
  );
};

TableInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  onClickRemove: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeType: PropTypes.func
};

export default TableInput;
