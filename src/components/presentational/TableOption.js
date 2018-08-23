import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

const Container = styled.div`
  width: 100%;
  height: 36px;
  padding: 0px 8px;
  box-sizing: border-box;
  background: #222;
  display: flex;
  align-items: center;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ isFirst }) => (isFirst ? 16 : 0)}px;
`;

const Label = styled.label`
  font-family: Roboto;
  font-size: 12px;
  color: white;
`;

export const Input = styled.input`
  outline: none;
  margin-right: 4px;
`;

class TableOption extends Component {
  shouldComponentUpdate(nextProps) {
    const { items } = this.props;

    const diffs = items.map((item, index) => {
      const nextItem = nextProps.items[index];
      const isCheckedDiff = nextItem.isChecked !== item.isChecked;

      return isCheckedDiff;
    });

    return diffs.includes(true);
  }

  render() {
    const { items, onChange } = this.props;

    return (
      <Container>
        {items.slice(0, 2).map((item, index) => (
          <Item key={item.id} isFirst={index === 0}>
            <Input
              type="checkbox"
              checked={item.isChecked}
              onChange={event => onChange(event, item.id)}
            />
            <Label>{item.label}</Label>
          </Item>
        ))}
      </Container>
    );
  }
}

TableOption.propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func
};

TableOption.defaultProps = {
  items: []
};

export default TableOption;
