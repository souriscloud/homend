<template>
  <Page class="page">
    <CustomActionBar :title="title" />
    <slot />
  </Page>
</template>

<script>
import CustomActionBar from "~/components/CustomActionBar";

export default {
  name: 'DomainPage',
  props: ['title'],
  components: { CustomActionBar }
}
</script>

<style scoped>

</style>
