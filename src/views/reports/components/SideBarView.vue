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

          <div class="pl-50 w-50">{{ current.name || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Дата создания</b>

          <div class="pl-50 w-50">{{ current.created_at || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Дата завершения</b>

          <div class="pl-50 w-50">{{ current.completed_at || '-' }}</div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Статус</b>

          <div class="pl-50 w-50">
            <b-badge :variant="resolveStatusType(current.status)">{{ resolveStatus(current.status) }}</b-badge>
          </div>
        </b-list-group-item>

        <b-list-group-item class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">Ссылка</b>

          <div class="pl-50 w-50">
            <a
                class="d-inline-flex align-items-center justify-content-center"
                v-if="current.status === 3"
                :href="url + current.file"
                :download="current.name">
              <feather-icon icon="DownloadIcon" />
              <span class="align-middle ml-50">Скачать</span>
            </a>

            <span v-else>-</span>
          </div>
        </b-list-group-item>
      </b-list-group>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BListGroup, BListGroupItem, BBadge,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

const url = Object.freeze(process.env.VUE_APP_BASE_API);

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
    return {
      url,
    };
  },

  methods: {
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
  },

  mounted() {},

  components: {
    // BS
    BBadge,
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
