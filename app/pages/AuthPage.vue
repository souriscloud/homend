<template>
  <Page class="page" :actionBarHidden="true">
    <GridLayout width="100%" height="100%">
      <GridLayout horizontalAlignment="center" verticalAlignment="center" rows="auto, auto, auto">
        <Button row="0" @tap="loginWithGoogle" paddingLeft="10" paddingRight="10" backgroundColor="BlanchedAlmond">Login with Google</Button>
<!--        <Label class="fas" :text="'fa-birthday-cake'|fonticon" row="1"/>-->
<!--        <Button row="2" @tap="onDrawerButtonTap">Open drawer</Button>-->
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import Home from '~/pages/Home'
import * as DrawerService from '~/services/drawer.service'
import { AsyncDelay } from '~/helpers'

export default {
  name: 'AuthPage',

  methods: {
    async loginWithGoogle () {
      const success = await this.$store.dispatch('auth/logIn')
      if (success) {
        this.$navigateTo(Home, { clearHistory: true })
      }
    },

    onDrawerButtonTap () {
      DrawerService.showDrawer()
    }
  },

  async mounted () {
    await AsyncDelay(200)
    if (this.$store.state.auth.loggedIn) {
      this.$navigateTo(Home, { clearHistory: true })
    }
  }
}
</script>

<style scoped>

</style>
