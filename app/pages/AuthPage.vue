<template>
  <Page class="page">
    <GridLayout width="100%" height="100%">
      <GridLayout horizontalAlignment="center" verticalAlignment="center" rows="auto, auto, auto">
        <Button row="0" @tap="loginWithGoogle">Login with Google</Button>
        <Label class="fas" :text="'fa-birthday-cake'|fonticon" row="1"/>
        <Button row="2" @tap="onDrawerButtonTap">Open drawer</Button>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import Home from '~/pages/Home'
import * as DrawerService from '~/services/drawer.service'

export default {
  name: 'AuthPage',

  methods: {
    loginWithGoogle () {
      this.$store.dispatch('auth/logIn', {
        success: () => {
          this.$navigateTo(Home, { clearHistory: true })
        }
      })
    },

    onDrawerButtonTap () {
      DrawerService.showDrawer()
    }
  },

  mounted () {
    if (this.$store.state.auth.loggedIn) {
      this.$navigateTo(Home, { clearHistory: true })
    }
  }
}
</script>

<style scoped>

</style>
