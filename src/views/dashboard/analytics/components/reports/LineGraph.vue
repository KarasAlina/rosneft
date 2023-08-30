<template>
  <div class="border p-2">
    <!-- apex chart -->
    <vue-apex-charts
      :options="chartOptions"
      :series="series"
      class="mb-2"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import dayjs from 'dayjs';
import { $themeColors } from '@themeConfig';
import 'dayjs/locale/ru';

export default {
  props: ['config', 'pageName'],
  data: () => ({
    series: [
      {
        name: '',
        data: [],
      },
    ],
    chartOptions: {
      chart: {
        type: 'line',
        height: '400',
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
          barHeight: '100%',
          borderRadius: 13,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      stroke: {
        show: true,
        colors: [
          $themeColors.primary,
          $themeColors.warning,
        ],
        width: 4,
      },
      markers: {
        size: 3,
        strokeColors: 'transparent',
      },
      dataLabels: {
        enabled: false,
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
        tickAmount: 6,
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
      const { columns } = this.config;
      const data = this.config.data[0];
      const keysFiltred = [];
      const series = [];
      console.log(this.config);
      Object.entries(columns).forEach(() => {
        series.push({
          name: '',
          data: [],
        });
      });
      Object.values(data).forEach((val) => {
        Object.entries(val).forEach(([key, value]) => {
          if (key === 'name') {
            keys.push(value);
          }
        });
      });
      Object.keys(keys).forEach((key) => {
        keysFiltred.push(keys[key]);
      });
      Object.keys(columns).forEach((key, i) => {
        let sortedName;
        Object.entries(data).forEach((el) => {
          if (key === Object.keys(el[1])[i]) {
            sortedName = Object.keys(el[1])[i];
            series[i].data.push(el[1][sortedName]);
          }
          console.log(el[1][sortedName]);
        });
        console.log(sortedName);
        series[i].name = columns[sortedName].title;
      });
      console.log(series);
      this.resolveChart(this.config, keys, series);
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
    },
  },

  components: {
    VueApexCharts,
  },
};
</script>

<style lang="scss" scoped>

</style>
