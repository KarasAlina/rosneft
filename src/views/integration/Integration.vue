<template>
  <div>
    <b-card>
      <b-row class="mt-1">
        <b-col
            cols="12"
            md="12"
            lg="3"
        >
          <div v-if="fields" class="d-flex align-items-center flex-wrap mb-1 w-100">
            <!-- Filter -->
            <FilterDrop :options="fields.filter(item => item.key !== 'actions')" @trigger="resolveFilter($event)"/>
          </div>
        </b-col>
        <b-col
            class="d-flex align-items-start justify-content-sm-start justify-content-lg-end"
            cols="12"
            md="12"
            lg="9"
        >
          <!-- Add Profile -->
          <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="primary"
              @click="isActiveSideBarAddProfile = true"
          >
            <feather-icon
                icon="PlusIcon"
                class="mr-50"
            />
            <span class="text-nowrap">Добавить интеграцию</span>
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

      <template v-if="profiles">
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
            </b-row>
          </div>

          <!-- Table -->
          <b-table
              @sort-changed="updateSort($event); getIntegration();"
              responsive
              :items="profiles"
              :fields="fields"
              show-empty
              empty-text="Совпадающих записей не найдено"
          >
            <template #cell()="data">
              <div>{{ data.value || '-' }}</div>
            </template>

            <template #cell(title)="data">
              <div class="text-capitalize">{{ data.value || '-' }}</div>
            </template>

            <template #cell(status)="data">
              <div class="text-capitalize">{{ data.value ? 'Активен' : 'Неактивен' }}</div>
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

                <b-dropdown-item @click="showSideBarEditProfile(data.item)">
                  <feather-icon icon="EditIcon" />
                  <span class="align-middle ml-50">Редактировать</span>
                </b-dropdown-item>

                <b-dropdown-item @click="deleteIntegration(data.item.id)">
                  <feather-icon icon="TrashIcon" />
                  <span class="align-middle ml-50">Удалить</span>
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

        <SideBarView
            :current="current"
            :isActiveSideBarViewProfile.sync="isActiveSideBarViewProfile"/>

        <SideBarAdd
            @refetch-data="getIntegration"
            :isActiveSideBarAddProfile.sync="isActiveSideBarAddProfile"/>

        <SideBarEdit
            :current="current"
            @refetch-data="getIntegration"
            :isActiveSideBarEditProfile.sync="isActiveSideBarEditProfile"/>
      </template>
    </b-card>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import {
  BCard, BTable, BRow, BCol, BPagination, BDropdown, BDropdownItem, BButton, BBadge,
} from 'bootstrap-vue';

const fields = Object.freeze([
  {
    data: {
      creatable: false,
      format: 'int64',
      type: 'integer',
      updatable: false,
    },
    key: 'id',
    sortable: true,
    label: 'Id',
  },
  {
    data: {
      creatable: true,
      type: 'string',
      updatable: true,
    },
    key: 'title',
    sortable: true,
    label: 'Название',
  },
  {
    data: {
      creatable: true,
      type: 'string',
      updatable: true,
    },
    key: 'name',
    sortable: false,
    label: 'Код',
  },
  {
    data: {
      creatable: true,
      format: 'date-time',
      type: 'integer',
      updatable: true,
    },
    key: 'created_at',
    sortable: true,
    label: 'Дата создания',
  },
  {
    data: {
      creatable: true,
      type: 'string',
      updatable: true,
    },
    key: 'status',
    sortable: false,
    label: 'Статус',
  },
  {
    key: 'actions',
    sortable: false,
    label: 'Действия',
  },
]);

export default {
  data() {
    return {
      isActiveSideBarViewProfile: false,
      isActiveSideBarAddProfile: false,
      isActiveSideBarEditProfile: false,
      pending: null,
      perPageList: this.$store.getters['me/settings'].perPageList,
      page: 1,
      currentPage: 1,
      filter: [],
      current: {},
      sortBy: null,
      sortDesc: false,
      fields,
    };
  },

  computed: {
    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['integration/list']?._meta.totalCount;
    },
    totalVisibleFields() {
      return this.fields.filter((item) => item.visible && item.tableVisible).length;
    },
    profiles() {
      return this.$store.getters['integration/list']?.items;
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
    updateSort(e) {
      this.sortBy = e.sortBy;

      this.sortDesc = e.sortDesc;
    },

    showSideBarEditProfile(data) {
      this.current = data;

      this.isActiveSideBarEditProfile = true;
    },

    showSideBarView(data) {
      this.current = data;

      this.isActiveSideBarViewProfile = true;
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

    async deleteIntegration(id) {
      this.pending = true;

      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('integration/DeleteIntegration', id);

        await this.getIntegration();

        this.$swal({
          icon: 'success',
          title: 'Удалено!',
          text: 'Интеграция удалена.',
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

      this.getIntegration();
    },

    resolveFilter(e) {
      console.log('--- ', e);
      this.filter.push(e);

      this.getIntegration();
    },

    selectPerPage() {
      this.page = 1;

      this.getIntegration();
    },

    pager(page) {
      this.page = page;

      this.getIntegration();
    },

    async getIntegration() {
      this.pending = true;

      const or = this.filter.map((item) => {
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

      const filter = {
        or,
      };

      const o = {
        'per-page': this.perPage,
        sort: !this.sortDesc ? this.sortBy : `-${this.sortBy}`,
        page: this.page,
      };

      o.filter = filter;

      await this.$store.dispatch('integration/GetIntegration', o);

      this.pending = null;
    },
  },

  mounted() {},

  async activated() {
    await this.getIntegration();
  },

  components: {
    vSelect,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    FilterDrop: () => import('./components/FilterDrop.vue'),
    SideBarView: () => import('./components/SideBarView.vue'),
    SideBarAdd: () => import('./components/SideBarAdd.vue'),
    SideBarEdit: () => import('./components/SideBarEdit.vue'),
    // BS
    BBadge,
    BButton,
    BDropdown,
    BDropdownItem,
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
