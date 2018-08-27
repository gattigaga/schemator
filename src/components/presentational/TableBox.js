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
      types,
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
      onMouseUp,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      onContextMenu
    },
    ref
  ) => {
    const { x, y } = position;
    const headerHeight = 36;
    const buttonHeight = 36;
    const fieldHeight = 36 * fields.length;
    const optionHeight = 72;
    const height = headerHeight + buttonHeight + fieldHeight + optionHeight + 4;

    // Count total needed of TableOption
    const totalOptionChunks = Math.round(options.length / 2);

    // Split options into several chunks.
    // Each chunk contains 2 options.
    const optionChunks = [...Array(totalOptionChunks)].map((_, index) =>
      options.slice(index * 2, (index + 1) * 2)
    );

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
        <Container>
          <TableHeader caption={name} onChangeCaption={onChangeName} />
          {fields.map(field => (
            <TableInput
              key={field.id}
              types={types}
              name={field.name}
              type={field.type}
              onChangeName={event => onChangeFieldName(event, field.id)}
              onChangeType={event => onChangeFieldType(event, field.id)}
              onClickRemove={() => onClickRemoveField(field.id)}
            />
          ))}
          {optionChunks.map((chunk, index) => (
            <TableOption key={index} onChange={onChangeOptions} items={chunk} />
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
  options: PropTypes.array,
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
  onChangeOptions: PropTypes.func
};

export default TableBox;
