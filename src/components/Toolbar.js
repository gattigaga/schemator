/* global chrome */

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  MdAddBox,
  MdSave,
  MdFolderOpen,
  MdArchive,
  MdAddCircle,
  MdHelp,
  MdCheckCircle
} from "react-icons/lib/md";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import pluralize from "pluralize";
import { format } from "date-fns";

import {
  setProject,
  setTables,
  setFields,
  setRelations,
  addTable,
  addField,
  setAlert
} from "../store/actions";
import { toSnakeCase } from "../helpers/formatter";
import { randomBetween } from "../helpers/math";
import { modelTemplate, migrationTemplate } from "../helpers/template";

import Tool from "./Tool";
import ToolZoom from "./ToolZoom";

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

    this.fileEntry = null;

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
      applyRelations,
      showAlert
    } = this.props;

    const options = {
      type: "saveFile",
      suggestedName: "project.json",
      accepts: [
        {
          description: "JSON files (*.json)",
          extensions: ["json"]
        }
      ],
      acceptsAllTypes: false
    };

    const saveFile = entry => {
      this.fileEntry = entry;

      const project = {
        name: entry.name.replace(".json", ""),
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

      entry.createWriter(writer => {
        let truncated = false;
        const contents = JSON.stringify(data, null, 2);
        const blob = new Blob([contents], { type: "application/json" });

        writer.onwriteend = function() {
          if (!truncated) {
            truncated = true;
            this.truncate(blob.size);
          }

          applyProject({ ...project, isModified: false });
          applyTables(tables);
          applyFields(fields);
          applyRelations([]);
        };

        writer.onerror = error => {
          console.error(error);
          showAlert({
            isOpen: true,
            message: "Failed to create new project",
            iconColor: "#ff5252"
          });
        };

        writer.write(blob);
      });
    };

    chrome.fileSystem.chooseEntry(options, saveFile);
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
      applyRelations,
      showAlert
    } = this.props;

    const options = {
      type: "openFile",
      accepts: [
        {
          description: "JSON files (*.json)",
          extensions: ["json"]
        }
      ],
      acceptsAllTypes: false
    };

    const openFile = entry => {
      this.fileEntry = entry;

      entry.file(function(file) {
        const reader = new FileReader();

        reader.onloadend = event => {
          const { result } = event.target;

          try {
            const data = JSON.parse(result);

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

            chrome.contextMenus.update("add-table", { visible: true });
          } catch (error) {
            console.error(error);
            showAlert({
              isOpen: true,
              message: "Failed to open a project",
              iconColor: "#ff5252"
            });
          }
        };

        reader.onerror = error => {
          console.error(error);
          showAlert({
            isOpen: true,
            message: "Failed to open a project",
            iconColor: "#ff5252"
          });
        };

        reader.readAsBinaryString(file);
      });
    };

    chrome.fileSystem.chooseEntry(options, openFile);
  }

  /**
   * Save current project
   *
   * @memberof Toolbar
   */
  saveProject() {
    const {
      project,
      tables,
      fields,
      relations,
      applyProject,
      showAlert
    } = this.props;
    const { isModified, ...newProject } = project;

    const data = {
      tables,
      fields,
      relations,
      project: newProject
    };

    this.fileEntry.createWriter(writer => {
      let truncated = false;
      const contents = JSON.stringify(data, null, 2);
      const blob = new Blob([contents], { type: "application/json" });

      writer.onwriteend = function() {
        if (!truncated) {
          truncated = true;
          this.truncate(blob.size);
        }

        applyProject({ isModified: false });
      };

      writer.onerror = error => {
        console.error(error);
        showAlert({
          isOpen: true,
          message: "Failed to save current project",
          iconColor: "#ff5252"
        });
      };

      writer.write(blob);
    });
  }

  /**
   * Create new table
   *
   * @memberof Toolbar
   */
  addTable() {
    const { applyProject, createTable, createField, tables } = this.props;
    const positions = tables.map(item => item.position);
    const appWindow = chrome.app.window.get("main");
    let newPosition;

    const isNotSameWith = pos => item => item.x !== pos.x && item.y !== pos.y;

    while (true) {
      newPosition = {
        x: randomBetween(16, appWindow.innerBounds.width - 240),
        y: randomBetween(64, appWindow.innerBounds.height - 240)
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
    const { project, tables, fields, showAlert } = this.props;
    const dataType = { type: "application/json" };
    const options = { type: "openDirectory" };

    const byTable = table => field => field.tableID === table.id;
    const createFolder = (entry, name, callback) => {
      entry.getDirectory(name, { create: true }, callback);
    };
    const createFile = (entry, options) => {
      entry.getFile(options.name, { create: true }, entry => {
        let truncated = false;
        const blob = new Blob([options.data], dataType);

        entry.createWriter(writer => {
          writer.onwriteend = () => {
            if (!truncated) {
              truncated = true;
              this.truncate(blob.size);
            }
          };

          writer.onerror = error => {
            console.error(error);
            showAlert({
              isOpen: true,
              message: "Failed to create file",
              iconColor: "#ff5252"
            });
          };

          writer.write(blob);
        });
      });
    };
    const exportFile = entry => {
      chrome.fileSystem.getWritableEntry(entry, entry => {
        entry.getDirectory(project.name, { create: true }, entry => {
          tables.forEach((table, index) => {
            const modelName = table.name;
            const tableName = pluralize(toSnakeCase(modelName));

            const date = format(table.timestamp, "YYYY_MM_DD_HHmmss");
            const modelFilename = `${modelName}.php`;
            const migrationFilename = `${date}_create_${tableName}_table.php`;

            const tableFields = fields.filter(byTable(table));
            const fillable = tableFields.map(item => item.name);
            const model = modelTemplate(modelName, fillable);
            const migration = migrationTemplate(
              modelName,
              table.options,
              tableFields
            );

            createFolder(entry, "app", entry => {
              createFile(entry, {
                name: modelFilename,
                data: model
              });
            });

            createFolder(entry, "database", entry => {
              createFolder(entry, "migrations", entry => {
                createFile(entry, {
                  name: migrationFilename,
                  data: migration
                });
              });
            });

            if (index === tables.length - 1) {
              showAlert({
                isOpen: true,
                icon: MdCheckCircle,
                message: "Project successfully exported",
                iconColor: "#34ace0"
              });
            }
          });
        });
      });
    };

    chrome.fileSystem.chooseEntry(options, exportFile);
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
          onClick={() =>
            chrome.browser.openTab({
              url: "https://github.com/gattigaga/schemator"
            })
          }
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
  createField: PropTypes.func,
  showAlert: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  applyProject: project => dispatch(setProject(project)),
  applyTables: tables => dispatch(setTables(tables)),
  applyFields: fields => dispatch(setFields(fields)),
  applyRelations: relations => dispatch(setRelations(relations)),
  createTable: table => dispatch(addTable(table)),
  createField: field => dispatch(addField(field)),
  showAlert: options => dispatch(setAlert(options))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
