import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import "typeface-roboto";

const Container = styled.div`
  width: fit-content;
  padding: 4px 12px;
  background: #b33939;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #8e2929;
  }
`;

const Caption = styled.span`
  font-family: Roboto;
  font-size: 12px;
  color: white;
`;

const SmallButton = ({ className, caption, onClick }) => (
  <Container className={className} onClick={onClick}>
    <Caption>{caption}</Caption>
  </Container>
);

SmallButton.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.string,
  onClick: PropTypes.func
};

SmallButton.defaultProps = {
  caption: "Button"
};

export default SmallButton;
