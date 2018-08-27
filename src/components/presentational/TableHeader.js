import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

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

export const Caption = styled.input`
  color: white;
  border: 0px;
  width: 50%;
  outline: none;
  background: none;
  font-size: 12px;
  font-family: Roboto;
  font-weight: bold;
  text-align: center;
`;

class TableHeader extends Component {
  shouldComponentUpdate(nextProps) {
    const { caption } = this.props;

    return nextProps.caption !== caption;
  }

  render() {
    const { caption, onChangeCaption } = this.props;

    return (
      <Header>
        <Caption type="text" value={caption} onChange={onChangeCaption} />
      </Header>
    );
  }
}

TableHeader.propTypes = {
  caption: PropTypes.string,
  onChangeCaption: PropTypes.func
};

export default TableHeader;
