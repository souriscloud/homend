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
import DrawerContent from '~/components/DrawerContent'
import AuthPage from '~/pages/AuthPage'

export default {
  name: 'App',
  components: {
    AuthPage,
    DrawerContent
  },

  data () {
    return {
      transition: new SlideInOnTopTransition()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@nativescript/theme/scss/variables/blue';
</style>
