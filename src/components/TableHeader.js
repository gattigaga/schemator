import React from "react";
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

const Caption = styled.p`
  color: white;
  font-size: 12px;
  font-family: Roboto;
  font-weight: bold;
  user-select: none;
`;

const TableHeader = ({ caption }) => (
  <Header>
    <Caption>{caption}</Caption>
  </Header>
);

TableHeader.propTypes = {
  caption: PropTypes.string
};

export default TableHeader;
