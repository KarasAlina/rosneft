<template>
  <b-sidebar
      :visible="isActiveSideBarEditCheck"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @hidden="resetForm"
      @shown="resolveFields"
      @change="(val) => $emit('update:is-active-side-bar-edit-check', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Редактировать чек
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
          <validation-provider
              #default="{ errors }"
              :name="field.label"
              :rules="'required'"
              :key="index"
              v-for="(field, index) in fields"
          >
            <b-form-group
                :state="errors.length > 0 ? false:null"
                :label-for="field.key + index"
                :label="field.label">

                <v-select
                    :id="field.key + index"
                    :reduce="(value) => value.key"
                    v-if="field.data.format === 'select'"
                    v-model="field.value"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    label="value"
                    :options="resolveOptions(field.data.value)"
                    :searchable="false"
                />

                <b-form-input
                    v-else
                    :id="field.key + index"
                    v-model="field.value"
                    :state="errors.length > 0 ? false:null"
                    :placeholder="field.label"
                />
                <small class="text-danger">{{ errors[0] }}</small>

            </b-form-group>
          </validation-provider>

          <b-button
              class="d-flex align-items-center justify-content-center"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
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
import vSelect from 'vue-select';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { required } from '@validations';
import {
  BSidebar, BButton, BFormInput, BFormGroup, BForm, BSpinner,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

export default {
  name: 'SideBarEditCheck',

  model: {
    prop: 'isActiveSideBarEditCheck',
    event: 'update:is-active-side-bar-edit-check',
  },

  props: {
    isActiveSideBarEditCheck: {
      type: Boolean,
      required: true,
    },

    current: {
      type: Object,
      required: true,
    },

    moduleId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      emailValue: '',
      name: '',
      fields: null,
      submitStatus: null,
      // validations
      required,
    };
  },

  computed: {
    currentProgram() {
      return this.$store.getters['program/current'];
    },
  },

  methods: {
    resolveOptions(o) {
      const a = o && Object.keys(o).map((key) => ({
        key: `${key}`,
        value: o[key],
      }));

      return a;
    },

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
          id: this.current.id,
          moduleId: this.moduleId,
          fields,
        };

        try {
          await this.$store.dispatch('check/UpdateCheck', data);

          this.resetForm();

          this.$emit('refetch-data');

          this.$emit('update:is-active-side-bar-edit-check', false);
        } catch (e) {
          console.log('--- ', e);
        } finally {
          this.submitStatus = null;
        }
      }
    },

    resolveFields() {
      const a = (this.$store.getters['check/options'])
        .filter((item) => item.key !== 'actions')
        .filter((item) => item.data.updatable);

      const d = a.map((item) => {
        const b = this.current[item.key];

        const c = { ...item };

        c.value = b ? `${b}` : b;

        return c;
      });

      this.fields = d;

      return d;
    },
  },

  mounted() {
    console.log('---fields-edit ', this.fields);
  },

  components: {
    vSelect,
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
