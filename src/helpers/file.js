import { createRef } from "react";
import path from "path";

import {
  osConfigPath,
  appConfigPath,
  pluginsPath,
  recentProjectsPath
} from "../config";
import { setProject, updateProject } from "../store/actions/project";
import { setTables } from "../store/actions/tables";
import { setFields } from "../store/actions/fields";
import { setRelations } from "../store/actions/relations";
import { setRecentProjects } from "../store/actions/recentProjects";
import store from "../store/store";
import { setPlugin } from "../store/actions/plugin";

const { remote } = window.require("electron");
const fs = window.require("fs-extra");

/**
 * Open dialog to create new project file based on plugin.
 *
 */
export const createProject = () => {
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
      if (!filePath) {
        return;
      }

      if (fs.existsSync(filePath)) {
        const choice = dialog.showMessageBox(mainWindow, {
          type: "question",
          title: "File Already Exists",
          message: "File already exists, you want to overwrite ?",
          buttons: ["Yes", "No"]
        });

        if (choice !== 0) {
          return;
        }
      }

      const { recentProjects, plugin } = store.getState();
      const { onInit, onUpdate } = plugin.main;
      const name = path.basename(filePath, ".json");
      const { tables = [], fields = [] } = onInit() || {};

      const project = {
        name,
        pluginID: plugin.id,
        timestamp: Date.now(),
        zoom: 100
      };

      const newTables = tables.map(table => ({
        ...table,
        ref: createRef()
      }));

      const relations = onUpdate({ tables, fields }) || [];

      const data = {
        project,
        tables,
        fields,
        relations
      };

      const content = JSON.stringify(data, null, 2);

      fs.writeFile(filePath, content, error => {
        if (error) {
          dialog.showErrorBox("Error", error.message);
          return;
        }

        const paths = [osConfigPath, appConfigPath, pluginsPath];
        const remainings = [...new Set([filePath, ...recentProjects])];
        const recents = remainings.slice(0, 10);
        const data = recents.join("\n");

        paths.forEach(path => {
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
        });

        fs.writeFileSync(recentProjectsPath, data);
        store.dispatch(setRecentProjects(recents));
        store.dispatch(setProject({ ...project, filePath, isModified: false }));
        store.dispatch(setTables(newTables));
        store.dispatch(setFields(fields));
        store.dispatch(setRelations([]));
      });
    }
  );
};

/**
 * Open dialog to load existing project.
 *
 * @param {function} [callback]
 */
export const openProject = callback => {
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
      if (!filePaths) {
        return;
      }

      const filePath = filePaths[0];

      loadProject(filePath, callback);
    }
  );
};

/**
 * Save current project.
 *
 * @param {function} [callback]
 */
export const saveProject = callback => {
  const { dialog } = remote;
  const { project, tables, fields, relations } = store.getState();
  const { isModified, filePath, ...newProject } = project;
  const newTables = tables.map(({ ref, ...newTable }) => newTable);

  const data = {
    project: newProject,
    tables: newTables,
    fields,
    relations
  };

  const content = JSON.stringify(data, null, 2);

  fs.writeFile(filePath, content, error => {
    if (error) {
      dialog.showErrorBox("Error", error.message);
      return;
    }

    store.dispatch(updateProject({ isModified: false }));

    if (callback) {
      callback();
    }
  });
};

/**
 * Load a project based on plugin.
 * Project wouldn't be loaded if plugin wasn't exists.
 *
 * @param {string} filePath Path where project exists.
 * @param {function} [callback]
 */
export const loadProject = (filePath, callback) => {
  fs.readFile(filePath, "utf-8", (error, content) => {
    const { dialog } = remote;

    if (error) {
      dialog.showErrorBox("Error", error.message);
      return;
    }

    try {
      const { recentProjects, plugins } = store.getState();
      const { project, tables, fields, relations } = JSON.parse(content);
      const paths = [osConfigPath, appConfigPath, pluginsPath];
      const remainings = [...new Set([filePath, ...recentProjects])];
      const recents = remainings.slice(0, 10);
      const data = recents.join("\n");
      const plugin = plugins.find(item => item.id === project.pluginID);

      paths.forEach(path => {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      });

      if (!plugin) {
        throw new Error("Plugin not found");
      }

      fs.writeFileSync(recentProjectsPath, data);
      store.dispatch(setRecentProjects(recents));
      store.dispatch(setPlugin(plugin));

      store.dispatch(
        setProject({
          ...project,
          filePath,
          zoom: project.zoom || 100
        })
      );

      if (tables) {
        const addRef = table => ({ ...table, ref: createRef() });
        const newTables = tables.map(addRef);

        store.dispatch(setTables(newTables));
      }

      if (fields) {
        store.dispatch(setFields(fields));
      }

      if (relations) {
        store.dispatch(setRelations(relations));
      }

      if (callback) {
        callback();
      }
    } catch (error) {
      dialog.showErrorBox("Error", `${error.message} in ${filePath}`);
    }
  });
};

/**
 * Export project based on plugin.
 *
 * @param {function} [callback]
 */
export const exportProject = callback => {
  const { dialog } = remote;
  const mainWindow = remote.getCurrentWindow();

  dialog.showOpenDialog(
    mainWindow,
    {
      properties: ["openDirectory"]
    },
    dirPaths => {
      if (!dirPaths) {
        return;
      }

      const { project, tables, fields, relations, plugin } = store.getState();
      const dirPath = dirPaths[0];
      const data = {
        project,
        tables,
        fields,
        relations
      };
      const { onExport } = plugin.main;
      const { paths = [], files = [] } = onExport(dirPath, data) || {};

      paths.forEach(path => {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      });

      files.forEach(file => fs.writeFileSync(file.path, file.content));

      if (callback) {
        callback();
      }
    }
  );
};

/**
 * Import new plugin.
 *
 * @param {function} [callback]
 */
export const importPlugin = callback => {
  const { dialog } = remote;
  const mainWindow = remote.getCurrentWindow();

  dialog.showOpenDialog(
    mainWindow,
    {
      properties: ["openDirectory"]
    },
    dirPaths => {
      if (!dirPaths) {
        return;
      }

      try {
        const dirPath = dirPaths[0];
        const manifestPath = `${dirPath}/manifest.json`;
        const manifestContent = fs.readFileSync(manifestPath, "utf-8");
        const manifest = JSON.parse(manifestContent);
        const targetPath = `${pluginsPath}/${manifest.id}`;
        const paths = [osConfigPath, appConfigPath, pluginsPath, targetPath];
        const files = ["manifest.json", "main.js", "icon.png", "README.md"];

        paths.forEach(path => {
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
        });

        files.forEach(file => {
          const fromPath = `${dirPath}/${file}`;
          const toPath = `${targetPath}/${file}`;

          fs.copySync(fromPath, toPath);
        });

        if (callback) {
          callback();
        }
      } catch (error) {
        dialog.showErrorBox("Error", error.message);
      }
    }
  );
};
