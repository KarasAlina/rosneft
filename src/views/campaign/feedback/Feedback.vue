<template>
  <b-card no-body>
    <Spinner class="position-left-0 position-right-0 position-top-0 position-bottom-0 position-absolute" v-if="pending" />

    <template v-if="prizes">
      <div>
        <!-- Table Top -->
        <div class="m-2">
          <b-row class="mb-50">
            <b-col
                cols="12"
                md="12"
                lg="7"
            >
              <div v-if="visibleFields" class="d-flex align-items-center flex-wrap mb-50">
                <!-- Filter -->
                <FilterDrop :options="visibleFields.filter(item => item.key !== 'actions')" @trigger="resolveFilter($event)"/>
              </div>

              <div
                  v-if="filter && filter.length"
                  class="d-flex align-items-center align-content-center flex-wrap mb-1">
                <b-badge
                    :key="index"
                    v-for="(item, index) in filter"
                    variant="warning"
                    class="mr-50 mb-50 p-50"
                >
                  <span>{{item.label}} = {{item.value}}</span>
                  <feather-icon
                      @click="deleteFilter(item)"
                      class="cursor-pointer ml-50"
                      icon="XIcon"
                  />
                </b-badge>
              </div>
            </b-col>

            <b-col
                class="d-flex align-items-start justify-content-sm-start justify-content-lg-end"
                cols="12"
                md="12"
                lg="5"
            >
              <b-dropdown
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="flat-primary"
                  class="ml-50 dropdown-icon-wrapper"
                  right
              >
                <template #button-content>
                  <feather-icon
                      icon="MoreVerticalIcon"
                      size="16"
                      class="align-middle"
                  />
                </template>
                <b-overlay
                    :show="pendingOptions"
                    rounded="sm"
                    :opacity="0.3"
                    spinner-variant="primary"
                >
                  <b-dropdown-form>
                    <p>Видимые колонки</p>
                    <b-form-checkbox
                        v-for="(field, index) in fields.filter((item) => item.tableVisible)"
                        :key="index"
                        :disabled="(visibleFields.length === 1 && field.visible) || field.key === 'actions'"
                        v-model="field.visible"
                        :class="[{'mb-50': fields.length !== index + 1}]"
                        @change="setTableFields(field)"
                    >
                      <div class="text-nowrap">{{ field.label }}</div>
                    </b-form-checkbox>
                  </b-dropdown-form>
                </b-overlay>
              </b-dropdown>
            </b-col>
          </b-row>

          <!-- Экспорт в CSV -->
          <DataExport :config="exportConfig" />

          <div class="d-flex align-items-end justify-content-sm-start justify-content-lg-end flex-wrap">
            <div>Показано {{ (perPage * page - perPage + 1) | formatNumber }}-{{ ((perPage * page) > totalCount ? totalCount : (perPage * page)) | formatNumber }} из {{ totalCount | formatNumber }} записей</div>
          </div>
        </div>

        <!-- Table -->
        <b-table
            @sort-changed="updateSort($event); getFeedback()"
            responsive
            :items="prizes"
            :fields="visibleFields"
            show-empty
            empty-text="Совпадающих записей не найдено"
        >
          <template #cell(profile_id)="data">
            <a
                @click.prevent="currentProfile = ''+data.value; isActiveSideBarViewProfile = true"
                href="#">{{ data.value }}</a>
          </template>
          <template #cell(theme)="data">
            <div>{{ data.field.data.format === 'select' && data.field.data.type === 'array' ? resolveValue(data.field.data.value, data.value) : data.value }}</div>
          </template>
          <template #cell()="data">
            <div>{{ data.value || '-' }}</div>
          </template>

          <!-- Column: Actions -->
          <template #cell(actions)="data">
            <b-dropdown
                variant="link"
                no-caret
                :right="$store.state.appConfig.isRTL"
            >

              <template #button-content>
                <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle text-body"
                />
              </template>
              <b-dropdown-item @click="showSideBarView(data.item)">
                <feather-icon icon="EyeIcon" />
                <span class="align-middle ml-50">Посмотреть</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>

        <!-- Pagination -->
        <div class="m-1">
          <b-row>
            <b-col
                cols="12"
                md="6"
                class="mb-1 mb-md-0 d-flex align-items-center"
            >
              Показать
              <v-select
                  class="ml-1 mr-1 select-size-sm"
                  style="width: 80px"
                  @option:selected="selectPerPage"
                  :searchable="false"
                  :clearable="false"
                  v-model="perPage"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="perPageList"
              />
              записей на странице
            </b-col>
            <b-col
                cols="12"
                md="6"
                class="d-flex justify-content-start justify-content-md-end align-items-center"
            >
              <b-pagination
                  class="m-0"
                  v-if="totalCount > perPage"
                  @change="pager"
                  v-model="currentPage"
                  :total-rows="totalCount"
                  :per-page="perPage"
                  first-number
                  last-number
                  prev-class="prev-item"
                  next-class="next-item"
              >
                <template #prev-text>
                  <feather-icon
                      icon="ChevronLeftIcon"
                      size="18"
                  />
                </template>
                <template #next-text>
                  <feather-icon
                      icon="ChevronRightIcon"
                      size="18"
                  />
                </template>
              </b-pagination>
            </b-col>
          </b-row>
        </div>
      </div>

      <SideBarViewProfile
          :current="currentProfile"
          :isActiveSideBarViewProfile.sync="isActiveSideBarViewProfile"/>

      <SideBarView
          :current="currentFeedback"
         :isActiveSideBarView.sync="isActiveSideBarView"/>
    </template>
  </b-card>
