<template>
  <div>
    <b-card no-body class="p-0">
      <b-form>
        <!-- Step 1 -->
        <div class="py-4 px-5 border-bottom">
          <div class="px-3">
            <b-card-text class="font-medium-3">1. Данные рассылки</b-card-text>
            <b-row>
              <b-col
                sm="12"
                md="6"
              >
                <b-form-group
                  id="form-title-group"
                >
                  <label for="form-title">Название рассылки<span class="text-danger">*</span></label>
                  <b-form-input
                    id="form-title"
                    v-model="form.title"
                    type="text"
                    placeholder="Введите название"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </div>
        <!-- Step 1 end -->
        <!-- Step 2 -->
        <div class="py-4 px-5 border-bottom">
          <div class="px-3">
            <b-card-text class="font-medium-3 mb-2">2. Выбор получателей</b-card-text>
            <b-row class="mb-2">
              <b-col
                cols="12"
              >
                <b-button-group>
                  <b-button
                    :variant="activeListTab === 1 ? 'primary' : 'outline-primary'"
                    @click="activeListTab = 1"
                  >
                    Новый список
                  </b-button>
                  <b-button
                    :variant="activeListTab === 2 ? 'primary' : 'outline-primary'"
                    @click="activeListTab = 2"
                  >
                    Прежние списки
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col
                cols="12"
                md="6"
                lg="4"
              >
                <div v-if="visibleFields" class="d-flex align-items-center flex-wrap w-100">
                  <!-- Filter -->
                  <FilterDropUsers :options="visibleFields.filter(item => item.key !== 'actions')" @trigger="resolveFilter($event)"/>
                </div>
              </b-col>
              <b-col>
                <div
                  v-if="filter && filter.length"
                  class="d-flex align-items-center align-content-center flex-wrap pt-25">
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
            <b-row v-if="profiles">
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
                    </b-col>
                  </b-row>
                </div>

                <!-- Table -->
                <b-table
                    @sort-changed="updateSort($event); getProfiles()"
                    responsive
                    :items="profiles"
                    :fields="visibleFields"
                    show-empty
                    selectable
                    select-mode="multi"
                    empty-text="Совпадающих записей не найдено"
                >
                  <template slot="HEAD_index" slot-scope="data">
                    {{data.value}}
                  </template>
                  <template #cell()="data">
                    <div>{{ data.value || '-' }}</div>
                  </template>
                  <!-- Column: Actions -->
                  <template #cell(actions)>
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
            </b-row>
          </div>
        </div>
        <!-- Step 2 end -->
        <!-- Step 3 -->
        <div class="py-4 px-5 border-bottom">
          <div class="px-3">
            <b-card-text class="font-medium-3 mb-2">3. Выберите шаблон</b-card-text>
            <b-row>
              <b-col
                md="3"
                v-for="(radio, i) in templates"
                :key="i"
              >
                <b-form-radio
                  v-model="form.template"
                  name="template"
                  :class="form.template === radio.value ? 'border-primary' : 'border'"
                  class="template-radio rounded"
                  :value="radio.value">
                  <img
                    v-if="radio.image"
                    :src="require(radio.image)"
                    :alt="radio.text"
                    class="template-radio-image"
                  >
                  <div
                    v-else
                    class="template-radio-image-placeholder d-flex align-items-center justify-content-center"
                  >
                    <feather-icon
                      class="text-light"
                      icon="ImageIcon"
                      size="38"
                    />
                  </div>
                  <div class="p-1 w-100">
                    {{ radio.text }}
                  </div>
                </b-form-radio>
              </b-col>
            </b-row>
          </div>
        </div>
        <!-- Step 3 end -->
        <!-- Step 4 -->
        <div class="py-4 px-5">
          <div class="px-3 pb-2">
            <b-card-text class="font-medium-3 mb-2">4. Редактирование сообщения</b-card-text>
            <b-row>
              <b-col
                sm="12"
                md="6"
              >
                <b-form-group class="mb-2">
                  <label for="form-weelcome-greeting">Welcome Text</label>
                  <b-form-input
                    id="form-welcome-greeting"
                    v-model="form.greeting"
                    type="email"
                    placeholder="Доброе, утро, [first_name}!"
                    required
                  ></b-form-input>
                  <b-form-text v-html="'Подстановки: &lbrace;&lbrace;first_name&rbrace;&rbrace;, &lbrace;&lbrace;last_name&rbrace;&rbrace; могут быть'"></b-form-text>
                </b-form-group>
                <b-form-group class="mb-2">
                  <label for="form-title">Welcome Text</label>
                  <b-form-textarea
                    id="form-welcome-text"
                    v-model="form.text"
                    placeholder="Enter something..."
                    rows="5"
                    max-rows="6"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="newsletter-actions d-flex align-items-center bg-lighten rounded p-2 w-100">
              <b-button
                variant="outline-success"
                class="mr-1"
              >
                Предпросмотр
              </b-button>
              <b-button
                variant="success"
                class="mr-auto"
              >
                Предпросмотр
              </b-button>
              <b-button
                variant="outline-light"
                class="mr-1"
              >
                Сохранить как черновик
              </b-button>
              <b-button
                variant="outline-light"
                class="mr-2"
              >
                Отменить
              </b-button>
              <div
                class="text-light d-flex align-items-center"
              >
                <feather-icon
                  class="text-light mr-50 mb-25"
                  icon="Trash2Icon"
                  size="14"
                />
                Удалить рассылку
              </div>
            </div>
          </div>
        </div>
        <!-- Step 4 end -->
      </b-form>
    </b-card>
  </div>
