<template>
    <DomainPage title="Profile">
        <GridLayout>
            <Label verticalAlignment="center" horizontalAlignment="center">
                <FormattedString>
                    <Span class="fas" text.decode="&#xf135; "/>
                    <Span :text="'Profile'"/>
                </FormattedString>
            </Label>
        </GridLayout>
    </DomainPage>
</template>

<script>
import DomainPage from '~/components/DomainPage'
import { DrawerNavigationService } from '~/services/drawer-navigation.service'

export default {
  name: 'Profile',

  components: {
    DomainPage
  },

  mounted () {
    DrawerNavigationService.getInstance().updateActivePage('profile')
  }
}
</script>

<style scoped lang="scss">
</style>
