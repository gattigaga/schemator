import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Field from "./Field";

const Container = styled.div`
  width: 240px;
  background: #222;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  border: 2px solid ${({ isActive }) => (isActive ? "#fff" : "#111")};
`;

const Header = styled.div`
  width: 100%;
  height: 32px;
  margin-bottom: 4px;
  background: #b33939;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const HeaderInput = styled.input`
  color: white;
  border: 0px;
  width: 50%;
  outline: none;
  background: none;
  font-size: 12px;
  font-family: "Roboto";
  font-weight: bold;
  text-align: center;
`;

const Button = styled.button`
  background: #444;
  border: 0px;
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  cursor: pointer;
  color: white;
  font-size: 11px;
  font-family: "Roboto";
  user-select: none;
  outline: none;

  &:hover {
    background: #333;
  }
`;

const Table = forwardRef(
  (
    {
      position,
      types,
      name,
      fields,
      isActive,
      onChangeName,
      onChangeFieldName,
      onChangeFieldType,
      onClickAddField,
      onClickRemoveField,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      onContextMenu,
    },
    ref
  ) => {
    const { x, y } = position;
    const blockHeight = 36;
    const totalBlocks = fields.length + 2;
    const height = blockHeight * totalBlocks + 4;

    return (
      <foreignObject
        ref={ref}
        x={x}
        y={y}
        width={240}
        height={height}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
      >
        <Container isActive={isActive}>
          <Header>
            <HeaderInput type="text" value={name} onChange={onChangeName} />
          </Header>
          {fields.map((field) => (
            <Field
              key={field.id}
              types={types}
              name={field.name}
              type={field.type}
              onChangeName={(event) => onChangeFieldName(event, field)}
              onChangeType={(event) => onChangeFieldType(event, field)}
              onClickRemove={() => onClickRemoveField(field)}
            />
          ))}
          <Button onClick={onClickAddField}>Add New Field</Button>
        </Container>
      </foreignObject>
    );
  }
);

Table.propTypes = {
  position: PropTypes.object,
  name: PropTypes.string,
  fields: PropTypes.array,
  isActive: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onContextMenu: PropTypes.func,
  onClickAddField: PropTypes.func,
  onClickRemoveField: PropTypes.func,
  onChangeFieldName: PropTypes.func,
  onChangeFieldType: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeOptions: PropTypes.func,
};

Table.defaultProps = {
  name: "New Table",
};

export default Table;
