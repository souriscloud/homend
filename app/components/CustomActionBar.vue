<template>
  <ActionBar>
    <GridLayout columns="auto, *, auto" width="100%">
      <Label class="fas" :text="'fa-bars'|fonticon" col="0" @tap="onDrawerButtonTap" />
      <Label :text="title" col="0" colSpan="2" horizontalAlignment="center" verticalAlignment="center" />
      <Label class="fas" :text="'fa-bars'|fonticon" col="2" />
    </GridLayout>
  </ActionBar>
</template>

<script>
import * as DrawerService from '~/services/drawer.service'

export default {
  name: 'CustomActionBar',
  props: ['title'],

  methods: {
    onDrawerButtonTap () {
      DrawerService.showDrawer()
    }
  }
}
</script>

<style scoped>

</style>
