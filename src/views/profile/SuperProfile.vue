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
            xl="6"
            class="mb-1 mb-xl-0"
        >
          <b-card class="full-height mb-0">
            <b-card-text>
              <h4 class="text-capitalize d-flex">
                <b>{{profile.name}} {{profile.last_name}}</b>
              </h4>

              <p>{{profile.email}}</p>

              <div class="mb-50">
                <b-button
                    @click="showSideBarEditProfile"
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="primary"
                    class="mr-50 mb-25"
                    size="sm"
                >
                  <feather-icon
                      icon="EditIcon"
                      class="mr-50"
                  />
                  <span class="text-nowrap">Редактировать</span>
                </b-button>

                <b-button
                    @click="deleteProfile(id, superModuleId)"
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="gradient-danger"
                    class="mr-50 mb-25"
                    size="sm"
                >
                  <feather-icon
                      icon="TrashIcon"
                      class="mr-50"
                  />
                  <span class="text-nowrap">Удалить</span>
                </b-button>
              </div>

              <div>
                <b-dropdown
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    left
                    variant="primary"
                    size="sm"
                >
                  <template #button-content>
                    <feather-icon
                        icon="LogInIcon"
                        class="mr-50"
                    />
                    <span class="text-nowrap">Авторизоваться</span>
                  </template>

                  <b-dropdown-form class="width-300 p-0">
                    <b-form-group class="mb-0">
                      <label>Временный пароль</label>
                      <b-input-group>
                        <b-form-input disabled :value="profile.name" type="text"/>
                        <b-input-group-append
                            class="cursor-pointer"
                            v-clipboard:copy="profile.name"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                            is-text>
                          <feather-icon icon="CopyIcon"/>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-dropdown-form>
                </b-dropdown>
              </div>
            </b-card-text>
          </b-card>
        </b-col>

        <b-col
            cols="12"
            xl="6"
            class="mb-1 mb-xl-0"
        >
          <b-card class="full-height mb-0">
            <b-card-text>
              <b-list-group>
                <b-list-group-item
                    :key="index"
                    v-for="(field, index) in fields"
                    class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
                  <b class="text-right pr-50 w-50">{{field.label}}</b>

                  <div class="pl-50 w-50">{{field.value ? field.value : '-'}}</div>
                </b-list-group-item>
              </b-list-group>
            </b-card-text>
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
              <div class="d-flex">
                <h4 class="mb-2">Активность пользователя</h4>

                <router-link to="/" class="font-small-2 ml-auto text-nowrap">
                  подробнее
                  <feather-icon
                      icon="ExternalLinkIcon"
                      class="ml-25"
                  />
                </router-link>
              </div>

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
          <b-card class="full-height mb-0">
            <b-card-text>
              <h4 class="mb-2">Полученные призы</h4>

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
      </b-row>

      <SideBarEditProfile
          v-if="superModuleId"
          :current="profile"
          :moduleId="superModuleId"
          @refetch-data="getProfile"
          :isActiveSideBarEditProfile.sync="isActiveSideBarEditProfile"/>
    </div>
  </div>
</template>

<script>
import Ripple from 'vue-ripple-directive';
import {
  BCard, BCardText, BRow, BCol, BAlert, BButton, BFormGroup, BInputGroupAppend, BInputGroup, BListGroup, BListGroupItem,
  BFormInput,
  BDropdown,
  BDropdownForm,
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

    superModuleId() {
      return this.$route.params.superModuleId;
    },

    id() {
      return this.$route.params.id;
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

    async getProfile() {
      const data = {
        id: this.id,
        params: {
          moduleId: this.superModuleId,
        },
      };

      try {
        const r = await this.$store.dispatch('profile/GetProfile', data);

        this.profile = r;
      } catch (e) {
        this.profile = false;
      }

      console.log('--- ', this.fields);
    },
  },

  mounted() {},

  async activated() {
    await this.getOptions(this.superModuleId);

    await this.getProfile();
  },

  components: {
    SideBarEditProfile: () => import('@/views/campaign/users/components/SideBarEditProfile.vue'),
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    AppTimeline: () => import('@core/components/app-timeline/AppTimeline.vue'),
    AppTimelineItem: () => import('@core/components/app-timeline/AppTimelineItem.vue'),
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    // BS
    BListGroup,
    BListGroupItem,
    BInputGroup,
    BInputGroupAppend,
    BFormGroup,
    BFormInput,
    BDropdown,
    BDropdownForm,
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
