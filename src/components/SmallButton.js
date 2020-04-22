import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import "typeface-roboto";

const Button = styled.button`
  width: fit-content;
  border: 0px;
  padding: 6px 12px 4px 12px;
  background: #b33939;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  font-family: "Roboto";
  font-size: 12px;
  color: ${({ isDisabled }) => (isDisabled ? "#999" : "white")};

  ${({ isDisabled }) => {
    if (isDisabled) {
      return `
        background: #555;
        cursor: not-allowed;
      `;
    }

    return `
      &:hover {
        background: #8e2929;
      }
    `;
  }}
`;

const SmallButton = ({ className, caption, isDisabled, onClick }) => (
  <Button
    className={className}
    onClick={!isDisabled ? onClick : null}
    isDisabled={isDisabled}
  >
    {caption}
  </Button>
);

SmallButton.propTypes = {
  className: PropTypes.string,
  caption: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

SmallButton.defaultProps = {
  caption: "Button",
};

export default SmallButton;
