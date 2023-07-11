<template>
  <b-modal id="saveList" ref="saveList">
    <template #modal-header="{ close }">
      <h2 class="modal-title">Задайте имя списку получателей</h2>
      <div @click="close()" class="cursor-pointer">
        <feather-icon
          icon="XIcon"
          size="30"
      />
      </div>
    </template>
    <b-form class="py-2">
      <b-form-input
        tabindex="1"
        id="name"
        v-model.trim="name"
        name="name"
        placeholder="Название списка"
      />
    </b-form>
    <template #modal-footer="{ close }">
      <b-button
        variant="primary"
        @click="send(), close()">
        Создать
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import {
  BModal,
  BButton,
  BForm,
  BFormInput,
} from 'bootstrap-vue';

export default {
  props: ['title', 'text'],
  data: () => ({
    name: null,
  }),
  methods: {
    send() {
      this.$emit('createRecipient', this.name);
    },
  },
  components: {
    BModal,
    BButton,
    BForm,
    BFormInput,
  },
};
</script>

<style lang="scss" scoped>

</style>
