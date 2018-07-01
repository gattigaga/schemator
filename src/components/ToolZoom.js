import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Tooltip from "./Tooltip";

const StyledTooltip = styled(Tooltip)``;

const Container = styled.div`
  width: 64px;
  height: 32px;
  box-sizing: border-box;
  margin: 4px;
  display: flex;
  position: relative;

  &:hover ${StyledTooltip} {
    opacity: 1;
  }
`;

export const Select = styled.select`
  width: 64px;
  height: 32px;
  border-radius: 4px;
  border: 0px;
  background: #444;
  color: white;
  outline: none;
  cursor: pointer;

  &:disabled {
    color: #777;
  }
`;

const ToolZoom = ({ value, tooltip, isDisabled, onChange }) => {
  const items = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];

  return (
    <Container>
      {tooltip && <StyledTooltip text={tooltip} />}
      <Select value={value} onChange={onChange} disabled={isDisabled}>
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}%
          </option>
        ))}
      </Select>
    </Container>
  );
};

ToolZoom.propTypes = {
  value: PropTypes.func,
  tooltip: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

ToolZoom.defaultProps = {
  value: 100
};

export default ToolZoom;
