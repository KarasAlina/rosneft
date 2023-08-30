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
          Добавить пользователя
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
              :label-for="field.key"
              :label="field.label"
              :key="index"
              v-for="(field, index) in fields">
            <validation-provider
                #default="{ errors }"
                :name="field.label"
                :rules="field.key === 'email' ? 'required|email' : 'required|min:3'"
            >
              <b-form-input
                  :id="field.key"
                  v-model="field.value"
                  v-mask="checkMask(field.data.format)"
                  :state="errors.length > 0 ? false:null"
                  :placeholder="field.label"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-button
              class="d-flex align-items-center justify-content-center"
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
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  BSidebar, BButton, BFormInput, BFormGroup, BForm, BSpinner,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import { required, email, min } from '@validations';

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
      emailValue: '',
      name: '',
      fields: this.resolveFields(),
      submitStatus: null,
      // validations
      required,
      email,
      min,
    };
  },

  computed: {
    currentProgram() {
      return this.$store.getters['program/current'];
    },
  },

  methods: {
    resetForm() {
      this.fields = this.resolveFields();

      this.$refs.createFormObserver.reset();
    },

    async send() {
      if (!this.submitStatus) {
        this.submitStatus = true;

        const fields = {};

        this.fields.forEach((item) => {
          fields[item.key] = item.value;
        });

        const data = {
          fields,
        };

        try {
          await this.$store.dispatch('profile/CreateProfile', data);

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

    resolveFields() {
      const a = (this.$store.getters['profile/optionsAll'])
        .filter((item) => item.key !== 'actions')
        .filter((item) => item.data.creatable);

      const b = a.map((item) => ({ ...item }));

      return b;
    },
    checkMask(type) {
      switch (type) {
        case 'phone':
          return '+# (###) ###-##-##';
        case 'date':
          return '##.##.####';
        default:
          return '';
      }
    },
  },

  mounted() {
    console.log('---fields-add ', this.fields);
  },

  components: {
    ValidationProvider,
    ValidationObserver,
    // BS
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
