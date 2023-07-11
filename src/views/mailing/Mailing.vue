<template>
  <div>
    <b-card>
        <b-row>
          <b-col
            cols="12"
            md="12"
            lg="12"
          >
            <div v-if="fields" class="d-flex align-items-center ml-auto">
              <div
                v-if="filter && filter.filter(item => item.from).length"
                class="d-flex align-items-center align-content-center flex-wrap">
                <b-badge
                    :key="index"
                    v-for="(item, index) in filter"
                    variant="primary"
                    style="height: 38px"
                    class="mr-50 p-1 d-flex align-items-center text-dark"
                >
                  <span>{{item.label}}: {{item.from | formatDate('MM.DD.YY') }} - {{item.to | formatDate('MM.DD.YY') }}</span>
                  <feather-icon
                      @click="deleteFilter(item)"
                      class="cursor-pointer d-block ml-50 mb-25"
                      icon="XIcon"
                  />
                </b-badge>
              </div>
              <!-- Filter -->
              <FilterDrop :options="fields.filter(item => item.key !== 'actions')" @trigger="resolveFilter($event)"/>
            </div>
          </b-col>
        </b-row>
      </b-card>
      <b-card no-body>
        <Spinner class="position-left-0 position-right-0 position-top-0 position-bottom-0 position-absolute" v-if="pending" />

        <template v-if="items">
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
                <b-col class="text-right">
                  <!-- Add Profile -->
                  <router-link
                    :to="{ name: 'CreateMailing' }"
                    class="btn btn-success"
                  >
                    <feather-icon
                        icon="MailIcon"
                        class="mr-50"
                    />
                    <span class="text-nowrap">Создать рассылку</span>
                  </router-link>
                </b-col>
              </b-row>
            </div>

            <!-- Table -->
            <b-table
              @sort-changed="updateSort($event); getItems()"
              responsive
              :items="items"
              :fields="fields"
              show-empty
              empty-text="Совпадающих записей не найдено"
            >

              <template #cell()="data">
                <router-link
                  class="text-dark"
                  :to="{ name: 'PreviewMailing', params: { id: data.item.id}}"
                >
                  {{ data.value || '-' }}
                </router-link>
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

              <template #cell(status)="data">
                <div>{{ statuses[data.value] || '-' }}</div>
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
                  <div class="d-flex align-items-end justify-content-sm-start justify-content-lg-end flex-wrap">
                    <div>Показано {{ (perPage * page - perPage + 1) | formatNumber }} - {{ ((perPage * page) > totalCount ? totalCount : (perPage * page)) | formatNumber }} из {{ totalCount | formatNumber }} записей</div>
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
        </template>
      </b-card>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import {
  BCard, BTable, BRow, BCol, BPagination, BBadge,
} from 'bootstrap-vue';

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
      allSelected: false,
      allSelectedVisibility: false,
      selectedUsers: [],
      excludedUsers: [],
    };
  },

  computed: {
    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['mailing/list']?._meta.totalCount;
    },

    items() {
      return this.$store.getters['mailing/list']?.items;
    },

    visibleFields() {
      return this.fields?.filter((field) => field.visible && field.tableVisible);
    },

    fields() {
      return this.$store.getters['mailing/options'];
    },

    statuses() {
      return this.$store.getters['mailing/statuses'];
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
    /* eslint-disable no-param-reassign */
    selectAll() {
      const $this = this;
      this.excludedUsers = [];
      this.items.forEach((user) => {
        user.selected = $this.allSelected;
      });
      const notSelected = this.items.filter((user) => !user.selected);
      const selected = this.items.filter((user) => user.selected);
      const selectedUsersCopy = this.selectedUsers.slice().filter((user) => !notSelected.find((e) => e.id === user.id));
      if (notSelected.length > 0) {
        this.allSelected = true;
        this.selectedUsersList = selected.map((item) => item.id);
      } else {
        this.allSelected = false;
        this.selectedUsersList = [];
      }
      this.selectedUsers = [
        ...selectedUsersCopy,
        ...selected.filter((user) => !selectedUsersCopy.find((e) => e.id === user.id)),
      ];
    },
    // eslint-disable-next-line
    select(user) {
      let currentSelect = user.selected;
      currentSelect = !currentSelect;
      this.allSelected = false;
      const selected = this.items.filter((u) => u.selected);
      if (selected.length === this.items.length) {
        this.allSelected = true;
        this.excludedUsers = [];
      } else {
        this.allSelected = false;
      }
      let isDouble = false;
      console.log(currentSelect);
      if (this.allSelectedVisibility) {
        if (this.excludedUsers.find((v) => v.id === user.id)) isDouble = true;
        if (currentSelect) {
          if (isDouble) {
            console.log('double if user selected and isDouble', isDouble);
            console.log('object already exists', this.selectedUsers);
          } else {
            this.excludedUsers.push(user);
            return this.excludedUsers;
          }
        } else {
          const index = this.excludedUsers.findIndex((u) => u === user);
          this.excludedUsers.splice(index, 1);
          console.log('removed, new array: ', this.excludedUsers);
        }
      } else {
        if (this.selectedUsers.find((v) => v.id === user.id)) isDouble = true;
        if (!currentSelect) {
          if (isDouble) {
            console.log('double if user selected and isDouble', isDouble);
            console.log('object already exists', this.selectedUsers);
          } else {
            this.selectedUsers.push(user);
            return this.selectedUsers;
          }
        } else {
          const index = this.selectedUsers.findIndex((u) => u === user);
          this.selectedUsers.splice(index, 1);
          console.log('removed, new array: ', this.selectedUsers);
        }
      }
    },
    async deleteProfile(id) {
      this.pending = true;

      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('manager/DeleteManager', id);

        await this.getItems();

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

      this.getItems();
    },

    resolveFilter(e) {
      console.log('--- ', e);
      this.filter = [];
      this.filter.push(e);

      this.getItems();
    },

    selectPerPage() {
      this.page = 1;

      this.getItems();
    },

    pager(page) {
      this.page = page;

      this.getItems();
    },

    async getItems() {
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

      await this.$store.dispatch('mailing/GetItems', o);

      await this.$store.dispatch('mailing/GetStatuses');

      this.pending = null;
    },
    async getOptions(moduleId) { // получить список полей для создания и редактирвания
      await this.$store.dispatch('mailing/GetOptions', {
        moduleId,
      });
    },
  },

  mounted() {},

  async activated() {
    await this.getOptions();
    await this.getItems();
  },

  components: {
    vSelect,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    FilterDrop: () => import('./components/FilterDrop.vue'),
    // BS
    BBadge,
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
