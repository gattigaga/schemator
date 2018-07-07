import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

import { getPathPoints } from "../helpers/layout";

const RelationLine = styled.path`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

export const RelationLines = ({ tables, fields, relations }) => {
  const byTableID = tableID => item => item.tableID === tableID;
  const byID = itemID => item => item.id === itemID;

  return (
    <g>
      {relations.map(relation => {
        const { fieldID, fromTableID, toTableID } = relation;
        const fieldIndex = fields
          .filter(byTableID(fromTableID))
          .findIndex(byID(fieldID));
        const fromTable = tables.find(byID(fromTableID));
        const toTable = tables.find(byID(toTableID));

        if (fromTable && toTable) {
          const { position: fPos } = fromTable;
          const { position: tPos } = toTable;
          const points = getPathPoints(fPos, tPos, fieldIndex);

          return <RelationLine key={relation.id} d={points} />;
        }

        return null;
      })}
    </g>
  );
};

RelationLines.propTypes = {
  tables: PropTypes.array,
  fields: PropTypes.array,
  relations: PropTypes.array
};

export const mapStateToProps = ({ tables, fields, relations }) => ({
  tables,
  fields,
  relations
});

export default connect(mapStateToProps)(RelationLines);
