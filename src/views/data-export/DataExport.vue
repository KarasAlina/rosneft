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
      </b-row>
    </b-card>
    <b-card no-body>
      <Spinner class="position-left-0 position-right-0 position-top-0 position-bottom-0 position-absolute" v-if="pending" />

      <template v-if="exports">
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
              @sort-changed="updateSort($event); getList();"
              responsive
              :items="exports"
              :fields="fields"
              show-empty
              empty-text="Совпадающих записей не найдено"
          >
            <template #cell()="data">
              <div>{{ data.value || '-' }}</div>
            </template>

            <template #cell(status)="data">
              <b-badge :variant="resolveStatusType(data.value)">{{ resolveStatus(data.value) }}</b-badge>
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

                <b-dropdown-item v-if="data.item.status === 3" :href="url + data.item.file" :download="data.item.name">
                  <feather-icon icon="DownloadIcon" />
                  <span class="align-middle ml-50">Скачать</span>
                </b-dropdown-item>

                <b-dropdown-item @click="showSideBarView(data.item)">
                  <feather-icon icon="EyeIcon" />
                  <span class="align-middle ml-50">Посмотреть</span>
                </b-dropdown-item>

                <b-dropdown-item @click="deleteExport(data.item.id)">
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
      </template>
    </b-card>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import {
  BCard, BTable, BRow, BCol, BPagination, BDropdown, BDropdownItem, BBadge,
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
      creatable: false,
      type: 'string',
      updatable: false,
    },
    key: 'status',
    sortable: true,
    label: 'Статус',
  },
  {
    data: {
      creatable: false,
      format: 'date-time',
      type: 'integer',
      updatable: false,
    },
    key: 'created_at',
    sortable: true,
    label: 'Дата создания',
  },
  {
    key: 'actions',
    tdClass: 'width-50',
    sortable: false,
    label: 'Действия',
  },
]);

const url = Object.freeze(process.env.VUE_APP_BASE_API);

export default {
  data() {
    return {
      isActiveSideBarViewProfile: false,
      pending: null,
      perPageList: this.$store.getters['me/settings'].perPageList,
      page: 1,
      currentPage: 1,
      filter: [],
      current: {},
      sortBy: 'id',
      sortDesc: true,
      fields,
      url,
    };
  },

  computed: {
    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['exportData/data']?._meta.totalCount;
    },

    exports() {
      return this.$store.getters['exportData/data']?.items;
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

    async deleteExport(id) {
      this.pending = true;

      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('exportData/DeleteItem', id);

        await this.getList();

        this.$swal({
          icon: 'success',
          title: 'Удалено!',
          text: 'Экспорт удален.',
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

      this.getList();
    },

    resolveFilter(e) {
      this.filter.push(e);

      this.getList();
    },

    selectPerPage() {
      this.page = 1;

      this.getList();
    },

    pager(page) {
      this.page = page;

      this.getList();
    },

    async getList() {
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

      await this.$store.dispatch('exportData/GetList', o);

      this.pending = null;
    },

    resolveStatusType(id) {
      switch (+id) {
        case 1:
          return 'light-warning';

        case 2:
          return 'light-primary';

        case 3:
          return 'light-success';

        case 4:
          return 'light-danger';

        default:
          return '';
      }
    },

    resolveStatus(id) {
      switch (+id) {
        case 1:
          return 'Ожидает';

        case 2:
          return 'Выполняется';

        case 3:
          return 'Выполнен';

        case 4:
          return 'Ошибка';

        default:
          return '';
      }
    },

    resolveType(name) {
      switch (name) {
        case 'program':
          return 'Промо';

        case 'crm':
          return 'CRM';

        case 'report':
          return 'Отчёт';

        case 'analytics':
          return 'Аналитика';

        default:
          return '-';
      }
    },
  },

  mounted() {},

  async activated() {
    await this.getList();
  },

  components: {
    vSelect,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    FilterDrop: () => import('./components/FilterDrop.vue'),
    SideBarView: () => import('./components/SideBarView.vue'),
    // BS
    BBadge,
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
