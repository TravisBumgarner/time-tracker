import { ipcRenderer } from 'electron'
import moment, { type Moment } from 'moment'

import { type AppStartIPCFromMain, type AsyncMessageIPCFromRenderer, type ESyncMessageIPC, type SyncMessageIPCFromRenderer } from 'shared/types'
import { DATE_ISO_DATE_MOMENT_STRING, EBackupInterval, EColorTheme, EProjectStatus, type TDateISODate } from './types'

const projectStatusLookup: Record<EProjectStatus, string> = {
  [EProjectStatus.INACTIVE]: 'Inactive',
  [EProjectStatus.ACTIVE]: 'Active'
}

const backupIntervalLookup: Record<EBackupInterval, string> = {
  [EBackupInterval.DAILY]: 'Every Day',
  [EBackupInterval.WEEKLY]: 'Every Week',
  [EBackupInterval.OFF]: 'Off'
}

const colorThemeOptionLabels: Record<EColorTheme, string> = {
  [EColorTheme.BEACH]: 'Beach',
  [EColorTheme.RETRO_FUTURE]: 'Retro Future',
  [EColorTheme.UNDER_THE_SEA]: 'Under the Sea',
  [EColorTheme.CONTRAST]: 'High Contrast'
}

const formatDateDisplayString = (date: Moment | null): string => {
  if (date === null) {
    return ''
  }

  return moment(date, DATE_ISO_DATE_MOMENT_STRING).format('MMM Do')
}

const formatDateKeyLookup = (date: moment.Moment): TDateISODate => {
  return date.format('YYYY-MM-DD HH:mm:ss') as TDateISODate
}

const formatDurationDisplayString = (rawMS: number) => {
  const hours = Math.floor(rawMS / 1000 / 60 / 60)
  const minutes = Math.floor(rawMS / 1000 / 60) % 60

  let output = ''
  if (hours > 0) output += `${hours}h `
  output += `${minutes}m`
  return output
}

const saveFile = async (fileName: string, jsonData: unknown) => {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', () => {
    setTimeout(() => { URL.revokeObjectURL(a.href) }, 30 * 1000)
  })
  a.click()
}

export interface TLocalStorage {
  backupDir: string
  lastBackup: string
  hasDoneWarmStart: boolean
  colorTheme: EColorTheme
  backupInterval: EBackupInterval
}

const getLocalStorage = (key: keyof TLocalStorage) => {
  const result = localStorage.getItem(key)
  return result ? JSON.parse(result) : ''
}

const setLocalStorage = <T extends TLocalStorage>(key: keyof T, value: T[keyof T]) => {
  localStorage.setItem(key as string, JSON.stringify(value))
}

interface MessageReturnTypeMap {
  [ESyncMessageIPC.AppStart]: AppStartIPCFromMain['body']
}

const sendSyncIPCMessage = async <T extends SyncMessageIPCFromRenderer>(
  message: T
): Promise<MessageReturnTypeMap[T['type']]> => {
  return (await ipcRenderer.invoke(
    message.type,
    message.body
  )) as MessageReturnTypeMap[T['type']]
}

const sendAsyncIPCMessage = <T extends AsyncMessageIPCFromRenderer>(
  message: T
) => {
  // Responses end up in useIPCRendererEffect.ts
  ipcRenderer.send(message.type, message.body)
}

export {
  backupIntervalLookup, colorThemeOptionLabels, formatDateDisplayString,
  formatDateKeyLookup,
  formatDurationDisplayString, getLocalStorage, projectStatusLookup, saveFile, sendAsyncIPCMessage, sendSyncIPCMessage, setLocalStorage
}
