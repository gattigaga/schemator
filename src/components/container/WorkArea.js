import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import uuid from "uuid/v4";

import { updateProject } from "../../store/actions/project";
import { removeTable, addTable } from "../../store/actions/tables";
import { addField, removeField } from "../../store/actions/fields";
import { removeRelation } from "../../store/actions/relations";
import BGLines from "../presentational/BGLines";
import RelationLinesContainer from "../container/RelationLinesContainer";
import TableListContainer from "../container/TableListContainer";

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
      mouse: {
        x: 0,
        y: 0
      }
    };

    this.area = createRef();
    this.menu = new Menu();
    this.hoveredTable = null;

    this.addTable = this.addTable.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.addField = this.addField.bind(this);
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
   * Add new table
   *
   * @memberof WorkArea
   */
  addTable() {
    const { mouse } = this.state;
    const {
      activeExtension,
      modifyProject,
      createTable,
      createField
    } = this.props;
    const { table, field } = activeExtension.main.onCreateTable(mouse);

    modifyProject({ isModified: true });
    createTable({ ...table, ref: createRef() });
    createField(field);
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
    const { project } = this.props;
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
    const [menuAddTable] = this.menu.items;

    return (
      <Container isScrollable={!!project}>
        <Area
          innerRef={this.area}
          style={{ zoom }}
          onWheel={this.zoom}
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
            <TableListContainer
              menuItems={this.menu.items}
              areaRef={this.area}
              onContextMenu={tableID => {
                this.hoveredTable = tableID;
              }}
            />
          </g>
        </Area>
      </Container>
    );
  }
}

WorkArea.propTypes = {
  activeExtension: PropTypes.object,
  project: PropTypes.object,
  relations: PropTypes.array,
  fields: PropTypes.array,
  modifyProject: PropTypes.func,
  createTable: PropTypes.func,
  createField: PropTypes.func,
  deleteTable: PropTypes.func,
  deleteField: PropTypes.func,
  deleteRelation: PropTypes.func
};

const mapStateToProps = ({ project, relations, fields, activeExtension }) => ({
  project,
  relations,
  fields,
  activeExtension
});

const mapDispatchToProps = dispatch => ({
  modifyProject: project => dispatch(updateProject(project)),
  createTable: table => dispatch(addTable(table)),
  createField: field => dispatch(addField(field)),
  deleteTable: id => dispatch(removeTable(id)),
  deleteField: fieldID => dispatch(removeField(fieldID)),
  deleteRelation: relationID => dispatch(removeRelation(relationID))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkArea);
