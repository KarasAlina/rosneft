<template>
  <b-card>
    <div v-if="data" class="pb-50">
      <h2 class="font-weight-bolder mb-25">
        <number
            ref="number1"
            :from="0"
            :to="data.total"
            :format="theFormat"
            :duration="1"
            :delay="0"
            easing="Power1.easeOut"/>
      </h2>
      <b-card-text class="font-weight-bold mb-2">
        {{ '' | declOfNum(data.total, settings.placeholder) }}

        {{ '' | declOfNum(data.total, ['зарегистрирован', 'зарегистрировано', 'зарегистрировано']) }}
      </b-card-text>

      <h5 v-if="data.growth" class="font-medium-2">
        <span class="text-success mr-50">
          <number
              ref="number1"
              :from="0"
              :to="data.growth"
              :format="theFormat"
              :duration="1"
              :delay="0"
              easing="Power1.easeOut"/>%
        </span>
        <span class="text-lowercase">{{ currentDate.text }}</span>
      </h5>
      <div>
        <b-dropdown
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          :text="currentDate.text"
          variant="flat-primary"
          left
          size="sm"
        >
          <b-dropdown-item
            @click="currentDate = day; fetchData()"
            v-for="(day, index) in lastDays"
            :key="index"
          >
            {{ day.text }}
          </b-dropdown-item>
        </b-dropdown>
      </div>

      <!-- apex chart -->
      <vue-apex-charts
        type="bar"
        height="200"
        class="mb-3"
        :options="chartOptions"
        :series="data.series"
      />
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="text-nowrap"
        @click="$emit('showModal', {
          title: settings.titleModal,
          path: settings.path,
          period: {
            start: currentDate.start,
            end: `${$date().format('YYYY-MM-DD')} 23:59:59`,
          },
          series: data.series,
          categories: chartOptions.xaxis.categories,
        })"
      >
        <span class="text-nowrap">Подробный отчет </span>
      </b-button>
    </div>

    <ContentLoader v-else/>
  </b-card>
</template>

<script>
import dayjs from 'dayjs';
import {
  BCard, BButton, BDropdown, BDropdownItem, BCardText,
} from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';
import Ripple from 'vue-ripple-directive';
import { $themeColors } from '@themeConfig';

const lastDays = Object.freeze([
  {
    type: 'day',
    text: 'За неделю',
    start: `${dayjs().subtract(7, 'day').format('YYYY-MM-DD')} 00:00:00`,
    prev: `${dayjs().subtract(14, 'day').format('YYYY-MM-DD')} 00:00:00`,
  },
  {
    type: 'day',
    text: 'За месяц',
    start: `${dayjs().subtract(1, 'month').format('YYYY-MM-DD')} 00:00:00`,
    prev: `${dayjs().subtract(2, 'month').format('YYYY-MM-DD')} 00:00:00`,
  },
  {
    type: 'month',
    text: 'За год',
    start: `${dayjs().subtract(1, 'year').format('YYYY-MM-DD')} 00:00:00`,
    prev: `${dayjs().subtract(2, 'year').format('YYYY-MM-DD')} 00:00:00`,
  },
]);

export default {
  props: ['settings'],

  data() {
    return {
      chartOptions: {
        chart: {
          sparkline: { enabled: false },
          toolbar: { show: false },
        },
        grid: {
          show: true,
          padding: {
            left: 0,
            right: 0,
          },
          xaxis: {
            lines: {
              show: false,
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
            // distributed: true,
            endingShape: 'rounded',
          },
        },
        tooltip: {
          x: { show: true },
        },
        legend: {
          show: false,
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['transparent'],
        },
        xaxis: {
          categories: [],
        },
      },
      lastDays,
      data: null,
      currentDate: lastDays[0],
    };
  },

  computed: {
    currentProgram() {
      return this.$store.getters['program/current'];
    },
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    theFormat(number) {
      return `${number.toFixed()}`.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
    },

    async fetchData() {
      const o = {
        path: this.settings.path,
        params: {
          moduleId: this.currentProgram.name,
          type: this.currentDate.type,
          start: this.currentDate.start,
          end: `${this.$date().format('YYYY-MM-DD')} 23:59:59`,
        },
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsData', o);

      const keys = Object.keys(res.data.data);

      const values = keys.map((key) => +res.data.data[key]);

      const total = res.data.user_count;

      const a = {
        total,
        series: [
          {
            name: this.settings.name,
            data: values,
          },
        ],
      };
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            categories: keys,
          },
        },
      };
      console.log(a);
      this.data = a;
    },
  },

  components: {
    VueApexCharts,
    BCard,
    BButton,
    BCardText,
    BDropdown,
    BDropdownItem,
    ContentLoader: () => import('./ContentLoader.vue'),
  },

  directives: {
    Ripple,
  },
};
</script>
