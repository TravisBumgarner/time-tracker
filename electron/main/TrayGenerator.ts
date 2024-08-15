import { Menu, Tray, type BrowserWindow } from 'electron'
import appIcon from '../../build/icon.png?asset'

class TrayGenerator {
    tray: any
    mainWindow: BrowserWindow

    constructor(mainWindow: BrowserWindow) {
        this.tray = null
        this.mainWindow = mainWindow
    }

    getWindowPosition = () => {
        const windowBounds = this.mainWindow.getBounds()
        const trayBounds = this.tray.getBounds()
        const x = Math.round(
            trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
        )
        const y = Math.round(trayBounds.y + trayBounds.height)
        return { x, y }
    }

    showWindow = () => {
        const position = this.getWindowPosition()
        this.mainWindow.setPosition(position.x, position.y, false)
        this.mainWindow.show()
        this.mainWindow.setVisibleOnAllWorkspaces(true)
        this.mainWindow.focus()
        this.mainWindow.setVisibleOnAllWorkspaces(false)
    }

    toggleWindow = () => {
        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide()
        } else {
            this.showWindow()
        }
    }

    rightClickMenu = () => {
        this.tray.popUpContextMenu(Menu.buildFromTemplate([
            {
                role: 'quit',
                accelerator: 'Command+Q'
            }
        ]))
    }

    createTray = () => {
        this.tray = new Tray(appIcon)
        this.tray.setIgnoreDoubleClickEvents(true)
        this.tray.on('click', this.toggleWindow)
        this.tray.on('right-click', this.rightClickMenu)
    }
}

export default TrayGenerator
