import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { stripIndent } from "common-tags";
import { MdDashboard, MdDescription } from "react-icons/lib/md";

import {
  osConfigPath,
  appConfigPath,
  pluginsPath,
  recentProjectsPath,
} from "./config";
import { clearProject, updateProject } from "./store/actions/project";
import { clearTables } from "./store/actions/tables";
import { clearFields } from "./store/actions/fields";
import { clearRelations } from "./store/actions/relations";
import { setRecentProjects } from "./store/actions/recentProjects";
import { setPlugins } from "./store/actions/plugins";
import { setPlugin } from "./store/actions/plugin";
import { setPage } from "./store/actions/page";
import {
  createProject,
  openProject,
  loadProject,
  saveProject,
  exportProject,
  importPlugin,
} from "./helpers/file";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import imgDefaultPlugin from "./assets/images/icon-black.png";
import WorkArea from "./pages/WorkArea";
import Plugins from "./pages/Plugins";

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

const App = () => {
  const menu = useRef(null);
  const dispatch = useDispatch();

  const { plugin, project, recentProjects, page } = useSelector(
    ({ plugin, project, recentProjects, page }) => ({
      plugin,
      project,
      recentProjects,
      page,
    })
  );

  const toolItems = [
    {
      id: "workarea",
      icon: MdDescription,
      tooltip: "Work Area",
    },
    {
      id: "plugins",
      icon: MdDashboard,
      tooltip: "Plugins",
    },
  ];

  const createMenu = () => {
    const { Menu, dialog } = remote;
    const mainWindow = remote.getCurrentWindow();
    const zoomPercentages = [25, 33, 50, 67, 75, 80, 90, 100];
    const isDev = process.env.NODE_ENV === "development";

    const devMenu = [
      {
        label: "Developer",
        submenu: [
          { role: "reload" },
          { role: "forcereload" },
          { role: "toggledevtools" },
        ],
      },
    ];

    const template = [
      {
        id: "file",
        label: "File",
        submenu: [
          {
            id: "new-project",
            label: "New Project",
            enabled: false,
            submenu: [],
          },
          {
            id: "open-project",
            label: "Open Project",
            accelerator: "CmdOrCtrl+O",
            click: () => openProject(),
          },
          {
            id: "open-recent",
            label: "Open Recent",
            submenu: [
              {
                id: "clear-recent",
                label: "Clear Recently Opened",
                click: () => {
                  const paths = [osConfigPath, appConfigPath];

                  paths.forEach((path) => {
                    if (!fs.existsSync(path)) {
                      fs.mkdirSync(path);
                    }
                  });

                  fs.writeFileSync(recentProjectsPath, "");
                  dispatch(setRecentProjects([]));
                },
              },
            ],
          },
          { type: "separator" },
          {
            id: "save-project",
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            enabled: false,
            click: () => saveProject(),
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
                  buttons: ["OK"],
                });
              });
            },
          },
          { type: "separator" },
          {
            id: "preferences",
            label: "Preferences",
            submenu: [
              {
                id: "plugin-list",
                label: "Plugin List",
                click: () => dispatch(setPage("plugins")),
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
                        buttons: ["OK"],
                      },
                      (response) => {
                        if (response === 0) {
                          mainWindow.reload();
                        }
                      }
                    );
                  });
                },
              },
            ],
          },
          { type: "separator" },
          {
            id: "close-project",
            label: "Close Project",
            accelerator: "CmdOrCtrl+W",
            enabled: false,
            click: () => {
              if (project.isModified) {
                const choice = dialog.showMessageBox(mainWindow, {
                  type: "question",
                  buttons: ["Yes", "No"],
                  title: "Your current project has been modified",
                  message: "Do you want to save changes your current project ?",
                });

                if (choice === 0) {
                  saveProject();
                }
              }

              dispatch(clearProject());
              dispatch(clearTables());
              dispatch(clearFields());
              dispatch(clearRelations());
            },
          },
          { type: "separator" },
          {
            id: "exit",
            label: "Exit",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
              remote.getCurrentWindow().close();
            },
          },
        ],
      },
      {
        label: "View",
        submenu: [
          {
            id: "zoom-in",
            label: "Zoom In",
            enabled: false,
            click: () => {
              const { zoom } = project;
              const zoomIndex = zoomPercentages.findIndex(
                (item) => item === zoom
              );

              if (zoomIndex < zoomPercentages.length - 1) {
                dispatch(
                  updateProject({
                    zoom: zoomPercentages[zoomIndex + 1],
                  })
                );
              }
            },
          },
          {
            id: "zoom-out",
            label: "Zoom Out",
            enabled: false,
            click: () => {
              const { zoom } = project;
              const zoomIndex = zoomPercentages.findIndex(
                (item) => item === zoom
              );

              if (zoomIndex > 0) {
                dispatch(
                  updateProject({
                    zoom: zoomPercentages[zoomIndex - 1],
                  })
                );
              }
            },
          },
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "About",
            click: () => {
              const detail = stripIndent`
              Version: 2.0.0
              Author: Gattigaga Hayyuta Dewa
              `;

              dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "About",
                message: `Schemator`,
                detail,
                buttons: ["OK"],
              });
            },
          },
        ],
      },
      ...(isDev ? devMenu : []),
    ];

    menu.current = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu.current);
  };

  const initConfigFolders = () => {
    const paths = [osConfigPath, appConfigPath, pluginsPath];

    paths.forEach((path) => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    });
  };

  const initRecentProjects = () => {
    if (!fs.existsSync(recentProjectsPath)) {
      fs.writeFileSync(recentProjectsPath, "");
    } else {
      const content = fs.readFileSync(recentProjectsPath, "utf8");
      const recents = content.split("\n").filter((item) => !!item);

      dispatch(setRecentProjects(recents));
    }
  };

  const initPlugins = () => {
    const { MenuItem, dialog } = remote;
    const mainWindow = remote.getCurrentWindow();
    const menuNewProject = menu.current.getMenuItemById("new-project");
    const pluginDirs = fs.readdirSync(pluginsPath);

    const createPath = (dirName) => `${pluginsPath}/${dirName}`;

    const hasAssets = (path) => {
      const files = [
        `${path}/manifest.json`,
        `${path}/README.md`,
        `${path}/main.js`,
      ];
      const isValid = !files.map(fs.existsSync).includes(false);

      return isValid;
    };

    const loadPlugin = (path) => {
      try {
        const manifest = fs.readFileSync(`${path}/manifest.json`, "utf-8");
        const readme = fs.readFileSync(`${path}/README.md`, "utf-8");
        const main = fs.readFileSync(`${path}/main.js`, "utf-8");
        let image = imgDefaultPlugin;

        const vm = new NodeVM({
          require: {
            external: true,
          },
        });

        const script = new VMScript(main);
        const parsedManifest = JSON.parse(manifest);
        const parsedMain = vm.run(script);
        const iconPath = `${path}/${parsedManifest.icon}`;

        if (parsedManifest.icon) {
          const rawData = fs.readFileSync(iconPath);
          const buffer = Buffer.from(rawData);

          image = "data:image/png;base64," + buffer.toString("base64");
        }

        return {
          ...parsedManifest,
          readme,
          path,
          image,
          main: {
            fieldTypes: [],
            onInit: () => ({ tables: [], fields: [] }),
            onCreateTable: () => ({ table: null, fields: [] }),
            onCreateField: () => null,
            onUpdate: () => [],
            onExport: () => ({ paths: [], files: [] }),
            ...parsedMain.default,
          },
        };
      } catch (error) {
        dialog.showMessageBox(mainWindow, {
          type: "error",
          message: `${error.message} in ${path}.`,
          buttons: ["OK"],
        });

        mainWindow.close();
      }
    };

    const plugins = pluginDirs
      .map(createPath)
      .filter(hasAssets)
      .map(loadPlugin);

    if (plugins.length) {
      menuNewProject.enabled = true;
    }

    // Make all plugins to be accessible from New Project menu item
    plugins.forEach((plugin) => {
      menuNewProject.submenu.append(
        new MenuItem({
          id: plugin.id,
          label: plugin.name,
          click: () => {
            dispatch(setPlugin(plugin));
            createProject();
          },
        })
      );
    });

    dispatch(setPlugins(plugins));
  };

  const resetMenu = () => {
    const { Menu } = remote;

    const menuIDs = [
      "close-project",
      "save-project",
      "export-project",
      "zoom-in",
      "zoom-out",
    ];

    const menus = menuIDs.map(menu.current.getMenuItemById);

    menus.forEach((item) => {
      item.enabled = !!project;
    });

    Menu.setApplicationMenu(menu.current);
  };

  const resetRecentProjects = () => {
    const { Menu, MenuItem } = remote;
    const { submenu } = menu.current.getMenuItemById("open-recent");

    submenu.clear();

    const recents = recentProjects.map((label) => {
      return new MenuItem({
        label,
        click: () => loadProject(label),
      });
    });

    submenu.append(
      new MenuItem({
        id: "clear-recent",
        label: "Clear Recently Opened",
        click: () => {
          const paths = [osConfigPath, appConfigPath];

          paths.forEach((path) => {
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path);
            }
          });

          fs.writeFileSync(recentProjectsPath, "");
          dispatch(setRecentProjects([]));
        },
      })
    );

    if (recents.length) {
      submenu.append(new MenuItem({ type: "separator" }));
    }

    recents.forEach(submenu.append);
    Menu.setApplicationMenu(menu.current);
  };

  useEffect(() => {
    createMenu();
    initConfigFolders();
    initRecentProjects();
    initPlugins();
  }, []);

  useEffect(() => {
    resetMenu();
  }, [project]);

  useEffect(() => {
    resetRecentProjects();
  }, [recentProjects]);

  return (
    <Container>
      <Wrapper>
        <Sidebar
          items={toolItems}
          onClickItem={(item) => dispatch(setPage(item.id))}
          active={page}
        />
        {page === "plugins" ? <Plugins /> : <WorkArea />}
      </Wrapper>
      {project ? (
        <StatusBar
          zoom={project.zoom}
          pluginName={plugin.name}
          projectName={project.name}
          isProjectModified={project.isModified}
        />
      ) : (
        <StatusBar />
      )}
    </Container>
  );
};

export default App;
