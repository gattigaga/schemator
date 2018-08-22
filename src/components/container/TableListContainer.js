import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { updateProject } from "../../store/actions/project";
import { updateTable } from "../../store/actions/tables";
import { addField, updateField, removeField } from "../../store/actions/fields";
import { setRelations } from "../../store/actions/relations";
import TableList from "../presentational/TableList";

class TableListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: {
        x: 0,
        y: 0
      }
    };

    this.activeTable = null;

    this.updateTableName = this.updateTableName.bind(this);
    this.updateTablePosition = this.updateTablePosition.bind(this);
    this.updateTableOptions = this.updateTableOptions.bind(this);
    this.getMousePosition = this.getMousePosition.bind(this);
    this.saveTableOffset = this.saveTableOffset.bind(this);
    this.updateField = this.updateField.bind(this);
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
  }

  /**
   * Get mouse position in SVG coordinate system.
   *
   * @param {object} event DOM event.
   * @returns {object} Mouse position.
   * @memberof WorkArea
   */
  getMousePosition(event) {
    const { areaRef } = this.props;
    const ctm = areaRef.current.getScreenCTM();

    return {
      x: (event.clientX - ctm.e) / ctm.a,
      y: (event.clientY - ctm.f) / ctm.d
    };
  }

  /**
   * Save table offset from the top left of object.
   *
   * @param {object} event DOM event.
   * @param {string} tableID ID of dragged table.
   * @memberof WorkArea
   */
  saveTableOffset(event, tableID) {
    const { tables } = this.props;
    const byID = item => item.id === tableID;
    this.activeTable = tables.find(byID).ref;

    if (this.activeTable && this.activeTable.current) {
      const getAttributeNS = attr => {
        const value = this.activeTable.current.getAttributeNS(null, attr);
        return parseFloat(value);
      };
      const offset = this.getMousePosition(event);

      offset.x -= getAttributeNS("x");
      offset.y -= getAttributeNS("y");

      this.setState({ offset });
    }
  }

  /**
   * Update field data inside a table.
   *
   * @param {object} event DOM event.
   * @param {string} fieldID ID of updated field.
   * @param {string} type Input type ('name' or 'type').
   * @memberof WorkArea
   */
  updateField(event, fieldID, type) {
    const { value } = event.target;
    const updatedData = { [type]: value };
    const {
      tables,
      fields,
      plugin,
      modifyProject,
      modifyField,
      applyRelations
    } = this.props;
    const { onUpdate } = plugin.main;
    const newFields = fields.map(field => {
      if (field.id === fieldID) {
        return { ...field, ...updatedData };
      }

      return field;
    });

    const data = {
      tables,
      fields: newFields
    };

    const relations = onUpdate(data) || [];

    applyRelations(relations);
    modifyField(fieldID, updatedData);
    modifyProject({ isModified: true });
  }

  /**
   * Add new field inside table.
   *
   * @param {string} tableID ID of table which contains this field
   * @memberof WorkArea
   */
  addField(tableID) {
    const {
      tables,
      fields,
      modifyProject,
      createField,
      plugin,
      applyRelations
    } = this.props;
    const { onCreateField, onUpdate } = plugin.main;
    const field = onCreateField(tableID);

    if (field) {
      const newFields = [...fields, field];
      const data = {
        tables,
        fields: newFields
      };
      const relations = onUpdate(data) || [];

      applyRelations(relations);
      createField(field);
      modifyProject({ isModified: true });
    }
  }

  /**
   * Remove an existing field.
   *
   * @param {string} fieldID ID of field which would be removed.
   * @memberof WorkArea
   */
  removeField(fieldID) {
    const {
      tables,
      fields,
      plugin,
      modifyProject,
      deleteField,
      applyRelations
    } = this.props;
    const { onUpdate } = plugin.main;
    const newFields = fields.filter(item => item.id !== fieldID);

    const data = {
      tables,
      fields: newFields
    };

    const relations = onUpdate(data) || [];

    applyRelations(relations);
    deleteField(fieldID);
    modifyProject({ isModified: true });
  }

  /**
   * Update table name.
   *
   * @param {object} event DOM event.
   * @param {string} tableID ID of updated table.
   * @memberof WorkArea
   */
  updateTableName(event, tableID) {
    const { value } = event.target;
    const updatedData = { name: value };
    const {
      tables,
      fields,
      plugin,
      modifyProject,
      modifyTable,
      applyRelations
    } = this.props;
    const { onUpdate } = plugin.main;
    const newTables = tables.map(table => {
      if (table.id === tableID) {
        return { ...table, ...updatedData };
      }

      return table;
    });

    const data = {
      tables: newTables,
      fields
    };

    const relations = onUpdate(data) || [];

    applyRelations(relations);
    modifyTable(tableID, updatedData);
    modifyProject({ isModified: true });
  }

  /**
   * Update table position.
   *
   * @param {object} event DOM event.
   * @param {string} tableID ID of updated table.
   * @memberof WorkArea
   */
  updateTablePosition(event, tableID) {
    const { offset } = this.state;
    const { modifyProject, modifyTable } = this.props;

    if (this.activeTable && this.activeTable.current) {
      event.preventDefault();

      const activeTableDOM = this.activeTable.current;
      const coord = this.getMousePosition(event);
      const x = coord.x - offset.x;
      const y = coord.y - offset.y;

      activeTableDOM.setAttributeNS(null, "x", x);
      activeTableDOM.setAttributeNS(null, "y", y);

      modifyProject({ isModified: true });
      modifyTable(tableID, {
        position: { x, y }
      });
    }
  }

  /**
   * Update table options.
   *
   * @param {object} event DOM event.
   * @param {string} tableID ID of updated table.
   * @param {string} optionID ID of updated option.
   * @memberof WorkArea
   */
  updateTableOptions(event, tableID, optionID) {
    const { tables, modifyProject, modifyTable } = this.props;
    const table = tables.find(item => item.id === tableID);

    if (table) {
      modifyProject({ isModified: true });
      modifyTable(tableID, {
        options: table.options.map(option => {
          if (option.id === optionID) {
            return {
              ...option,
              isChecked: event.target.checked
            };
          }

          return option;
        })
      });
    }
  }

  render() {
    const { tables, fields, menuItems, onContextMenu, plugin } = this.props;
    const [menuAddTable, menuRemoveTable, menuAddField] = menuItems;
    const types = plugin ? plugin.main.fieldTypes : [];

    return (
      <TableList
        tables={tables}
        fields={fields}
        types={types}
        onContextMenu={onContextMenu}
        onMouseDown={this.saveTableOffset}
        onMouseUp={() => {
          this.activeTable = null;
        }}
        onMouseMove={this.updateTablePosition}
        onMouseEnter={() => {
          if (menuAddTable) {
            menuAddTable.visible = false;
          }

          if (menuRemoveTable) {
            menuRemoveTable.visible = true;
          }

          if (menuAddField) {
            menuAddField.visible = true;
          }
        }}
        onMouseLeave={() => {
          this.activeTable = null;

          if (menuAddTable) {
            menuAddTable.visible = true;
          }

          if (menuRemoveTable) {
            menuRemoveTable.visible = false;
          }

          if (menuAddField) {
            menuAddField.visible = false;
          }
        }}
        onClickAddField={this.addField}
        onClickRemoveField={this.removeField}
        onChangeField={this.updateField}
        onChangeName={this.updateTableName}
        onChangeOptions={this.updateTableOptions}
      />
    );
  }
}

TableListContainer.propTypes = {
  tables: PropTypes.array,
  fields: PropTypes.array,
  plugin: PropTypes.object,
  menuItems: PropTypes.array,
  areaRef: PropTypes.object,
  modifyProject: PropTypes.func,
  createField: PropTypes.func,
  deleteField: PropTypes.func,
  modifyTable: PropTypes.func,
  modifyField: PropTypes.func,
  applyRelations: PropTypes.func,
  onContextMenu: PropTypes.func
};

const mapStateToProps = ({ tables, fields, plugin }) => ({
  tables,
  fields,
  plugin
});

const mapDispatchToProps = dispatch => ({
  modifyProject: project => dispatch(updateProject(project)),
  createField: field => dispatch(addField(field)),
  deleteField: fieldID => dispatch(removeField(fieldID)),
  modifyTable: (id, data) => dispatch(updateTable(id, data)),
  modifyField: (id, data) => dispatch(updateField(id, data)),
  applyRelations: relations => dispatch(setRelations(relations))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableListContainer);
