<template>
  <b-card>
    <div>
      <h3 class="font-weight-bolder mb-1">{{ settings.title }}</h3>
    </div>

    <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="shadow text-nowrap"
        @click="$emit('showModal', settings)"
    >
      <span class="text-nowrap">Подробнее </span>
      <feather-icon icon="ChevronsRightIcon" />
    </b-button>
  </b-card>
</template>

<script>
import {
  BCard, BButton,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

export default {
  props: ['settings'],

  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {},

  components: {
    BCard,
    BButton,
  },

  directives: {
    Ripple,
  },
};
</script>
