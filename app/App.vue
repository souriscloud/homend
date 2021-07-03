<template>
  <RadSideDrawer ref="drawer" drawerLocation="left" gesturesEnabled="true" :drawerTransition="transition">
    <StackLayout ~drawerContent backgroundColor="#9d9d9d">
      <DrawerContent />
    </StackLayout>
    <Frame ~mainContent ref="drawerMainContent">
      <AuthPage />
    </Frame>
  </RadSideDrawer>
</template>

<script>
import { SlideInOnTopTransition } from 'nativescript-ui-sidedrawer'
import { LocalNotifications } from '@nativescript/local-notifications'
import { firebase } from '@nativescript/firebase'
import { inappmessaging } from '@nativescript/firebase/inappmessaging'
import { Color } from '@nativescript/core'
import DrawerContent from '~/components/DrawerContent'
import AuthPage from '~/pages/AuthPage'
import { AsyncDelay } from '~/helpers'

export default {
  name: 'App',
  components: {
    AuthPage,
    DrawerContent
  },

  data () {
    return {
      transition: new SlideInOnTopTransition(),
      allowNotifications: false
    }
  },

  async created () {
    inappmessaging.onMessageImpression(message => {
      console.log('InAppMessaging [shown]')
      console.log(message)
    })

    inappmessaging.onMessageClicked(message => {
      console.log('InAppMessaging [clicked]')
      console.log(message)
    })

    await LocalNotifications.addOnMessageReceivedCallback(notificationData => {
      if (notificationData.event === 'button' && notificationData.response === 'yes') {
        console.log('Open reply dialog')
      } else {
        console.log('notification just consumed, no other actions taken')
      }
    })

    await AsyncDelay(200)
    this.allowNotifications = await LocalNotifications.hasPermission()

    if (this.allowNotifications) {
      await firebase.addOnMessageReceivedCallback(message => {
        if (message.foreground) {
          console.log('received foreground notworking notification so scheduling it 5secs from now')
          console.log(message)
          LocalNotifications.schedule([{
            id: message['google.message_id'],
            title: message.data['homend_sender'],
            body: message.data['homend_message'],
            bigTextStyle: true,
            color: new Color('green'),
            thumbnail: 'res://icon',
            forceShowWhenInForeground: true,
            channel: 'homend-vue-channel',
            at: new Date(new Date().getTime() + 5 * 1000),
            actions: [
              {
                id: 'yes',
                type: 'button',
                title: 'Reply',
                launch: true
              },
              {
                id: 'no',
                type: 'button',
                title: 'OK',
                launch: false
              }
            ]
          }])
        } else {
          console.log('probably background notification, so it was shown in android by default')
          console.log(message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@nativescript/theme/scss/variables/blue';
</style>
