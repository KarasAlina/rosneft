<template>
  <b-sidebar
      :visible="isActiveSideBarAdd"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @hidden="resetForm"
      @change="(val) => $emit('update:is-active-side-bar-add', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Добавить активность
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
        <b-form autocomplete="off" class="p-2" @submit.prevent="handleSubmit(send)">
          <validation-provider
              #default="{ errors }"
              name="ID профиля"
              rules="required"
          >
            <b-form-group
                :state="errors.length > 0 ? false:null"
                label-for="autosuggestInput"
                label="ID профиля">

              <input autocomplete="false" type="hidden" v-model="selectedUser"/>

              <vue-typeahead-bootstrap
                  v-model="query"
                  :ieCloseFix="false"
                  :data="users"
                  :serializer="item => (`${item.name} ${item.last_name} (id: ${item.profile_id})`)"
                  :showAllResults="true"
                  @hit="selectedUser = $event"
                  placeholder="Поиск профиля..."
                  @input="lookupUser"
                  autocomplete="new-text"
              >
                <template slot="append">
                  <b-button
                      class="d-flex align-items-center justify-content-center"
                      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                      variant="outline-primary"
                      disabled
                      type="button"
                  >
                    <feather-icon v-if="!pendingSearch" icon="SearchIcon" />

                    <b-spinner variant="primary" v-else small />
                  </b-button>
                </template>
              </vue-typeahead-bootstrap>

              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>

          <validation-provider
              :key="index"
              v-for="(field, index) in fields"
              #default="{ errors }"
              :name="field.label"
              :rules="field.data.required ? 'required' : null"
          >
            <b-form-group
                :state="errors.length > 0 ? false:null"
                :label-for="field.key"
                :label="field.label">

              <v-select
                  :placeholder="field.label"
                  :id="field.key + index"
                  :reduce="(value) => value.key"
                  v-if="field.data.format === 'select'"
                  v-model="field.value"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="value"
                  :options="resolveOptions(field.data.value)"
                  :searchable="false"
              />

              <b-form-textarea
                  v-else-if="field.key === 'comment'"
                  :id="field.key + index"
                  v-model="field.value"
                  :placeholder="field.label"
                  :state="errors.length > 0 ? false:null"
                  rows="3"
              />

              <b-form-input
                  v-else-if="field.key !== 'profile_id'"
                  :id="field.key + index"
                  v-model="field.value"
                  :state="errors.length > 0 ? false:null"
                  :placeholder="field.label"
                  :type="field.data.type === 'integer' ? 'number' : 'text'"
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
            Созда{{submitStatus ? 'ние...' : 'ть'}}
          </b-button>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import { debounce } from 'lodash';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
import vSelect from 'vue-select';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, email } from '@validations';
import {
  BSidebar, BButton, BFormInput, BFormGroup, BForm, BSpinner, BFormTextarea,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

export default {
  name: 'SideBarAddProfile',

  model: {
    prop: 'isActiveSideBarAdd',
    event: 'update:is-active-side-bar-add',
  },

  props: {
    isActiveSideBarAdd: {
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
      //
      profiles: [],
      observer: null,
      profileId: null,
      query: '',
      selectedUser: null,
      users: [],
      pendingSearch: null,
      // validations
      required,
      email,
    };
  },

  computed: {
    currentProgram() {
      return this.$store.getters['program/current'];
    },

    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['activity/profiles']._meta.totalCount;
    },

    currentPage() {
      return this.$store.getters['activity/profiles']._meta.currentPage;
    },

    hasNextPage() {
      return this.profiles.length < this.totalCount;
    },
  },

  methods: {
    lookupUser: debounce(async function () {
      this.pendingSearch = true;

      const num = !Number.isNaN(+this.query);

      let or = [
        {
          name: {
            like: this.query,
          },
        },
        {
          last_name: {
            like: this.query,
          },
        },
      ];

      if (num) {
        or = [
          {
            profile_id: this.query,
          },
        ];
      }

      const filter = {
        or,
      };

      const o = {
        moduleId: this.currentProgram?.name,
        'per-page': 50,
        page: 1,
        filter,
      };

      if (this.query) {
        const r = await this.$store.dispatch('activity/GetProfiles', o);

        this.users = r?.items;
      } else {
        this.selectedUser = null;

        this.users = [];
      }

      this.pendingSearch = null;
    }, 500),

    resolveOptions(o) {
      const a = o && Object.keys(o).map((key) => ({
        key: `${key}`,
        value: o[key],
      }));

      return a;
    },

    resetForm() {
      this.fields = this.resolveFields();

      this.profileId = null;

      this.selectedUser = null;

      this.users = [];

      this.query = null;

      this.$refs.createFormObserver.reset();
    },

    async send() {
      if (!this.submitStatus) {
        this.submitStatus = true;

        const fields = {};

        this.fields.forEach((item) => {
          fields[item.key] = item.value;
        });

        fields.profile_id = this.selectedUser.profile_id;

        const data = {
          moduleId: this.currentProgram.name,
          fields,
        };

        try {
          await this.$store.dispatch('activity/SetActivity', data);

          this.resetForm();

          this.$emit('refetch-data');

          this.$emit('update:is-active-side-bar-add', false);
        } catch (e) {
          console.log('--- ', e);
        } finally {
          this.submitStatus = null;
        }
      }
    },

    resolveFields() {
      const a = (this.$store.getters['activity/options'])
        ?.filter((item) => item.key !== 'actions')
        ?.filter((item) => item.key !== 'profile_id')
        ?.filter((item) => item.data.creatable);

      const b = a.map((item) => ({ ...item }));

      return b;
    },

    onSelect(e) {
      this.$store.commit('program/SET_CURRENT', e);
    },

    async getProfiles(page) {
      const list = await this.$store.dispatch('activity/GetProfiles', {
        page,
        moduleId: this.currentProgram?.name,
      });

      const a = list.items.map((item) => {
        const o = { ...item };

        o.title = `${item?.name} ${item?.last_name} (${item?.profile_id})`;

        return o;
      });

      this.profiles = this.profiles ? this.profiles.concat(a) : this.profiles = a;
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
        await this.getProfiles(this.currentPage + 1);
        await this.$nextTick();
        ul.scrollTop = scrollTop;
      }
    },
  },

  mounted() {
    this.getProfiles(1);

    this.observer = new IntersectionObserver(this.infiniteScroll);
  },

  components: {
    VueTypeaheadBootstrap,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    // BS
    BFormTextarea,
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