</template>

<script>
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import {
  BCard, BTable, BRow, BCol, BPagination, BDropdown, BDropdownForm, BBadge, BFormCheckbox, BOverlay, BDropdownItem,
} from 'bootstrap-vue';

export default {
  data() {
    return {
      isActiveSideBarViewProfile: false,
      pending: null,
      pendingOptions: null,
      perPageList: this.$store.getters['me/settings'].perPageList,
      page: 1,
      currentPage: 1,
      filter: [],
      currentProfile: '',
      sortBy: null,
      sortDesc: false,
      currentFeedback: {},
      isActiveSideBarView: false,
    };
  },

  computed: {
    exportConfig() {
      const and = this.and();

      const filter = {
        and,
      };

      const a = {
        program_id: this.currentProgram.id,
        entity: 'feedback',
        type: 'program', // program => 'Промо', crm => 'CRM', report => 'Отчёт', analytics => 'Аналитика'
      };

      a.filter = filter;

      return a;
    },

    visibleFields() {
      return this.fields?.filter((field) => field.visible && field.tableVisible);
    },

    fields() {
      return this.$store.getters['feedback/options'];
    },

    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['feedback/list']?._meta.totalCount;
    },

    currentProgram() {
      return this.$store.getters['program/current'];
    },

    prizes() {
      return this.$store.getters['feedback/list']?.items;
    },

    perPage: {
      get() {
        return this.$store.getters['me/settings'].perPage;
      },

      set(newValue) {
        this.$store.commit('me/SET_USER_SETTINGS', {
          prop: 'perPage',
          value: newValue,
        });
      },
    },
  },

  watch: {
    currentProgram() {
      this.getFeedback(this.currentProgram?.name);
    },
  },

  methods: {
    and() {
      return this.filter.map((item) => {
        const o = {
          [item.key]: item.value,
        };

        if (item.key === 'created_at' || item.key === 'updated_at') {
          const a = item.value.split(' — ');

          const gte = `${a[0]} 00:00:00`;

          const lte = a.length > 1 ? `${a[1]} 23:59:59` : `${a[0]} 23:59:59`;

          o[item.key] = {
            gte,
            lte,
          };
        }

        return o;
      });
    },

    resolveValue(o, value) {
      const a = Object.keys(o).map((key) => ({
        key: +key,
        value: o[key],
      }));

      const b = a.filter((item) => +item.key === +value);

      return b[0].value;
    },

    showSideBarView(data) {
      this.currentFeedback = data;

      this.isActiveSideBarView = true;
    },

    updateSort(e) {
      this.sortBy = e.sortBy;

      this.sortDesc = e.sortDesc;
    },

    deleteFilter(o) {
      const i = this.filter.indexOf(o);

      if (i !== -1) {
        this.filter.splice(i, 1);
      }

      this.getFeedback();
    },

    resolveFilter(e) {
      this.filter.push(e);

      this.getFeedback();
    },

    async setTableFields(field) {
      this.pendingOptions = true;

      this.$store.commit('feedback/SET_OPTIONS', this.fields);

      const data = {
        key: field.key,
        params: {
          moduleId: this.currentProgram?.name,
          attribute: 'visible',
          value: field.visible,
        },
      };

      await this.$store.dispatch('feedback/SetOption', data);

      this.pendingOptions = false;
    },

    selectPerPage() {
      this.page = 1;

      this.getFeedback();
    },

    pager(page) {
      this.page = page;

      this.getFeedback();
    },

    async getFeedback() { // все призы текущего промо
      this.pending = true;

      const and = this.and();

      const filter = {
        and,
      };

      const o = {
        moduleId: this.currentProgram?.name,
        'per-page': this.perPage,
        sort: !this.sortDesc ? this.sortBy : `-${this.sortBy}`,
        page: this.page,
      };

      o.filter = filter;

      try {
        await this.$store.dispatch('feedback/GetFeedback', o);
      } catch (e) {
        await this.$router.push('/');
      }

      this.pending = null;
    },

    async getOptions(moduleId) { // получить список полей
      try {
        await this.$store.dispatch('feedback/GetOptions', {
          moduleId,
        });
      } catch (e) {
        await this.$router.push('/');
      }
    },
  },

  mounted() {},

  async activated() {
    await this.getOptions(this.currentProgram?.name);

    await this.getFeedback();
  },

  components: {
    vSelect,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    FilterDrop: () => import('./components/FilterDrop.vue'),
    SideBarViewProfile: () => import('./components/SideBarViewProfile.vue'),
    SideBarView: () => import('./components/SideBarView.vue'),
    DataExport: () => import('@/components/DataExport.vue'),
    // BS
    BDropdownItem,
    BOverlay,
    BFormCheckbox,
    BBadge,
    BDropdownForm,
    BDropdown,
    BPagination,
    BRow,
    BCol,
    BTable,
    BCard,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass" scoped></style>
