<template>
  <ActionBar class="action-bar" :flat="true">
    <NavigationButton :visibility="'collapsed'" width="0" height="0" />
    <GridLayout class="action-bar--view" rows="*" columns="auto, *, auto">
<!--  COLUMN 1 -->
      <Label :visibility="back ? 'collapsed' : 'visible'" class="fas" :text="'fa-bars'|fonticon" col="0" @tap="onDrawerButtonTap" />
      <Label :visibility="back ? 'visible' : 'collapsed'" class="fas" :text="'fa-chevron-left'|fonticon" col="0" @tap="onBackButtonTap" />

<!--  TITLE -->
      <Label :text="title" col="0" colSpan="3" horizontalAlignment="center" verticalAlignment="center" />

<!--  COLUMN 2 -->
      <GridLayout col="2" marginRight="5" marginTop="2">
        <Label class="fas" verticalAlignment="center" horizontalAlignment="center" :text="'fa-address-book'|fonticon" @tap="onRightButtonTap" />
      </GridLayout>
    </GridLayout>
  </ActionBar>
</template>

<script>
import FriendListBottomSheet from '~/components/FriendListBottomSheet'
import * as DrawerService from '~/services/drawer.service'
import { TNSFancyAlert } from '@nstudio/nativescript-fancyalert'

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

  computed: {
    isLoggedIn () {
      return this.$store.state.auth.loggedIn
    }
  },

  methods: {
    onDrawerButtonTap () {
      DrawerService.showDrawer()
    },

    onBackButtonTap () {
      this.$navigateBack()
    },

    async onRightButtonTap () {
      try {
        const option = await this.$showBottomSheet(FriendListBottomSheet, {
          animated: true
        })
        if (!option) return
        switch (option.action) {
          case 'add':
            await this.$navigateTo(require('~/pages/AddFriend').default, { clearHistory: true })
            break
          case 'option':
            const friendData = this.$store.state.channels.friends.filter(fr => fr.id === option.option)[0]
            console.log('friendData', friendData)
            if (friendData) {
              await this.$navigateTo(require('~/pages/Friend').default, { clearHistory: true, props: { friendData } })
            } else {
              console.log('No friend index')
            }
            break
          default:
            console.log('error onRightButtonTap')
            break;
        }
      } catch (err) {
        console.log('errrrrrrr')
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.action-bar {
  margin: 0;
  padding: 0;

  background-color: #dfdfdf;

  &--view {
    width: 100%;
    height: 100%;
  }
}
</style>
