<template>
    <DomainPage title="Debug">
        <GridLayout>
          <Button @tap="testLocalNotification">Test Local Notification</Button>
        </GridLayout>
    </DomainPage>
</template>

<script>
import DomainPage from '~/components/DomainPage'
import { Color } from '@nativescript/core'
import { DrawerNavigationService } from '~/services/drawer-navigation.service'
import { LocalNotifications } from '@nativescript/local-notifications'

export default {
  name: 'Debug',

  components: {
    DomainPage
  },

  methods: {
    testLocalNotification () {
      LocalNotifications.schedule([{
        id: 1,
        title: 'Would you like a Red Alert poster?',
        subtitle: 'This poster is awesome!',
        body: 'The big brown Vue app jumped over the lazy Angular app. The big brown Vue app jumped over the lazy Angular app. The big brown Vue app jumped over the lazy Angular app. The big brown Vue app jumped over the lazy Angular app.',
        bigTextStyle: false, // Allow more than 1 row of the 'body' text on Android, but setting this to true denies showing the 'image'
        color: new Color('green'),
        image: 'https://images-na.ssl-images-amazon.com/images/I/61mx-VbrS0L.jpg',
        thumbnail: 'https://2.bp.blogspot.com/-H_SZ3nAmNsI/VrJeARpbuSI/AAAAAAAABfc/szsV7_F609k/s200/emoji.jpg',
        forceShowWhenInForeground: true,
        channel: 'vue-channel',
        ticker: 'Special ticker text for Vue (Android only)',
        at: new Date(new Date().getTime() + (5 * 1000)), // 5 seconds from now
        actions: [
          {
            id: 'yes',
            type: 'button',
            title: 'Yes (and launch app)',
            launch: true
          },
          {
            id: 'no',
            type: 'button',
            title: 'No',
            launch: false
          }
        ]
      }])
    }
  },

  mounted () {
    DrawerNavigationService.getInstance().updateActivePage('debug')
  }
}
</script>

<style scoped lang="scss">
</style>
