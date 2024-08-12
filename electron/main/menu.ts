import { Menu, app, shell, type MenuItemConstructorOptions } from 'electron'
import { autoUpdater } from 'electron-updater'

import { isMac } from './config'

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'quit' }
      ]
    }]
    : []),
  {
    label: 'File',
    submenu: [
      ...(!isMac ? [{ role: 'about' }] : []),
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ]
        : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ]
        : [
          { role: 'close' }
        ])
    ]
  },
  {
    label: 'Support',
    submenu: [
      {
        label: 'Check for Updates',
        click: async () => await autoUpdater.checkForUpdatesAndNotify()
      },
      {
        label: 'Changelog',
        click: async () => { await shell.openExternal('http://todo.sillysideprojects.com/changelog') }
      },
      {
        label: 'Contact',
        click: async () => { await shell.openExternal('http://todo.sillysideprojects.com/contact') }
      },
      {
        label: 'Website',
        click: async () => { await shell.openExternal('http://todo.sillysideprojects.com/') }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[])

export default menu
