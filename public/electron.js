const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: path.join(__dirname, "icons/128x128.png")
  });

  const startURL =
    process.env.ELECTRON_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true
    });

  // and load the main URL of the app.
  mainWindow.loadURL(startURL);
  mainWindow.maximize();
  mainWindow.show();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createWindow);

if (process.env.NODE_ENV === "development") {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS
  } = require("electron-devtools-installer");

  app.on("ready", () => {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
      installExtension(extension)
        .then(name => console.log(`Added Extension: ${name}`))
        .catch(err => console.log("An error occurred: ", err));
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