</template>

<script>
import vSelect from 'vue-select';

import {
  BCard,
  BCardText,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BFormRadio,
  BFormText,
  BFormTextarea,
  BButton,
  BButtonGroup,
  BTable,
  BPagination,
  BBadge,
} from 'bootstrap-vue';

export default {
  data: () => ({
    form: {
      title: null,
      template: null,
      greeting: null,
      text: null,
    },
    activeListTab: 1,
    pending: null,
    pendingOptions: null,
    page: 1,
    currentPage: 1,
    filter: [],
    currentProfile: {},
    sortBy: null,
    sortDesc: false,
    filteredItems: null,
    templates: [
      {
        text: 'Запуск новой акции',
        value: 1,
      },
      {
        text: 'Мотивирующая',
        value: 2,
      },
      {
        text: 'Изменение условий акции',
        value: 3,
      },
    ],
  }),
  watch: {
    currentProgram() {
      // this.getOptions(this.currentProgram.name);
      this.currentPage = 1;
      this.page = 1;
      this.getProfiles(this.currentProgram?.name);
    },
  },
  computed: {
    exportConfig() {
      const and = this.and();

      const filter = {
        and,
      };

      const a = {
        program_id: this.currentProgram.id,
        entity: 'profile',
        type: 'program', // program => 'Промо', crm => 'CRM', report => 'Отчёт', analytics => 'Аналитика'
      };

      a.filter = filter;

      return a;
    },

    visibleFields() {
      return this.fields?.filter((field) => field.visible && field.tableVisible);
    },

    fields() {
      return this.$store.getters['profile/options'];
    },
    totalVisibleFields() {
      return this.fields.filter((item) => item.visible && item.tableVisible).length;
    },
    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['profile/list']?._meta.totalCount;
    },

    currentProgram() {
      return this.$store.getters['program/current'];
    },

    profiles() {
      return this.$store.getters['profile/list']?.items;
    },
    perPageList() {
      return this.$store.getters['me/settings'].perPageList;
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

    async deleteProfile(id, moduleId) {
      this.pending = true;

      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('profile/DeleteProfile', {
          id,
          moduleId,
        });

        await this.getProfiles();

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

      this.getProfiles();
    },

    resolveFilter(e) {
      this.filter.push(e);

      this.getProfiles();
    },

    async setTableFields(field) {
      this.pendingOptions = true;

      this.$store.commit('profile/SET_OPTIONS', this.fields);

      const data = {
        key: field.key,
        params: {
          moduleId: this.currentProgram?.name,
          attribute: 'visible',
          value: field.visible,
        },
      };

      await this.$store.dispatch('profile/SetOption', data);

      this.pendingOptions = false;
    },

    selectPerPage() {
      this.page = 1;

      this.getProfiles();
    },

    pager(page) {
      this.page = page;

      this.getProfiles();
    },

    async getProfiles() { // все профили текущего промо
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

      await this.$store.dispatch('profile/GetProfiles', o);

      this.pending = null;
    },
    async getOptions(moduleId) { // получить список полей для создания и редактирвания
      await this.$store.dispatch('profile/GetOptions', {
        moduleId,
      });
    },
  },
  components: {
    FilterDropUsers: () => import('./components/FilterDropUsers.vue'),
    BCard,
    BCardText,
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BFormRadio,
    BFormText,
    BFormTextarea,
    BButton,
    BButtonGroup,
    BTable,
    vSelect,
    BPagination,
    BBadge,
  },
};

</script>

<style lang="scss" scoped>
</style>
