import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

const Container = styled.div`
  width: auto;
  padding: 4px 8px;
  background: #222;
  white-space: nowrap;
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  display: none;
  transition: all 0.1s;
`;

const Arrow = styled.div`
  width: 8px;
  height: 8px;
  background: #222;
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(-50%, -50%) rotate(45deg);
`;

const Text = styled.span`
  color: white;
  font-family: Roboto;
  font-size: 10px;
  font-weight: bold;
`;

const Tooltip = ({ text, className }) => (
  <Container className={className}>
    <Arrow />
    <Text>{text}</Text>
  </Container>
);

Tooltip.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

export default Tooltip;
