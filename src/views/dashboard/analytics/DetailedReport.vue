<template>
  <section>
    <template>
      <!-- date-line -->
      <b-card
        no-body
        class="py-3 px-5"
        v-if="report"
      >
        <b-row>
          <b-col>
            <b-tabs pills>
              <b-tab
                v-for="(value, key) in report.options"
                :key="key"
                :title="value.name"
                @click="getAnalyticsReport({ filter: false, type: key, report_type: configData.setting.selected }), selectedReport = key"
                lazy
              >
                <b-card-title class="mt-3 mb-3">{{ value.name }}</b-card-title>
                <b-tabs pills>
                  <b-tab
                    v-for="(nav, name, i) in value.options"
                    :key="i"
                    :title="nav.name"
                    @click="getAnalyticsReport({ filter: false, type: key, report_type: name })"
                    lazy
                  >
                    <b-card-title v-if="nav.filter && nav.filter.length">Для построения отчёта необходимо выбрать год, канал продаж и кампанию</b-card-title>
                    <b-row
                      v-if="configData && configData.setting.options[name]"
                      class="my-2"
                      :key="indexFilters"
                    >
                      <b-col
                        cols="12"
                        md="3"
                        v-for="(filter, i) in configData.setting.options[name].filter"
                        :key="i"
                      >
                        <b-form-group
                        :label="filter.title"
                        v-if="filter.values.length"
                        >
                          <!-- <v-select
                            :placeholder="filter.placeholder"
                            label="name"
                            v-if="selected"
                            :clearable="false"
                            :value="filter.values.id"
                            v-model="selected[i]"
                            :options="filter.values">
                            <template #option="value">
                              <span>{{ value.name }}</span>
                            </template>
                          </v-select> -->
                          <v-select
                            :placeholder="filter.placeholder"
                            label="label"
                            v-if="selected"
                            :clearable="false"
                            :value="filter.selected"
                            v-model="selected[filter.name]"
                            :reduce="label => label.value"
                            @input="indexFilters += 1, getAnalyticsReport({ filter: true, type: key, report_type: name, filterName: filter.name, filterValue: selected[filter.name] })"
                            :options="filter.values">
                            <template #option="value">
                              <span>{{ value.label }}</span>
                            </template>
                          </v-select>
                        </b-form-group>
                        <!-- {{filter}} -->
                        <!-- {{selected[filter.name]}} -->
                      </b-col>
                    </b-row>
                    <Table
                      v-if="config && name === 'table'"
                      :config="configData"
                      :forExport="exportConfig"
                    />
                    <Chart
                      v-if="config && name === 'barchart'"
                      :config="configData"
                      :pageName="$route.params.name"
                    />
                    <Donut
                      v-if="config && name === 'piechart'"
                      :config="configData"
                      :pageName="$route.params.name"
                      :title="value.name"
                    />
                    <LineGraph
                      v-if="config && name === 'graph'"
                      :config="configData"
                      :pageName="$route.params.name"
                      :title="value.name"
                    />
                  </b-tab>
                </b-tabs>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
      </b-card>
    </template>
  </section>
</template>

