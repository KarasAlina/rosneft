<template>
  <div>
    <b-row class="mb-1">
      <b-col md="auto" class="d-flex align-items-center">
        Выберите период отчета:
      </b-col>

      <b-col>
        <flat-pickr
            style="height: 2.714rem !important; width: 230px"
            @on-change="doSomethingOnChange"
            v-model="dateRange"
            :config="flatPickrConfig"
            class="form-control text-center"/>
      </b-col>
    </b-row>
    <!-- apex chart -->
    <vue-apex-charts
        class="mb-1"
        v-if="data"
        type="bar"
        height="200"
        :options="chartOptions"
        :series="data.series"
    />

    <!-- Table Top -->
    <div>
      <!-- Экспорт в CSV -->
      <DataExport :config="exportConfig" />

      <div class="d-flex align-items-end justify-content-sm-start justify-content-lg-end flex-wrap">
        <div>Показано {{ (perPage * page - perPage + 1) | formatNumber }}-{{ ((perPage * page) > totalCount ? totalCount : (perPage * page)) | formatNumber }} из {{ totalCount | formatNumber }} записей</div>
      </div>
    </div>

    <!-- Table -->

    <b-table
        v-if="tableData"
        striped
        responsive
        show-empty
        empty-text="Совпадающих записей не найдено"
        :items="tableDataPager"
        :fields="fields"
    >
      <template #cell(Дата)="data">
        <span class="text-nowrap">
          {{ data.item.key }}
        </span>
      </template>

      <template #cell(Количество участников)="data">
        <span class="text-nowrap">
          {{ data.item.value }}
        </span>
      </template>

      <template #custom-foot>
        <b-tr v-if="response && response.user_count" class="bg-secondary text-white">
          <b-td>
            Всего
          </b-td>

          <b-td>
            {{ response.user_count }}
          </b-td>
        </b-tr>
      </template>
    </b-table>

    <!-- Pagination -->
    <div class="m-1">
      <b-row>
        <b-col
            cols="12"
            md="6"
            class="mb-1 mb-md-0 d-flex align-items-center"
        >
          Показать
          <v-select
              class="ml-1 mr-1 select-size-sm"
              style="width: 80px"
              @option:selected="selectPerPage"
              :searchable="false"
              :clearable="false"
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :options="perPageList"
          />
          записей на странице
        </b-col>
        <b-col
            cols="12"
            md="6"
            class="d-flex justify-content-start justify-content-md-end align-items-center"
        >
          <b-pagination
              class="m-0"
              v-if="totalCount > perPage"
              @change="pager"
              v-model="page"
              :total-rows="totalCount"
              :per-page="perPage"
              first-number
              last-number
              prev-class="prev-item"
              next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
              />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import vSelect from 'vue-select';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import 'flatpickr/dist/flatpickr.css';
import {
  BRow, BCol, BPagination, BTable, BTd, BTr,
} from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';
import Ripple from 'vue-ripple-directive';
import { $themeColors } from '@themeConfig';

const fields = Object.freeze([
  {
    key: 'key',
    label: 'Дата',
  },
  {
    key: 'value',
    label: 'Количество',
  },
]);

export default {
  props: ['config'],

  data() {
    return {
      fields,
      dateRange: null,
      data: null,
      chartOptions: {
        grid: {
          show: true,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        states: {
          hover: {
            filter: 'none',
          },
        },
        colors: [
          $themeColors.primary,
        ],
        plotOptions: {
          bar: {
            columnWidth: '50%',
            distributed: true,
            endingShape: 'rounded',
          },
        },
        tooltip: {
          x: { show: true },
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
        },
      },
      flatPickrConfig: {
        mode: 'range',
        maxDate: new Date(),
        dateFormat: 'Y-m-d',
        locale: Russian,
      },
      page: 1,
      perPageList: this.$store.getters['me/settings'].perPageList,
      tableData: [],
      response: null,
    };
  },

  computed: {
    exportConfig() {
      const filter = {};

      if (this.dateRange) {
        filter.type = 'day';

        filter.start = `${this.dateRange?.split(' — ')[0]} 00:00:00`;

        filter.end = `${this.dateRange?.split(' — ')[1]} 23:59:59`;
      }

      const a = {
        program_id: this.currentProgram.id,
        entity: this.config.path,
        type: 'analytics', // program => 'Промо', crm => 'CRM', report => 'Отчёт', analytics => 'Аналитика'
      };

      a.filter = filter;

      return a;
    },

    tableDataPager() {
      return _.chunk(this.tableData, this.perPage)[this.page - 1];
    },

    totalCount() {
      return this.data?.series[0].data.length || 0;
    },

    currentProgram() {
      return this.$store.getters['program/current'];
    },

    perPage: {
      get() {
        return this.$store.getters['me/settings'].perPage;
      },

      set(newValue) {
        this.$store.commit('me/SET_USER_SETTINGS', {
          prop: 'perPage',
          value: newValue,
        });
      },
    },
  },

  mounted() {
    this.data = { ...this.config };

    if (this.data.period) {
      const a = this.data.period;

      this.dateRange = `${a.start} — ${a.end}`;
    }
  },

  methods: {
    pager(page) {
      this.page = page;
    },

    selectPerPage() {
      this.page = 1;
    },

    doSomethingOnChange(e) {
      if (e.length > 1) {
        this.fetchData({
          start: `${this.$date(e[0]).format('YYYY-MM-DD')} 00:00:00`,
          end: `${this.$date(e[1]).format('YYYY-MM-DD')} 23:59:59`,
        });
      }
    },

    async fetchData(obj) {
      const o = {
        path: this.config.path,
        params: {
          moduleId: this.currentProgram.name,
          type: this.currentDate?.type || 'day',
          start: obj?.start || this.config.period.start,
          end: obj?.end || `${this.$date().format('YYYY-MM-DD')} 23:59:59`,
        },
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsData', o);

      this.response = res.data;

      this.page = 1;

      const keys = Object.keys(res.data.data);

      const keysN = keys.map((item) => `${this.$date(item.split(' ')[0]).format('DD/MM/YY')}`);
      const values = keys.map((key) => +res.data.data[key]);

      this.data.series[0].data = values;

      this.data.categories = keysN;

      this.chartOptions = {
        ...this.chartOptions,
      };
      this.chartOptions.xaxis.categories = keysN;
      this.tableData = values.map((item, index) => ({
        value: item,
        key: `${this.$date(keys[index].split(' ')).format('DD/MM/YY')}`,
      }));
    },
  },

  components: {
    vSelect,
    flatPickr,
    VueApexCharts,
    DataExport: () => import('@/components/DataExport.vue'),
    //
    BTable,
    BPagination,
    BRow,
    BCol,
    BTd,
    BTr,
  },

  directives: {
    Ripple,
  },
};
</script>
