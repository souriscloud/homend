import GenericDb from '~/firestore/generic.db'

export default class ChannelsDb extends GenericDb {
  constructor () {
    super('channels')
  }

  async fetchOmniChannel () {
    return this.read('omnichannel')
  }

  async fetchUserChannel (uid1, uid2) {
    let result = null
    try {
      result = await this.read(`${uid1}-${uid2}`)
    } catch (errNotFound) {
      try {
        result = await this.read(`${uid2}-${uid1}`)
      } catch (errNotFoundEither) {
        // should I create new channel if no mutation was found?
        throw new Error('channel-doesnt-exist--create-new-channel')
      }
    }

    if (result) {
      result.userIndex = null
      if (result.user1 === uid1) result.userIndex = 1
      if (result.user2 === uid1) result.userIndex = 2
      result.otherParticipantUID = uid2
      return result
    } else throw new Error('channel-doesnt-exist--no-result-return')
  }

  async createUserChannel (uid1, uid2, topic = 'Topic was not set') {
    const channelData = {
      user1: uid1,
      user2: uid2,
      public: false,
      topic
    }
    const channelId = `${uid1}-${uid2}`
    return await this.create(channelData, channelId)
  }
}
