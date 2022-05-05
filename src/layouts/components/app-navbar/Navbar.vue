<template>
  <div v-if="user" class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
<!--      <dark-Toggler class="d-none d-lg-block" />-->
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <dark-Toggler class="d-none taxt-dark" />
      <li class="navbar-user d-none d-lg-flex" v-if="user">
        <div class="user-nav">
          <p class="user-name font-weight-bolder mb-0">
            {{ user.first_name | capitalize}} {{ user.last_name | capitalize}}
          </p>
          <!-- <span class="user-status">{{ user.role }}</span> -->
        </div>

        <b-avatar
          size="38"
          variant="light-primary"
          :src="user.photo"
          badge
          class="badge-minimal"
          badge-variant="success"
        />
        <router-link
            to="/me/profile"
            link-class="d-flex align-items-center link-dark">
          <feather-icon
            size="20"
            icon="SettingsIcon"
            class="ml-2"
          />
        </router-link>

        <div
          @click="logOut"
          link-class="d-flex align-items-center">
          <feather-icon
            size="20"
            icon="LogOutIcon"
            class="ml-2 text-dark"
          />
        </div>
      </li>
      <notification-dropdown />
      <b-nav-item-dropdown
        right
        toggle-class="d-flex d-sm-none align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content v-if="user">
          <div class="d-sm-flex user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ user.first_name | capitalize}} {{ user.last_name | capitalize}}
            </p>
            <span class="user-status">{{ user.role }}</span>
          </div>

          <b-avatar
            size="40"
            variant="light-primary"
            :src="user.photo"
            badge
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item
            to="/me/profile"
            link-class="d-flex align-items-center">
          <feather-icon
            size="16"
            icon="UserIcon"
            class="mr-50"
          />
          <span>Профиль</span>
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item
            @click="logOut"
            link-class="d-flex align-items-center">
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>Выйти</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue';
import DarkToggler from '@/layouts/components/app-navbar/components/DarkToggler.vue';
import NotificationDropdown from '@/layouts/components/app-navbar/components/NotificationDropdown.vue';

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,

    // Navbar Components
    DarkToggler,
    NotificationDropdown,
  },

  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },

  computed: {
    user() {
      return this.$store.getters['me/data'];
    },
  },

  methods: {
    logOut() {
      window.localStorage.removeItem(process.env.VUE_APP_STATE_KEY);

      this.$store.dispatch('me/SingOut');
    },
  },
};
</script>
