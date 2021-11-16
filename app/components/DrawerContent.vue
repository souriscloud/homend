<template>
  <GridLayout rows="auto, auto, *" class="nt-drawer__content">
    <Label row="0" horizontalAlignment="left" verticalAlignment="center" marginTop="15" marginLeft="10" marginBottom="10" fontSize="20" class="fas" :text="'fa-angle-left'|fonticon" @tap="hideDrawer" />
    <Label row="0" :visibility="$store.state.auth.loggedIn ? 'visible' : 'collapsed'"
           horizontalAlignment="right" verticalAlignment="center" marginTop="15" marginRight="10" marginBottom="10" fontSize="20" @tap="onSignOutTap">
      <FormattedString>
        <Span>Sign Out </Span>
        <Span class="fas" :text="'fa-power-off'|fonticon" />
      </FormattedString>
    </Label>
    <StackLayout row="1" class="nt-drawer__header">
      <Image :visibility="$store.state.auth.loggedIn ? 'visible' : 'collapsed'" class="nt-drawer__header-image" :src="$store.state.auth.loggedIn && $store.state.auth.data.photoURL ? $store.state.auth.data.photoURL : ''" stretch="aspectFill" />
      <Label :visibility="$store.state.auth.loggedIn ? 'visible' : 'collapsed'" class="nt-drawer__header-brand" :text="userNameText" />
      <Label textWrap class="nt-drawer__header-footnote" :text="emailText" />
    </StackLayout>

    <ScrollView :visibility="$store.state.auth.loggedIn ? 'visible' : 'collapsed'" row="2" class="nt-drawer__body">
      <StackLayout>
        <GridLayout v-for="[navigationItemPage, navigationItem] in Object.entries(navigation)" :key="`navitem-${navigationItemPage}`" columns="auto, *" :class="getNavigationItemClass(navigationItemPage)" @tap="onNavigationItemTap(navigationItemPage)">
          <Label col="0" class="nt-icon fas" :text="'fa-home'|fonticon" />
          <Label col="1" class="p-r-10" :text="navigationItem.title" />
        </GridLayout>
        <GridLayout key="navitem-omnichat" columns="auto, *" :class="getNavigationItemClass('omnichat')" @tap="navigateOmniChat">
          <Label col="0" class="nt-icon fas" :text="'fa-home'|fonticon" />
          <Label col="1" class="p-r-10" text="OmniChat" />
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </GridLayout>
</template>

<script>
import { DrawerNavigationService } from '~/services/drawer-navigation.service'
import * as DrawerService from '~/services/drawer.service'
import Chat from '~/pages/Chat'

export default {
  name: 'DrawerContent',

  computed: {
    userNameText () {
      if (this.$store.state.auth.loggedIn) {
        return this.$store.state.auth.data.displayName
      }

      return ''
    },

    emailText () {
      if (this.$store.state.auth.loggedIn) {
        return this.$store.state.auth.data.email
      }

      return 'Sign up with google to use HomEnd'
    }
  },

  data () {
    return {
      activePage: DrawerNavigationService.getInstance().drawerNavigationData.get('activePage'),

      navigation: {
        home: {
          title: 'Home'
        },
        profile: {
          title: 'Profile'
        },
        debug: {
          title: 'Debug'
        }
      }
    }
  },

  methods: {
    onNavigationItemTap (page) {
      console.log('onNavigationItemTap', page)
      if (page === this.activePage) return

      this.$navigateTo(require(`~/pages/${page.replace(/^\w/, (c) => c.toUpperCase())}.vue`).default, { clearHistory: true })
        .then(() => {
          DrawerService.hideDrawer()
        })
        .catch(err => {
          console.error('NavigationERROR')
          console.log(err)
        })
    },

    async navigateOmniChat () {
      console.log('navigating to omnichat page')
      await this.$store.dispatch('channels/selectOmniChannel')
      this.$navigateTo(Chat, {}).then(() => {
        DrawerService.hideDrawer()
      }).catch(err => console.error(err))
    },

    hideDrawer () {
      DrawerService.hideDrawer()
    },

    getNavigationItemClass (page) {
      if (this.isPageActive(page)) {
        return 'nt-drawer__list-item navitem-active'
      }

      return 'nt-drawer__list-item'
    },

    isPageActive (page) {
      return page === this.activePage || page === DrawerNavigationService.getInstance().drawerNavigationData.get('activePage')
    },

    onNavigationUpdate (event) {
      if (event.propertyName === 'activePage') {
        console.log('onNavigationUpdate[activePage]', event.value)
        this.activePage = event.value
      }
    },

    onHeaderImageTap () {
      if (this.$store.state.auth.loggedIn) {
        console.log('test')
      } else {
        DrawerService.hideDrawer()
      }
    },

    async onSignOutTap () {
      await this.$store.dispatch('auth/logOut')
      this.onNavigationItemTap('authPage')
    }
  },

  mounted () {
    DrawerNavigationService.getInstance().subscribe(this.onNavigationUpdate)
  },

  beforeDestroy() {
    DrawerNavigationService.getInstance().unsubscribe(this.onNavigationUpdate)
  }
}
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';
.fas {
  @include colorize($color: accent);
}

.navitem-active {
  @include colorize($color: accent);
}
</style>
