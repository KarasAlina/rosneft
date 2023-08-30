<template>
  <b-sidebar
      :visible="isActiveSideBarAddProfile"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @hidden="resetForm"
      @change="(val) => $emit('update:is-active-side-bar-add-profile', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Добавить интеграцию
        </h5>

        <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
        />
      </div>

      <!-- BODY -->

      <validation-observer #default="{ handleSubmit }" ref="createFormObserver">
        <b-form class="p-2" @submit.prevent="handleSubmit(send)">
          <b-form-group
              label-for="title"
              label="Название">
            <validation-provider
                #default="{ errors }"
                name="Название"
                rules="required"
            >
              <b-form-input
                  id="title"
                  v-model.trim="title"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Название"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="name"
              label="Код">
            <validation-provider
                #default="{ errors }"
                name="Код"
                rules="required"
            >
              <b-form-input
                  id="name"
                  v-model.trim="name"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Код"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="pass"
              label="Пароль">
            <validation-provider
                #default="{ errors }"
                name="Пароль"
                rules="required|min:6"
            >
              <b-form-input
                  id="pass"
                  v-model.trim="pass"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Пароль"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <validation-provider
              #default="{ errors }"
              name="Срок действия"
              rules="required"
          >
            <b-form-group
                label-for="date"
                label="Срок действия"
                :state="errors.length > 0 ? false:null">
              <flat-pickr
                  id="date"
                  style="height: 2.714rem !important;"
                  v-model="date"
                  :config="config"
                  class="form-control"
                  placeholder="Срок действия"/>

              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <b-form-group
              label-for="status"
              label="Статус">
            <b-form-checkbox
                id="status"
                v-model="status"
                checked="true"
                name="check-button"
                switch
                inline
            >
              <span :class="!status ? 'text-warning' : 'text-success'">{{ status ? 'Активен' : 'Неактивен' }}</span>
            </b-form-checkbox>
          </b-form-group>

          <b-button
              class="d-flex align-items-center justify-content-center mt-2"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="primary"
              type="submit"
          >
            <b-spinner v-if="submitStatus" class="mr-25" small />
            Созда{{submitStatus ? 'ние...' : 'ть'}}
          </b-button>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import 'flatpickr/dist/flatpickr.css';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  BSidebar, BButton, BFormInput, BFormGroup, BForm, BSpinner, BFormCheckbox,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import { required, min } from '@validations';

export default {
  name: 'SideBarAddProfile',

  model: {
    prop: 'isActiveSideBarAddProfile',
    event: 'update:is-active-side-bar-add-profile',
  },

  props: {
    isActiveSideBarAddProfile: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      // form
      title: null,
      name: null,
      pass: null,
      date: null,
      status: false,
      //
      submitStatus: null,
      // validations
      required,
      min,
      //
      config: {
        mode: 'range',
        dateFormat: 'Y-m-d',
        locale: Russian,
      },
    };
  },

  computed: {},

  methods: {
    resetForm() {
      this.title = null;

      this.name = null;

      this.pass = null;

      this.date = null;

      this.status = false;

      this.$refs.createFormObserver.reset();
    },

    async send() {
      if (!this.submitStatus) {
        const d = this.date.split(' — ');

        this.submitStatus = true;

        const fields = {
          title: this.title,
          name: this.name,
          password: this.pass,
          status: +this.status,
          start_at: d[0],
          finish_at: d[1],
        };

        try {
          await this.$store.dispatch('integration/SetIntegration', fields);

          this.resetForm();

          this.$emit('refetch-data');

          this.$emit('update:is-active-side-bar-add-profile', false);
        } catch (e) {
          console.log('--- ', e);
        } finally {
          this.submitStatus = null;
        }
      }
    },
  },

  mounted() {},

  components: {
    flatPickr,
    ValidationProvider,
    ValidationObserver,
    // BS
    BFormCheckbox,
    BSpinner,
    BFormInput,
    BFormGroup,
    BForm,
    BButton,
    BSidebar,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass" scoped></style>
