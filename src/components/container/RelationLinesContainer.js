import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RelationLines from "../presentational/RelationLines";

export const RelationLinesContainer = ({ tables, fields, relations }) => {
  const items = relations
    .map(relation => {
      const byTableID = tableID => item => item.tableID === tableID;
      const byID = itemID => item => item.id === itemID;

      const { fieldID, fromTableID, toTableID } = relation;
      // Table which contains foreign key
      const fromTable = tables.find(byID(fromTableID));
      // Table as a destination
      const toTable = tables.find(byID(toTableID));
      // Index of foreign key field
      const fieldIndex = fields
        .filter(byTableID(fromTableID))
        .findIndex(byID(fieldID));

      return { fromTable, toTable, fieldIndex };
    })
    .filter(({ fromTable, toTable }) => fromTable && toTable)
    .map(relation => {
      const { fromTable, toTable, fieldIndex } = relation;
      const { position: fromPos } = fromTable;
      const { position: toPos } = toTable;
      const tableWidth = 240;
      // Height of Table part (i.e. header, input or option)
      const chunkHeight = 36;

      const coordinate = {
        x1: toPos.x <= fromPos.x ? toPos.x + tableWidth : toPos.x,
        y1: toPos.y + chunkHeight / 2,
        x2: fromPos.x <= toPos.x ? fromPos.x + tableWidth : fromPos.x,
        y2: fromPos.y + chunkHeight * (fieldIndex + 1) + chunkHeight / 2
      };

      return coordinate;
    });

  return <RelationLines items={items} />;
};

RelationLinesContainer.propTypes = {
  tables: PropTypes.array,
  fields: PropTypes.array,
  relations: PropTypes.array
};

export const mapStateToProps = ({ tables, fields, relations }) => ({
  tables,
  fields,
  relations
});

export default connect(mapStateToProps)(RelationLinesContainer);
