import GenericDb from '~/firestore/generic.db'

const constraintEqual = (property, equalTo) => ([property, '==', equalTo])

export default class UsersDb extends GenericDb {
  constructor () {
    super('users')
  }

  async fetchManyByID (ids = []) {
    if (ids.length === 0) return []

    const db = new UsersDb()
    const result = ids.map(async id => await db.read(id))
    return Promise.all(result)
  }
}
