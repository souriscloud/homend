import UsersDb from '~/firestore/users.db'
import ChannelsDb from '~/firestore/channels.db'
import ChannelMessagesDb from '~/firestore/channel-messages.db'

export async function retrieveFriendsFromFriendList (friendList = []) {
  if (friendList.length === 0) return []

  return new UsersDb().fetchManyByID(friendList)
}

export async function retrieveUserChannel (uid1, uid2) {
  let channel = null
  try {
    channel = await (new ChannelsDb()).fetchUserChannel(uid1, uid2)
  } catch (channelError) {
    if (['channel-doesnt-exist--create-new-channel', 'channel-doesnt-exist--no-result-return'].includes(channelError.message)) {
      channel = await (new ChannelsDb()).createUserChannel(uid1, uid2)
    } else {
      console.error('[Channels] Error occurred')
      console.log(channelError)
    }
  }

  if (channel) channel.title = (await (new UsersDb()).read(uid2)).displayName

  return channel
}

export async function retrieveOmniChannel () {
  const channel = await (new ChannelsDb()).fetchOmniChannel()
  channel.title = 'OmniChannel'
  return channel
}

export async function isChannelValid (channelId) {
  return await new ChannelsDb().read(channelId) !== null
}

export async function retrieveChannelMessages (channelId) {
  const messages = await (new ChannelMessagesDb(channelId)).readAllOrdered()
  return messages
}

export async function updateChannelUnread (channelId, fromUID) {
  await (new ChannelMessagesDb(channelId)).updateUnread(fromUID)
}

export async function sendMessage (from, channelId, messageBody) {
  const message = await (new ChannelMessagesDb(channelId)).create({
    from,
    body: messageBody,
    sent_at: new Date(),
    received_at: null
  })
  return message
}
