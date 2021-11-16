import { Http } from '@nativescript/core'

const relayEndpoint = 'https://fcm-relay.aytos.souris.cloud/fcm'

export async function fcmSendNotification (fromUID, fromDisplayName, fromPhotoURL, fromToken, toToken, message) {
  const requestContent = {
    type: 'message',
    from: {
      uid: fromUID,
      displayName: fromDisplayName,
      photoURL: fromPhotoURL,
      token: fromToken
    },
    to: {
      token: toToken
    },
    message: {
      text: message,
      data: {
        homend_sender: fromDisplayName,
        homend_message: message
      }
    }
  };
  const content = JSON.stringify(requestContent);
  return Http.request({
    url: relayEndpoint,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    content
  })
}
