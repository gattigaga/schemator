import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { updateProject } from "../../store/actions/project";
import { updateTable } from "../../store/actions/tables";
import { addField, updateField, removeField } from "../../store/actions/fields";
import { addRelation, removeRelation } from "../../store/actions/relations";
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
   * Get mouse position in SVG coordinate system
   *
   * @param {object} event DOM event
   * @returns {object} Mouse position
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
   * Save table offset from the top left of object
   *
   * @param {object} event DOM event
   * @param {number} tableID Table ID
   * @memberof WorkArea
   */
  saveTableOffset(event, tableID) {
    const { tables } = this.props;
    const byID = item => item.id === tableID;
    this.activeTable = tables.find(byID).ref;

    const getAttributeNS = attr => {
      const activeTableDOM = this.activeTable.current;
      return parseFloat(activeTableDOM.getAttributeNS(null, attr));
    };
    const offset = this.getMousePosition(event);

    offset.x -= getAttributeNS("x");
    offset.y -= getAttributeNS("y");

    this.setState({ offset });
  }

  /**
   * Update field data inside table
   *
   * @param {object} event DOM event
   * @param {string} fieldID Field ID
   * @param {string} type Input type
   * @memberof WorkArea
   */
  updateField(event, fieldID, type) {
    const { value } = event.target;

    const {
      tables,
      fields,
      relations,
      modifyProject,
      modifyField,
      createRelation,
      deleteRelation,
      extension
    } = this.props;

    const action = {
      fieldID,
      updatedType: type,
      updatedData: value
    };

    const result = extension.main.onUpdateField(action, {
      tables,
      fields,
      relations
    });

    if (result) {
      switch (result.type) {
        case "CREATE":
          createRelation(result.relation);
          break;

        case "DELETE":
          deleteRelation(result.relation.id);
          break;

        default:
          break;
      }
    }

    modifyProject({ isModified: true });
    modifyField(fieldID, { [type]: value });
  }

  /**
   * Add new field inside table
   *
   * @param {string} tableID
   * @memberof WorkArea
   */
  addField(tableID) {
    const { modifyProject, createField, extension } = this.props;
    const field = extension.main.onCreateField(tableID);

    modifyProject({ isModified: true });
    createField(field);
  }

  /**
   * Remove existing field
   *
   * @param {number} fieldID Field ID
   * @memberof WorkArea
   */
  removeField(fieldID) {
    const {
      fields,
      relations,
      modifyProject,
      deleteField,
      deleteRelation,
      extension
    } = this.props;
    const field = fields.find(item => item.id === fieldID);
    const relation = relations.find(item => item.fieldID === fieldID);
    const isRelationRemovable = extension.main.onDeleteField(field);

    if (isRelationRemovable && relation) {
      deleteRelation(relation.id);
    }

    modifyProject({ isModified: true });
    deleteField(fieldID);
  }

  /**
   * Update table name
   *
   * @param {object} event DOM event
   * @param {number} tableID Table ID
   * @memberof WorkArea
   */
  updateTableName(event, tableID) {
    const {
      tables,
      fields,
      relations,
      modifyProject,
      modifyTable,
      deleteRelation,
      createRelation,
      extension
    } = this.props;
    const { value: tableName } = event.target;

    const table = {
      id: tableID,
      name: tableName
    };

    const newRelations = extension.main.onUpdateTable(table, {
      tables,
      fields
    });

    if (newRelations.length) {
      newRelations.forEach(createRelation);
    } else {
      const unneededRelations = relations
        .filter(item => item.toTableID === tableID)
        .map(item => item.id);

      unneededRelations.forEach(deleteRelation);
    }

    modifyProject({ isModified: true });
    modifyTable(tableID, { name: tableName });
  }

  /**
   * Update table position
   *
   * @param {object} event DOM event
   * @param {string} tableID Table ID
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
   * Update table options like id, rememberToken, etc
   *
   * @param {object} event DOM event
   * @param {number} tableID Table ID
   * @param {string} name Option name
   * @memberof WorkArea
   */
  updateTableOptions(event, tableID, optionID) {
    const { tables, modifyProject, modifyTable } = this.props;
    const { options } = tables.find(item => item.id === tableID);

    modifyProject({ isModified: true });
    modifyTable(tableID, {
      options: options.map(option => {
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

  render() {
    const { tables, fields, menuItems, onContextMenu, extension } = this.props;
    const [menuAddTable, menuRemoveTable, menuAddField] = menuItems;
    const types = extension ? extension.main.fieldTypes : [];

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
  relations: PropTypes.array,
  extension: PropTypes.object,
  menuItems: PropTypes.array,
  areaRef: PropTypes.object,
  modifyProject: PropTypes.func,
  createField: PropTypes.func,
  deleteField: PropTypes.func,
  modifyTable: PropTypes.func,
  modifyField: PropTypes.func,
  createRelation: PropTypes.func,
  deleteRelation: PropTypes.func,
  onContextMenu: PropTypes.func
};

const mapStateToProps = ({ tables, fields, relations, extension }) => ({
  tables,
  fields,
  relations,
  extension
});

const mapDispatchToProps = dispatch => ({
  modifyProject: project => dispatch(updateProject(project)),
  createField: field => dispatch(addField(field)),
  deleteField: fieldID => dispatch(removeField(fieldID)),
  modifyTable: (id, data) => dispatch(updateTable(id, data)),
  modifyField: (id, data) => dispatch(updateField(id, data)),
  createRelation: relation => dispatch(addRelation(relation)),
  deleteRelation: relationID => dispatch(removeRelation(relationID))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableListContainer);
