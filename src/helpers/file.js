import { createRef } from "react";
import path from "path";

import { setProject, updateProject } from "../store/actions/project";
import { setTables } from "../store/actions/tables";
import { setFields } from "../store/actions/fields";
import { setRelations } from "../store/actions/relations";
import { setRecentProjects } from "../store/actions/recentProjects";
import store from "../store/store";
import { setExtension } from "../store/actions/extension";

const { remote } = window.require("electron");
const fs = window.require("fs");

/**
 * Open dialog to create new project file based on extension.
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

      const { recentProjects, extension } = store.getState();
      const name = path.basename(filePath, ".json");
      const scheme = extension.main.onInit();
      const { fields } = scheme;

      const project = {
        name,
        extensionID: extension.id,
        timestamp: Date.now(),
        zoom: 100
      };

      const tables = scheme.tables.map(table => ({
        ...table,
        ref: createRef()
      }));

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

        const { app } = remote;
        const osConfigPath = app.getPath("appData");
        const appConfigPath = `${osConfigPath}/schemator`;
        const fileRecents = `${appConfigPath}/recents.txt`;
        const remainings = [...new Set([filePath, ...recentProjects])];
        const recents = remainings.slice(0, 10);
        const data = recents.join("\n");

        fs.writeFileSync(fileRecents, data);
        store.dispatch(setRecentProjects(recents));
        store.dispatch(setProject({ ...project, filePath, isModified: false }));
        store.dispatch(setTables(tables));
        store.dispatch(setFields(fields));
        store.dispatch(setRelations([]));
      });
    }
  );
};

/**
 * Open dialog to load existing project
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
 * Save current project
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
 * Load a project
 *
 * @param {string} filePath
 * @param {function} [callback]
 */
export const loadProject = (filePath, callback) => {
  fs.readFile(filePath, "utf-8", (error, content) => {
    const { dialog } = remote;

    if (error) {
      dialog.showErrorBox("Error", error.message);
      return;
    }

    const { recentProjects, extensions } = store.getState();
    const { project, tables, fields, relations } = JSON.parse(content);
    const { app } = remote;
    const osConfigPath = app.getPath("appData");
    const appConfigPath = `${osConfigPath}/schemator`;
    const fileRecents = `${appConfigPath}/recents.txt`;
    const remainings = [...new Set([filePath, ...recentProjects])];
    const recents = remainings.slice(0, 10);
    const data = recents.join("\n");
    const extension = extensions.find(item => item.id === project.extensionID);

    if (!extension) {
      dialog.showErrorBox("Error", "Extension not found !");
      return;
    }

    fs.writeFileSync(fileRecents, data);
    store.dispatch(setRecentProjects(recents));
    store.dispatch(setExtension(extension));

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
  });
};

/**
 * Export to Laravel model and migration
 *
 * @param {function} [callback]
 */
export const exportProject = callback => {
  const { project, tables, fields, extension } = store.getState();
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

      const dirPath = dirPaths[0];

      const { paths, files } = extension.main.onExport(dirPath, {
        project,
        tables,
        fields
      });

      paths.forEach(path => fs.mkdirSync(path));
      files.forEach(file => fs.writeFileSync(file.path, file.content));

      if (callback) {
        callback();
      }
    }
  );
};
