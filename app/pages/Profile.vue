<template>
    <DomainPage title="Profile">
        <GridLayout rows="auto, auto, 300">
            <GridLayout columns="*" rows="auto, auto, auto, auto, auto" marginLeft="25" marginRight="25">
              <Label row="0">Display Name: {{ this.$store.state.auth.data.displayName }}</Label>
              <Label row="1">E-Mail: {{ this.$store.state.auth.data.email }}</Label>
              <Label row="2">UID: {{ this.$store.state.auth.data.uid }}</Label>
              <Label row="3" textWrap>FCM: {{ this.$store.state.auth.storeData.fcmToken || 'no' }}</Label>
              <Button row="4">Test</Button>
            </GridLayout>
            <Label row="1" verticalAlignment="center" horizontalAlignment="center">
              PQRC to be added by trusted client:
            </Label>
            <ProfileQR row="2" />
        </GridLayout>
    </DomainPage>
</template>

<script>
import DomainPage from '~/components/DomainPage'
import { DrawerNavigationService } from '~/services/drawer-navigation.service'
import ProfileQR from '~/components/ProfileQR'

export default {
  name: 'Profile',

  components: {
    DomainPage,
    ProfileQR
  },

  mounted () {
    DrawerNavigationService.getInstance().updateActivePage('profile')
  }
}
</script>

<style scoped lang="scss">
</style>
