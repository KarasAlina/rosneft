<template>
  <div>
    <b-card no-body class="p-0">
      <b-form @submit.prevent="send('created')">
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
                    @click="setActiveListTab(1)"
                  >
                    Новый список
                  </b-button>
                  <b-button
                    :variant="activeListTab === 2 ? 'primary' : 'outline-primary'"
                    @click="setActiveListTab(2)"
                  >
                    Прежние списки
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
            <div v-if="activeListTab === 1">
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
              <b-row v-if="items">
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
                <b-col cols="12">
                  <FlipTable>
                    <b-table
                      class="w-100"
                      @sort-changed="updateSort($event); getItems()"
                      :items="items"
                      :fields="visibleFields"
                      show-empty
                      selectable
                      select-mode="multi"
                      empty-text="Совпадающих записей не найдено"
                    >
                      <!-- Head Select -->
                      <template #head(selected)>
                        <b-form-checkbox
                          v-model="allSelected"
                          @change="selectAll(items), allSelected = !allSelected, allSelectedVisibility = !allSelectedVisibility"
                        >
                        </b-form-checkbox>
                      </template>

                      <!-- Body Select -->
                      <template #cell(selected)="data">
                        <b-form-checkbox
                          v-model="data.item.selected"
                          @change="select(items, data.item)"
                        >
                        </b-form-checkbox>
                      </template>
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
                  </FlipTable>
                </b-col>
              </b-row>
            </div>
            <div v-else>
              <b-row>
                <b-col
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <div v-if="recipientVisibleFields" class="d-flex align-items-center flex-wrap w-100">
                    <!-- Filter -->
                    <FilterDropUsers :options="recipientVisibleFields.filter(item => item.key !== 'actions')" @trigger="resolveFilter($event)"/>
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
              <b-row v-if="recipientListComplete">
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
                <b-col cols="12">
                  <FlipTable>
                    <b-table
                      class="w-100"
                      @sort-changed="updateSort($event); getItems()"
                      :items="recipientListComplete"
                      :fields="recipientVisibleFields"
                      show-empty
                      selectable
                      select-mode="multi"
                      empty-text="Совпадающих записей не найдено"
                    >
                      <!-- Head Select -->
                      <template #head(selected)>
                        <b-form-checkbox
                          v-model="allSelected"
                          @change="selectAll(recipientListComplete), allSelected = !allSelected, allSelectedVisibility = !allSelectedVisibility"
                        >
                        </b-form-checkbox>
                      </template>

                      <!-- Body Select -->
                      <template #cell(selected)="data">
                        <b-form-checkbox
                          v-model="data.item.selected"
                          @change="select(recipientListComplete, data.item)"
                        >
                        </b-form-checkbox>
                      </template>
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
                  </FlipTable>
                </b-col>
              </b-row>
            </div>

            <!-- Pagination -->
            <b-row class="mt-1 mb-2">
              <b-col
                cols="12"
                md="6"
                class="mb-1 mb-md-0 d-flex align-items-center"
              >
                <div class="d-flex align-items-end justify-content-sm-start justify-content-lg-end flex-wrap text-light">
                  <div>Показано {{ (perPage * page - perPage + 1) | formatNumber }}-{{ ((perPage * page) > totalCountRecipient ? totalCountRecipient : (perPage * page)) | formatNumber }} из {{ totalCountRecipient | formatNumber }} записей</div>
                </div>
              </b-col>
              <b-col
                cols="12"
                md="6"
                class="d-flex justify-content-start justify-content-md-end align-items-center"
              >
                <b-pagination
                  class="m-0"
                  v-if="totalCountRecipient > perPage"
                  @change="pager"
                  v-model="currentPage"
                  :total-rows="totalCountRecipient"
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
            <div class="p-2 rounded" style="background: #f8f8f8">
              <b-row>
                <b-col cols="12" md="6">
                  <span>Выбрано получателей:</span>
                  <span class="px-50 pt-25 pb-15 ml-50 mr-2 rounded-pill line-height-1 font-small-2 bg-primary">{{selectedUsers.length}}</span>
                  <b-button
                    variant="outline-primary"
                    size="md"
                    @click="addToTotal()"
                  >
                    <feather-icon
                      icon="PlusIcon"
                      class="mr-75"
                      size="14"
                    />
                    Добавить выбранные
                  </b-button>
                </b-col>
                <b-col cols="12" md="6" class="d-flex justify-content-end align-items-center">
                  <span>Всего получателей:</span>
                  <span class="px-50 pt-25 pb-15 ml-50 mr-2 rounded-pill line-height-1 font-small-2 bg-success">{{selectedUsersAll.length}}</span>
                  <b-button
                    variant="success"
                    :disabled="!selectedUsersAll.length"
                    @click="showSaveListPopup()"
                  >
                    <feather-icon
                      icon="CheckIcon"
                      class="mr-75"
                      size="14"
                    />
                    Завершить
                  </b-button>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <!-- Step 2 end -->
        <!-- Step 3 -->
        <div v-if="showNextStep" class="py-4 px-5 border-bottom">
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
                  :class="form.template === radio.id ? 'border-primary' : 'border'"
                  class="template-preview rounded"
                  @change="fillFields(radio.id)"
                  :value="radio.id">
                  <img
                    v-if="radio.image"
                    :src="require(radio.image)"
                    :alt="radio.name"
                    class="template-preview-image"
                  >
                  <div
                    v-else
                    class="template-preview-image-placeholder d-flex align-items-center justify-content-center"
                  >
                    <feather-icon
                      class="text-light"
                      icon="ImageIcon"
                      size="38"
                    />
                  </div>
                  <div class="p-1 w-100">
                    {{ radio.name }}
                  </div>
                </b-form-radio>
              </b-col>
            </b-row>
          </div>
        </div>
        <!-- Step 3 end -->
        <!-- Step 4 -->
        <div v-if="showNextStep" class="py-4 px-5" :key="indexMessages">
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
                    type="text"
                    placeholder="Доброе, утро, [first_name}!"
                    required
                  ></b-form-input>
                  <b-form-text v-html="'Подстановки: &lbrace;&lbrace;first_name&rbrace;&rbrace;, &lbrace;&lbrace;last_name&rbrace;&rbrace; могут быть'"></b-form-text>
                </b-form-group>
                <b-form-group class="mb-2">
                  <label for="form-title">Welcome Message</label>
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
            <div class="mailing-actions d-flex align-items-center bg-lighten rounded p-2 w-100">
              <b-button
                variant="outline-success"
                class="mr-1"
                @click="send('test')"
              >
                Предпросмотр
              </b-button>
              <b-button
                variant="success"
                class="mr-auto"
                type="submit"
              >
                Создать
              </b-button>
              <b-button
                variant="outline-light"
                class="mr-1"
                @click="send('draft')"
              >
                Сохранить как черновик
              </b-button>
              <b-button
                variant="outline-light"
                :to="{ name: 'Mailing' }"
              >
                Отменить
              </b-button>
              <!-- <div
                class="text-light d-flex align-items-center"
              >
                <feather-icon
                  class="text-light mr-50 mb-25"
                  icon="Trash2Icon"
                  size="14"
                />
                Удалить рассылку
              </div> -->
            </div>
          </div>
        </div>
        <!-- Step 4 end -->
      </b-form>
    </b-card>
    <SaveListModal
      @createRecipient="createRecipient"
    />
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
  BFormCheckbox,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import SaveListModal from '../../components/SaveListModal.vue';
