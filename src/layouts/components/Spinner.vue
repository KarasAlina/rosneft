<template>
  <div class="d-flex flex-nowrap justify-content-center align-items-center">
    <b-spinner
        small
        v-for="variant in ['primary', 'info', 'warning']"
        :key="variant"
        :variant="variant"
        class="mr-1"
        type="grow"
    />
  </div>
</template>

<script>
import { BSpinner } from 'bootstrap-vue';

export default {
  name: 'Spinner',

  components: { BSpinner },
};
</script>

<style lang="sass" scoped>
.d-flex
  background: rgba(255, 255, 255, .5)
  z-index: 100

  &.no-bg
    background: none

</style>
