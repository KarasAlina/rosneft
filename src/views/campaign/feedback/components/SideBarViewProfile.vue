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
      @hidden="profile = null"
      @shown="show"
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
      <Spinner class="position-left-0 position-right-0 position-top-0 position-bottom-0 position-absolute" v-if="!profile" />

      <template v-else>
        <b-list-group class="m-2">
          <b-list-group-item
              :key="index"
              v-for="(field, index) in fields"
              class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
            <b class="text-right pr-50 w-50">{{field.label}}</b>

            <div class="pl-50 w-50">{{field.value ? field.value : '-'}}</div>
          </b-list-group-item>
        </b-list-group>

        <div class="text-center mt-3">
          <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              :to="`/${moduleId}/profile/${current}`"
          >
            <feather-icon
                icon="ExternalLinkIcon"
                class="mr-50"
            />
            Детальный профиль
          </b-button>
        </div>
      </template>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BListGroup, BListGroupItem, BButton,
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
      type: String,
      required: true,
    },
  },

  data() {
    return {
      profile: null,
    };
  },

  computed: {
    fields() {
      const a = this.$store.getters['profile/options']?.map((item) => {
        const b = this.profile && this.profile[item.key];

        const c = { ...item };

        c.value = b;

        return c;
      });

      const d = a?.filter((item) => item.key !== 'actions');

      return d;
    },

    moduleId() {
      return this.$store.getters['program/current'].name;
    },
  },

  methods: {
    async getProfile() {
      const data = {
        id: this.current,
        params: {
          moduleId: this.moduleId,
        },
      };

      try {
        const r = await this.$store.dispatch('profile/GetProfile', data);

        this.profile = r;
      } catch (e) {
        this.profile = false;
      }

      console.log('--- ', this.profile);
    },

    async getOptions(moduleId) {
      await this.$store.dispatch('profile/GetOptions', {
        moduleId,
      });
    },

    async show() {
      await this.getOptions(this.moduleId);

      await this.getProfile();
    },
  },

  mounted() {},

  components: {
    Spinner: () => import('@/layouts/components/Spinner.vue'),
    // BS
    BButton,
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
