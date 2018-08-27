import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Tooltip from "./Tooltip";

const StyledTooltip = styled(Tooltip)``;

const Container = styled.div`
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  cursor: pointer;
  user-select: none;
  position: relative;

  &:hover * {
    color: white;
  }

  &:hover ${StyledTooltip} {
    display: block;
  }
`;

const Tool = ({ icon, tooltip, onClick, isActive }) => {
  const StyledIcon = styled(icon)`
    margin: auto;
  `;

  return (
    <Container onClick={onClick}>
      {tooltip && <StyledTooltip text={tooltip} />}
      <StyledIcon size={24} color={isActive ? "white" : "#999"} />
    </Container>
  );
};

Tool.propTypes = {
  icon: PropTypes.func,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool
};

export default Tool;
