import GenericDb from '~/firestore/generic.db'

export default class UsersDb extends GenericDb {
  constructor () {
    super('users')
  }
}
