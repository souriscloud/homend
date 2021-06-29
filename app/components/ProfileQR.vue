<template>
  <GridLayout columns="*" rows="*" width="100%" height="100%">
    <ActivityIndicator col="0" row="0" verticalAlignment="stretch" horizontalAlignment="stretch" :busy="isWorking" color="Green" />
    <Image col="0" row="0" verticalAlignment="stretch" horizontalAlignment="stretch" stretch="aspectFill" ref="qrProfile" @loaded="onImageLoaded" />
  </GridLayout>
</template>

<script>
import { ImageSource } from '@nativescript/core'
import { QrGenerator } from 'nativescript-qr-generator'

export default {
  name: 'ProfileQR',

  data () {
    return {
      isWorking: true
    }
  },

  methods: {
    onImageLoaded (args) {
      const image = args.object
      const result = new QrGenerator().generate(this.$store.state.auth.fcmToken, {
        size: {
          width: 250,
          height: 250
        }
      })
      image.imageSource = new ImageSource(result)
      this.isWorking = false
    }
  }
}
</script>

<style scoped>

</style>
