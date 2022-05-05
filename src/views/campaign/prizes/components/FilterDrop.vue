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

      <b-dropdown-form class="width-300 p-0">
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
              :reduce="(value) => value.key"
              v-else-if="selected && selected.data.format === 'select'"
              @option:selected="shown = true"
              v-model="text"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="value"
              :options="optionsSubSelect"
              :searchable="false"
              :placeholder="'Выберите ' + selected.label"
          />

          <b-form-input
              v-else-if="selected && selected.data.type === 'integer'"
              type="number"
              v-model.trim="text"
              placeholder="Введите число"
          />

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
      shown: null,
      config: {
        mode: 'range',
        maxDate: new Date(),
        dateFormat: 'Y-m-d',
        locale: Russian,
      },
    };
  },

  computed: {
    optionsSubSelect() {
      const o = this.selected?.data.value;

      const a = o && Object.keys(o).map((key) => ({
        key,
        value: o[key],
      }));

      return a;
    },
  },

  methods: {
    onClick() {
      this.shown = false;

      this.$emit('trigger', {
        key: this.selected.key,
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
  },

  mounted() {},

  components: {
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
