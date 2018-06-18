import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

const Container = styled.div`
  background: #444;
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  cursor: pointer;
`;

const Caption = styled.p`
  color: white;
  font-size: 11px;
  font-family: Roboto;
  user-select: none;
`;

const TableButton = ({ caption, onClick }) => (
  <Container onClick={onClick}>
    <Caption>{caption}</Caption>
  </Container>
);

TableButton.propTypes = {
  caption: PropTypes.string,
  onClick: PropTypes.func
};

export default TableButton;
