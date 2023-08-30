<template>
  <section>
    <template>
      <!-- date-line -->
      <b-card>
        <b-row>
          <!-- {{filters}} -->
          <b-col
            cols="12"
            md="3"
            v-for="(filter,i) in filters"
            :key="i"
          >
          <b-form-group
          :label="filter.title"
        >
          <v-select
            :placeholder="filter.placeholder"
            label="name"
            :clearable="false"
            :value="filter.values.id"
            v-model="selected[i].id"
            :reduce="name => name.id"
            @input="getAnalyticsReports($event, filter.filterName)"
            :options="filter.values">
            <template #option="value">
              <span>{{ value.name }}</span>
            </template>
          </v-select>
          </b-form-group>
          </b-col>
        </b-row>
      </b-card>
      <Spinner class="no-bg" v-if="!config"/>
      <!-- <b-row v-else class="match-height">
        <b-col lg="6" >
          <AnalyticsPreviewDateLine v-if="config.profile_registration"
              @showModal="showModal"
              :settings="{
                path: 'profile_registration',
                placeholder: ['Участник', 'Участника', 'Участников'],
                name: 'Участников',
                titleModal: 'участники',
              }"
              :selected="selected"
          />
        </b-col>

        <b-col lg="6" v-if="config.outlets_registratio">
          <AnalyticsPreviewDateLine
              @showModal="showModal"
              :settings="{
                path: 'outlets_registration',
                placeholder: ['Торговая точка', 'Тоговой точки', 'Торговых точек'],
                name: 'Торговых точек',
                titleModal: 'торговых точек',
              }"
              :selected="selected"
          />
        </b-col>
      </b-row> -->
      <!-- type report -->
      <b-row class="match-height">
        <b-col
            lg="6"
            v-show="item.type === 'report'"
            :key="name"
            v-for="(item, name) in config">
          <AnalyticsPreviewReport
              v-if="item.type === 'report'"
              :settings="{ ...item, name }"
              :selected="selected"
          />
        </b-col>
      </b-row>

      <b-modal
          no-close-on-backdrop
          ref="modal-analytic"
          :title="`${currentProgram.title || ''}: ${modalConfig.title}`"
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
  BRow, BCol, BModal, BCardText, BCard, BFormGroup,
} from 'bootstrap-vue';
import vSelect from 'vue-select';

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
      filters: null,
      selected: null,
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

    async getAnalyticsConfig() {
      this.filters = null;
      this.config = null;
      const data = {
        campaignId: 'campaign1',
        channel: 'B2C',
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsConfig', data);
      this.filters = res.data.filters;
      this.config = res.data.reports;
      this.selected = Object.keys(this.filters).map((key) => ({
        id: this.filters[key].selected,
        filterName: this.filters[key].filterName,
      }));
    },
    async getAnalyticsReports(event, filter) {
      this.config = null;
      const data = {
        campaignId: filter === 'companies' ? event : 'campaign1',
        channel: filter === 'channels' ? event : 'B2C',
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsConfig', data);
      this.config = res.data.reports;
    },
  },

  components: {
    BCardText,
    BModal,
    BCard,
    BRow,
    BCol,
    BFormGroup,
    vSelect,
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
