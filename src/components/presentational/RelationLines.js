import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { getPathPoints } from "../../helpers/layout";

const RelationLine = styled.path`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const RelationLines = ({ items }) => (
  <Fragment>
    {items.map((item, index) => {
      const points = getPathPoints(item);

      return <RelationLine key={index} d={points} />;
    })}
  </Fragment>
);

RelationLines.propTypes = {
  items: PropTypes.array
};

export default RelationLines;
