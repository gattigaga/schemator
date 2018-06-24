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

import {
  setProject,
  setTables,
  setFields,
  setRelations,
  addTable,
  addField
} from "../store/actions";
import { randomBetween } from "../helpers/math";

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

    this.newProject = this.newProject.bind(this);
    this.openProject = this.openProject.bind(this);
    this.addTable = this.addTable.bind(this);
  }

  /**
   * Create new project
   *
   * @memberof Toolbar
   */
  newProject() {
    const { applyProject } = this.props;

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

        writer.onerror = console.error;

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
      applyRelations
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
        };

        reader.readAsBinaryString(file);
      });
    };

    chrome.fileSystem.chooseEntry(options, openFile);
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
      position: newPosition
    };

    const newField = {
      id: uuid(),
      tableID: newTable.id,
      name: "id",
      type: "INCREMENT"
    };

    createTable(newTable);
    createField(newField);
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
        <Tool tooltip="Save Project" icon={MdSave} isDisabled={!project} />
        <Separator />
        <Tool tooltip="Export" icon={MdArchive} isDisabled={!project} />
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
  applyProject: PropTypes.func,
  applyTables: PropTypes.func,
  applyFields: PropTypes.func,
  applyRelations: PropTypes.func,
  createTable: PropTypes.func,
  createField: PropTypes.func
};

const mapStateToProps = ({ project, tables }) => ({ project, tables });

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
