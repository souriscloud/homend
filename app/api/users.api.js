import UsersDb from '~/firestore/users.db'

export async function createOrFetchUser ({ uid, email, displayName, photoURL }) {
  const userFromFirestore = await new UsersDb().read(uid)

  return userFromFirestore === null ? await new UsersDb().create({
    email,
    displayName,
    photoURL,
    completed: false,
    fcmToken: null,
    friendList: []
  }, uid) : userFromFirestore
}

export async function updateFCM (uid, token) {
  await new UsersDb().update(uid, {
    fcmToken: token
  })
}

export async function updateFriendList (uid, friendList = []) {
  await new UsersDb().update(uid, { friendList })
}

// export async function watchFriendlist ()
