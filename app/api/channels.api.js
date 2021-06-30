import UsersDb from '~/firestore/users.db'

export async function retrieveFriendsFromFriendList (friendList = []) {
  if (friendList.length === 0) return []

  return new UsersDb().fetchManyByID(friendList)
}
