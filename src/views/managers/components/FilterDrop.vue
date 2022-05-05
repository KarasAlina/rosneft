<template>
  <div class="w-100">
    <b-dropdown
        id="dropdown-form"
        ref="dropdown"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        left
        variant="gradient-primary"
        class="dropdown-icon-wrapper"
        @hide="hide($event)"
    >
      <template #button-content>
        <feather-icon
            icon="FilterIcon"
            class="mr-50"
        />
        <span class="text-nowrap mr-1">Добавить условие</span>
        <feather-icon icon="ChevronDownIcon" />
      </template>

      <b-dropdown-form class="width-350 p-0">
        <b-form-group class="mb-50">
          <v-select
              @option:selected="text = null; shown = true"
              v-model="selected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="label"
              :options="options"
              :searchable="false"
              :placeholder="'Выберите условие'"
          />
        </b-form-group>

        <b-form-group v-if="selected" class="mb-50">
          <flat-pickr
              style="height: 2.714rem !important;"
              v-if="selected && selected.data.format === 'date-time'"
              v-model="text"
              :config="config"
              class="form-control"
              placeholder="Дата не выбрана"/>

          <v-select
              @option:selected="shown = true"
              v-else-if="selected && selected.key === 'role'"
              :reduce="(value) => value.key"
              v-model="text"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="value"
              :options="roles"
              :placeholder="'Права доступа'"
          />

          <v-select
              @option:selected="shown = true"
              v-else-if="selected && selected.key === 'project'"
              :reduce="(value) => value.name"
              @open="onOpen"
              @close="onClose"
              :clearable="true"
              v-model="text"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :placeholder="'Проект'"
              :options="programList">
            <template #list-footer>
              <li ref="load" class="loader" v-show="hasNextPage">
                <Spinner class="m-1" />
              </li>
            </template>
          </v-select>

          <b-form-input
              v-else
              type="text"
              v-model.trim="text"
              placeholder="Введите текст"
          />
        </b-form-group>

        <b-button
            :disabled="!(text && selected)"
            class="btn-icon mr-25"
            variant="primary"
            @click="onClick"
        >
          Добавить
        </b-button>

        <b-button
            @click="close"
            variant="outline-primary"
            class="btn-icon"
        >
          Отмена
        </b-button>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import {
  BButton,
  BFormGroup,
  BFormInput,
  BDropdown,
  BDropdownForm,
} from 'bootstrap-vue';

export default {
  name: 'FilterDrop',

  props: ['options'],

  data() {
    return {
      selected: null,
      text: null,
      project: [],
      shown: null,
      config: {
        mode: 'range',
        maxDate: new Date(),
        dateFormat: 'Y-m-d',
        locale: Russian,
      },
      observer: null,
      programList: null,
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

    onClick() {
      this.shown = false;

      const key = this.selected.key === 'project' ? 'programs' : this.selected.key;

      this.$emit('trigger', {
        key,
        value: this.text,
        label: this.selected.label,
      });

      this.selected = null;
      this.text = null;

      this.$refs.dropdown.hide(true);
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
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    flatPickr,
    vSelect,
    // BS
    BFormInput,
    BFormGroup,
    BButton,
    BDropdown,
    BDropdownForm,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass"></style>
