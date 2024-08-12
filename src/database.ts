import Dexie, { type Table } from 'dexie'
import { type TProject, type TProjectEntry } from 'types'

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>

  projectEntries!: Table<TProjectEntry>

  constructor() {
    super('time-tracker')
    this.version(1).stores({
      projects: 'id, title, status',
      projectEntries: 'id, projectId'
    })
  }
}

const db = new MySubClassedDexie()

export default db