<script>
import {
  BCard, BCardTitle, BRow, BCol, BFormGroup, BTabs, BTab,
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import Table from './components/reports/Table.vue';
import Chart from './components/reports/Chart.vue';
import Donut from './components/reports/Donut.vue';
import LineGraph from './components/reports/LineGraph.vue';

export default {
  data: () => ({
    filters: null,
    selected: {},
    indexFilters: 1,
    config: null,
    configData: null,
    report: null,
    activeTab: 0,
    selectedReport: null,
    selectedType: null,
    navs: [
      {
        title: 'Таблица',
      },
      {
        title: 'Гистограмма',
      },
      {
        title: 'Круговая диаграмма',
      },
      {
        title: 'График',
      },
    ],
    options: [
      {
        name: 'Text',
        value: 1,
      },
    ],
    fields: [
      {
        key: 'name',
        label: 'Регион',
      },
      {
        key: 'outlet_employee',
        label: 'Торговые представители',
        tdClass: 'p-0',
      },
      {
        key: 'sales_representative',
        label: 'Сотрудники торговых точек',
        tdClass: 'p-0',
      },
    ],
    fieldsInner: [
      {
        label: 'Всего',
        key: 'profiles',
        thClass: 'border-bottom-0',
      },
      {
        label: 'Всего с пд',
        key: 'profiles_with_pd',
        thClass: 'border-bottom-0',
      },
      {
        label: '%',
        key: 'percent',
        thClass: 'border-bottom-0',
      },
    ],
    items: [],
    tableData: null,
  }),
  watch: {
    $route(to) {
      console.log(to);
      if (to.name === 'DetailedReport') {
        this.getAnalyticsConfig();
      }
    },
  },
  computed: {
    currentProgram() {
      return this.$store.getters['program/current'];
    },
    exportConfig() {
      const a = {
        program_id: this.currentProgram.id,
        entity: 'profile',
        type: this.selectedReport,
      };

      a.filter = this.selected;

      return a;
    },
  },
  methods: {
    async getAnalyticsReport(info) {
      this.filters = null;
      this.config = null;
      Object.keys(this.selected).forEach((key) => {
        if (this.selected[key] === '') {
          delete this.selected[key];
        }
      });
      const data = {
        path: this.$route.params.name,
        params: {
          campaignId: this.$route.params.selected ? this.$route.params.selected.find((item) => item.filterName === 'companies').id : 'campaign1',
          channel: this.$route.params.selected ? this.$route.params.selected.find((item) => item.filterName === 'channels').id : 'B2C',
          // type: this.$route.params.type,
          type: info.type,
          report_type: info.report_type,
          report_depth: 'regions',
          start: '2021-08-09 23:59:59' || this.$route.params.period.start,
          end: '2022-08-09 23:59:59' || this.$route.params.period.end,
          ...this.selected,
        },
      };
      if (info.filter) {
        Object.assign(data.params, this.selected);
      }

      const res = await this.$store.dispatch('analytic/GetAnalyticsReport', data);
      console.log(res.data);
      this.filters = res.data.mainFilter;
      this.config = res.data.report.data;
      this.configData = res.data.report;
      if (!info.filter) {
        Object.keys(this.selected).forEach((el) => {
          this.selected[el] = '';
        });
      }
      console.log(info.report_type);
      if (info.report_type) {
        console.log(this.configData);
        if (this.configData.setting.options[info.report_type].filter) {
          this.configData.setting.options[info.report_type].filter.forEach((element) => {
            Object.assign(this.selected, {
              [element.name]: element.selected,
            });
          });
        }
      }
    },
    async getAnalyticsConfig() {
      const data = {
        campaignId: 'campaign1' || this.$route.params.selected.find((item) => item.filterName === 'companies').id,
        channel: 'B2C' || this.$route.params.selected.find((item) => item.filterName === 'channels').id,
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsConfig', data);
      console.log(res.data);

      this.report = res.data.reports[this.$route.params.name];
      delete this.report.options.report1;
      this.selectedReport = 'report2';
      console.log(this.report);
      this.selectedType = this.$route.params.name === 'dynamics_outlets_registration' ? 'dashboard' : 'table';
      // this.selectedReport = this.report.selected;
      // const filters = this.report.options[this.selectedReport].options[this.selectedType].filter;
      // Object.keys(filters).forEach((element) => {
      //   console.log(element);
      //   Object.assign(this.selected, {
      //     [element]: '',
      //   });
      // });
      console.log(this.report);
      // console.log(this.selected);
      this.getAnalyticsReport({ filter: false, type: this.selectedReport, report_type: this.selectedType });
    },
  },
  mounted() {
    // if (!this.$route.params.period) {
    //   this.$router.push({ name: 'home' });
    // }
    this.getAnalyticsConfig();
  },
  components: {
    BCard,
    BCardTitle,
    BRow,
    BCol,
    BFormGroup,
    vSelect,
    BTabs,
    BTab,
    // BTable,
    // BButton,
    Table,
    Chart,
    Donut,
    LineGraph,
  },
};
</script>

<style lang="scss" scoped>

</style>
