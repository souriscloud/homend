<template>
  <DomainPage title="Chat">
    <GridLayout columns="*" rows="auto, *, auto">
      <GridLayout row="0" col="0" columns="auto, *, auto" rows="*">
        <Label row="0" col="0" class="btn-icon fas" horizontalAlignment="center" verticalAlignment="center" :text="'fa-bell'|fonticon" @tap="openNotification" />
        <Label row="0" col="0" colSpan="3" horizontalAlignment="center" verticalAlignment="center" :text="`${chatTitle} - ${chatTopic}`" />
        <Label row="0" col="2" class="btn-icon fas" horizontalAlignment="center" verticalAlignment="center" :text="'fa-info-circle'|fonticon" @tap="openDetail" />
      </GridLayout>
      <GridLayout row="1" col="0" class="messages-wrapper">
        <CollectionView ref="lvMessages" :items="messages" colWidth="100%" rowHeight="auto" verticalAlignment="stretch" horizontalAlignment="stretch">
          <v-template>
            <GridLayout>
              <GridLayout class="message" columns="auto, *" rows="auto, auto">
                <Image col="0" row="0" rowSpan="2" verticalAlignment="center" horizontalAlignment="center" :src="item.messagePhotoURL" class="message__pic" />
                <Label col="1" row="0" verticalAlignment="center" horizontalAlignment="left" :text="translateTime(item.sent_at)" class="message__date" />
                <Label col="1" row="1" verticalAlignment="top" horizontalAlignment="left" :text="item.body" class="message__body" textWrap />
              </GridLayout>
            </GridLayout>
          </v-template>
        </CollectionView>
        <ActivityIndicator horizontalAlignment="center" verticalAlignment="center" class="messages-loading" :busy="isLoading" :visibility="isLoading ? 'visible' : 'collapsed'" />
      </GridLayout>
      <GridLayout row="2" col="0">
        <GridLayout rows="*" columns="*, auto">
          <TextField @loaded="onTextFieldLoaded" row="0" col="0" :class="notification-text-field" hint="Message..." v-model="messageText" returnKeyType="send" @returnPress="sendMessage" autocapitalizationType="sentences" autocorrect="true" />
          <Label row="0" col="1" class="btn-icon fas" horizontalAlignment="center" verticalAlignment="center" :text="'fa-paper-plane'|fonticon" @tap="sendMessage" />
        </GridLayout>
      </GridLayout>
    </GridLayout>
  </DomainPage>
</template>

<script>
import DomainPage from '~/components/DomainPage'
import SendNotificationBottomSheet from '~/components/SendNotificationBottomSheet'
import { DrawerNavigationService } from '~/services/drawer-navigation.service'
import { TNSFancyAlert } from '@nstudio/nativescript-fancyalert'
import { timeFromNow } from '~/utils'

export default {
  name: 'Chat',

  props: {},

  computed: {
    messages () {
      return this.$store.state.channels.messages
    },

    loadingMessages () {
      return this.$store.state.channels.loadingMessages
    }
  },

  data () {
    return {
      chatTitle: 'loading title...',
      chatTopic: 'loading topic...',
      messageText: '',
      textFieldRef: null,
      isLoading: false,
      isOmni: false
    }
  },

  components: {
    DomainPage
  },

  methods: {
    openDetail () {
      console.log(this.$store.state.channels.currentChannel.otherParticipantUID)
      console.log('navigate out from chat')
    },

    sendMessage () {
      if (this.messageText.trim() === '') return
      const messageBody = this.messageText
      this.messageText = ''
      this.textFieldRef.dismissSoftInput()
      this.$store.dispatch('channels/sendMessage', messageBody)
    },

    openNotification () {
      console.log('chat notification tapped')
    },

    translateTime (date) {
      return timeFromNow(date)
    },

    setupChatPage () {
      if (this.$store.state.channels.currentChannel === null) return

      this.chatTitle = this.$store.state.channels.currentChannel.title
      this.chatTopic = this.$store.state.channels.currentChannel.topic

      this.$store.dispatch('channels/setLoadingMessagesStateCallback', this.scrollToLast)

      this.scrollToLast()
    },

    scrollToLast () {
      setTimeout(() => {
        const len = this.messages.length
        console.log('trying', len)
        this.$refs.lvMessages.scrollToIndex(len - 1)
      }, 200)
    },

    onTextFieldLoaded (args) {
      const { object } = args
      this.textFieldRef = object
    }
  },

  mounted () {
    if (this.$store.state.channels.currentChannel === null) {
      this.$navigateBack().catch(err => console.error(err))
      return
    }

    const isOmni = this.$store.state.channels.currentChannel && this.$store.state.channels.currentChannel.id === 'omnichannel'
    this.isOmni = isOmni
    DrawerNavigationService.getInstance().updateActivePage(isOmni ? 'omnichat' : 'chat')

    this.setupChatPage()
  },

  beforeDestroy () {
    this.$store.dispatch('channels/setLoadingMessagesStateCallback')
    this.$store.dispatch('channels/clearChannel')
      console.log('before destroy')
  }
}
</script>

<style scoped lang="scss">
.messages-wrapper {
  background-color: #4d4d4d;
}

.message {
  margin-top: 10;
  margin-bottom: 10;

  &__pic {
    margin-left: 3;
    margin-right: 3;
    width: 48;
    height: 48;
    border-radius: 48;
  }

  &__date {
    color: #dfdfdf;
  }

  &__body {
    margin-left: 3;
    margin-right: 3;
    margin-top: 2;
    margin-bottom: 2;
    padding-left: 4;
    padding-top: 3;
    padding-bottom: 3;
    padding-right: 6;
    background-color: #dfdfdf;
  }
}

.btn-icon {
  padding: 10;
  margin: 10;
  border-radius: 30;
  color: #4d4d4d;
  box-shadow: 2 2 5 #4d4d4d;
}
</style>
