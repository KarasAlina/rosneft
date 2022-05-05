<template>
  <b-card no-body>
    <Spinner class="position-left-0 position-right-0 position-top-0 position-bottom-0 position-absolute" v-if="pending" />

    <template v-if="profiles">
      <div>
        <!-- Table Top -->
        <div class="m-2">
          <b-row class="mb-50">
            <b-col
                cols="12"
                md="12"
                lg="7"
            >
              <div v-if="fields" class="d-flex align-items-center flex-wrap mb-50">
                <!-- Filter -->
                <FilterDrop :options="fields.filter(item => item.key !== 'actions')" @trigger="resolveFilter($event)"/>
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
                  <template v-if="item.label === 'Роль'">
                    {{item.label}} = {{ roles.filter((i) => i.key === item.value)[0].value }}
                  </template>

                  <template v-else>
                    <span>{{item.label}} = {{item.value}}</span>
                  </template>

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
              <!-- Add Profile -->
              <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="gradient-success"
                  @click="isActiveSideBarAddProfile = true"
              >
                <feather-icon
                    icon="PlusSquareIcon"
                    class="mr-50"
                />
                <span class="text-nowrap">Добавить менеджера</span>
              </b-button>
            </b-col>
          </b-row>

          <div class="d-flex align-items-end justify-content-sm-start justify-content-lg-end flex-wrap">
            <div>Показано {{ (perPage * page - perPage + 1) | formatNumber }}-{{ ((perPage * page) > totalCount ? totalCount : (perPage * page)) | formatNumber }} из {{ totalCount | formatNumber }} записей</div>
          </div>
        </div>

        <!-- Table -->
        <b-table
            @sort-changed="updateSort($event); getManagers()"
            responsive
            :items="profiles"
            :fields="fields"
            show-empty
            empty-text="Совпадающих записей не найдено"
        >
          <template #cell()="data">
            <div>{{ data.value || '-' }}</div>
          </template>

          <template #cell(first_name)="data">
            <div class="text-capitalize">{{ data.value || '-' }}</div>
          </template>

          <template #cell(last_name)="data">
            <div class="text-capitalize">{{ data.value || '-' }}</div>
          </template>

          <template #cell(role)="data">
            <div v-if="data.value">{{ roles.filter((item) => item.key === data.value)[0].value }}</div>
            <div v-else>-</div>
          </template>

          <template #cell(project)="data">
            <div v-if="!data.item.programs.length">-</div>
            <div v-else :key="index" v-for="(item, index) in data.item.programs">{{ item.name }}</div>
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
              <b-dropdown-item @click="showSideBarViewProfile(data.item)">
                <feather-icon icon="EyeIcon" />
                <span class="align-middle ml-50">Посмотреть</span>
              </b-dropdown-item>

              <b-dropdown-item @click="showSideBarEditProfile(data.item)">
                <feather-icon icon="EditIcon" />
                <span class="align-middle ml-50">Редактировать</span>
              </b-dropdown-item>

              <b-dropdown-item @click="deleteProfile(data.item.id)">
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

      <SideBarAddProfile
          @refetch-data="getManagers"
          :isActiveSideBarAddProfile.sync="isActiveSideBarAddProfile"/>

      <SideBarEditProfile
          :current="currentProfile"
          @refetch-data="getManagers"
          :isActiveSideBarEditProfile.sync="isActiveSideBarEditProfile"/>
    </template>
  </b-card>
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
    key: 'email',
    sortable: false,
    label: 'Email',
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
    label: 'Дата регистрации',
  },
  {
    data: {
      creatable: true,
      type: 'string',
      updatable: true,
    },
    key: 'first_name',
    sortable: false,
    label: 'Имя',
  },
  {
    data: {
      creatable: true,
      type: 'string',
      updatable: true,
    },
    key: 'last_name',
    sortable: false,
    label: 'Фамилия',
  },
  {
    data: {
      creatable: true,
      type: 'string',
      updatable: true,
    },
    key: 'role',
    sortable: false,
    label: 'Роль',
  },
  {
    data: {
      creatable: true,
      type: 'string',
      updatable: true,
    },
    key: 'project',
    sortable: false,
    label: 'Проект',
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
      currentProfile: {},
      sortBy: null,
      sortDesc: null,
      fields,
    };
  },

  computed: {
    roles() {
      return this.$store.getters['manager/roles'];
    },

    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['manager/list']?._meta.totalCount;
    },

    profiles() {
      return this.$store.getters['manager/list']?.items;
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
      this.currentProfile = data;

      this.isActiveSideBarEditProfile = true;
    },

    showSideBarViewProfile(data) {
      this.currentProfile = data;

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

    async deleteProfile(id) {
      this.pending = true;

      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('manager/DeleteManager', id);

        await this.getManagers();

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

      this.getManagers();
    },

    resolveFilter(e) {
      console.log('--- ', e);
      this.filter.push(e);

      this.getManagers();
    },

    selectPerPage() {
      this.page = 1;

      this.getManagers();
    },

    pager(page) {
      this.page = page;

      this.getManagers();
    },

    async getRoles() {
      await this.$store.dispatch('manager/GetRoles');
    },

    async getManagers() {
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

      await this.$store.dispatch('manager/GetManagers', o);

      this.pending = null;
    },
  },

  mounted() {},

  async activated() {
    await this.getRoles();

    await this.getManagers();
  },

  components: {
    vSelect,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    FilterDrop: () => import('./components/FilterDrop.vue'),
    SideBarViewProfile: () => import('./components/SideBarViewProfile.vue'),
    SideBarAddProfile: () => import('./components/SideBarAddProfile.vue'),
    SideBarEditProfile: () => import('./components/SideBarEditProfile.vue'),
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
