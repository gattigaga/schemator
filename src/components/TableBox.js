import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

import TableHeader from "./TableHeader";
import TableButton from "./TableButton";
import TableInput from "./TableInput";

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
      onChangeName,
      onChangeFieldName,
      onChangeFieldType,
      onClickAddField,
      onClickRemoveField,
      onMouseDown,
      onMouseMove
    },
    ref
  ) => {
    const { x, y } = position;
    const headerHeight = 36;
    const buttonHeight = 36;
    const fieldHeight = 36 * fields.length;
    const height = headerHeight + buttonHeight + fieldHeight + 4;

    return (
      <foreignObject
        ref={ref}
        x={x}
        y={y}
        width={240}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        <Container>
          <TableHeader caption={name} onChangeCaption={onChangeName} />
          {fields.map((field, index) => (
            <TableInput
              key={field.id}
              name={field.name}
              type={field.type}
              onChangeName={event => onChangeFieldName(event, field.id)}
              onChangeType={event => onChangeFieldType(event, field.id)}
              onClickRemove={() => onClickRemoveField(field.id)}
            />
          ))}
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
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  onClickAddField: PropTypes.func,
  onClickRemoveField: PropTypes.func,
  onChangeFieldName: PropTypes.func,
  onChangeFieldType: PropTypes.func,
  onChangeName: PropTypes.func
};

TableBox.defaultProps = {
  position: { x: 32, y: 32 },
  name: "ModelName",
  fields: [
    {
      name: "id",
      type: "INCREMENT"
    }
  ]
};

export default TableBox;
