import { ipcRenderer } from 'electron'
import { type Action } from 'Context'
import { type AsyncBackupIPCFromMain, EAsyncMessageIPCFromMain, EAsyncMessageIPCFromRenderer, type AsyncTimerTickIPCFromMain } from 'shared/types'
import { setLocalStorage } from 'utilities'

export const useIPCAsyncMessageEffect = (dispatch: React.Dispatch<Action>) => {
  ipcRenderer.on(EAsyncMessageIPCFromMain.UpdateAvailable, () => {
    ipcRenderer.removeAllListeners(EAsyncMessageIPCFromMain.UpdateAvailable)
    dispatch({ type: 'ADD_MESSAGE', payload: { text: 'A new update is available. Downloading now...', severity: 'info' } })
  })

  ipcRenderer.on(EAsyncMessageIPCFromMain.UpdateDownloaded, () => {
    ipcRenderer.removeAllListeners(EAsyncMessageIPCFromMain.UpdateDownloaded)
    dispatch({ type: 'ADD_MESSAGE', payload: { text: 'Update Downloaded. It will be installed on restart. Restart now?', severity: 'info', cancelCallbackText: 'Later', confirmCallbackText: 'Restart', confirmCallback: () => { ipcRenderer.send(EAsyncMessageIPCFromRenderer.RestartApp) } } })
  })

  ipcRenderer.on(EAsyncMessageIPCFromMain.BackupCompleted, (_event, message: AsyncBackupIPCFromMain['body']) => {
    if (message.success) {
      setLocalStorage('lastBackup', message.timestamp)
      dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'lastBackup', value: message.timestamp } })
    } else {
      dispatch({ type: 'ADD_MESSAGE', payload: { text: 'Backup Failed. Please try again.', severity: 'error' } })
    }
  })

  ipcRenderer.on(EAsyncMessageIPCFromMain.TimerTick, (_event, message: AsyncTimerTickIPCFromMain['body']) => {
    dispatch({ type: 'UPDATE_TIMER', payload: { timerDuration: message.timerDuration } })
  })
}
