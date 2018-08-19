import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import uuid from "uuid/v4";

import { clearProject, updateProject } from "./store/actions/project";
import { clearTables } from "./store/actions/tables";
import { clearFields } from "./store/actions/fields";
import { clearRelations } from "./store/actions/relations";
import { setRecentProjects } from "./store/actions/recentProjects";
import { setExtensions } from "./store/actions/extensions";
import { setExtension } from "./store/actions/extension";
import { setPage } from "./store/actions/page";
import {
  createProject,
  openProject,
  loadProject,
  saveProject,
  exportProject,
  importPlugin
} from "./helpers/file";
import StatusbarContainer from "./components/container/StatusbarContainer";
import SidebarContainer from "./components/container/SidebarContainer";
import PageSwitcher from "./components/container/PageSwitcher";
import imgDefaultExtension from "./assets/images/icon-black.png";

const { remote } = window.require("electron");
const fs = window.require("fs");
const { NodeVM, VMScript } = window.require("vm2");

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
    this.createMenu();
    this.initConfigFolder();
    this.initRecentProjects();
    this.initExtensions();
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
    const { applyRecentProjects, changePage } = this.props;
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
            submenu: []
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
            label: "Export Project",
            accelerator: "CmdOrCtrl+E",
            enabled: false,
            click: () => {
              exportProject(() => {
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
            id: "preferences",
            label: "Preferences",
            submenu: [
              {
                id: "plugin-list",
                label: "Plugin List",
                click: () => changePage("extensions")
              },
              {
                id: "import-plugin",
                label: "Import New Plugin",
                click: () => {
                  importPlugin(() => {
                    dialog.showMessageBox(
                      mainWindow,
                      {
                        type: "info",
                        message:
                          "Plugin successfully imported, Press OK to reload Schemator!",
                        buttons: ["OK"]
                      },
                      response => {
                        if (response === 0) {
                          mainWindow.reload();
                        }
                      }
                    );
                  });
                }
              }
            ]
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
    const pluginPath = `${appConfigPath}/plugins`;

    if (!fs.existsSync(osConfigPath)) {
      fs.mkdirSync(osConfigPath);
    }

    if (!fs.existsSync(appConfigPath)) {
      fs.mkdirSync(appConfigPath);
    }

    if (!fs.existsSync(pluginPath)) {
      fs.mkdirSync(pluginPath);
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

  /**
   * Load all built-in extensions
   *
   * @memberof App
   */
  initExtensions() {
    const { MenuItem, app } = remote;
    const { applyExtensions, activateExtension } = this.props;
    const { submenu } = this.menu.getMenuItemById("new-project");
    const osConfigPath = app.getPath("appData");
    const appConfigPath = `${osConfigPath}/schemator`;
    const internalPath = "./plugins";
    const externalPath = `${appConfigPath}/plugins`;
    const internalDirs = ["laravel"];
    const externalDirs = fs.readdirSync(externalPath);

    const createPath = path => dirName => `${path}/${dirName}`;
    const loadInternalExtension = path => ({
      path,
      type: "internal",
      manifest: require(`${path}/manifest.json`),
      main: require(`${path}/main`)
    });
    const loadExternalExtension = path => ({
      path,
      type: "external",
      manifest: fs.readFileSync(`${path}/manifest.json`, "utf-8"),
      main: fs.readFileSync(`${path}/main.js`, "utf-8")
    });

    const internalPaths = internalDirs
      .map(createPath(internalPath))
      .map(loadInternalExtension);

    const externalPaths = externalDirs
      .map(createPath(externalPath))
      .map(loadExternalExtension);

    const loadedExtensions = [...internalPaths, ...externalPaths];

    const extensions = loadedExtensions.map(extension => {
      const { manifest, main, path, type } = extension;
      let iconPath;
      let image;

      switch (type) {
        case "internal":
          iconPath = `${path}/${manifest.icon}`;
          image = manifest.icon ? require(`${iconPath}`) : imgDefaultExtension;

          return {
            id: uuid(),
            ...manifest,
            path,
            type,
            image,
            main: main.default
          };

        case "external":
          const vm = new NodeVM({
            require: {
              external: true
            }
          });
          const script = new VMScript(main);
          const parsedManifest = JSON.parse(manifest);
          const parsedMain = vm.run(script);
          iconPath = `${path}/${parsedManifest.icon}`;

          if (parsedManifest.icon) {
            const rawData = fs.readFileSync(iconPath);
            const buffer = Buffer.from(rawData);

            image = "data:image/png;base64," + buffer.toString("base64");
          } else {
            image = imgDefaultExtension;
          }

          return {
            id: uuid(),
            ...parsedManifest,
            path,
            type,
            image,
            main: parsedMain.default
          };

        default:
          return null;
      }
    });

    // Make all extensions to be accessible from New Project menu item
    extensions.forEach(extension => {
      submenu.append(
        new MenuItem({
          id: extension.id,
          label: extension.name,
          click: () => {
            activateExtension(extension);
            createProject();
          }
        })
      );
    });

    applyExtensions(extensions);
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
  applyRecentProjects: PropTypes.func,
  applyExtensions: PropTypes.func,
  activateExtension: PropTypes.func,
  changePage: PropTypes.func
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
  applyRecentProjects: recents => dispatch(setRecentProjects(recents)),
  applyExtensions: extensions => dispatch(setExtensions(extensions)),
  activateExtension: extension => dispatch(setExtension(extension)),
  changePage: pageID => dispatch(setPage(pageID))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
