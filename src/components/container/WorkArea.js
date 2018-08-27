import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

import { updateProject } from "../../store/actions/project";
import { addTable, setTables } from "../../store/actions/tables";
import { addField, setFields } from "../../store/actions/fields";
import { setRelations } from "../../store/actions/relations";
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

  componentDidUpdate(prevProps) {
    this.setAreaSize(prevProps);
  }

  /**
   * Create all context menus.
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
   * Set default size of working area in 100%.
   *
   * @param {object} prevProps
   * @memberof WorkArea
   */
  setAreaSize(prevProps) {
    const { project } = this.props;

    if (prevProps.project !== project) {
      const { workAreaSize } = screen.getPrimaryDisplay();
      const area = this.area.current;
      const width = (workAreaSize.width / 25) * 100;
      const height = ((workAreaSize.height - 48) / 25) * 100;

      area.style.width = `${width}px`;
      area.style.height = `${height}px`;
    }
  }

  /**
   * Add new table.
   *
   * @memberof WorkArea
   */
  addTable() {
    const {
      tables,
      fields,
      plugin,
      modifyProject,
      createTable,
      createField,
      applyRelations
    } = this.props;
    const { mouse } = this.state;
    const { onCreateTable, onUpdate } = plugin.main;
    const { table, fields: newFields = [] } = onCreateTable(mouse) || {};

    if (table && newFields) {
      const newTable = { ...table, ref: createRef() };

      const data = {
        tables: [...tables, newTable],
        fields: [...fields, ...newFields]
      };

      const relations = onUpdate(data) || [];

      applyRelations(relations);
      createTable(newTable);
      newFields.forEach(createField);
      modifyProject({ isModified: true });
    }
  }

  /**
   * Remove a table.
   *
   * @memberof WorkArea
   */
  removeTable() {
    const {
      tables,
      fields,
      plugin,
      modifyProject,
      applyTables,
      applyFields,
      applyRelations
    } = this.props;
    const { onUpdate } = plugin.main;
    const tableID = this.hoveredTable;
    const newTables = tables.filter(table => table.id !== tableID);
    const newFields = fields.filter(field => field.tableID !== tableID);

    const data = {
      tables: newTables,
      fields: newFields
    };

    const relations = onUpdate(data) || [];

    applyRelations(relations);
    applyTables(newTables);
    applyFields(newFields);
    modifyProject({ isModified: true });
  }

  /**
   * Add new field inside table.
   *
   * @memberof WorkArea
   */
  addField() {
    const {
      tables,
      fields,
      plugin,
      modifyProject,
      createField,
      applyRelations
    } = this.props;
    const { onCreateField, onUpdate } = plugin.main;
    const tableID = this.hoveredTable;
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
   * Handle zoom from mouse wheel offset.
   *
   * @param {object} event DOM event.
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
    const totalHorizontalLines = Math.trunc(width / gap);
    const totalVerticalLines = Math.trunc(height / gap);
    const [menuAddTable] = this.menu.items;

    return (
      <Container isScrollable={!!project}>
        <Area
          innerRef={this.area}
          style={{ zoom }}
          onWheel={this.zoom}
          onContextMenu={event => {
            this.menu.popup({ window: appWindow });

            this.setState({
              mouse: {
                x: event.clientX,
                y: event.clientY
              }
            });
          }}
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
  plugin: PropTypes.object,
  project: PropTypes.object,
  tables: PropTypes.array,
  fields: PropTypes.array,
  modifyProject: PropTypes.func,
  createTable: PropTypes.func,
  createField: PropTypes.func,
  applyTables: PropTypes.func,
  applyFields: PropTypes.func,
  applyRelations: PropTypes.func
};

const mapStateToProps = ({ project, tables, fields, plugin }) => ({
  project,
  tables,
  fields,
  plugin
});

const mapDispatchToProps = dispatch => ({
  modifyProject: project => dispatch(updateProject(project)),
  createTable: table => dispatch(addTable(table)),
  createField: field => dispatch(addField(field)),
  applyTables: tables => dispatch(setTables(tables)),
  applyFields: fields => dispatch(setFields(fields)),
  applyRelations: relations => dispatch(setRelations(relations))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkArea);
