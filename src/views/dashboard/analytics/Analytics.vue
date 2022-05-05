<template>
  <section>
    <Spinner class="no-bg" v-if="!config"/>

    <template v-else>
      <!-- date-line -->
      <b-row class="match-height">
        <b-col lg="6" v-if="config.profile">
          <AnalyticsPreviewDateLine
              @showModal="showModal"
              :settings="{
                path: 'profile',
                placeholder: ['Участник', 'Участника', 'Участников'],
                name: 'Участников',
                titleModal: 'участники',
              }"
          />
        </b-col>

        <b-col lg="6" v-if="config.outlet">
          <AnalyticsPreviewDateLine
              @showModal="showModal"
              :settings="{
                path: 'outlet',
                placeholder: ['Торговая точка', 'Тоговой точки', 'Торговых точек'],
                name: 'Торговых точек',
                titleModal: 'торговых точек',
              }"
          />
        </b-col>
      </b-row>

      <!-- type report -->
      <b-row class="match-height">
        <b-col
            lg="4"
            v-show="item.type === 'report'"
            :key="name"
            v-for="(item, name) in config">
          <AnalyticsPreviewReport
              v-if="item.type === 'report'"
              @showModal="showModalReport"
              :settings="{ ...item, name }"
          />
        </b-col>
      </b-row>

      <b-modal
          no-close-on-backdrop
          ref="modal-analytic"
          :title="`${currentProgram.title}: ${modalConfig.title}`"
          ok-only
          hide-footer
          size="xl"
          @shown="showMore = true"
          @hidden="showMore = false"
      >
        <b-card-text v-if="showMore">
          <AnalyticsMoreDateLine :config="modalConfig"/>
        </b-card-text>
      </b-modal>

      <b-modal
          no-close-on-backdrop
          ref="modal-analytic-report"
          :title="`${currentProgram.title}: ${modalConfigReport.title}`"
          ok-only
          hide-footer
          size="xl"
          @shown="showMore = true"
          @hidden="showMore = false; currentComponentReport = null"
      >
        <b-card-text v-if="showMore">
          <component :is="currentComponentReport" :config="modalConfigReport"/>
        </b-card-text>
      </b-modal>
    </template>
  </section>
</template>

<script>
import {
  BRow, BCol, BModal, BCardText,
} from 'bootstrap-vue';

export default {
  data() {
    return {
      showMore: null,
      config: null,
      modalConfig: {
        title: null,
        path: null,
        period: {
          start: null,
          end: null,
        },
      },
      modalConfigReport: {
        title: null,
      },
      currentComponentReport: null,
    };
  },

  computed: {
    currentProgram() {
      return this.$store.getters['program/current'];
    },
  },

  watch: {
    currentProgram() {
      this.getAnalyticsConfig();
    },
  },

  async mounted() {
    await this.getAnalyticsConfig();
  },

  deactivated() {
    this.$refs['modal-analytic'].hide();

    this.$refs['modal-analytic-report'].hide();
  },

  methods: {
    showModal(e) {
      this.modalConfig = e;

      this.$refs['modal-analytic'].show();
    },

    showModalReport(e) {
      if (e.chart === 'date') {
        this.currentComponentReport = 'DateLine';
      }

      if (e.chart === 'total') {
        this.currentComponentReport = 'Total';
      }

      if (e.chart === 'pie') {
        this.currentComponentReport = 'Pie';
      }

      this.modalConfigReport = e;

      this.$refs['modal-analytic-report'].show();
    },

    async getAnalyticsConfig() {
      this.config = null;

      const data = {
        moduleId: this.currentProgram.name,
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsConfig', data);
      console.log(res.data);
      this.config = res.data;
    },
  },

  components: {
    BCardText,
    BModal,
    BRow,
    BCol,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    AnalyticsPreviewDateLine: () => import('./components/AnalyticsPreviewDateLine.vue'),
    AnalyticsMoreDateLine: () => import('./components/AnalyticsMoreDateLine.vue'),
    AnalyticsPreviewReport: () => import('./components/AnalyticsPreviewReport.vue'),
    DateLine: () => import('./components/reports/DateLine.vue'),
    Total: () => import('./components/reports/Total.vue'),
    Pie: () => import('./components/reports/Pie.vue'),
  },
};
</script>
