<template>
  <b-card>
    <div class="mb-1 ml-1">
      <div class="font-medium-2">{{ settings.title }}</div>
      <small class="text-light">за период {{ period }}</small>
    </div>
    <!-- apex chart -->
    <vue-apex-charts
        :options="chartOptions"
        :series="series"
        v-if="!excluded.includes(settings.name)"
        class="mb-2"
    />

    <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="shadow text-nowrap ml-1"
        :to="{
          name: 'DetailedReport',
          params: {
            name: settings.name,
            type: settings.type_interval,
            period: {
              start: year,
              end: now
            }
          }
        }"
    >
      <span class="text-nowrap">Подробный отчет</span>
    </b-button>
  </b-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import {
  BCard, BButton,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import { $themeColors } from '@themeConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

// const month = `${dayjs().subtract(1, 'month').format('YYYY-MM-DD')} 00:00:00`;

const excluded = Object.freeze(['city_user', 'sku_code', 'prize_promo']);

dayjs.locale('ru');

export default {
  props: ['settings', 'selected'],

  data() {
    return {
      excluded,
      series: [
        {
          name: '',
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: '200',
          toolbar: { show: false },
          fontWeight: 400,
          fontFamily: 'Europe',
          colors: ['#6E6B7B'],
        },
        colors: [
          $themeColors.primary,
          $themeColors.warning,
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '26%',
            barHeight: '100%',
            borderRadius: 13,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          },
        },
        stroke: {
          show: true,
          colors: ['transparent'],
          width: 10,
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '11px',
            colors: ['#6E6B7B'],
            fontWeight: 400,
            fontFamily: 'Europe',
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          fontSize: '14px',
          fontWeight: '400',
          fontFamily: 'Europe',
          markers: {
            width: 10,
            height: 10,
            radius: 32,
            offsetX: -6,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 0,
          },
        },
        states: {
          hover: {
            filter: {
              type: 'none',
            },
          },
          normal: {
            filter: {
              type: 'desaturate',
            },
          },
          active: {
            allowMultipleDataPointsSelection: true,
            filter: {
              type: 'darken',
              value: 1,
            },
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontWeight: '400',
              fontFamily: 'Europe',
              fontSize: '12px',
              colors: ['#6E6B7B'],
            },
          },
        },
        fill: {
          opacity: 1,
        },
        yaxis: {
          tickAmount: 4,
        },
      },
    };
  },

  computed: {
    currentPromo() {
      return this.$store.getters['promo/current'];
    },
    period() {
      return `${dayjs().subtract(1, 'year').add(1, 'day').format('DD.MM.YYYY')} - ${dayjs().add(1, 'day').format('DD.MM.YYYY')}`;
    },
    now() {
      return `${dayjs().add(1, 'day').format('YYYY-MM-DD')} 23:59:59`;
    },
    year() {
      return `${dayjs().subtract(1, 'year').add(1, 'day').format('YYYY-MM-DD')} 23:59:59`;
    },
  },
  watch: {
    selected() {
      this.fetchData();
    },
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const o = {
        path: this.settings.name,
        params: {
          channel: this.selected[0].id,
          campaignId: this.selected[1].id,
          start: this.year,
          end: this.now,
          type: this.settings.type_interval,
        },
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsReport', o);
      // console.log(res);
      const keys = res.data?.report.groupby;
      const columns = res.data?.report.columns;
      const data = res.data.report.data[0];
      const keysFiltred = [];
      const series = [];
      Object.entries(columns).forEach(() => {
        series.push({
          name: '',
          data: [],
        });
      });
      // eslint-disable-next-line
      if (this.settings.name !== 'dynamics_outlets_registration') {
        Object.keys(columns).forEach((key, i) => {
          const sortedData = [];
          Object.entries(data.total.value).forEach((el) => {
            sortedData.push(el[1][Object.keys(el[1])[i]]);
          });
          series[i].data = sortedData;
        });
      }
      Object.keys(keys).forEach((key) => {
        keysFiltred.push(keys[key]);
      });
      Object.keys(columns).forEach((key, i) => {
        let sortedName;
        Object.entries(data.total.value).forEach((el) => {
          if (key === Object.keys(el[1])[i]) {
            sortedName = Object.keys(el[1])[i];
          }
        });
        series[i].name = columns[sortedName].title;
      });
      this.resolveChart(res, keysFiltred, series);
    },

    resolveChart(res, keys, seriesData) {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            categories: keys,
          },
        },
      };
      this.series = seriesData;
      if (this.settings.name === 'profile') {
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: keys,
            },
          },
          ...{
            yaxis: {
              tickAmount: 4,
              max: Math.max(...this.series[0].data) + 5,
            },
            tooltip: {
              intersect: true,
              shared: false,
            },
          },
        };
        this.series = seriesData;
      }

      if (this.settings.name === 'outlet') {
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            plotOptions: {
              bar: {
                columnWidth: '39%',
                borderRadius: 13,
              },
            },
          },
          ...{
            yaxis: {
              tickAmount: 4,
              max: Math.max(...this.series[0].data) + 2,
            },
          },
        };
      }
      if (this.settings.name === 'distributor_activity') {
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            plotOptions: {
              bar: {
                columnWidth: '13%',
                borderRadius: 13,
              },
            },
          },
          ...{
            yaxis: {
              tickAmount: 4,
              max: Math.max(...this.series[0].data) + 10,
            },
          },
        };
      }
      if (this.settings.name === 'point_payout') {
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            plotOptions: {
              bar: {
                columnWidth: '13%',
                borderRadius: 13,
              },
            },
          },
          ...{
            yaxis: {
              tickAmount: 4,
              max: Math.max(...this.series[0].data) + 200,
            },
          },
        };
      }
      if (this.settings.name === 'dynamics_outlets_registration') {
        const keysOutlet = Object.keys(res.data.report.data[0]).map((key) => this.$date(key).format('DD.MM.YY'));
        const valuesOutlet = Object.values(res.data.report.data[0]);
        this.chartOptions = {
          chart: {
            height: 200,
            type: 'line',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 3,
            strokeColors: 'transparent',
          },
          stroke: {
            width: 3,
            colors: [
              $themeColors.warning,
            ],
            curve: 'straight',
          },
          ...{
            xaxis: {
              categories: keysOutlet,
              labels: {
                style: {
                  fontSize: '8px',
                },
              },
              crosshairs: {
                show: true,
              },
            },
          },
          colors: [
            $themeColors.warning,
            $themeColors.primary,
          ],
        };
        this.series = [
          {
            name: 'Динамика',
            data: valuesOutlet,
          },
        ];
      }
      if (this.settings.name === 'sale') {
        const labels = Object.values(res.data.report.groupby);
        const saleSeries = Object.values(res.data.report.data[0].total.value);
        this.chartOptions = {
          ...this.chartOptions,
          chart: {
            height: 265,
            type: 'donut',
          },
          colors: [
            $themeColors.primary,
            $themeColors.warning,
            $themeColors.success,
            $themeColors.info,
            $themeColors.danger,
            $themeColors.secondary,
          ],
          legend: {
            position: 'bottom',
          },
          labels,
          dataLabels: {
            formatter(val) {
              return `${val.toFixed(0)}%`;
            },
            style: {
              fontSize: '8px',
              colors: ['#FFFFFF'],
              fontWeight: 400,
              fontFamily: 'Europe',
            },
          },
        };
        this.series = saleSeries;
      }
      // pie

      if (this.settings.name === 'gender_user') {
        const { columns } = res.data;

        const { total } = res.data;

        this.chartOptions = {
          chart: {
            type: 'donut',
            redrawOnWindowResize: true,
            redrawOnParentResize: true,
          },
          labels: [columns?.male_percent?.title, columns?.female_percent?.title],
          dataLabels: {
            enabled: true,
            formatter(val) {
              return `${val.toFixed(1)}%`;
            },
          },
          legend: {
            position: 'right',
          },
          colors: [
            $themeColors.warning,
            $themeColors.primary,
          ],
        };

        this.series = [+total?.male_percent, +total?.female_percent];

        this.$forceUpdate();
      }

      if (this.settings.name === 'age_user') {
        const { columns } = res.data;

        const { total } = res.data;

        this.chartOptions = {
          chart: {
            type: 'donut',
            redrawOnWindowResize: true,
            redrawOnParentResize: true,
          },
          labels: [
            columns?.['0']?.title,
            columns?.['18_20']?.title,
            columns?.['21_25']?.title,
            columns?.['26_30']?.title,
            columns?.['31_35']?.title,
            columns?.['36_200']?.title,
          ],
          dataLabels: {
            enabled: true,
            formatter(val) {
              return `${val.toFixed(1)}%`;
            },
          },
          legend: {
            position: 'right',
          },
          colors: [
            $themeColors.primary,
            $themeColors.warning,
            $themeColors.success,
            $themeColors.info,
            $themeColors.danger,
            $themeColors.secondary,
          ],
        };

        this.series = [
          +total?.['0'],
          +total?.['18_20'],
          +total?.['21_25'],
          +total?.['26_30'],
          +total?.['31_35'],
          +total?.['36_200'],
        ];

        this.$forceUpdate();
      }

      if (this.settings.name === 'count_code') {
        const { columns } = res.data;

        const { total } = res.data;

        const k = Object.keys(columns);

        const labels = k.map((item) => columns[item].title);

        const j = Object.keys(total);

        const series = j.map((item) => +total[item]);

        this.chartOptions = {
          chart: {
            type: 'donut',
            redrawOnWindowResize: true,
            redrawOnParentResize: true,
          },
          labels,
          dataLabels: {
            enabled: true,
            formatter(val) {
              return `${val.toFixed(1)}%`;
            },
          },
          legend: {
            position: 'right',
          },
          colors: [
            $themeColors.primary,
            $themeColors.warning,
            $themeColors.success,
            $themeColors.info,
            $themeColors.danger,
            $themeColors.secondary,
            $themeColors.primary,
            $themeColors.warning,
            $themeColors.success,
            $themeColors.info,
            $themeColors.danger,
            $themeColors.secondary,
            $themeColors.primary,
            $themeColors.warning,
            $themeColors.success,
          ],
        };

        this.series = series;

        this.$forceUpdate();
      }
    },
  },

  components: {
    VueApexCharts,
    // BS
    BCard,
    BButton,
  },

  directives: {
    Ripple,
  },
};
</script>
