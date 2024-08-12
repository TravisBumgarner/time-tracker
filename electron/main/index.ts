import { BrowserWindow, Menu, Notification, app, ipcMain, shell } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import moment from 'moment'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { release } from 'node:os'
import { join, resolve } from 'node:path'

import { EAsyncMessageIPCFromMain, EAsyncMessageIPCFromRenderer, ESyncMessageIPC, type AppStartIPCFromMain, type AsyncBackupIPCFromMain, type AsyncBackupIPCFromRenderer, type AsyncNotificationIPCFromRenderer, type AsyncStartTimerIPCFromRenderer } from '../../shared/types'
import { DATE_BACKUP_DATE } from '../../shared/utilities'
import { isDebugProduction, isDev } from './config'
import menu from './menu'
import Timer from './timer'
import { update } from './update'

Menu.setApplicationMenu(menu)

log.info('backend logs intialized')
log.transports.file.level = 'info'
autoUpdater.logger = log

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
async function createWindow() {
  win = new BrowserWindow({
    width: 840,
    height: 700,
    minWidth: 840,
    minHeight: 700,
    x: 0,
    y: 0,
    title: isDev ? 'DEV MODE' : 'Todo Today',
    icon: join(process.env.VITE_PUBLIC, 'icon.icns'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (url) { // electron-vite-vue#298
    await win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    if (isDebugProduction) {
      win.webContents.openDevTools()
    }
    await win.loadFile(indexHtml)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) void shell.openExternal(url)
    return { action: 'deny' }
  })

  win.once('ready-to-show', () => {
    void autoUpdater.checkForUpdatesAndNotify()
  })

  // Apply electron-updater
  update(win)
}

void app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    void createWindow()
  }
})

let timer: Timer

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    void childWindow.loadURL(`${url}#${arg}`)
  } else {
    void childWindow.loadFile(indexHtml, { hash: arg })
  }
})

const BACKUPS_DIR = resolve(app.getPath('documents'), app.name, 'backups')
if (!existsSync(BACKUPS_DIR)) {
  mkdirSync(BACKUPS_DIR, { recursive: true })
}

const timerTickCallback = (timerDuration: number) => {
  if (win) {
    win.webContents.send(EAsyncMessageIPCFromMain.TimerTick, { timerDuration })
  }
}

ipcMain.on(EAsyncMessageIPCFromRenderer.StartTimer, async (_, arg: AsyncStartTimerIPCFromRenderer['body']) => {
  timer = new Timer(timerTickCallback)
  timer.start(arg.duration)
})

ipcMain.on(EAsyncMessageIPCFromRenderer.PauseTimer, async () => {
  timer.pause()
})

ipcMain.on(EAsyncMessageIPCFromRenderer.ResetTimer, async () => {
  timer.reset()
})

ipcMain.on(EAsyncMessageIPCFromRenderer.ResumeTimer, async () => {
  timer.resume()
})

ipcMain.handle(ESyncMessageIPC.AppStart, async (): Promise<AppStartIPCFromMain['body']> => {
  return {
    backupDir: BACKUPS_DIR
  }
})

ipcMain.on(EAsyncMessageIPCFromRenderer.CreateBackup, async (event, arg: AsyncBackupIPCFromRenderer['body']) => {
  if (win) {
    try {
      writeFileSync(resolve(BACKUPS_DIR, arg.filename), arg.data, 'utf8')
      const message: AsyncBackupIPCFromMain['body'] = { success: true, timestamp: moment().format(DATE_BACKUP_DATE) }
      win.webContents.send(EAsyncMessageIPCFromMain.BackupCompleted, message)
    } catch (e) {
      const message: AsyncBackupIPCFromMain['body'] = { success: false }
      win.webContents.send(EAsyncMessageIPCFromMain.BackupCompleted, message)
    }
  } else {
    log.error(EAsyncMessageIPCFromMain.BackupCompleted, 'No window available')
  }
})

ipcMain.on(EAsyncMessageIPCFromRenderer.CreateNotification, async (event: any, arg: AsyncNotificationIPCFromRenderer['body']) => {
  console.log('notification received')
  new Notification(arg).show()
})

autoUpdater.on('update-available', () => {
  log.info('update-available')
  if (win) {
    win.webContents.send(EAsyncMessageIPCFromMain.UpdateAvailable)
    void autoUpdater.downloadUpdate()
  } else {
    log.error(EAsyncMessageIPCFromMain.UpdateAvailable, 'No window available')
  }
})

autoUpdater.on('update-downloaded', () => {
  log.info('update-downloaded')
  if (win) {
    win.webContents.send(EAsyncMessageIPCFromMain.UpdateDownloaded)
  } else {
    log.error(EAsyncMessageIPCFromMain.UpdateDownloaded, 'No window available')
  }
})

ipcMain.on(EAsyncMessageIPCFromRenderer.RestartApp, () => {
  autoUpdater.quitAndInstall()
})
