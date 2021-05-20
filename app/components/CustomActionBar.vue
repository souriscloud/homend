<template>
  <ActionBar flat="true">
    <NavigationButton visibility="collapsed" />
    <GridLayout columns="auto, *, auto" width="100%" marginTop="5">
<!--  COLUMN 1 -->
      <Label :visibility="back ? 'collapsed' : 'visible'" class="fas" :text="'fa-bars'|fonticon" col="0" @tap="onDrawerButtonTap" />
      <Label :visibility="back ? 'visible' : 'collapsed'" class="fas" :text="'fa-chevron-left'|fonticon" col="0" @tap="onBackButtonTap" />

<!--  TITLE -->
      <Label :text="title" col="0" colSpan="3" horizontalAlignment="center" verticalAlignment="center" />

<!--  COLUMN 2 -->
<!--      <Label class="fas" :text="'fa-bars'|fonticon" col="2" />-->
    </GridLayout>
  </ActionBar>
</template>

<script>
import * as DrawerService from '~/services/drawer.service'

export default {
  name: 'CustomActionBar',
  props: {
    title: {
      type: String,
      required: true
    },
    back: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    onDrawerButtonTap () {
      DrawerService.showDrawer()
    },

    onBackButtonTap () {
      this.$navigateBack()
    }
  }
}
</script>

<style scoped>

</style>
