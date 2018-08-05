import { createRef } from "react";
import path from "path";
import pluralize from "pluralize";
import { format } from "date-fns";

import { setProject, updateProject } from "../store/actions/project";
import { setTables } from "../store/actions/tables";
import { setFields } from "../store/actions/fields";
import { setRelations } from "../store/actions/relations";
import { setRecentProjects } from "../store/actions/recentProjects";
import store from "../store/store";
import { modelTemplate, migrationTemplate } from "./template";
import { toSnakeCase } from "./formatter";

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

      const { recentProjects, activeExtension } = store.getState();
      const name = path.basename(filePath, ".json");
      const scheme = activeExtension.main.onInit();
      const { fields } = scheme;

      const project = {
        name,
        extensionID: activeExtension.id,
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
    if (error) {
      const { dialog } = remote;

      dialog.showErrorBox("Error", error.message);
      return;
    }

    const { recentProjects } = store.getState();
    const { project, tables, fields, relations } = JSON.parse(content);
    const { app } = remote;
    const osConfigPath = app.getPath("appData");
    const appConfigPath = `${osConfigPath}/schemator`;
    const fileRecents = `${appConfigPath}/recents.txt`;
    const remainings = [...new Set([filePath, ...recentProjects])];
    const recents = remainings.slice(0, 10);
    const data = recents.join("\n");

    fs.writeFileSync(fileRecents, data);
    store.dispatch(setRecentProjects(recents));

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
export const toLaravel = callback => {
  const { project, tables, fields } = store.getState();
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
      const exportPath = `${dirPath}/${project.name}`;
      const modelPath = `${exportPath}/app`;
      const databasePath = `${exportPath}/database`;
      const migrationPath = `${databasePath}/migrations`;

      fs.mkdirSync(exportPath);
      fs.mkdirSync(modelPath);
      fs.mkdirSync(databasePath);
      fs.mkdirSync(migrationPath);

      tables.forEach(table => {
        const byTable = field => field.tableID === table.id;

        const modelName = table.name;
        const tableName = pluralize(toSnakeCase(modelName));
        const date = format(table.timestamp, "YYYY_MM_DD_HHmmss");
        const modelFilename = `${modelName}.php`;
        const migrationFilename = `${date}_create_${tableName}_table.php`;
        const tableFields = fields.filter(byTable);
        const fillable = tableFields.map(item => item.name);
        const model = modelTemplate(modelName, fillable);
        const migration = migrationTemplate(
          modelName,
          table.options,
          tableFields
        );

        fs.writeFileSync(`${modelPath}/${modelFilename}`, model);
        fs.writeFileSync(`${migrationPath}/${migrationFilename}`, migration);
      });

      if (callback) {
        callback();
      }
    }
  );
};
