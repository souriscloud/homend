<template>
    <DomainPage title="Home">
        <GridLayout>
            <Label verticalAlignment="center" horizontalAlignment="center">
                <FormattedString>
                    <Span class="fas" text.decode="&#xf135; "/>
                    <Span :text="'Home'"/>
                </FormattedString>
            </Label>
        </GridLayout>
    </DomainPage>
</template>

<script>
import DomainPage from '~/components/DomainPage'
import { DrawerNavigationService } from '~/services/drawer-navigation.service'

export default {
  name: 'Home',

  components: {
    DomainPage
  },

  mounted () {
    DrawerNavigationService.getInstance().updateActivePage('home')
  }
}
</script>

<style scoped lang="scss">
</style>
