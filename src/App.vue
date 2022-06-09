<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses]"
  >
    <JsonViewer
        v-if="dev"
        :expand-depth=0
        :value="$store.getters">
    </JsonViewer>

    <keep-alive>
      <transition name="fade">
        <component v-if="ready" :is="layout">
          <router-view />
        </component>
      </transition>
    </keep-alive>
  </div>
</template>

<script>

// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig';
import { provideToast } from 'vue-toastification/composition';
import { watch } from '@vue/composition-api';
import useAppConfig from '@core/app-config/useAppConfig';
import { getToken } from '@/utils/auth';

import { useWindowSize, useCssVar } from '@vueuse/core';

import store from '@/store';

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue');
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue');

export default {
  data() {
    return {
      ready: null,
    };
  },

  components: {
    // dev
    JsonViewer: () => ({
      component: import('vue-json-viewer'),
    }),

    // Layouts
    LayoutVertical,
    LayoutFull,

  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full';
      return `layout-${this.contentLayoutType}`;
    },

    contentLayoutType() {
      return this.$store.state.appConfig.layout.type;
    },

    currentProgram() {
      return this.$store.getters['program/current'];
    },
  },

  beforeCreate() {
    // Set colors in theme
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark'];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim();
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2));
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout;
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  },

  methods: {
    async checkAuth() {
      if (getToken()) {
        try {
          await this.$store.dispatch('me/GetUser');

          await this.$store.dispatch('program/GetProgramList', { page: 1 });

          await this.$store.dispatch('me/GetAccessProrgams');
        } catch (e) {
          console.log('---e ', e);
          await this.$router.push('/user/login');
        }
      } else {
        this.$store.commit('me/REMOVE_TOKEN', null);

        this.$store.commit('me/SET_USER', null);

        await this.$router.push('/user/login');
      }

      this.hideSpinner();

      this.ready = true;
    },

    hideSpinner() {
      const spinner = document.getElementById('spinner');

      if (spinner) spinner.classList.add('-hide');
    },
  },

  created() {},

  mounted() {
    this.checkAuth();
  },

  setup() {
    const { skin, skinClasses } = useAppConfig();

    const dev = process.env.NODE_ENV === 'development';

    // If skin is dark when initialized => Add class to body
    if (skin.value === 'dark') document.body.classList.add('dark-layout');

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    });

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth);
    const { width: windowWidth } = useWindowSize();
    watch(windowWidth, (val) => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val);
    });

    return {
      skinClasses,
      dev,
    };
  },
};
</script>

<style lang="sass">
.jv-container
  position: fixed !important
  bottom: 0
  top: auto !important
  left: 0
  z-index: 100001

  &.jv-light
    font-size: 12px
    background-color: floralwhite
    max-height: 78vh
    overflow: auto

  .jv-code
    padding: 5px
</style>
