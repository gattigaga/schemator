import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Tooltip from "./Tooltip";

const StyledTooltip = styled(Tooltip)``;

const Container = styled.div`
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  border-radius: 4px;
  background: #555;
  margin: 4px;
  display: flex;
  cursor: pointer;
  user-select: none;
  position: relative;

  &:hover {
    background: "#eee";
  }

  &:hover ${StyledTooltip} {
    opacity: 1;
  }
`;

const Tool = ({ icon, tooltip, isDisabled, onClick }) => {
  const StyledIcon = styled(icon)`
    color: ${({ isDisabled }) => (isDisabled ? "#666" : "#aaa")};
    font-size: 24px;
    margin: auto;
  `;

  return (
    <Container onClick={() => !isDisabled && onClick()} isDisabled={isDisabled}>
      {tooltip && <StyledTooltip text={tooltip} />}
      <StyledIcon name={icon} isDisabled={isDisabled} />
    </Container>
  );
};

Tool.propTypes = {
  icon: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

export default Tool;
