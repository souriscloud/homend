<template>
  <GridLayout>
  <GridLayout class="notification-view" rows="auto, auto, auto">
    <GridLayout row="0" rows="74, auto">
      <Image row="0" verticalAlignment="center" horizontalAlignment="center" :src="to.photoURL" class="notification__pic" />
      <Label row="1" verticalAlignment="bottom" horizontalAlignment="center" :text="to.displayName" class="notification__name" />
    </GridLayout>
    <StackLayout row="1">
      <Label class="form-label">What to notify the other end about?</Label>
      <TextField class="notification-text-field" hint="Some short text..." v-model="messageText" />
    </StackLayout>
    <StackLayout row="2">
      <Button :isEnabled="messageText.trim().length > 1" @tap="close">Send</Button>
    </StackLayout>
  </GridLayout>
  </GridLayout>
</template>

<script>
import { fcmSendNotification } from '~/api/relay.api'

export default {
  name: 'FriendListBottomSheet',

  computed: {
    to () {
      return this.$store.state.channels.target
    }
  },

  data () {
    return {
      messageText: '',
      busy: false
    }
  },

  methods: {
    async close () {
      this.busy = true
      let success = null

      try {
        const response = await fcmSendNotification(
          this.$store.state.auth.data.uid,
          this.$store.state.auth.storeData.displayName,
          this.$store.state.auth.storeData.photoURL,
          this.$store.state.auth.fcmToken,
          this.to.fcmToken,
          this.messageText.trim()
        )
        console.log(response.content)
        success = true
      } catch (fcmError) {
        success = false
        console.log('error on sending fcm notification thru relay')
        console.log(fcmError)
      }

      this.busy = false
      this.$closeBottomSheet(success)
    }
  }
}
</script>

<style lang="scss" scoped>
.notification {
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

.form-label {
  margin-left: 5;
  font-size: 16;
  padding: 5;
}

.notification-text-field {
  font-size: 16;
  padding: 5;
  margin-bottom: 15;
  text-align: left;
  border-top-width: 1;
  border-left-width: 1;
  border-right-width: 1;
  border-bottom-width: 1;
  border-color: #4d4d4d;
  background-color: #fff;
  placeholder-color: #dfdfdf;
}
</style>
