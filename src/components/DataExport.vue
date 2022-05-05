<template>
  <div class="d-flex align-items-end justify-content-sm-start justify-content-lg-end flex-wrap mb-1">
    <b-button
        variant="primary"
        @click="exportData"
        class="mr-50"
    >
      <feather-icon
          v-if="!pending"
          icon="DownloadIcon"
          class="mr-50"
      />
      <b-spinner
          v-else
          small
          variant="primary"
          class="mr-50"
      />
      <span class="text-nowrap">Экспорт в CSV</span>
    </b-button>

    <b-tooltip
        target="tooltip-button"
        placement="left"
        triggers="hover"
    >
      <div class="d-flex flex-nowrap flex-row justify-center align-items-center">
        <div class="text-right">
          Файл с выгрузкой будет доступен в разделе <router-link to="/data-export"><b>Экспорт</b></router-link>
        </div>
      </div>
    </b-tooltip>
  </div>
</template>

<script>
import {
  BTooltip, BSpinner, BButton,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  props: ['config'],

  data() {
    return {
      pending: null,
    };
  },

  methods: {
    async exportData() {
      this.pending = true;

      if (this.pending) {
        await this.$store.dispatch('exportData/SetItem', this.config || {});

        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: 'Данные экспортированы',
            icon: 'CoffeeIcon',
            variant: 'success',
          },
        });
      }

      this.pending = null;
    },
  },

  mounted() {},

  components: {
    BTooltip,
    BSpinner,
    BButton,
  },
};
</script>

<style lang="sass" scoped></style>
