<template>
  <b-nav-item-dropdown
    v-if="notifications"
    class="dropdown-notification mr-25"
    menu-class="dropdown-menu-media"
    right
  >
    <template #button-content>
      <feather-icon
        :badge="notifications.length"
        badge-classes="bg-danger"
        class="text-body"
        icon="BellIcon"
        size="21"
      />
    </template>

    <!-- Header -->
    <li class="dropdown-menu-header">
      <div class="dropdown-header d-flex">
        <h4 class="notification-title mb-0 mr-auto">
          Notifications
        </h4>
        <b-badge
          pill
          variant="light-primary"
        >
          {{ notifications.length }} New
        </b-badge>
      </div>
    </li>

    <!-- Notifications -->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="scrollable-container media-list scroll-area"
      tagname="li"
    >
      <b-link
        v-for="(noty, index) in notifications"
        :key="index"
      >
        <b-media>
          <template #aside>
            <b-avatar
              size="32"
              :variant="noty.attributes.type"
            >
              <feather-icon :icon="renderIcon(noty.attributes.type)" />
            </b-avatar>
          </template>
          <p class="media-heading">
            <span class="font-weight-bolder">
              {{ noty.attributes.subject }}
            </span>
          </p>
          <small class="notification-text">{{ noty.attributes.body }}</small>
        </b-media>
      </b-link>
    </vue-perfect-scrollbar>

    <!-- Cart Footer -->
    <li
        v-if="notifications.length"
        class="dropdown-menu-footer"
    >
      <b-button
          @click="readAll"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          block
      >
        <template v-if="!submitStatus">
          Read all notifications
        </template>

        <b-spinner v-else small/>
      </b-button>
    </li>
    <li class="dropdown-menu-footer" v-else>There are no notifications at the moment</li>
  </b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown, BBadge, BMedia, BLink, BAvatar, BButton, BSpinner,
} from 'bootstrap-vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Ripple from 'vue-ripple-directive';

export default {
  data() {
    return {
      submitStatus: null,
    };
  },

  computed: {
    notifications() {
      return this.$store.getters['me/user']?.included?.filter((n) => n.type === 'notification');
    },
  },

  methods: {
    renderIcon(name) {
      switch (name) {
        case 'warning':
          return 'AlertTriangleIcon';

        case 'success':
          return 'CheckIcon';

        case 'danger':
          return 'AlertOctagonIcon';

        case 'secondary':
          return 'InfoIcon';

        case 'info':
          return 'InfoIcon';

        default:
          return 'InfoIcon';
      }
    },

    async readAll() {
      if (!this.submitStatus) {
        this.submitStatus = true;

        try {
          await this.$store.dispatch('me/DeleteNotifications');
        } catch (e) {
          console.log('--- ', e);
        }

        await this.$store.dispatch('me/GetUser');

        this.submitStatus = false;
      }
    },
  },

  components: {
    BSpinner,
    BNavItemDropdown,
    BBadge,
    BMedia,
    BLink,
    BAvatar,
    VuePerfectScrollbar,
    BButton,
  },

  directives: {
    Ripple,
  },

  setup() {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    };

    return {
      perfectScrollbarSettings,
    };
  },
};
</script>

<style>

</style>
