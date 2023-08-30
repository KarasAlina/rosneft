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
          Добавить менеджера
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
              label-for="emailValue"
              label="Адрес электронной почты">
            <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
            >
              <b-form-input
                  id="emailValue"
                  v-model="emailValue"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Email"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="name"
              label="Имя">
            <validation-provider
                #default="{ errors }"
                name="Имя"
                rules="required|min:3"
            >
              <b-form-input
                  id="name"
                  v-model="name"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Имя"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="lastName"
              label="Фамилия">
            <validation-provider
                #default="{ errors }"
                name="Фамилия"
                rules="required|min:3"
            >
              <b-form-input
                  id="lastName"
                  v-model="lastName"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Фамилия"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <validation-provider
              #default="{ errors }"
              name="Права доступа"
              rules="required"
          >
            <b-form-group
                label-for="role"
                label="Права доступа"
                :state="errors.length > 0 ? false:null">
              <v-select
                  id="role"
                  :reduce="(value) => value.key"
                  v-model="role"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="value"
                  :options="roles"
                  :state="errors.length > 0 ? false:null"
                  :placeholder="'Права доступа'"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <validation-provider
              #default="{ errors }"
              name="Проект"
              rules="required"
          >
            <b-form-group
                label-for="project"
                label="Проект"
                :state="errors.length > 0 ? false:null"
                v-if="programList && programList.length">
              <v-select
                  id="project"
                  :reduce="(value) => value.name"
                  multiple
                  @open="onOpen"
                  @close="onClose"
                  :clearable="true"
                  v-model="project"
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
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

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
import vSelect from 'vue-select';
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
      // form
      emailValue: null,
      name: null,
      lastName: null,
      role: null,
      project: null,
      //
      submitStatus: null,
      observer: null,
      programList: null,
      // validations
      required,
      email,
      min,
    };
  },

  computed: {
    roles() {
      return this.$store.getters['manager/roles'];
    },

    currentProgram() {
      return this.$store.getters['program/current'];
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

    resetForm() {
      this.emailValue = null;

      this.name = null;

      this.lastName = null;

      this.role = null;

      this.project = [];

      this.$refs.createFormObserver.reset();
    },

    async send() {
      if (!this.submitStatus) {
        this.submitStatus = true;

        const fields = {
          email: this.emailValue,
          first_name: this.name,
          last_name: this.lastName,
          role: this.role,
          programs: this.project,
        };

        try {
          await this.$store.dispatch('manager/SetManager', fields);

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

  mounted() {
    if (!this.programList) {
      this.getProgramList(1);
    }

    this.observer = new IntersectionObserver(this.infiniteScroll);
  },

  components: {
    Spinner: () => import('@/layouts/components/Spinner.vue'),
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
