<template>
  <div>
    <Spinner
        v-if="!response"
        class="m-1" />

    <template v-else>
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
      <vue-apex-charts type="line" height="350" :options="chartOptions" :series="series" />

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
        <template #cell(date)="data">
          <span class="text-nowrap">
            {{ $date(data.item.date.split(' ')[0]).format('DD/MM/YY') }}
          </span>
        </template>

        <template #custom-foot>
          <b-tr class="bg-secondary text-white">
            <b-td>
              Всего
            </b-td>

            <b-td
                :key="name"
                v-for="(item, name) in response.data.total">
              {{ item }}
            </b-td>
          </b-tr>
        </template>
      </b-table>

      <!-- Pagination -->
      <div class="m-1">
        <b-row>
          <b-col
              cols="12"
              lg="6"
              md="12"
              sm="12"
              class="mb-1 mb-lg-0 d-flex align-items-center"
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
              lg="6"
              md="12"
              sm="12"
              class="d-flex justify-content-start justify-content-lg-end align-items-center"
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
    </template>
  </div>
</template>

<script>
import _ from 'lodash';
import vSelect from 'vue-select';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import 'flatpickr/dist/flatpickr.css';
import {
  BRow, BCol, BTable, BPagination, BTr, BTd,
} from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';
import Ripple from 'vue-ripple-directive';
import { $themeColors } from '@themeConfig';

const bar = {
  seriesName: '',
  axisTicks: {
    show: true,
  },
  axisBorder: {
    show: true,
    color: '',
  },
  labels: {
    style: {
      colors: '',
    },
  },
  title: {
    text: '',
    style: {
      color: '',
    },
  },
  tooltip: {
    enabled: true,
  },
};

export default {
  props: ['config'],

  data() {
    return {
      fields: [],
      dateRange: `${this.$date().subtract(1, 'month').format('YYYY-MM-DD')} 00:00:00 — ${this.$date().format('YYYY-MM-DD')} 23:59:59`,
      response: null,
      series: [],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        colors: [
          $themeColors.primary,
          $themeColors.warning,
          $themeColors.success,
          $themeColors.info,
          $themeColors.danger,
          $themeColors.secondary,
        ],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          width: [1, 1, 4],
        },
        title: {
          text: '',
          align: 'center',
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: '10px',
            },
          },
        },
        yaxis: [],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60,
          },
        },
        legend: {
          show: false,
          horizontalAlign: 'center',
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
    };
  },

  computed: {
    exportConfig() {
      const filter = {};

      if (this.dateRange) {
        filter.type = 'day';

        const start = this.dateRange?.split(' — ')[0];

        const end = this.dateRange?.split(' — ')[1];

        filter.start = `${start} 00:00:00`;

        filter.end = `${end || start} 23:59:59`;
      }

      const a = {
        program_id: this.currentProgram.id,
        entity: this.config.name,
        type: 'report', // program => 'Промо', crm => 'CRM', report => 'Отчёт', analytics => 'Аналитика'
      };

      a.filter = filter;

      return a;
    },

    tableDataPager() {
      return _.chunk(this.tableData, this.perPage)[this.page - 1];
    },

    totalCount() {
      return this.tableData.length || 0;
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
    this.fetchData();
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
        path: this.config.name,
        params: {
          moduleId: this.currentProgram.name,
          type: 'day',
          start: obj?.start || this.dateRange?.split(' — ')[0],
          end: obj?.end || this.dateRange?.split(' — ')[1],
        },
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsReport', o);

      this.response = res;

      const { data } = res;

      this.tableData = data;

      const keys = Object.keys(data.data);

      const keysColumns = Object.keys(data.columns);

      const keysTotal = Object.keys(data.total);

      const keysColumnsFiltered = keysColumns.filter((item) => data.columns[item].type !== 'none');

      this.chartOptions.title.text = this.config.title;

      this.chartOptions.yaxis = [];

      this.series = [];

      const b = JSON.parse(JSON.stringify(bar));

      b.seriesName = '';

      b.title.text = '';

      [b.axisBorder.color] = this.chartOptions.colors;

      [b.labels.style.colors] = this.chartOptions.colors;

      [b.title.style.color] = this.chartOptions.colors;

      this.chartOptions.yaxis.push(b);

      this.series.push({
        name: '',
        type: 'column',
        data: keysTotal.map((key) => data.total[key]),
      });

      this.chartOptions.xaxis.categories = keysColumnsFiltered.map((item) => data.columns[item].title);

      this.chartOptions = {
        ...this.chartOptions,
      };

      this.series = [...this.series];

      this.page = 1;

      this.fields = [
        {
          key: 'date',
          label: 'Дата',
        },
      ];

      keysColumns.map((key) => {
        this.fields.push({
          key,
          label: data.columns[key].title,
        });

        return null;
      });

      this.tableData = keys.map((key) => ({ ...{ date: key }, ...data.data[key] }));

      this.$forceUpdate();
    },
  },

  components: {
    vSelect,
    flatPickr,
    VueApexCharts,
    DataExport: () => import('@/components/DataExport.vue'),
    //
    BTr,
    BTd,
    BTable,
    BPagination,
    BRow,
    BCol,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
  },

  directives: {
    Ripple,
  },
};
</script>
