import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const BGLine = styled.line`
  stroke: #3a3a3a;
  stroke-width: 1px;
  shape-rendering: crispEdges;
`;

const BGLines = ({ totalHorizontal, totalVertical, gap }) => (
  <>
    {[...Array(totalHorizontal)].map((_, index) => {
      const y = (index + 1) * gap;
      return <BGLine key={index} x1="0" y1={y} x2="100%" y2={y} />;
    })}
    {[...Array(totalVertical)].map((_, index) => {
      const x = (index + 1) * gap;
      return <BGLine key={index} x1={x} y1="0" x2={x} y2="100%" />;
    })}
  </>
);

BGLines.propTypes = {
  totalHorizontal: PropTypes.number,
  totalVertical: PropTypes.number,
  gap: PropTypes.number,
};

BGLines.defaultProps = {
  totalHorizontal: 170,
  totalVertical: 87,
  gap: 32,
};

export default BGLines;
