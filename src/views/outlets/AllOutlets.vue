<template>
  <div>
    <b-card>
      <b-row>
        <b-col
          cols="12"
          md="12"
          lg="4"
        >
          <div v-if="visibleFields" class="d-flex align-items-center flex-wrap w-100">
            <!-- Filter -->
            <FilterDrop :options="visibleFields.filter(item => item.key !== 'actions')" @trigger="resolveFilter($event)"/>
          </div>
        </b-col>
        <b-col
          cols="12"
          md="12"
          lg="4"
        >
          <b-dropdown
              v-if="fields"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="dropdown-icon-wrapper dropdown-columns-select border w-100"
              right
          >
            <template #button-content>
              <div class="d-flex align-items-center">
                <span class="mr-auto">Настроить колонки</span>
                <span class="dropdown-columns-select__total d-flex align-items-center justify-content-center bg-primary text-dark rounded-circle">{{ totalVisibleFields }}</span>
                <feather-icon icon="ChevronDownIcon" class="ml-50"/>
              </div>
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
        <b-col
          class="d-flex align-items-start justify-content-sm-start justify-content-lg-end"
          cols="12"
          md="12"
          lg="4"
        >
          <!-- Add Profile -->
          <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="primary"
              @click="isActiveSideBarAddOutlet = true"
              class="mr-50"
          >
            <feather-icon
                icon="PlusSquareIcon"
                class="mr-50"
            />
            <span class="text-nowrap">Добавить точку</span>
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div
            v-if="filter && filter.length"
            class="d-flex align-items-center align-content-center flex-wrap mt-1">
            <span class="mr-2 mb-50">Выбраны условия:</span>
            <b-badge
                :key="index"
                v-for="(item, index) in filter"
                variant="light-warning"
                class="mr-50 mb-50 p-50 d-flex align-items-center"
            >
              <span>{{item.label}}: {{item.value}}</span>
              <feather-icon
                  @click="deleteFilter(item)"
                  class="cursor-pointer d-block ml-50 mb-25"
                  icon="XIcon"
              />
            </b-badge>
          </div>
        </b-col>
      </b-row>
    </b-card>
    <b-card no-body>
    <Spinner class="position-left-0 position-right-0 position-top-0 position-bottom-0 position-absolute" v-if="pending" />

    <template v-if="outlets">
      <div>
        <!-- Table Top -->
        <div class="m-2">
          <b-row>
            <b-col
              cols="12"
              md="6"
              class="mb-1 mb-md-0 d-flex align-items-center"
            >
              Показать
              <v-select
                  class="ml-1 mr-1 select-size-sm v-select-no-bg v-select-no-bd text-light"
                  style="width: 60px"
                  @option:selected="selectPerPage"
                  :searchable="false"
                  :clearable="false"
                  v-model="perPage"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="perPageList"
              />
              <!-- записей на странице -->
            </b-col>
            <b-col>
              <!-- Экспорт в CSV -->
              <DataExport :config="exportConfig" />
            </b-col>
          </b-row>
        </div>

        <!-- Table -->
        <FlipTable>
          <b-table
              @sort-changed="updateSort($event); getOutlets()"
              :items="outlets"
              :fields="visibleFields"
              show-empty
              empty-text="Совпадающих записей не найдено"
          >
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
                <b-dropdown-item @click="showSideBarViewOutlet(data.item)">
                  <feather-icon icon="EyeIcon" />
                  <span class="align-middle ml-50">Посмотреть</span>
                </b-dropdown-item>

                <b-dropdown-item @click="showSideBarEditOutlet(data.item)">
                  <feather-icon icon="EditIcon" />
                  <span class="align-middle ml-50">Редактировать</span>
                </b-dropdown-item>

                <b-dropdown-item @click="deleteOutlet(data.item.id)">
                  <feather-icon icon="TrashIcon" />
                  <span class="align-middle ml-50">Удалить</span>
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </b-table>
        </FlipTable>

        <!-- Pagination -->
        <div class="m-1">
          <b-row>
            <b-col
                cols="12"
                md="6"
                class="mb-1 mb-md-0 d-flex align-items-center"
            >
              <div class="d-flex align-items-end justify-content-sm-start justify-content-lg-end flex-wrap text-light">
                <div>Показано {{ (perPage * page - perPage + 1) | formatNumber }}-{{ ((perPage * page) > totalCount ? totalCount : (perPage * page)) | formatNumber }} из {{ totalCount | formatNumber }} записей</div>
              </div>
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
          :current="currentOutlet"
          :isActiveSideBarViewProfile.sync="isActiveSideBarViewOutlet"/>

      <SideBarAddProfile
          @refetch-data="getOutlets"
          :isActiveSideBarAddProfile.sync="isActiveSideBarAddOutlet"/>

      <SideBarEditProfile
          :current="currentOutlet"
          @refetch-data="getOutlets"
          :isActiveSideBarEditProfile.sync="isActiveSideBarEditOutlet"/>
    </template>
  </b-card>
  </div>

