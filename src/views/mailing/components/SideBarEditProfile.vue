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
          Редактировать менеджера
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
              label-for="edit-emailValue"
              label="Адрес электронной почты">
            <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
            >
              <b-form-input
                  id="edit-emailValue"
                  v-model="emailValue"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Email"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="edit-name"
              label="Имя">
            <validation-provider
                #default="{ errors }"
                name="Имя"
                rules="required|min:3"
            >
              <b-form-input
                  id="edit-name"
                  v-model="name"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Имя"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group
              label-for="edit-lastName"
              label="Фамилия">
            <validation-provider
                #default="{ errors }"
                name="Фамилия"
                rules="required|min:3"
            >
              <b-form-input
                  id="edit-lastName"
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
                label-for="edit-role"
                label="Права доступа"
                :state="errors.length > 0 ? false:null">
              <v-select
                  id="edit-role"
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
                label-for="edit-project"
                label="Проект"
                :state="errors.length > 0 ? false:null"
                v-if="programList && programList.length">
              <v-select
                  id="edit-project"
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
      // form
      emailValue: null,
      name: null,
      lastName: null,
      role: null, // todo: получить список ролей
      project: [],
      //
      fields: null,
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

    resolveFields() {
      this.emailValue = this.current.email;

      this.name = this.current.first_name;

      this.lastName = this.current.last_name;

      this.role = this.current.role;

      this.project = this.current.programs.map((item) => item.name);

      console.log('---project ', this.project); // todo: вывести список промо
    },

    resetForm() {
      this.$refs.createFormObserver.reset();
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

        const data = {
          id: this.current.id,
          fields,
        };

        try {
          await this.$store.dispatch('manager/UpdateManager', data);

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
