import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import {
  clearTables,
  clearFields,
  clearRelations,
  clearProject,
  updateProject
} from "./store/actions";
import {
  createProject,
  openProject,
  saveProject,
  toLaravel
} from "./helpers/file";
import Toolbar from "./components/container/Toolbar";
import WorkArea from "./components/container/WorkArea";

const { remote } = window.require("electron");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.menu = null;
  }

  componentDidMount() {
    this.createMenu();
  }

  componentDidUpdate(prevProps) {
    const { Menu } = remote;
    const { project } = this.props;
    const isProjectInitializedOrClosed = !prevProps.project || !project;
    const isProjectChanged =
      !!project &&
      !!prevProps.project &&
      prevProps.project.name !== project.name;

    if (isProjectInitializedOrClosed || isProjectChanged) {
      const menuIDs = [
        "close-project",
        "save-project",
        "export-project",
        "zoom-in",
        "zoom-out"
      ];

      const menus = menuIDs.map(this.menu.getMenuItemById);

      menus.forEach(item => {
        item.enabled = !!project;
      });

      Menu.setApplicationMenu(this.menu);
    }
  }

  /**
   * Create menubar
   *
   * @memberof App
   */
  createMenu() {
    const { Menu, dialog } = remote;
    const mainWindow = remote.getCurrentWindow();
    const zoomPercentages = [25, 33, 50, 67, 75, 80, 90, 100];

    const template = [
      {
        id: "file",
        label: "File",
        submenu: [
          {
            id: "new-project",
            label: "New Project",
            acceleratoclickr: "CmdOrCtrl+N",
            click: () => createProject()
          },
          {
            id: "open-project",
            label: "Open Project",
            accelerator: "CmdOrCtrl+O",
            click: () => openProject()
          },
          { type: "separator" },
          {
            id: "save-project",
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            enabled: false,
            click: () => saveProject()
          },
          { type: "separator" },
          {
            id: "export-project",
            label: "Export to Laravel",
            accelerator: "CmdOrCtrl+E",
            enabled: false,
            click: () => {
              toLaravel(() => {
                dialog.showMessageBox(mainWindow, {
                  type: "info",
                  message: "Project successfully exported!",
                  buttons: ["OK"]
                });
              });
            }
          },
          {
            type: "separator"
          },
          {
            id: "close-project",
            label: "Close Project",
            accelerator: "CmdOrCtrl+W",
            enabled: false,
            click: () => {
              const {
                removeProject,
                removeAllTables,
                removeAllFields,
                removeAllRelations
              } = this.props;

              removeProject();
              removeAllTables();
              removeAllFields();
              removeAllRelations();
            }
          },
          {
            type: "separator"
          },
          {
            id: "exit",
            label: "Exit",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
              remote.getCurrentWindow().close();
            }
          }
        ]
      },
      {
        label: "View",
        submenu: [
          {
            id: "zoom-in",
            label: "Zoom In",
            enabled: false,
            click: () => {
              const { project, modifyProject } = this.props;
              const { zoom } = project;
              const zoomIndex = zoomPercentages.findIndex(
                item => item === zoom
              );

              if (zoomIndex < zoomPercentages.length - 1) {
                modifyProject({
                  zoom: zoomPercentages[zoomIndex + 1]
                });
              }
            }
          },
          {
            id: "zoom-out",
            label: "Zoom Out",
            enabled: false,
            click: () => {
              const { project, modifyProject } = this.props;
              const { zoom } = project;
              const zoomIndex = zoomPercentages.findIndex(
                item => item === zoom
              );

              if (zoomIndex > 0) {
                modifyProject({
                  zoom: zoomPercentages[zoomIndex - 1]
                });
              }
            }
          }
        ]
      },
      {
        label: "Developer",
        submenu: [
          { role: "reload" },
          { role: "forcereload" },
          { role: "toggledevtools" }
        ]
      }
    ];

    this.menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(this.menu);
  }

  render() {
    const { project } = this.props;

    return (
      <Container>
        {project && (
          <Helmet>
            <title>
              Schemator {project.name ? `- ${project.name}` : ""}{" "}
              {project.isModified ? "- Modified" : ""}
            </title>
          </Helmet>
        )}
        <Toolbar />
        <WorkArea />
      </Container>
    );
  }
}

App.propTypes = {
  project: PropTypes.object,
  removeProject: PropTypes.func,
  removeAllTables: PropTypes.func,
  removeAllFields: PropTypes.func,
  removeAllRelations: PropTypes.func,
  modifyProject: PropTypes.func
};

const mapStateToProps = ({ project }) => ({ project });

const mapDispatchToProps = dispatch => ({
  removeProject: () => dispatch(clearProject()),
  removeAllTables: () => dispatch(clearTables()),
  removeAllFields: () => dispatch(clearFields()),
  removeAllRelations: () => dispatch(clearRelations()),
  modifyProject: project => dispatch(updateProject(project))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
