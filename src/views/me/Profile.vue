<template>
  <div>
    <b-card class="mb-0" v-if="!profile">
      <b-card-text>
        <Spinner class="back mt-1 mb-1" v-if="profile === null" />

        <b-alert
            class="mb-0"
            v-else-if="profile === false"
            variant="warning"
            show
        >
          <div class="alert-body">
            <span><strong>Ошибка!</strong> Пользователь не найден.</span>
          </div>
        </b-alert>
      </b-card-text>
    </b-card>

    <div v-else>
      <b-row class="mb-0 mb-xl-2 pb-xl-50">
        <b-col
            cols="12"
            md="12"
            xl="12"
            class="mb-1 mb-xl-0"
        >
          <b-card class="full-height mb-0">
            <b-row>
              <b-col
                md="4"
              >
                <b-card-text>
                  <b-row>
                    <b-col
                      sm="12"
                      md="3"
                      lg="4"
                    >
                      <b-avatar
                        size="108"
                        variant="light-primary"
                        :src="profile.photo"
                        class="flex-0"
                        rounded
                      />
                    </b-col>
                    <b-col
                      sm="12"
                      md="9"
                      lg="8"
                      class="pl-lg-0"
                    >
                      <h4 class="text-capitalize d-flex">
                        <b>{{profile.first_name}} {{profile.last_name}}</b>
                        <!-- <router-link :to="`/${superModuleId}/super-profile/${profile.profile_id}`" class="font-small-2 ml-auto text-nowrap">
                          подробнее
                          <feather-icon
                              icon="ExternalLinkIcon"
                              class="ml-25"
                          />
                        </router-link> -->
                      </h4>

                      <p class="mb-2">{{profile.email}}</p>

                      <div class="mb-50">
                        <b-button
                            @click="showSideBarEditProfile"
                            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                            variant="primary"
                            class="mr-50 mb-25"
                        >
                          <span class="text-nowrap">Редактировать</span>
                        </b-button>

                        <!-- <b-button
                            @click="deleteProfile(id, moduleId)"
                            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                            variant="danger"
                            class="mr-50 mb-25"
                            size="sm"
                        >
                          <feather-icon
                              icon="TrashIcon"
                              class="mr-50"
                          />
                          <span class="text-nowrap">Удалить</span>
                        </b-button> -->
                      </div>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-col>
              <b-col
                :class="{'border-right': profile.score}"
              >
                <b-card-text>
                  <b-list-group>
                    <b-list-group-item
                        :key="index"
                        v-for="(field, index) in fields"
                        class="py-50 px-0 d-flex flex-row flex-nowrap justify-center align-items-baseline border-0">
                      <div class="pr-50 pl-50 w-50">{{ field.label }}</div>
                      <div class="pl-50 w-50">{{ field.value ? field.value : '-' }}</div>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-text>
              </b-col>
              <b-col
                md="3"
                v-if="profile.score"
              >
                <div class="px-1 mb-2">
                  <h4 class="text-capitalize mb-2">Бонусные баллы</h4>
                  <div class="d-flex">
                    <div
                      class="mr-1 bg-light-success d-flex align-items-center justify-content-center rounded"
                      style="width:38px;height: 38px;"
                    >
                      <feather-icon
                        icon="AwardIcon"
                        size="18"
                      />
                    </div>
                    <div>
                      <div class="font-medium-3 line-height-1">{{ profile.score }}</div>
                      <small class="text-light">Бонусов начислено</small>
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>

      <!-- <b-row class="mb-0 mb-xl-2 pb-xl-50">
        <b-col
            cols="12"
            md="6"
            class="mb-1 mb-xl-0"
        >
          <b-card
            v-if="activityListItems"
            class="full-height mb-0">
            <b-card-text>
              <h4 class="mb-2">Активность пользователя</h4>

              <div class="position-relative">
                <Spinner class="position-left-0 position-right-0 position-top-0 position-bottom-0 position-absolute" v-if="pending" />

                <app-timeline v-if="activityListItems.length">
                  <app-timeline-item
                    :key="index"
                    v-for="(item, index) in activityListItems"
                    :title="type[item.type] || '-'"
                    :subtitle="item.comment"
                    :time="item.created_at | formatDate('DD.MM.YYYY')"
                    :variant="resolveIcon(item.type).variant"
                  />
                </app-timeline>

                <b-alert
                  class="mb-0"
                  v-else
                  variant="warning"
                  show
                >
                  <div class="alert-body">
                    <span>Данных нет.</span>
                  </div>
                </b-alert>
              </div>

              <b-pagination
                class="m-0 mt-2"
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
            </b-card-text>
          </b-card>
        </b-col>

        <b-col
            cols="12"
            md="6"
            class="mb-1 mb-xl-0"
        >
        </b-col>
      </b-row> -->

      <SideBarEditProfile
          v-if="moduleId"
          :moduleId="moduleId"
          :current="profile"
          @refetch-data="getProfile"
          :isActiveSideBarEditProfile.sync="isActiveSideBarEditProfile"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import {
  BCard,
  BCardText,
  BRow,
  BCol,
  BAlert,
  BButton,
  BListGroup,
  BListGroupItem,
  BAvatar,
  // BPagination,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  data() {
    return {
      isActiveSideBarEditProfile: false,
      page: 1,
      currentPage: 1,
      pending: null,
      perPage: 5,
    };
  },

  computed: {
    ...mapGetters({
      currentPromo: 'program/current',
      activityOptions: 'activity/options',
      activityList: 'activity/list',
    }),
    profile() {
      return this.$store.getters['me/data'];
    },
    roles() {
      return this.$store.getters['me/roles'];
    },
    fields() {
      const a = this.$store.getters['profile/options']?.map((item) => {
        const b = this.profile?.[item.key];

        const c = { ...item };

        c.value = b;

        return c;
      });

      const d = a?.filter((item) => item.key !== 'actions');

      return d;
    },
    type() {
      const [a] = this.activityOptions.filter((item) => item.key === 'type');

      return a?.data?.value || {};
    },
    moduleId() {
      return this.$route.params.moduleId;
    },

    superModuleId() {
      return this.$store.getters['superProfile/superModuleId'];
    },
    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.activityList?._meta.totalCount;
    },
    id() {
      return this.$route.params.id;
    },

    config() {
      return this.$store.getters['config/modules'];
    },
    activityListItems() {
      return this.activityList?.items;
    },
  },

  methods: {
    ...mapActions({
      activityGetActivityList: 'activity/GetActivityList',
      getOptions: 'profile/GetOptions',
      getOptionsActivity: 'activity/GetOptions',
    }),
    pager(page) {
      this.page = page;

      this.getActivityList();
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
    async getActivityList() {
      this.pending = true;

      const filter = {
        and: [
          {
            profile_id: this.id,
          },
        ],
      };

      const o = {
        moduleId: this.currentPromo?.name,
        sort: '-created_at',
        'per-page': this.perPage,
        page: this.page,
        filter,
      };

      await this.activityGetActivityList(o);

      this.pending = null;
    },
    async deleteProfile(id, moduleId) {
      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('profile/DeleteProfile', {
          id,
          moduleId,
        });

        this.profile = false;

        await this.$router.push('/campaign/users');

        this.$swal({
          icon: 'success',
          title: 'Удалено!',
          text: 'Профиль удален.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    },

    showSideBarEditProfile() {
      this.isActiveSideBarEditProfile = true;
    },

    onError() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Failed to copy texts!',
          icon: 'BellIcon',
        },
      });
    },

    onCopy() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Пароль скопирован',
          icon: 'BellIcon',
        },
      });
    },

    async getOptions(moduleId) { // получить список полей для создания и редактирвания
      await this.$store.dispatch('profile/GetOptions', {
        moduleId,
      });
    },

    resolveIcon(type) {
      const variant = {
        user_get_prize: 'success',
        user_reg_code: 'warning',
        user_update_profile: 'danger',
        user_reg: 'info',
      };

      return {
        variant: variant[type] || 'primary',
      };
    },
  },

  mounted() {},

  async activated() {
    await this.getOptions(this.moduleId);

    await this.getActivityList();
  },

  components: {
    SideBarEditProfile: () => import('@/views/campaign/users/components/SideBarEditProfile.vue'),
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    // AppTimeline: () => import('@core/components/app-timeline/AppTimeline.vue'),
    // AppTimelineItem: () => import('@core/components/app-timeline/AppTimelineItem.vue'),
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    // BS
    BAvatar,
    BListGroup,
    BListGroupItem,
    BButton,
    BAlert,
    BRow,
    BCol,
    BCard,
    BCardText,
    // BPagination,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass" scoped>
.profile-stat
  margin: 0 auto
  display: grid
  grid-gap: 10px
  grid-template-columns: auto 1fr
  align-items: center

</style>
