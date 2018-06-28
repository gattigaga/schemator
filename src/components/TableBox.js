import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

import TableHeader from "./TableHeader";
import TableButton from "./TableButton";
import TableInput from "./TableInput";
import TableOption from "./TableOption";

const Container = styled.div`
  width: 240px;
  background: #222;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  border: 2px solid #111;
`;

const TableBox = forwardRef(
  (
    {
      position,
      name,
      fields,
      options,
      onChangeName,
      onChangeFieldName,
      onChangeFieldType,
      onChangeOptions,
      onClickAddField,
      onClickRemoveField,
      onMouseDown,
      onMouseMove,
      onMouseEnter,
      onMouseLeave
    },
    ref
  ) => {
    const { x, y } = position;
    const headerHeight = 36;
    const buttonHeight = 36;
    const fieldHeight = 36 * fields.length;
    const optionHeight = 72;
    const height = headerHeight + buttonHeight + fieldHeight + optionHeight + 4;

    return (
      <foreignObject
        ref={ref}
        x={x}
        y={y}
        width={240}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Container>
          <TableHeader caption={name} onChangeCaption={onChangeName} />
          {fields.map(field => (
            <TableInput
              key={field.id}
              name={field.name}
              type={field.type}
              onChangeName={event => onChangeFieldName(event, field.id)}
              onChangeType={event => onChangeFieldType(event, field.id)}
              onClickRemove={() => onClickRemoveField(field.id)}
            />
          ))}
          <TableOption onChange={onChangeOptions} value={options} />
          <TableButton caption="Add New Field" onClick={onClickAddField} />
        </Container>
      </foreignObject>
    );
  }
);

TableBox.propTypes = {
  position: PropTypes.object,
  name: PropTypes.string,
  fields: PropTypes.array,
  options: PropTypes.object,
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClickAddField: PropTypes.func,
  onClickRemoveField: PropTypes.func,
  onChangeFieldName: PropTypes.func,
  onChangeFieldType: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeOptions: PropTypes.func
};

export default TableBox;
