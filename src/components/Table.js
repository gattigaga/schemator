import React, { Children, forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MdClose } from "react-icons/lib/md";

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
  position: relative;
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

const CloseButton = styled(MdClose)`
  color: rgba(0, 0, 0, 0.3);
  font-size: 16px;
  padding: 8px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
`;

const Table = forwardRef(
  (
    {
      children,
      position,
      name,
      isActive,
      onChangeName,
      onClickRemove,
      onClickAddField,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    const { x, y } = position;
    const blockHeight = 36;
    const totalBlocks = Children.toArray(children).length + 2;
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
      >
        <Container isActive={isActive}>
          <Header>
            <HeaderInput type="text" value={name} onChange={onChangeName} />
            <CloseButton onClick={onClickRemove} />
          </Header>
          {children}
          <Button onClick={onClickAddField}>Add New Field</Button>
        </Container>
      </foreignObject>
    );
  }
);

Table.propTypes = {
  children: PropTypes.node,
  position: PropTypes.object,
  name: PropTypes.string,
  isActive: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClickRemove: PropTypes.func,
  onClickAddField: PropTypes.func,
  onChangeName: PropTypes.func,
};

Table.defaultProps = {
  name: "New Table",
};

export default Table;
