<template>
  <section>
    <template>
      <!-- date-line -->
      <b-card
        no-body
        class="py-3 px-5"
      >
        <b-card-title>Для построения отчёта необходимо выбрать год, канал продаж и кампанию</b-card-title>
        <b-row class="mb-2">
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
            v-model="selected[i]"
            :options="filter.values">
            <template #option="value">
              <span>{{ value.name }}</span>
            </template>
          </v-select>
          </b-form-group>
          </b-col>
        </b-row>
        <b-card-title>Отчёт по предоставлению персональных данных</b-card-title>
        <b-row>
          <b-col>
            <b-button-group>
              <b-button
                v-for="(nav, i) in navs"
                :key="i"
                @click="activeTab = i"
                :variant="activeTab === i ? 'primary' : 'outline-primary'"
              >
                {{ nav.title }}
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
      </b-card>
    </template>
  </section>
</template>

<script>
import {
  BCard, BCardTitle, BRow, BCol, BFormGroup, BButton, BButtonGroup,
} from 'bootstrap-vue';
import vSelect from 'vue-select';

export default {
  data: () => ({
    filters: null,
    selected: null,
    config: null,
    activeTab: 0,
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
  }),
  watch: {
    $route: {
      handler(to) {
        console.log(to.params);
        if (!to.params.period) {
          this.$router.push({ name: 'home' });
        }
      },
      deep: true,
    },
  },
  methods: {
    async getAnalyticsReport() {
      this.filters = null;
      this.config = null;
      const data = {
        path: this.$route.params.name,
        params: {
          campaignId: 'campaign1',
          channel: 'B2C',
          type: this.$route.params.type,
          start: this.$route.params.period.start,
          end: this.$route.params.period.end,
        },
      };

      const res = await this.$store.dispatch('analytic/GetAnalyticsReport', data);
      console.log(res.data);
      this.filters = res.data.mainFilter;
      this.config = res.data.reports;
      this.selected = Object.keys(this.filters).map((key) => ({
        id: this.filters[key].selected,
        name: this.filters[key].values.filter((item) => item.id === this.filters[key].selected)[0].name,
      }));
    },
  },
  mounted() {
    console.log(this.$route.params);
    if (!this.$route.params.period) {
      this.$router.push({ name: 'home' });
    }
    this.getAnalyticsReport();
  },
  components: {
    BCard,
    BCardTitle,
    BRow,
    BCol,
    BFormGroup,
    vSelect,
    BButton,
    BButtonGroup,
  },
};
</script>

<style lang="scss" scoped>

</style>
