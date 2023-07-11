<template>
  <b-row>
    <b-col
      cols="12"
      md="5"
    >
      <div class="border p-2 w-100">
        <p class="font-medium-2">{{ title }}</p>
        <!-- apex chart -->
        <vue-apex-charts
          :options="chartOptions"
          :series="series"
          class="mb-2"
        />
      </div>
    </b-col>
  </b-row>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';
import { $themeColors } from '@themeConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export default {
  props: ['config', 'pageName', 'title'],
  data: () => ({
    series: [
      {
        name: '',
        data: [],
      },
    ],
    chartOptions: {
      chart: {
        type: 'donut',
        height: '450',
        toolbar: { show: false },
        fontWeight: 400,
        fontFamily: 'Europe',
        colors: ['#6E6B7B'],
      },
      colors: [
        $themeColors.primary,
        $themeColors.warning,
        $themeColors.success,
        $themeColors.info,
        $themeColors.danger,
        $themeColors.secondary,
        '#BB6BD9',
        '#0D6EFD',
        '#00D4BD',
        '#8769FF',
        '#00CFE8',
        '#20C997',
        '#0D6EFD',
      ],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            offsetY: -10,
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
        offsetY: 10,
        style: {
          fontSize: '11px',
          colors: ['#FFFFFF'],
          fontWeight: 400,
          fontFamily: 'Europe',
        },
        dropShadow: {
          blur: 3,
          opacity: 0.2,
        },
      },
      legend: {
        offsetY: 10,
        position: 'bottom',
        horizontalAlign: 'left',
        fontSize: '14px',
        fontWeight: '400',
        fontFamily: 'Europe',
        labels: {
          colors: ['#6E6B7B'],
        },
        markers: {
          width: 10,
          height: 10,
          radius: 32,
          offsetX: -6,
        },
        itemMargin: {
          horizontal: 15,
          vertical: 6,
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
  }),
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
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      // console.log(res);
      const keys = [];
      // const { columns } = this.config;
      const data = this.config.data[0];
      // const keysFiltred = [];
      const series = [];
      console.log(this.config);
      Object.values(data).forEach((val) => {
        Object.entries(val).forEach(([key, value]) => {
          if (key === 'name') {
            keys.push(value);
          }
          if (key === 'profiles_with_pd') {
            series.push(value);
          }
        });
      });
      console.log(series);
      this.resolveChart(this.config, keys, series);
    },

    resolveChart(res, keys, seriesData) {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          labels: keys,
          xaxis: {
            categories: keys,
          },
        },
      };
      this.series = seriesData;
      if (this.pageName === 'profile') {
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: keys,
            },
          },
          ...{
            yaxis: {
              tickAmount: 10,
              max: Math.max(...this.series[0].data) + Math.max(...this.series[0].data) / 3,
            },
            tooltip: {
              intersect: true,
              shared: false,
            },
          },
        };
        this.series = seriesData;
      }
    },
  },

  components: {
    VueApexCharts,
    BRow,
    BCol,
  },
};
</script>

<style lang="scss" scoped>

</style>
