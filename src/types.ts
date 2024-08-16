type TYear = `${number}${number}${number}${number}`
type TMonth = `${number}${number}`
type TDay = `${number}${number}`
export type TDateISODate = `${TYear}-${TMonth}-${TDay}`
export const DATE_ISO_DATE_MOMENT_STRING = 'YYYY-MM-DD HH:mm'

export enum EProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface TProject {
  id: string
  title: string
  status: EProjectStatus
}

export interface TProjectEntry {
  id: string
  projectId: string
  details: string
  start: string
  end: string
}

export enum EBackupInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  OFF = 'OFF'
}

export enum EColorTheme {
  BEACH = 'BEACH',
  RETRO_FUTURE = 'RETRO_FUTURE',
  CONTRAST = 'CONTRAST',
  UNDER_THE_SEA = 'UNDER_THE_SEA'
}

export interface TSettings {
  colorTheme: EColorTheme
  backupInterval: EBackupInterval
  backupDir: string
}

export enum EActivePage {
  Home = 'Home',
  Charts = 'Charts',
}
