<template>
    <DomainPage :title="friendData.displayName || 'asd'">
        <GridLayout>
            <GridLayout columns="*" rows="auto, auto, auto, auto, auto, auto" marginLeft="25" marginRight="25" marginTop="25">
              <Label row="0">Display Name: {{ friendData.displayName || 'asd' }}</Label>
              <Label row="1">E-Mail: {{ friendData.email || 'asd' }}</Label>
              <Label row="2">UID: {{ friendData.id || 'asd' }}</Label>
              <Label row="3" textWrap>FCM: {{ friendData.fcmToken || 'no' }}</Label>
              <Button row="4">Send notification</Button>
              <Button row="5">Open chat</Button>
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
