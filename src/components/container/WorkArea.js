import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import uuid from "uuid/v4";

import { updateProject } from "../../store/actions/project";
import { updateTable, removeTable } from "../../store/actions/tables";
import { addField, updateField, removeField } from "../../store/actions/fields";
import { addRelation, removeRelation } from "../../store/actions/relations";
import { capitalize } from "../../helpers/formatter";
import { createTable } from "../../helpers/layout";
import BGLines from "../presentational/BGLines";
import RelationLinesContainer from "../container/RelationLinesContainer";
import TableList from "../presentational/TableList";

const { remote, screen } = window.require("electron");

const Container = styled.div`
  flex: 1;
  overflow: ${({ isScrollable }) => (isScrollable ? "scroll" : "hidden")};
`;

const Area = styled.svg`
  width: 100%;
  height: 100%;
  background: #333;
  transform-origin: top left;
`;

class WorkArea extends Component {
  constructor(props) {
    super(props);

    const { Menu } = remote;

    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      mouse: {
        x: 0,
        y: 0
      }
    };

    this.area = createRef();
    this.activeTable = null;
    this.hoveredTable = null;
    this.menu = new Menu();

    this.getMousePosition = this.getMousePosition.bind(this);
    this.saveTableOffset = this.saveTableOffset.bind(this);
    this.addField = this.addField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.addTable = this.addTable.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.updateTableName = this.updateTableName.bind(this);
    this.updateTablePosition = this.updateTablePosition.bind(this);
    this.updateTableOptions = this.updateTableOptions.bind(this);
    this.zoom = this.zoom.bind(this);
  }

  componentDidMount() {
    this.createContextMenus();
  }

  componentWillReceiveProps(nextProps) {
    this.setAreaSize(nextProps);
  }

  /**
   * Create all context menus
   *
   * @memberof WorkArea
   */
  createContextMenus() {
    const { MenuItem } = remote;

    this.menu.append(
      new MenuItem({
        label: "Add Table",
        visible: false,
        click: this.addTable
      })
    );

    this.menu.append(
      new MenuItem({
        label: "Remove Table",
        visible: false,
        click: this.removeTable
      })
    );

    this.menu.append(
      new MenuItem({
        label: "Add Field",
        visible: false,
        click: this.addField
      })
    );
  }

  /**
   * Set default size of working area in 100%
   *
   * @param {object} nextProps
   * @memberof WorkArea
   */
  setAreaSize(nextProps) {
    const { project } = this.props;

    if (nextProps.project !== project) {
      const { workAreaSize } = screen.getPrimaryDisplay();
      const area = this.area.current;
      const width = (workAreaSize.width / 25) * 100;
      const height = ((workAreaSize.height - 48) / 25) * 100;

      area.style.width = `${width}px`;
      area.style.height = `${height}px`;
    }
  }

  /**
   * Get mouse position in SVG coordinate system
   *
   * @param {object} event DOM event
   * @returns {object} Mouse position
   * @memberof WorkArea
   */
  getMousePosition(event) {
    const ctm = this.area.current.getScreenCTM();

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
   * Add new field inside table
   *
   * @memberof WorkArea
   */
  addField() {
    this.activeTable = null;

    const { modifyProject, createField } = this.props;
    const tableID = this.hoveredTable;

    const data = {
      tableID,
      id: uuid(),
      name: "field",
      type: "INTEGER"
    };

    modifyProject({ isModified: true });
    createField(data);
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
    const {
      tables,
      fields,
      relations,
      modifyProject,
      modifyField,
      createRelation,
      deleteRelation
    } = this.props;
    const { value } = event.target;

    if (type === "name") {
      const relation = relations.find(item => item.fieldID === fieldID);

      if (value.endsWith("_id")) {
        const tableName = capitalize(value.replace("_id", ""));
        const field = fields.find(item => item.id === fieldID);
        const fromTable = tables.find(item => item.id === field.tableID);
        const toTable = tables.find(item => item.name === tableName);

        if (fromTable && toTable && !relation) {
          const newRelation = {
            id: uuid(),
            fieldID: field.id,
            fromTableID: fromTable.id,
            toTableID: toTable.id
          };

          createRelation(newRelation);
        }
      } else {
        if (relation) {
          deleteRelation(relation.id);
        }
      }
    }

    const data = {
      [type]: value
    };

    modifyProject({ isModified: true });
    modifyField(fieldID, data);
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
      deleteRelation
    } = this.props;
    const field = fields.find(item => item.id === fieldID);
    const relation = relations.find(item => item.fieldID === fieldID);

    if (field.name.endsWith("_id") && relation) {
      deleteRelation(relation.id);
    }

    modifyProject({ isModified: true });
    deleteField(fieldID);
  }

  /**
   * Add new table
   *
   * @memberof WorkArea
   */
  addTable() {
    const { mouse } = this.state;
    const { modifyProject } = this.props;

    modifyProject({ isModified: true });
    createTable(mouse);
  }

  /**
   * Remove a table
   *
   * @memberof WorkArea
   */
  removeTable() {
    const {
      relations,
      fields,
      modifyProject,
      deleteTable,
      deleteField,
      deleteRelation
    } = this.props;
    const tableID = this.hoveredTable;

    const getID = item => item.id;
    const byThisTable = field => item => item[field] === tableID;

    relations
      .filter(byThisTable("toTable"))
      .map(getID)
      .forEach(deleteRelation);

    fields
      .filter(byThisTable("tableID"))
      .map(getID)
      .forEach(deleteField);

    modifyProject({ isModified: true });
    deleteTable(tableID);
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
      fields,
      relations,
      modifyProject,
      modifyTable,
      deleteRelation,
      createRelation
    } = this.props;
    const { value: newTableName } = event.target;
    const fieldPrefix = newTableName.toLowerCase();
    const foreignFields = fields.filter(
      item => item.name === `${fieldPrefix}_id`
    );

    if (foreignFields.length > 0) {
      foreignFields.forEach(field => {
        const newRelation = {
          id: uuid(),
          fieldID: field.id,
          fromTableID: field.tableID,
          toTableID: tableID
        };

        createRelation(newRelation);
      });
    } else {
      const unneededRelations = relations
        .filter(item => item.toTableID === tableID)
        .map(item => item.id);

      unneededRelations.forEach(deleteRelation);
    }

    const data = {
      name: newTableName
    };

    modifyProject({ isModified: true });
    modifyTable(tableID, data);
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

    if (this.activeTable) {
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
  updateTableOptions(event, tableID, name) {
    const { tables, modifyProject, modifyTable } = this.props;
    const table = tables.find(item => item.id === tableID);

    modifyProject({ isModified: true });
    modifyTable(tableID, {
      options: {
        ...table.options,
        [name]: event.target.checked
      }
    });
  }

  /**
   * Handle zoom from mouse wheel offset
   *
   * @param {object} event DOM event
   * @memberof WorkArea
   */
  zoom(event) {
    const { project, modifyProject } = this.props;
    const { deltaY, ctrlKey } = event;

    if (project && ctrlKey) {
      const zoomValues = [25, 33, 50, 67, 75, 80, 90, 100];
      const totalValues = zoomValues.length;
      const { zoom } = project;
      const offset = deltaY > 0 ? -1 : 1;
      const index = zoomValues.findIndex(item => item === zoom);
      const newIndex = index + offset;
      const isOutOfBound = newIndex < 0 || newIndex > totalValues - 1;

      if (!isOutOfBound) {
        const newZoom = zoomValues[newIndex];

        modifyProject({ zoom: newZoom });
      }
    }
  }

  render() {
    const { project, tables, fields } = this.props;
    const appWindow = remote.getCurrentWindow();
    const zoom = project ? project.zoom / 100 : 1;
    const area = this.area.current;
    const areaWidth = area ? area.clientWidth : 1366;
    const areaHeight = area ? area.clientHeight : 696;
    const gap = 32;
    const width = (areaWidth / 25) * 100;
    const height = (areaHeight / 25) * 100;
    const totalHorizontalLines = parseInt(width / gap);
    const totalVerticalLines = parseInt(height / gap);
    const [menuAddTable, menuRemoveTable, menuAddField] = this.menu.items;

    return (
      <Container isScrollable={!!project}>
        <Area
          innerRef={this.area}
          style={{ zoom }}
          onWheel={this.zoom}
          onMouseUp={() => {
            this.activeTable = null;
          }}
          onContextMenu={() => this.menu.popup({ window: appWindow })}
          onMouseEnter={() => {
            if (menuAddTable) {
              menuAddTable.visible = !!project;
            }
          }}
          onMouseLeave={() => {
            if (menuAddTable) {
              menuAddTable.visible = false;
            }
          }}
          onMouseMove={event =>
            this.setState({
              mouse: {
                x: event.clientX,
                y: event.clientY
              }
            })
          }
        >
          <BGLines
            totalHorizontal={totalHorizontalLines}
            totalVertical={totalVerticalLines}
            gap={32}
          />
          <g>
            <RelationLinesContainer />
            <TableList
              tables={tables}
              fields={fields}
              onContextMenu={tableID => {
                this.hoveredTable = tableID;
              }}
              onMouseDown={this.saveTableOffset}
              onMouseMove={this.updateTablePosition}
              onMouseEnter={tableID => {
                this.hoveredTable = tableID;

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
              onMouseLeave={tableID => {
                this.hoveredTable = tableID;

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
          </g>
        </Area>
      </Container>
    );
  }
}

WorkArea.propTypes = {
  project: PropTypes.object,
  tables: PropTypes.array,
  fields: PropTypes.array,
  relations: PropTypes.array,
  modifyProject: PropTypes.func,
  modifyTable: PropTypes.func,
  deleteTable: PropTypes.func,
  modifyField: PropTypes.func,
  createField: PropTypes.func,
  deleteField: PropTypes.func,
  createRelation: PropTypes.func,
  deleteRelation: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  modifyProject: project => dispatch(updateProject(project)),
  createField: field => dispatch(addField(field)),
  deleteField: fieldID => dispatch(removeField(fieldID)),
  modifyTable: (id, data) => dispatch(updateTable(id, data)),
  deleteTable: id => dispatch(removeTable(id)),
  modifyField: (id, data) => dispatch(updateField(id, data)),
  createRelation: relation => dispatch(addRelation(relation)),
  deleteRelation: relationID => dispatch(removeRelation(relationID))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkArea);
