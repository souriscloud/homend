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
      console.log('notification received vole')
      console.log(notificationData)
    })

    await AsyncDelay(200)
    this.allowNotifications = await LocalNotifications.hasPermission()

    if (this.allowNotifications) {
      await firebase.addOnMessageReceivedCallback(message => {
        // if (message.foreground) {
          // console.log('received foreground notworking notification so scheduling it 5secs from now')
          console.log(message)
          LocalNotifications.schedule([{
            id: message['google.message_id'],
            title: `New message from '${message.data['homend_sender']}'`,
            body: `Here is text: ${message.data['homend_message']}`,
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
        // } else {
        //   console.log('should we do now some deeplinking or something? :-)')
        // }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@nativescript/theme/scss/variables/blue';
</style>
