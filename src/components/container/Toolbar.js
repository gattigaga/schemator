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

import { updateProject } from "../../store/actions";
import { randomBetween } from "../../helpers/math";
import { createTable } from "../../helpers/layout";
import {
  createProject,
  openProject,
  saveProject,
  toLaravel
} from "../../helpers/file";

import Tool from "../presentational/Tool";
import ToolZoom from "../presentational/ToolZoom";

const { remote, screen, shell } = window.require("electron");

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

    this.addTable = this.addTable.bind(this);
    this.zoom = this.zoom.bind(this);
  }

  /**
   * Create new table in random position
   *
   * @memberof Toolbar
   */
  addTable() {
    const { tables } = this.props;
    const { workAreaSize } = screen.getPrimaryDisplay();
    const positions = tables.map(item => item.position);
    let position;

    const isNotSameWith = pos => item => item.x !== pos.x && item.y !== pos.y;

    while (true) {
      position = {
        x: randomBetween(16, workAreaSize.width - 240),
        y: randomBetween(64, workAreaSize.height - 240)
      };

      if (positions.every(isNotSameWith(position))) {
        break;
      }
    }

    createTable(position);
  }

  /**
   * Zoom in / Zoom out in work area
   *
   * @param {object} event DOM event
   * @memberof Toolbar
   */
  zoom(event) {
    const { modifyProject } = this.props;
    const { value } = event.target;

    modifyProject({ zoom: value });
  }

  render() {
    const { project } = this.props;
    const { dialog } = remote;
    const mainWindow = remote.getCurrentWindow();

    return (
      <Container>
        <Tool tooltip="New Project" icon={MdAddBox} onClick={createProject} />
        <Tool
          tooltip="Open Project"
          icon={MdFolderOpen}
          onClick={openProject}
        />
        <Tool
          tooltip="Save Project"
          icon={MdSave}
          isDisabled={!project}
          onClick={saveProject}
        />
        <Separator />
        <Tool
          tooltip="Export"
          icon={MdArchive}
          isDisabled={!project}
          onClick={() => {
            toLaravel(() => {
              dialog.showMessageBox(mainWindow, {
                type: "info",
                message: "Project successfully exported!",
                buttons: ["OK"]
              });
            });
          }}
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
  modifyProject: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  modifyProject: project => dispatch(updateProject(project))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
