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
import { DrawerNavigationService } from '~/services/drawer-navigation.service'

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
    sendNotification () {
      console.log('navigate to send notification')
    },
    openChat () {
      console.log('navigate to chat')
    }
  },

  mounted () {
    DrawerNavigationService.getInstance().updateActivePage('friend')
  }
}
</script>

<style scoped lang="scss">
</style>