</template>

<script>
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import {
  BCard, BTable, BRow, BCol, BPagination, BDropdown, BDropdownItem, BButton, BDropdownForm, BBadge, BFormCheckbox, BOverlay,
} from 'bootstrap-vue';
import FlipTable from '@/components/FlipTable.vue';

export default {
  data() {
    return {
      isActiveSideBarViewOutlet: false,
      isActiveSideBarAddOutlet: false,
      isActiveSideBarEditOutlet: false,
      pending: null,
      pendingOptions: null,
      perPageList: this.$store.getters['me/settings'].perPageList,
      page: 1,
      currentPage: 1,
      filter: [],
      currentOutlet: {},
      sortBy: 'id',
      sortDesc: false,
      filteredItems: null,
    };
  },

  computed: {
    exportConfig() {
      const and = this.and();

      const filter = {
        and,
      };

      const a = {
        entity: 'outlet',
        type: 'program', // program => 'Промо', crm => 'CRM', report => 'Отчёт', analytics => 'Аналитика'
      };

      a.filter = filter;

      return a;
    },

    visibleFields() {
      return this.fields?.filter((field) => field.visible && field.tableVisible);
    },

    fields() {
      return this.$store.getters['outlet/optionsAll'];
    },
    totalVisibleFields() {
      return this.fields.filter((item) => item.visible && item.tableVisible).length;
    },
    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['outlet/listAll']?._meta.totalCount;
    },

    outlets() {
      return this.$store.getters['outlet/listAll']?.items;
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

        if (item.key === 'birthday') {
          const a = item.value.split(' — ');

          const gte = a[0];

          const lte = a.length > 1 ? a[1] : a[0];

          o[item.key] = {
            gte,
            lte,
          };
        }

        return o;
      });
    },

    updateSort(e) {
      this.sortBy = e.sortBy;

      this.sortDesc = e.sortDesc;
    },

    showSideBarEditOutlet(data) {
      this.currentOutlet = data;

      this.isActiveSideBarEditOutlet = true;
    },

    showSideBarViewOutlet(data) {
      this.currentOutlet = data;

      this.isActiveSideBarViewOutlet = true;
    },

    async confirmText() {
      const result = await this.$swal({
        title: 'Вы уверены?',
        text: 'Вы не сможете отменить это!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Да, удалить!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      });

      return result;
    },

    async deleteOutlet(id) {
      this.pending = true;

      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('outlet/DeleteOutlet', {
          id,
        });

        await this.getOutlets();

        this.$swal({
          icon: 'success',
          title: 'Удалено!',
          text: 'Профиль удален.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }

      this.pending = false;
    },

    deleteFilter(o) {
      const i = this.filter.indexOf(o);

      if (i !== -1) {
        this.filter.splice(i, 1);
      }

      this.getOutlets();
    },

    resolveFilter(e) {
      this.filter.push(e);

      this.getOutlets();
    },

    async setTableFields(field) {
      this.pendingOptions = true;

      this.$store.commit('outlet/SET_OPTIONS_ALL', this.fields);

      const data = {
        key: field.key,
        params: {
          attribute: 'visible',
          value: field.visible,
        },
      };

      await this.$store.dispatch('outlet/SetOptionAll', data);

      this.pendingOptions = false;
    },

    selectPerPage() {
      this.page = 1;

      this.getOutlets();
    },

    pager(page) {
      this.page = page;

      this.getOutlets();
    },

    async getOutlets() { // все профили текущего промо
      this.pending = true;

      const and = this.and();

      const filter = {
        and,
      };
      const o = {
        'per-page': this.perPage,
        sort: !this.sortDesc ? this.sortBy : `-${this.sortBy}`,
        page: this.page,
      };

      o.filter = filter;

      await this.$store.dispatch('outlet/GetOutletsAll', o);

      this.pending = null;
    },

    async getOptions(moduleId) { // получить список полей для создания и редактирвания
      await this.$store.dispatch('outlet/GetOptionsAll', {
        moduleId,
      });
    },
  },

  mounted() {},

  async activated() {
    await this.getOptions();
    await this.getOutlets();
  },

  components: {
    vSelect,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    FilterDrop: () => import('./components/FilterDrop.vue'),
    SideBarViewProfile: () => import('./components/SideBarViewProfile.vue'),
    SideBarAddProfile: () => import('./components/SideBarAddProfile.vue'),
    SideBarEditProfile: () => import('./components/SideBarEditProfile.vue'),
    DataExport: () => import('@/components/DataExport.vue'),
    // BS
    BOverlay,
    BFormCheckbox,
    BBadge,
    BDropdownForm,
    BButton,
    BDropdown,
    BDropdownItem,
    BPagination,
    BRow,
    BCol,
    BTable,
    BCard,
    FlipTable,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass" scoped></style>
