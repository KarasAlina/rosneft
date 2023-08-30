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
                  <div class="d-flex">
                      <b-avatar
                        size="108"
                        variant="light-primary"
                        :src="profile.photo"
                        rounded
                        class="mr-2"
                      />
                      <div>
                        <h4 class="text-capitalize d-flex">
                          <b>{{profile.name}} {{profile.last_name}}</b>
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
                      </div>

                  </div>
                </b-card-text>
              </b-col>
              <b-col
                md="5"
                class="border-right"
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
            </b-row>
          </b-card>
        </b-col>

<!--        <b-col-->
<!--            cols="12"-->
<!--            xl="4"-->
<!--            class="mb-1 mb-xl-0"-->
<!--        >-->
<!--          <b-card class="full-height mb-0">-->
<!--            <b-card-text class="d-flex justify-content-center align-items-center full-height">-->
<!--              <div class="profile-stat">-->
<!--                <h6 class="text-right m-0 font-large-3">10</h6>-->
<!--                <div>кодов <br>зарегистрировано</div>-->

<!--                <h6 class="text-right m-0 font-large-3">5</h6>-->
<!--                <div>чеков <br>зарегистрировано</div>-->

<!--                <h6 class="text-right m-0 font-large-3">2</h6>-->
<!--                <div>обращений <br>в обратную связь</div>-->
<!--              </div>-->
<!--            </b-card-text>-->
<!--          </b-card>-->
<!--        </b-col>-->
      </b-row>

      <b-row class="mb-0 mb-xl-2 pb-xl-50">
        <b-col
            cols="12"
            md="6"
            class="mb-1 mb-xl-0"
        >
          <b-card class="full-height mb-0">
            <b-card-text>
              <h4 class="mb-2">Активность пользователя</h4>

              <app-timeline>
                <app-timeline-item
                    title="Goal Achieved"
                    subtitle="All milestones are completed"
                    icon="AwardIcon"
                    time="few minutes ago"
                    variant="success"
                />

                <app-timeline-item
                    title="Last milestone remain"
                    subtitle="You are just one step away from your goal"
                    icon="InfoIcon"
                    time="3 minutes ago"
                    variant="info"
                />

                <app-timeline-item
                    title="Your are running low on time"
                    subtitle="Only 30 minutes left to finish milestone"
                    icon="ClockIcon"
                    time="21 minutes ago"
                    variant="warning"
                />

                <app-timeline-item
                    title="Client Meeting"
                    subtitle="New event has been added to your schedule"
                    icon="UserIcon"
                    time="36 minutes ago"
                />

                <app-timeline-item
                    title="Авторизация в проекте"
                    subtitle="Авторизация пользователя в проекте"
                    icon="LogInIcon"
                    time="1 hour ago"
                />

                <app-timeline-item
                    icon="GiftIcon"
                    variant="success"
                >
                  <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                    <h6>Сертификат</h6>
                    <small class="text-muted">2 hours ago</small>
                  </div>
                  <p><a href="#">Сертификат озон</a></p>
                </app-timeline-item>

                <app-timeline-item
                    title="Регистрация в проекте"
                    subtitle="Регистрация пользователя в проекте"
                    icon="LogInIcon"
                    time="1 hour ago"
                />
              </app-timeline>
            </b-card-text>
          </b-card>
        </b-col>

        <b-col
            cols="12"
            md="6"
            class="mb-1 mb-xl-0"
        >
          <b-row>
            <b-col
                v-if="config && config.prize"
                cols="12"
                xl="6">
              <b-card
                  @click="$router.push(`/campaign/prizes?profile=${id}`)"
                  class="mb-1 cursor-pointer text-success">
                <b-card-text class="text-center">
                  <feather-icon
                      icon="GiftIcon"
                      class="mb-1"
                      size="40"
                  />
                  <div>Призы</div>
                </b-card-text>
              </b-card>
            </b-col>

            <b-col
                v-if="config && config.code"
                cols="12"
                xl="6">
              <b-card
                  @click="$router.push(`/campaign/codes?profile=${id}`)"
                  class="mb-1 cursor-pointer text-primary">
                <b-card-text class="text-center">
                  <feather-icon
                      icon="CodesandboxIcon"
                      class="mb-1"
                      size="40"
                  />
                  <div>Коды</div>
                </b-card-text>
              </b-card>
            </b-col>

            <b-col
                v-if="config && config.receipt"
                cols="12"
                xl="6">
              <b-card
                  @click="$router.push(`/campaign/checks?profile=${id}`)"
                  class="mb-1 cursor-pointer text-warning">
                <b-card-text class="text-center">
                  <feather-icon
                      icon="TrelloIcon"
                      class="mb-1"
                      size="40"
                  />
                  <div>Чеки</div>
                </b-card-text>
              </b-card>
            </b-col>

            <b-col
                v-if="config && config.activity"
                cols="12"
                xl="6">
              <b-card
                  @click="$router.push(`/campaign/activity?profile=${id}`)"
                  class="mb-1 cursor-pointer text-info">
                <b-card-text class="text-center">
                  <feather-icon
                      icon="ActivityIcon"
                      class="mb-1"
                      size="40"
                  />
                  <div>Активности</div>
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <SideBarEditProfile
          :current="profile"
          @refetch-data="getProfile"
          :isActiveSideBarEditProfile.sync="isActiveSideBarEditProfile"/>
    </div>
  </div>
</template>

<script>
import Ripple from 'vue-ripple-directive';
import {
  BCard, BCardText, BRow, BCol, BAlert, BButton, BListGroup, BListGroupItem, BAvatar,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  data() {
    return {
      isActiveSideBarEditProfile: false,
      profile: null,
    };
  },

  computed: {
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

    id() {
      return this.$route.params.id;
    },

    config() {
      return this.$store.getters['config/modules'];
    },
  },

  methods: {
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
      const confirm = await this.confirmText();

      if (confirm.value) {
        await this.$store.dispatch('profile/DeleteProfile', {
          id,
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

    async getProfile() {
      const data = {
        id: this.id,
      };

      try {
        const r = await this.$store.dispatch('profile/GetProfileAllSingle', data);

        this.profile = r;
      } catch (e) {
        this.profile = false;
      }
    },
  },

  mounted() {},

  async activated() {
    await this.getOptions();

    await this.getProfile();
  },

  components: {
    SideBarEditProfile: () => import('./components/SideBarEditProfile.vue'),
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    AppTimeline: () => import('@core/components/app-timeline/AppTimeline.vue'),
    AppTimelineItem: () => import('@core/components/app-timeline/AppTimelineItem.vue'),
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
