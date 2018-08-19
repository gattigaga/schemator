import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import "typeface-roboto";

const Container = styled.div`
  width: fit-content;
  padding: 4px 12px;
  background: #b33939;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  ${({ isDisabled }) =>
    !isDisabled
      ? css`
          &:hover {
            background: #8e2929;
          }
        `
      : css`
          background: #555;
          cursor: not-allowed;
        `};
`;

export const Caption = styled.span`
  font-family: Roboto;
  font-size: 12px;
  color: ${({ isDisabled }) => (isDisabled ? "#999" : "white")};
`;

const SmallButton = ({ className, caption, isDisabled, onClick }) => (
  <Container
    className={className}
    onClick={!isDisabled ? onClick : null}
    isDisabled={isDisabled}
  >
    <Caption isDisabled={isDisabled}>{caption}</Caption>
  </Container>
);

SmallButton.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func
};

SmallButton.defaultProps = {
  caption: "Button"
};

export default SmallButton;
