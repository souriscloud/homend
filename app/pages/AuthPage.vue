<template>
  <Page class="page" :actionBarHidden="true">
    <GridLayout width="100%" height="100%">
      <GridLayout horizontalAlignment="center" verticalAlignment="center" rows="auto" columns="auto">
        <ActivityIndicator row="0" col="0" :busy="$store.state.auth.busy" color="Green" />
        <Label row="0" col="0" :visibility="$store.state.auth.busy ? 'collapsed' : 'visible'">You have to sign in using Google account!</Label>
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
    } else {
      await this.loginWithGoogle()
    }
  }
}
</script>

<style scoped>

</style>
