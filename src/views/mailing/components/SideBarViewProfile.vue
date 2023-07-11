<template>
  <b-sidebar
      width="40vw"
      id="sidebar-right"
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

          <div class="pl-50 w-50">{{current.id || '-'}}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Email</b>

          <div class="pl-50 w-50">{{current.email || '-'}}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Имя</b>

          <div class="pl-50 w-50">{{current.first_name || '-'}}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Фамилия</b>

          <div class="pl-50 w-50">{{current.last_name || '-'}}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Дата регистрации</b>

          <div class="pl-50 w-50">{{current.created_at || '-'}}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Дата обновления</b>

          <div class="pl-50 w-50">{{current.updated_at || '-'}}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Роль</b>

          <div class="pl-50 w-50">{{current.role || '-'}}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Проект</b>

          <div class="pl-50 w-50">{{current.project || '-'}}</div>
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

  methods: {},

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
