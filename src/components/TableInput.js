import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MdClose } from "react-icons/lib/md";

import "typeface-roboto";

const Container = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding: 0px 8px;
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
  margin-right: 8px;
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
    "BIG_INCREMENT",
    "BIGINT",
    "BLOB",
    "BOOLEAN",
    "CHAR",
    "DATE",
    "DATETIME",
    "DATETIME_TZ",
    "DECIMAL",
    "DOUBLE",
    "ENUM",
    "FLOAT",
    "INTEGER",
    "INCREMENT",
    "IP_ADDRESS",
    "JSON",
    "JSONB",
    "LONGTEXT",
    "MAC_ADDRESS",
    "MEDIUM_INCREMENT",
    "MEDIUMINT",
    "MEDIUMTEXT",
    "MORPHS",
    "NULLABLE_MORPHS",
    "NULLABLE_TIMESTAMP",
    "REMEMBER_TOKEN",
    "SMALL_INCREMENT",
    "SMALLINT",
    "SOFTDELETES",
    "STRING",
    "TEXT",
    "TIME",
    "TIME_TZ",
    "TINYINT",
    "TIMESTAMP",
    "TIMESTAMP_TZ",
    "TIMESTAMPS",
    "TIMESTAMPS_TZ",
    "UBIGINT",
    "UINT",
    "UMEDIUMINT",
    "USMALLINT",
    "UTINYINT",
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
