<template>
  <GridLayout rows="auto, *" class="nt-drawer__content">
    <StackLayout row="0" class="nt-drawer__header">
      <Label class="nt-drawer__header-image fas t-36" :text="$store.state.auth.loggedIn ? 'fa-birthday-cake' : 'fa-times-circle'|fonticon" />
      <Label :visibility="$store.state.auth.loggedIn ? 'visible' : 'collapsed'" class="nt-drawer__header-brand" text="User Name" />
      <Label class="nt-drawer__header-footnote" :text="$store.state.auth.loggedIn ? $store.state.auth.test : 'Login to use HomEnd'" />
    </StackLayout>
  </GridLayout>
</template>

<script>
export default {
  name: 'DrawerContent'
}
</script>

<style scoped lang="scss">
// Start custom common variables
@import '@nativescript/theme/scss/variables/blue';
// End custom common variables
// Custom styles
</style>
