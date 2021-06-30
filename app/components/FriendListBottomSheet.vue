<template>
  <GridLayout>
    <StackLayout verticalAlignment="stretch" horizontalAlignment="stretch">
      <template v-for="friend in friendList">
        <StackLayout :key="friend">
          <Label :text="friend" margin="20" @tap="close({ action: 'option', option: friend })" />
        </StackLayout>
      </template>
      <StackLayout>
        <Label @tap="close({ action: 'add' })">Add Friend</Label>
      </StackLayout>
    </StackLayout>
  </GridLayout>
</template>

<script>
export default {
  name: 'FriendListBottomSheet',

  data () {
    return {
      friendList: [
          '12asds3dssds',
          '2321312asdasdas',
          '1rasf3r2324'
      ]
    }
  },

  methods: {
    close (payload) {
      this.$closeBottomSheet(payload)
    }
  }
}
</script>
