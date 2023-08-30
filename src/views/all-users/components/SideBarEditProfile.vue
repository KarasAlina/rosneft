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
          Редактировать профиль
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
              :label-for="field.key + index"
              :label="field.label"
              :key="index"
              v-for="(field, index) in fields">
            <validation-provider
                #default="{ errors }"
                :name="field.label"
                :rules="field.key === 'email' ? 'required|email' : 'required|min:1'"
            >
              <b-form-input
                  :id="field.key + index"
                  v-model="field.value"
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
            Обнов{{submitStatus ? 'ление...' : 'ить'}}
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
      emailValue: '',
      name: '',
      fields: null,
      submitStatus: null,
      // validations
      required,
      email,
      min,
    };
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
          id: this.current.id,
          fields,
        };

        try {
          await this.$store.dispatch('profile/UpdateProfile', data);
          console.log(data);
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

    resolveFields() {
      const a = (this.$store.getters['profile/options'])
        .filter((item) => item.key !== 'actions')
        .filter((item) => item.data.updatable);
      const d = a.map((item) => {
        const b = this.current[item.key];

        const c = { ...item };

        c.value = b;

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
