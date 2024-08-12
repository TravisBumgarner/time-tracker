import { Notification } from 'electron'

class Timer {
  private countdown: NodeJS.Timeout | null = null
  public timerDuration: number = 0
  private initialTime: number = 0
  private isPaused: boolean = false
  private readonly tickCallback: (tick: number) => void

  constructor(callback: (timerDuration: number) => void) {
    this.tickCallback = callback
  }

  start(timeInSeconds: number) {
    this.timerDuration = timeInSeconds
    this.initialTime = timeInSeconds

    this.countdown = setInterval(() => {
      if (!this.isPaused) {
        this.timerDuration--
        this.tickCallback(this.timerDuration)

        if (this.timerDuration <= 0) {
          this.reset()
          new Notification({ title: 'Timer', body: 'Time is up!' }).show()
        }
      }
    }, 1000)
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
  }

  reset() {
    if (this.countdown) {
      clearInterval(this.countdown)
      this.tickCallback(0)
      this.countdown = null
      this.timerDuration = this.initialTime
      return this.timerDuration
    }
  }
}

export default Timer
