<template>
  <div class="d-flex flex-grow-1 flex-shrink-1 align-items-center">
    <b-button
      v-for="(btn, idx) in buttons"
      :key="idx"
      :variant="activeState === idx ? 'primary' : 'outline-light'"
      @click="onClick(btn.date), activeState = idx"
      class="mr-75"
    >
      <span class="text-nowrap">{{ btn.caption }}</span>
    </b-button>
    <div class="d-flex align-items-center ml-auto">
      <span class="mr-1">Период</span>
      <flat-pickr
        style="height: 2.714rem !important; width: 120px;"
        v-model="from"
        :config="config"
        class="picker__input form-control mr-75"
        placeholder="От"/>
      <flat-pickr
        style="height: 2.714rem !important;width: 120px;"
        v-model="to"
        :config="config"
        class="picker__input form-control"
        @on-change="onClick(), activeState = null"
        placeholder="До"/>
    </div>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import 'flatpickr/dist/flatpickr.css';
import Ripple from 'vue-ripple-directive';

import {
  BButton,
} from 'bootstrap-vue';

export default {
  name: 'FilterDrop',

  props: ['options'],

  data() {
    return {
      selected: null,
      text: null,
      from: null,
      to: null,
      activeState: null,
      project: [],
      shown: null,
      config: {
        maxDate: new Date(),
        dateFormat: 'Y-m-d',
        locale: Russian,
      },
      observer: null,
      programList: null,
      buttons: [
        {
          caption: 'Сегодня',
          date: this.$options.filters.formatDate(new Date(), 'YYYY-MM-DD'),
        },
        {
          caption: 'Вчера',
          date: this.$options.filters.formatDate(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24), 'YYYY-MM-DD'),
        },
        {
          caption: 'Прошлая неделя',
          date: `${this.$options.filters.formatDate(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD')} — ${this.$options.filters.formatDate(new Date(), 'YYYY-MM-DD')}`,
        },
        {
          caption: 'Прошлый месяц',
          date: `${this.$options.filters.formatDate(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD')} — ${this.$options.filters.formatDate(new Date(), 'YYYY-MM-DD')}`,
        },
      ],
    };
  },

  computed: {
    roles() {
      return this.$store.getters['manager/roles'];
    },

    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['program/list']._meta.totalCount;
    },

    currentPage() {
      return this.$store.getters['program/list']._meta.currentPage;
    },

    hasNextPage() {
      return this.programList.length < this.totalCount;
    },
  },

  methods: {
    async getProgramList(page) {
      const list = await this.$store.dispatch('program/GetProgramList', {
        page,
      });

      this.programList = this.programList ? this.programList.concat(list.items) : this.programList = list.items;

      if (!this.selectedProgram) {
        [this.selectedProgram] = this.programList;
      }
    },

    onClick(date) {
      this.shown = false;
      const key = 'created_at';
      const label = 'Период';
      console.log(date);
      if (date === undefined) {
        console.log('text');
        this.text = `${this.from} — ${this.to}`;
        this.$emit('trigger', {
          key,
          value: this.text,
          from: this.from || null,
          to: this.to || null,
          label,
        });
        this.selected = null;
        this.text = null;
      } else {
        console.log('date');
        this.text = date;
        this.$emit('trigger', {
          key,
          value: this.text,
          label,
        });
        // this.from = null;
        // this.to = null;
        this.selected = null;
        this.text = null;
      }
    },

    hide(e) {
      if (this.shown) {
        e.preventDefault();

        if (this.selected?.data.format !== 'date-time') {
          this.shown = !this.shown;
        }
      }
    },

    close() {
      this.selected = null;

      this.text = null;

      this.shown = false;

      this.$refs.dropdown.hide(true);
    },

    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },

    onClose() {
      this.observer.disconnect();
    },

    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent;
        const { scrollTop } = target.offsetParent;
        await this.getProgramList(this.currentPage + 1);
        await this.$nextTick();
        ul.scrollTop = scrollTop;
      }
    },
  },

  mounted() {
    if (!this.programList) {
      this.getProgramList(1);
    }

    this.observer = new IntersectionObserver(this.infiniteScroll);
  },

  components: {
    flatPickr,
    // BS
    BButton,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass"></style>
