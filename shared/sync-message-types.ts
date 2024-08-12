export enum ESyncMessageIPC {
  AppStart = 'app-start',
}

export interface AppStartIPCFromRenderer {
  type: ESyncMessageIPC.AppStart
  body: null
}

export interface AppStartIPCFromMain {
  type: ESyncMessageIPC.AppStart
  body: {
    backupDir: string
  }
}

export type SyncMessageIPCFromRenderer =
  | AppStartIPCFromRenderer
