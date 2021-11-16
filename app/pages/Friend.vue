<template>
    <DomainPage :title="friendData.displayName">
        <GridLayout>
            <GridLayout columns="*" rows="auto, auto, auto, auto, auto, auto" marginLeft="25" marginRight="25" marginTop="25">
              <Label row="0">Display Name: {{ friendData.displayName }}</Label>
              <Label row="1">E-Mail: {{ friendData.email }}</Label>
              <Label row="2">UID: {{ friendData.id }}</Label>
              <Label row="3" textWrap>FCM: {{ friendData.fcmToken }}</Label>
              <Button row="4" @tap="sendNotification">Send notification</Button>
              <Button row="5" @tap="openChat">Open chat</Button>
            </GridLayout>
        </GridLayout>
    </DomainPage>
</template>

<script>
import DomainPage from '~/components/DomainPage'
import Chat from '~/pages/Chat'
import SendNotificationBottomSheet from '~/components/SendNotificationBottomSheet'
import { DrawerNavigationService } from '~/services/drawer-navigation.service'
import { TNSFancyAlert } from '@nstudio/nativescript-fancyalert'

export default {
  name: 'Friend',

  props: {
    friendData: {
      type: Object,
      default: {
        displayName: 'NO_FRIEND'
      },
      required: true
    }
  },

  components: {
    DomainPage
  },

  methods: {
    async sendNotification () {
      await this.$store.dispatch('channels/setTarget', this.friendData)
      const success = await this.$showBottomSheet(SendNotificationBottomSheet, {
        animated: true
      })
      if (success) {
        console.log('success')
      } else {
        console.log('not success')
      }
      await this.$store.dispatch('channels/resetTarget')
    },

    async openChat () {
      await this.$store.dispatch('channels/switchChannel', this.friendData.id)
      this.$navigateTo(Chat, {}).catch(err => console.error(err))
    }
  },

  mounted () {
    DrawerNavigationService.getInstance().updateActivePage('friend')
  }
}
</script>

<style scoped lang="scss">
</style>
