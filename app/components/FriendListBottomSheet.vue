<template>
  <GridLayout class="friend-view">
    <CollectionView ref="lvFriends" :items="friendList" colWidth="20%" rowHeight="100" verticalAlignment="stretch" horizontalAlignment="stretch">
      <v-template>
        <GridLayout>
          <GridLayout :visibility="item.hasOwnProperty('id') ? 'visible' : 'collapsed'" class="friend" columns="*" rows="74, auto" @tap="close({ action: 'option', option: item.id })">
            <Image row="0" verticalAlignment="center" horizontalAlignment="center" :src="item.photoURL" class="friend__pic" />
            <Label row="1" verticalAlignment="bottom" horizontalAlignment="center" :text="item.displayName" class="friend__name" />
          </GridLayout>
          <GridLayout :visibility="item.hasOwnProperty('isAction') && item.isAction ? 'visible' : 'collapsed'" class="friend" columns="*" rows="74, auto" @tap="close({ action: item.action })">
            <Label row="0" verticalAlignment="center" horizontalAlignment="center" :text="'fa-plus-circle'|fonticon" class="fas friend__icon" />
            <Label row="1" verticalAlignment="bottom" horizontalAlignment="center" text="Add a friend" class="friend__name" />
          </GridLayout>
        </GridLayout>
      </v-template>
    </CollectionView>
  </GridLayout>
</template>

<script>
export default {
  name: 'FriendListBottomSheet',

  data () {
    return {}
  },

  computed: {
    friendList () {
      return this.$store.state.channels.friends.reverse().concat([{ isAction: true, action: 'add' }]).reverse()
    }
  },

  methods: {
    close (payload) {
      this.$closeBottomSheet(payload)
    }
  },

  async mounted () {
    await this.$store.dispatch('channels/refreshFriends')
  }
}
</script>

<style lang="scss" scoped>
.friend {
  &-view {
    margin: 10;
  }

  &__pic {
    width: 74;
    height: 74;
    border-radius: 32;
  }

  &__icon {
    width: 74;
    height: 74;
    font-size: 60;
    text-align: center;
    vertical-align: center;
    padding-top: 7;
  }

  &__name {
    margin-bottom: 10;
  }
}
</style>
