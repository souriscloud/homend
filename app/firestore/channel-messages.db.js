import GenericDb from '~/firestore/generic.db'
import UsersDb from '~/firestore/users.db'
import { constraintEqual } from '~/firestore/_tools.db'

export function generateMessage(uid, body) {
  return {
    body,
    from: uid,
    sent_at: new Date(),
    received_at: null
  }
}

export default class ChannelMessagesDb extends GenericDb {
  constructor (channelId) {
    super(`channels/${channelId}/messages`)
  }

  async readAllOrdered () {
    const all = await this.readAll(null, { path: 'sent_at', dir: 'asc' })
    return Promise.all(all.map(async channelMessage => {
      return this.saltDocument(channelMessage)
    }))
  }

  async updateUnread(fromUID) {
    const allUnread = await this.readAll([constraintEqual('received_at', null), constraintEqual('from', fromUID)])
    for (const message of allUnread) {
      await this.updateMessageReceivedAt(message.id)
    }
  }

  async saltDocument(doc) {
    const from = await (new UsersDb()).read(doc.from)
    const photoURL = from ? from.photoURL : 'https://static-cdn.jtvnw.net/jtv_user_pictures/ea3d506d-0339-40e7-ae44-eb104d5a546b-profile_image-70x70.png'
    return {
      ...doc,
      messagePhotoURL: photoURL
    }
  }

  async updateMessageReceivedAt(messageId) {
    return this.update(messageId, {
      received_at: new Date()
    })
  }

  async getChatView (ownerUID) {
    // should return messages parsed as ownerUID is the right part of chat (the other author is left part)
  }
}
