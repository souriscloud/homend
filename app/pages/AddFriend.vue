<template>
    <DomainPage title="Add Friend">
        <GridLayout rows="auto, auto">
          <Label row="0" verticalAlignment="center" horizontalAlignment="center" textWrap>Scan friends PQRC to add him into your list of friends.</Label>
          <BarcodeView row="1" verticalAlignment="center" horizontalAlignment="center" width="200" height="200" @scanResult="onScanResult" />
        </GridLayout>
    </DomainPage>
</template>

<script>
import DomainPage from '~/components/DomainPage'
import { Color } from '@nativescript/core'
import { DrawerNavigationService } from '~/services/drawer-navigation.service'
import { TNSFancyAlert } from '@nstudio/nativescript-fancyalert'

export default {
  name: 'AddFriend',

  components: {
    DomainPage
  },

  data () {
    return {}
  },

  methods: {
    async onScanResult ({ format, text }) {
      console.log('SCANNER GOT RESULT')
      console.log(text)
      console.log(format)
      if (format !== 'QR_CODE') return
      const success = await this.$store.dispatch('auth/addFriend', { friendUID: text })
      if (success) {
        await TNSFancyAlert.showSuccess('Friend Added!', 'You have successfully added a friend!', 'OK!')
      } else {
        await TNSFancyAlert.showError('Cannot add a friend!', 'Either you have already this person as a friend or this person does not exist!', 'OK!')
      }

      await this.$navigateTo(require('~/pages/Home').default, { clearHistory: true })
    }
  },

  mounted () {
    DrawerNavigationService.getInstance().updateActivePage('debug')
  }
}
</script>

<style scoped lang="scss">
</style>
