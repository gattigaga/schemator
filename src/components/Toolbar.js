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
  MdHelp
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
import { randomBetween } from "../helpers/math";
import { modelTemplate, migrationTemplate } from "../helpers/template";

import Tool from "./Tool";

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
  }

  /**
   * Create new project
   *
   * @memberof Toolbar
   */
  newProject() {
    const { applyProject, showAlert } = this.props;

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

      const data = {
        project: {
          name: entry.name.replace(".json", ""),
          timestamp: Date.now()
        }
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

          applyProject(data.project);
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

        reader.onloadend = function(e) {
          const data = JSON.parse(this.result);

          applyProject(data.project);

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
    const { project, tables, fields, relations, showAlert } = this.props;

    const data = {
      project,
      tables,
      fields,
      relations
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
    const { createTable, createField, tables } = this.props;
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
        const blob = new Blob([options.data], dataType);

        entry.createWriter(writer => {
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
          tables.forEach(table => {
            const modelName = table.name;
            const tableName = pluralize(modelName.toLowerCase());

            const date = format(new Date(), "YYYY_MM_DD_HHmmss");
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
          });
        });
      });
    };

    chrome.fileSystem.chooseEntry(options, exportFile);
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
        <Separator />
        <Tool tooltip="Help" icon={MdHelp} />
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
