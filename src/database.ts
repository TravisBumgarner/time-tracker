import Dexie, { type Table } from 'dexie'
import { type TProject, type TTask } from 'types'

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>

  tasks!: Table<TTask>

  constructor() {
    super('time-tracker')
    this.version(1).stores({
      projects: 'id, title, status',
      tasks: 'id, projectId, details'
    })
  }
}

const db = new MySubClassedDexie()

export default db