import FlipTable from '../../components/FlipTable.vue';

export default {
  data: () => ({
    form: {
      title: null,
      template: null,
      greeting: null,
      text: null,
    },
    showNextStep: false,
    activeListTab: 1,
    indexMessages: 1,
    pending: null,
    pendingOptions: null,
    page: 1,
    currentPage: 1,
    filter: [],
    currentProfile: {},
    currentList: null,
    sortBy: null,
    sortDesc: false,
    filteredItems: null,
    allSelected: false,
    allSelectedVisibility: false,
    selectedUsers: [],
    selectedUsersAll: [],
    excludedUsers: [],
    errorMessage: null,
    submitStatus: false,
  }),
  watch: {
    currentProgram() {
      // this.getOptions(this.currentProgram.name);
      this.currentPage = 1;
      this.page = 1;
      this.getItems(this.currentProgram?.name);
    },
  },
  computed: {
    me() {
      return this.$store.getters['me/data'];
    },

    recipientVisibleFields() {
      return this.recipientFields?.filter((field) => field.visible && field.tableVisible);
    },

    visibleFields() {
      return this.fields?.filter((field) => field.visible && field.tableVisible);
    },

    fields() {
      return this.$store.getters['mailing/recipientListOptions'];
    },

    recipientFields() {
      return this.$store.getters['mailing/recipientListCompleteOptions'];
    },

    recipientListComplete() {
      return this.$store.getters['mailing/recipientListComplete']?.items;
    },

    totalVisibleFields() {
      return this.fields.filter((item) => item.visible && item.tableVisible).length;
    },
    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['mailing/recipientList']?._meta.totalCount;
    },

    totalCountRecipient() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['mailing/recipientListComplete']?._meta.totalCount;
    },

    currentProgram() {
      return this.$store.getters['program/current'];
    },

    items() {
      return this.$store.getters['mailing/recipientList']?.items;
    },
    templates() {
      return this.$store.getters['mailing/templates']?.items;
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
    fillFields(id) {
      const currentTemplate = this.templates.filter((item) => item.id === id)[0];

      this.indexMessages += 1;
      this.form.greeting = currentTemplate.welcome_text;
      this.form.text = currentTemplate.message_text;
    },

    addToTotal() {
      this.selectedUsers.forEach((element) => {
        const exist = this.selectedUsersAll.filter((item) => item === element).length;
        if (!exist) {
          this.selectedUsersAll.push(element);
        } else {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Выбраный пользователь/пользователи уже есть в списке',
              icon: 'ListIcon',
              variant: 'primary',
            },
          });
        }
      });
    },

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

    deleteFilter(o) {
      const i = this.filter.indexOf(o);

      if (i !== -1) {
        this.filter.splice(i, 1);
      }

      this.getItems();
    },

    resolveFilter(e) {
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
    /* eslint-disable no-param-reassign */
    selectAll(items) {
      const $this = this;
      this.excludedUsers = [];
      items.forEach((user) => {
        user.selected = $this.allSelected;
      });
      const notSelected = items.filter((user) => !user.selected);
      const selected = items.filter((user) => user.selected);
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
    select(items, user) {
      let currentSelect = user.selected;
      currentSelect = !currentSelect;
      this.allSelected = false;
      const selected = items.filter((u) => u.selected);
      if (selected.length === items.length) {
        this.allSelected = true;
        this.excludedUsers = [];
      } else {
        this.allSelected = false;
      }
      let isDouble = false;
      console.log(currentSelect);
      if (this.allSelectedVisibility) {
        if (this.excludedUsers.find((v) => v === user.id)) isDouble = true;
        if (currentSelect) {
          if (isDouble) {
            console.log('double if user selected and isDouble', isDouble);
            console.log('object already exists', this.selectedUsers);
          } else {
            this.excludedUsers.push(user.id);
            return this.excludedUsers;
          }
        } else {
          const index = this.excludedUsers.findIndex((u) => u === user);
          this.excludedUsers.splice(index, 1);
          console.log('removed, new array: ', this.excludedUsers);
        }
      } else {
        if (this.selectedUsers.find((v) => v === user.id)) isDouble = true;
        if (!currentSelect) {
          if (isDouble) {
            console.log('double if user selected and isDouble', isDouble);
            console.log('object already exists', this.selectedUsers);
          } else {
            this.selectedUsers.push(user.id);
            return this.selectedUsers;
          }
        } else {
          const index = this.selectedUsers.findIndex((u) => u === user);
          this.selectedUsers.splice(index, 1);
          console.log('removed, new array: ', this.selectedUsers);
        }
      }
    },
    async getItems() { // все профили текущего промо
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

      await this.$store.dispatch('mailing/GetRecipientList', o);

      this.pending = null;
    },
    async getOptions(moduleId) { // получить список полей для создания и редактирвания
      await this.$store.dispatch('mailing/GetRecipientListOptions', {
        moduleId,
      });
      await this.$store.dispatch('mailing/GetRecipientOptions', {
        moduleId,
      });
    },
    async getTemplateList() {
      await this.$store.dispatch('mailing/GetTemplateList');
    },
    async setRecipientListItem() {
      await this.$store.dispatch('mailing/SetRecipientListItem', {
        recipient_id: 0,
        profile_id: 0,
      });
    },
    async send(status) {
      if (!this.submitStatus) {
        this.submitStatus = true;

        this.errorMessage = null;

        const email = status === 'test' ? this.me.email : null;

        const data = {
          name: this.form.title,
          email,
          recipient_id: this.currentList ? this.currentList : this.selectedUsersAll,
          welcome_text: this.form.greeting,
          message_text: this.form.text,
          status,
        };

        try {
          const title = status === 'test' ? 'Тестовая рассылка была отправлена на Вашу почту' : 'Расслыка успешно создана';

          await this.$store.dispatch('mailing/SetItem', data);

          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title,
              icon: 'CoffeeIcon',
              variant: 'success',
            },
          });

          if (status !== 'test') this.$router.push({ name: 'Mailing' });
        } catch (e) {
          this.submitStatus = false;

          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: e,
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          });
        }

        this.submitStatus = false;
      }
    },
    async getRecipientListComplete() {
      await this.$store.dispatch('mailing/GetRecipient');
    },
    async createRecipient(name) {
      let data;
      if (this.excludedUsers.length) {
        data = {
          name,
          excluded_users: this.excludedUsers,
        };
      } else if (this.totalCount > this.selectedUsersAll) {
        data = {
          name,
          selected_users: this.selectedUsersAll,
        };
      } else {
        data = {
          name,
          selected_users: 'all',
        };
      }
      try {
        await this.$store.dispatch('mailing/CreateRecipient', data).then((res) => {
          this.currentList = res.data.id;
        });
        this.showNextStep = true;
        this.getRecipientListComplete();
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: 'Список успешно добален',
            icon: 'CheckCircleIcon',
            variant: 'success',
          },
        });
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: error,
            icon: 'AlertTriangleIcon',
            variant: 'warning',
          },
        });
      }
    },

    showSaveListPopup() {
      if (this.activeListTab === 1) {
        this.$bvModal.show('saveList');
      } else {
        this.showNextStep = true;
      }
    },

    setActiveListTab(id) {
      this.activeListTab = id;
      this.selectedUsers = [];
      this.selectedUsersAll = [];
      this.excludedUsers = [];
      this.allSelected = false;
      this.allSelectedVisibility = false;
    },
  },
  mounted() {
    this.getItems();
    this.getOptions();
    this.getTemplateList();
    this.getRecipientListComplete();
    // this.setItem();
  },
  beforeRouteLeave(to, from, next) {
    this.form.title = null;
    this.form.template = null;
    this.form.greeting = null;
    this.form.text = null;
    this.allSelected = false;
    this.selectedUsersList = [];
    this.selectedUsers = [];
    this.selectedUsersAll = [];
    this.getItems();
    next();
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
    BFormCheckbox,
    FlipTable,
    SaveListModal,
  },
};

</script>

<style lang="scss" scoped>
</style>
