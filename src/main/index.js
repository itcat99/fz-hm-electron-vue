import { app, BrowserWindow, Menu, dialog } from 'electron'
import fs from 'fs'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    useContentSize: true,
  })

  mainWindow.loadURL(winURL)

  // create menu
  const template = [{
    label: 'Window',
    role: 'windowMenu'
  }, {
    label: 'Dev',
    submenu: [{
      label: 'Open Dev Tools',
      accelerator: 'CmdOrCtrl+D',
      role: 'toggledevtools'
    }]
  }, {
    label: 'About',
    submenu: [{
      label: 'About me...',
      click() {
        dialog.showMessageBox({
          message: 'power by Electron/Vue.'
        })
      }
    }]
  }]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow();

  if (mainWindow) {
    let filePath = path.join(app.getPath('userData'), 'posts.txt');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.writeFile(filePath, '', err => {
          if (err) {
            console.error(err);
          }
        })
      } else {
        console.log('read file')
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow.webContents.send('initList', data.toString());
        });
      }
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
  if (mainWindow) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('save');
    })
  }
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
