import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  MdAddBox,
  MdSave,
  MdFolderOpen,
  MdArchive,
  MdAddCircle,
  MdHelp
} from "react-icons/lib/md";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import pluralize from "pluralize";
import { format } from "date-fns";
import path from "path";

import {
  setProject,
  setTables,
  setFields,
  setRelations,
  addTable,
  addField
} from "../store/actions";
import { toSnakeCase } from "../helpers/formatter";
import { randomBetween } from "../helpers/math";
import { modelTemplate, migrationTemplate } from "../helpers/template";

import Tool from "./Tool";
import ToolZoom from "./ToolZoom";

const { remote, screen, shell } = window.require("electron");
const fs = window.require("fs");

const Container = styled.div`
  width: 100%;
  height: 48px;
  align-items: center;
  padding: 0px 16px;
  box-sizing: border-box;
  display: flex;
  background: #555;
`;

const Separator = styled.div`
  width: 1px;
  height: 32px;
  border-left: 1px solid #666;
  margin: 0px 8px;
`;

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.filePath = null;

    this.newProject = this.newProject.bind(this);
    this.openProject = this.openProject.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.addTable = this.addTable.bind(this);
    this.export = this.export.bind(this);
    this.zoom = this.zoom.bind(this);
  }

  /**
   * Create new project
   *
   * @memberof Toolbar
   */
  newProject() {
    const {
      applyProject,
      applyTables,
      applyFields,
      applyRelations
    } = this.props;
    const { dialog } = remote;
    const mainWindow = remote.getCurrentWindow();

    dialog.showSaveDialog(
      mainWindow,
      {
        filters: [
          {
            name: "JSON files",
            extensions: ["json"]
          }
        ]
      },
      filePath => {
        if (filePath === undefined) {
          dialog.showErrorBox("Error", "You should define your project name !");
          return;
        }

        const name = path.basename(filePath, ".json");

        const project = {
          name,
          timestamp: Date.now(),
          zoom: 100
        };

        const tables = [
          {
            id: uuid(),
            name: "User",
            timestamp: Date.now(),
            position: {
              x: 128,
              y: 128
            },
            options: {
              id: true,
              rememberToken: true,
              softDeletes: false,
              timestamps: true
            }
          }
        ];

        const fields = [
          {
            id: uuid(),
            tableID: tables[0].id,
            name: "name",
            type: "STRING"
          },
          {
            id: uuid(),
            tableID: tables[0].id,
            name: "email",
            type: "STRING"
          },
          {
            id: uuid(),
            tableID: tables[0].id,
            name: "password",
            type: "STRING"
          }
        ];

        const data = {
          project,
          tables,
          fields
        };

        const content = JSON.stringify(data, null, 2);

        fs.writeFile(filePath, content, error => {
          if (error) {
            dialog.showErrorBox("Error", error.message);
            return;
          }

          applyProject({ ...project, isModified: false });
          applyTables(tables);
          applyFields(fields);
          applyRelations([]);

          this.filePath = filePath;
        });
      }
    );
  }

  /**
   * Open existing project
   *
   * @memberof Toolbar
   */
  openProject() {
    const {
      applyProject,
      applyTables,
      applyFields,
      applyRelations
    } = this.props;
    const { dialog } = remote;
    const mainWindow = remote.getCurrentWindow();

    dialog.showOpenDialog(
      mainWindow,
      {
        properties: ["openFile"],
        filters: [
          {
            name: "JSON files",
            extensions: ["json"]
          }
        ]
      },
      filePaths => {
        if (filePaths === undefined) {
          dialog.showErrorBox("Error", "No file selected !");
          return;
        }

        const filePath = filePaths[0];
        this.filePath = filePath;

        fs.readFile(filePath, "utf-8", (error, content) => {
          if (error) {
            dialog.showErrorBox("Error", error.message);
            return;
          }

          const data = JSON.parse(content);

          applyProject({
            ...data.project,
            zoom: data.project.zoom || 100
          });

          if (data.tables) {
            applyTables(data.tables);
          }

          if (data.fields) {
            applyFields(data.fields);
          }

          if (data.relations) {
            applyRelations(data.relations);
          }
        });
      }
    );
  }

  /**
   * Save current project
   *
   * @memberof Toolbar
   */
  saveProject() {
    const { project, tables, fields, relations, applyProject } = this.props;
    const { isModified, ...newProject } = project;
    const { dialog } = remote;

    const data = {
      tables,
      fields,
      relations,
      project: newProject
    };

    const content = JSON.stringify(data, null, 2);

    fs.writeFile(this.filePath, content, error => {
      if (error) {
        dialog.showErrorBox("Error", error.message);
        return;
      }

      applyProject({ isModified: false });
    });
  }

  /**
   * Create new table
   *
   * @memberof Toolbar
   */
  addTable() {
    const { applyProject, createTable, createField, tables } = this.props;
    const { workAreaSize } = screen.getPrimaryDisplay();
    const positions = tables.map(item => item.position);
    let newPosition;

    const isNotSameWith = pos => item => item.x !== pos.x && item.y !== pos.y;

    while (true) {
      newPosition = {
        x: randomBetween(16, workAreaSize.width - 240),
        y: randomBetween(64, workAreaSize.height - 240)
      };

      if (positions.every(isNotSameWith(newPosition))) {
        break;
      }
    }

    const project = {
      isModified: true
    };

    const newTable = {
      id: uuid(),
      name: "NewTable",
      timestamp: Date.now(),
      position: newPosition,
      options: {
        id: true,
        rememberToken: false,
        softDeletes: false,
        timestamps: true
      }
    };

    const newField = {
      id: uuid(),
      tableID: newTable.id,
      name: "field",
      type: "INTEGER"
    };

    applyProject(project);
    createTable(newTable);
    createField(newField);
  }

  /**
   * Export to Laravel model and migration
   *
   * @memberof Toolbar
   */
  export() {
    const { project, tables, fields } = this.props;
    const { dialog } = remote;
    const mainWindow = remote.getCurrentWindow();

    dialog.showOpenDialog(
      mainWindow,
      {
        properties: ["openDirectory"]
      },
      dirPaths => {
        if (dirPaths === undefined) {
          dialog.showErrorBox("Error", "No folder selected !");
          return;
        }

        const dirPath = dirPaths[0];
        const exportPath = `${dirPath}/${project.name}`;
        const modelPath = `${exportPath}/app`;
        const databasePath = `${exportPath}/database`;
        const migrationPath = `${databasePath}/migrations`;

        fs.mkdirSync(exportPath);
        fs.mkdirSync(modelPath);
        fs.mkdirSync(databasePath);
        fs.mkdirSync(migrationPath);

        tables.forEach((table, index) => {
          const byTable = field => field.tableID === table.id;

          const modelName = table.name;
          const tableName = pluralize(toSnakeCase(modelName));
          const date = format(table.timestamp, "YYYY_MM_DD_HHmmss");
          const modelFilename = `${modelName}.php`;
          const migrationFilename = `${date}_create_${tableName}_table.php`;
          const tableFields = fields.filter(byTable);
          const fillable = tableFields.map(item => item.name);
          const model = modelTemplate(modelName, fillable);
          const migration = migrationTemplate(
            modelName,
            table.options,
            tableFields
          );

          fs.writeFileSync(`${modelPath}/${modelFilename}`, model);
          fs.writeFileSync(`${migrationPath}/${migrationFilename}`, migration);

          if (index === tables.length - 1) {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              message: "Project successfully exported!",
              buttons: ["OK"]
            });
          }
        });
      }
    );
  }

  /**
   * Zoom in or zoom out WorkArea
   *
   * @param {object} event DOM event
   * @memberof Toolbar
   */
  zoom(event) {
    const { applyProject } = this.props;
    const { value } = event.target;

    applyProject({ zoom: value });
  }

  render() {
    const { project } = this.props;

    return (
      <Container>
        <Tool tooltip="New Project" icon={MdAddBox} onClick={this.newProject} />
        <Tool
          tooltip="Open Project"
          icon={MdFolderOpen}
          onClick={this.openProject}
        />
        <Tool
          tooltip="Save Project"
          icon={MdSave}
          isDisabled={!project}
          onClick={this.saveProject}
        />
        <Separator />
        <Tool
          tooltip="Export"
          icon={MdArchive}
          isDisabled={!project}
          onClick={this.export}
        />
        <Separator />
        <Tool
          tooltip="Add Table"
          icon={MdAddCircle}
          isDisabled={!project}
          onClick={this.addTable}
        />
        <ToolZoom
          value={project ? project.zoom : 100}
          isDisabled={!project}
          onChange={this.zoom}
        />
        <Separator />
        <Tool
          tooltip="Help"
          icon={MdHelp}
          onClick={() => {
            const url = "https://github.com/gattigaga/schemator";
            shell.openExternal(url);
          }}
        />
      </Container>
    );
  }
}

Toolbar.propTypes = {
  project: PropTypes.object,
  tables: PropTypes.array,
  fields: PropTypes.array,
  relations: PropTypes.array,
  applyProject: PropTypes.func,
  applyTables: PropTypes.func,
  applyFields: PropTypes.func,
  applyRelations: PropTypes.func,
  createTable: PropTypes.func,
  createField: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  applyProject: project => dispatch(setProject(project)),
  applyTables: tables => dispatch(setTables(tables)),
  applyFields: fields => dispatch(setFields(fields)),
  applyRelations: relations => dispatch(setRelations(relations)),
  createTable: table => dispatch(addTable(table)),
  createField: field => dispatch(addField(field))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
