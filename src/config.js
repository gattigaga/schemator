const { remote } = window.require("electron");
const { app } = remote;

export const osConfigPath = app.getPath("appData");
export const appConfigPath = `${osConfigPath}/schemator`;
export const pluginsPath = `${appConfigPath}/plugins`;
export const recentProjectsPath = `${appConfigPath}/recents.txt`;
