<template>
  <b-sidebar
      :visible="isActiveSideBarEditProfile"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @hidden="resetForm"
      @shown="resolveFields"
      @change="(val) => $emit('update:is-active-side-bar-edit-profile', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Редактировать интеграцию
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
              label-for="edit-title"
              label="Название">
            <validation-provider
                #default="{ errors }"
                name="Название"
                rules="required"
            >
              <b-form-input
                  id="edit-title"
                  v-model.trim="title"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Название"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="edit-name"
              label="Код">
            <validation-provider
                #default="{ errors }"
                name="Код"
                rules="required"
            >
              <b-input-group>
                <b-form-input
                    id="edit-name"
                    v-model.trim="name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Код"
                />
                <b-input-group-append
                    v-clipboard:copy="name"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                    is-text>
                  <feather-icon
                      icon="CopyIcon"
                      class="cursor-pointer"
                  />
                </b-input-group-append>
              </b-input-group>

              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="edit-pass"
              label="Пароль">
            <validation-provider
                #default="{ errors }"
                name="Пароль"
                rules="required|min:6"
            >
              <b-input-group>
                <b-form-input
                    id="edit-pass"
                    v-model.trim="pass"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Пароль"
                />

                <b-input-group-append
                    v-clipboard:copy="pass"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                    is-text>
                  <feather-icon
                      icon="CopyIcon"
                      class="cursor-pointer"
                  />
                </b-input-group-append>
              </b-input-group>

              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <validation-provider
              #default="{ errors }"
              name="Срок действия"
              rules="required"
          >
            <b-form-group
                label-for="edit-date"
                label="Срок действия"
                :state="errors.length > 0 ? false:null">
              <flat-pickr
                  id="edit-date"
                  style="height: 2.714rem !important;"
                  v-model="date"
                  :config="config"
                  class="form-control"
                  placeholder="Срок действия"/>

              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <b-form-group
              label-for="edit-status"
              label="Статус">
            <b-form-checkbox
                id="edit-status"
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
              class="d-flex align-items-center justify-content-center"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="primary"
              type="submit"
          >
            <b-spinner v-if="submitStatus" class="mr-25" small />
            Обнов{{submitStatus ? 'ление...' : 'ить'}}
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
import { required, min } from '@validations';
import {
  BSidebar, BButton, BFormInput, BFormGroup, BForm, BSpinner, BFormCheckbox, BInputGroupAppend, BInputGroup,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  name: 'SideBarEditProfile',

  model: {
    prop: 'isActiveSideBarEditProfile',
    event: 'update:is-active-side-bar-edit-profile',
  },

  props: {
    isActiveSideBarEditProfile: {
      type: Boolean,
      required: true,
    },

    current: {
      type: Object,
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
    onError() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Failed to copy texts!',
          icon: 'BellIcon',
        },
      });
    },

    onCopy() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Скопировано',
          icon: 'BellIcon',
        },
      });
    },

    resolveFields() {
      this.title = this.current.title;

      this.name = this.current.name;

      this.pass = this.current.password;

      this.status = !!this.current.status;

      this.date = `${this.current.start_at} — ${this.current.finish_at}`;
    },

    resetForm() {
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

        const data = {
          id: this.current.id,
          fields,
        };

        try {
          await this.$store.dispatch('integration/UpdateIntegration', data);

          this.resetForm();

          this.$emit('refetch-data');

          this.$emit('update:is-active-side-bar-edit-profile', false);
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
    BInputGroup,
    BInputGroupAppend,
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
