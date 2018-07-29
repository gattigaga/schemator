import React from "react";
import PropTypes from "prop-types";

import TableBox from "./TableBox";

const TableList = ({
  tables,
  fields,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  onClickAddField,
  onClickRemoveField,
  onChangeField,
  onChangeName,
  onChangeOptions
}) => (
  <g>
    {tables.map(table => {
      const byTableID = ({ tableID }) => tableID === table.id;
      const currentFields = fields.filter(byTableID);

      return (
        <TableBox
          key={table.id}
          ref={table.ref}
          {...table}
          fields={currentFields}
          options={table.options}
          onMouseDown={event => onMouseDown(event, table.id)}
          onMouseUp={event => onMouseUp(event, table.id)}
          onMouseMove={event => onMouseMove(event, table.id)}
          onMouseEnter={() => onMouseEnter(table.id)}
          onMouseLeave={() => onMouseLeave(table.id)}
          onContextMenu={() => onContextMenu(table.id)}
          onClickAddField={() => onClickAddField(table.id)}
          onClickRemoveField={onClickRemoveField}
          onChangeFieldName={(event, fieldID) =>
            onChangeField(event, fieldID, "name")
          }
          onChangeFieldType={(event, fieldID) =>
            onChangeField(event, fieldID, "type")
          }
          onChangeName={event => onChangeName(event, table.id)}
          onChangeOptions={(event, name) =>
            onChangeOptions(event, table.id, name)
          }
        />
      );
    })}
  </g>
);

TableList.propTypes = {
  tables: PropTypes.array,
  fields: PropTypes.array,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onContextMenu: PropTypes.func,
  onClickAddField: PropTypes.func,
  onClickRemoveField: PropTypes.func,
  onChangeField: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeOptions: PropTypes.func
};

export default TableList;
