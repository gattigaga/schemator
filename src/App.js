import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

import { clearProject, updateProject } from "./store/actions/project";
import { clearTables } from "./store/actions/tables";
import { clearFields } from "./store/actions/fields";
import { clearRelations } from "./store/actions/relations";
import { setRecentProjects } from "./store/actions/recentProjects";
import {
  createProject,
  openProject,
  loadProject,
  saveProject,
  toLaravel
} from "./helpers/file";
import StatusbarContainer from "./components/container/StatusbarContainer";
import SidebarContainer from "./components/container/SidebarContainer";
import PageSwitcher from "./components/container/PageSwitcher";

const { remote } = window.require("electron");
const fs = window.require("fs");

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #383838;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.menu = null;
  }

  componentDidMount() {
    this.initConfigFolder();
    this.initRecentProjects();
    this.createMenu();
  }

  componentDidUpdate(prevProps) {
    const { Menu, MenuItem } = remote;
    const { project, recentProjects, applyRecentProjects } = this.props;
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

    if (recentProjects.length !== prevProps.recentProjects.length) {
      const { submenu } = this.menu.getMenuItemById("open-recent");

      submenu.clear();

      const recents = recentProjects.map(label => {
        return new MenuItem({
          label,
          click: () => loadProject(label)
        });
      });

      submenu.append(
        new MenuItem({
          id: "clear-recent",
          label: "Clear Recently Opened",
          click: () => {
            const { app } = remote;
            const osConfigPath = app.getPath("appData");
            const appConfigPath = `${osConfigPath}/schemator`;
            const fileRecents = `${appConfigPath}/recents.txt`;

            if (!fs.existsSync(osConfigPath)) {
              fs.mkdirSync(osConfigPath);
            }

            if (!fs.existsSync(appConfigPath)) {
              fs.mkdirSync(appConfigPath);
            }

            fs.writeFileSync(fileRecents, "");
            applyRecentProjects([]);
          }
        })
      );

      if (recents.length) {
        submenu.append(new MenuItem({ type: "separator" }));
      }

      recents.forEach(submenu.append);
      Menu.setApplicationMenu(this.menu);
    } else {
      const comparison = recentProjects.map(
        (item, index) => item === prevProps.recentProjects[index]
      );

      if (comparison.includes(false)) {
        const { submenu } = this.menu.getMenuItemById("open-recent");

        submenu.clear();

        const recents = recentProjects.map(label => {
          return new MenuItem({
            label,
            click: () => loadProject(label)
          });
        });

        submenu.append(
          new MenuItem({
            id: "clear-recent",
            label: "Clear Recently Opened",
            click: () => {
              const { app } = remote;
              const osConfigPath = app.getPath("appData");
              const appConfigPath = `${osConfigPath}/schemator`;
              const fileRecents = `${appConfigPath}/recents.txt`;

              if (!fs.existsSync(osConfigPath)) {
                fs.mkdirSync(osConfigPath);
              }

              if (!fs.existsSync(appConfigPath)) {
                fs.mkdirSync(appConfigPath);
              }

              fs.writeFileSync(fileRecents, "");
              applyRecentProjects([]);
            }
          })
        );

        if (recents.length) {
          submenu.append(new MenuItem({ type: "separator" }));
        }

        recents.forEach(submenu.append);
        Menu.setApplicationMenu(this.menu);
      }
    }
  }

  /**
   * Create menubar
   *
   * @memberof App
   */
  createMenu() {
    const { applyRecentProjects } = this.props;
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
          {
            id: "open-recent",
            label: "Open Recent",
            submenu: [
              {
                id: "clear-recent",
                label: "Clear Recently Opened",
                click: () => {
                  const { app } = remote;
                  const osConfigPath = app.getPath("appData");
                  const appConfigPath = `${osConfigPath}/schemator`;
                  const fileRecents = `${appConfigPath}/recents.txt`;

                  if (!fs.existsSync(osConfigPath)) {
                    fs.mkdirSync(osConfigPath);
                  }

                  if (!fs.existsSync(appConfigPath)) {
                    fs.mkdirSync(appConfigPath);
                  }

                  fs.writeFileSync(fileRecents, "");
                  applyRecentProjects([]);
                }
              }
            ]
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
                project,
                removeProject,
                removeAllTables,
                removeAllFields,
                removeAllRelations
              } = this.props;

              if (project.isModified) {
                const choice = dialog.showMessageBox(mainWindow, {
                  type: "question",
                  buttons: ["Yes", "No"],
                  title: "Your current project has been modified",
                  message: "Do you want to save changes your current project ?"
                });

                if (choice === 0) {
                  saveProject();
                }
              }

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

  /**
   * Initialize app config folder
   *
   * @memberof App
   */
  initConfigFolder() {
    const { app } = remote;
    const osConfigPath = app.getPath("appData");
    const appConfigPath = `${osConfigPath}/schemator`;

    if (!fs.existsSync(osConfigPath)) {
      fs.mkdirSync(osConfigPath);
    }

    if (!fs.existsSync(appConfigPath)) {
      fs.mkdirSync(appConfigPath);
    }
  }

  /**
   * Load histories file if exists otherwise create it
   *
   * @memberof App
   */
  initRecentProjects() {
    const { app } = remote;
    const osConfigPath = app.getPath("appData");
    const appConfigPath = `${osConfigPath}/schemator`;
    const fileRecents = `${appConfigPath}/recents.txt`;

    if (!fs.existsSync(fileRecents)) {
      fs.writeFileSync(fileRecents, "");
    } else {
      const { applyRecentProjects } = this.props;
      const content = fs.readFileSync(fileRecents, "utf8");
      const recents = content.split("\n").filter(item => !!item);

      applyRecentProjects(recents);
    }
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <SidebarContainer />
          <PageSwitcher />
        </Wrapper>
        <StatusbarContainer />
      </Container>
    );
  }
}

App.propTypes = {
  project: PropTypes.object,
  recentProjects: PropTypes.array,
  removeProject: PropTypes.func,
  removeAllTables: PropTypes.func,
  removeAllFields: PropTypes.func,
  removeAllRelations: PropTypes.func,
  modifyProject: PropTypes.func,
  applyRecentProjects: PropTypes.func
};

const mapStateToProps = ({ project, recentProjects }) => ({
  project,
  recentProjects
});

const mapDispatchToProps = dispatch => ({
  removeProject: () => dispatch(clearProject()),
  removeAllTables: () => dispatch(clearTables()),
  removeAllFields: () => dispatch(clearFields()),
  removeAllRelations: () => dispatch(clearRelations()),
  modifyProject: project => dispatch(updateProject(project)),
  applyRecentProjects: recents => dispatch(setRecentProjects(recents))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
