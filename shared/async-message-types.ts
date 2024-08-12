export enum EAsyncMessageIPCFromRenderer {
  CreateNotification = 'create-notification',
  CreateBackup = 'create-backup',
  RestartApp = 'restart-app',
  StartTimer = 'start-timer',
  ResetTimer = 'reset-timer',
  PauseTimer = 'pause-timer',
  ResumeTimer = 'resume-timer'
}

export enum EAsyncMessageIPCFromMain {
  BackupCompleted = 'backup-completed',
  UpdateAvailable = 'update-available',
  UpdateDownloaded = 'update-downloaded',
  TimerTick = 'timer-tick',
}

export interface AsyncNotificationIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.CreateNotification
  body: {
    title: string
    body: string
  }
}

export interface AsyncBackupIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.CreateBackup
  body: {
    filename: string
    data: string
  }
}

export interface AsyncStartTimerIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.StartTimer
  body: {
    duration: number
  }
}

export interface AsyncRestartAppIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.RestartApp
  body: null
}

export interface AsyncResetTimerIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.ResetTimer
  body: null
}

export interface AsyncPauseTimerIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.PauseTimer
  body: null
}

export interface AsyncResumeTimerIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.ResumeTimer
  body: null
}

export interface AsyncBackupIPCFromMain {
  type: EAsyncMessageIPCFromMain.BackupCompleted
  body: {
    success: true
    timestamp: string
  } | {
    success: false
  }
}

export interface AsyncTimerTickIPCFromMain {
  type: EAsyncMessageIPCFromMain.TimerTick
  body: {
    timerDuration: number
  }
}

export type AsyncMessageIPCFromRenderer =
  | AsyncNotificationIPCFromRenderer
  | AsyncBackupIPCFromRenderer
  | AsyncStartTimerIPCFromRenderer
  | AsyncRestartAppIPCFromRenderer
  | AsyncResetTimerIPCFromRenderer
  | AsyncPauseTimerIPCFromRenderer
  | AsyncResumeTimerIPCFromRenderer
