<template>
  <b-sidebar
      width="40vw"
      :visible="isActiveSideBarViewProfile"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-active-side-bar-view-profile', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Краткий простмотр
        </h5>

        <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
        />
      </div>

      <!-- BODY -->
      <b-list-group class="m-2">
        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">ID</b>

          <div class="pl-50 w-50">{{ current.id || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Название</b>

          <div class="pl-50 w-50">{{ current.title || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Код</b>

          <div class="pl-50 w-50 d-flex flex-nowrap justify-center align-items-center">
            {{ current.name || '-' }}

            <div
                v-clipboard:copy="current.name"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                class="ml-50">
              <feather-icon
                  icon="CopyIcon"
                  class="cursor-pointer text-primary"
              />
            </div>
          </div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Пароль</b>

          <div class="pl-50 w-50 d-flex flex-nowrap justify-center align-items-center">
            {{ current.password || '-' }}

            <div
                v-clipboard:copy="current.password"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                class="ml-50">
              <feather-icon
                  icon="CopyIcon"
                  class="cursor-pointer text-primary"
              />
            </div>
          </div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Дата создания</b>

          <div class="pl-50 w-50">{{ current.created_at || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Дата обновления</b>

          <div class="pl-50 w-50">{{ current.updated_at || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Срок действия</b>

          <div class="pl-50 w-50">с {{ current.start_at || '-' }} по {{ current.finish_at || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Статус</b>

          <div class="pl-50 w-50">{{ current.status ? 'Активен' : 'Неактивен' }}</div>
        </b-list-group-item>
      </b-list-group>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BListGroup, BListGroupItem,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  name: 'SideBarViewProfile',

  model: {
    prop: 'isActiveSideBarViewProfile',
    event: 'update:is-active-side-bar-view-profile',
  },

  props: {
    isActiveSideBarViewProfile: {
      type: Boolean,
      required: true,
    },

    current: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  methods: {
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
          title: 'Скопировано',
          icon: 'BellIcon',
        },
      });
    },
  },

  mounted() {},

  components: {
    // BS
    BSidebar,
    BListGroup,
    BListGroupItem,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass" scoped></style>
