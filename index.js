const electron = require("electron");
const { BrowserWindow, app, Menu, ipcMain } = electron;

let win;
let subWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile("index.html");
}

app.on("ready", () => {
  createWindow();
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        click() {
          popupWindow();
        },
      },
      {
        label: "Clear Todos",
        click() {
          win.webContents.send("user:clear", "");
        },
      },
      {
        label: "Quit",
        accelerator: "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

function popupWindow() {
  subWindow = new BrowserWindow({
    height: 200,
    width: 300,
    title: "What do you like",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  // mainWindow.loadURL(`file://${__dirname}/add.html`);
  subWindow.loadFile("add.html");
  subWindow.on("closed", () => (subWindow = null));
}

ipcMain.on("user:like", (event, likes) => {
  win.webContents.send("user:like", likes);
  subWindow.close();
});


if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      { role: "reload" },
      {
        label: "Toggle Developer Tools",
        accelerator: "Ctrl+T",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
