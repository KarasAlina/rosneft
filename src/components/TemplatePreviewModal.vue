<template>
  <b-modal id="preview" ref="preview">
    <template #modal-header="{ close }">
      <h2 class="modal-title">{{ title }}</h2>
      <div @click="close()" class="cursor-pointer">
        <feather-icon
          icon="XIcon"
          size="30"
      />
      </div>
    </template>
    <p>{{ text }}</p>
    <template #modal-footer="{ ok }">
      <b-button size="lg" variant="primary" @click="ok()">
        Закрыть
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import {
  BModal,
  BButton,
} from 'bootstrap-vue';

export default {
  props: ['title', 'text'],
  components: {
    BModal,
    BButton,
  },
};
</script>

<style lang="scss" scoped>

</style>
