<template>
  <div
    class="main-menu menu-fixed menu-accordion"
    :class="[
      { 'expanded': !isVerticalMenuCollapsed || (isVerticalMenuCollapsed && isMouseHovered) },
      skin === 'semi-dark' ? 'menu-dark' : 'menu-light'
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header expanded" :id="skin">
      <slot
        name="header"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :toggleCollapsed="toggleCollapsed"
        :collapseTogglerIcon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row h-100">
          <transition name="fade">
            <!-- Logo  -->
            <li class="nav-item d-flex mr-auto logo-small" v-if="isVerticalMenuCollapsed || (isVerticalMenuCollapsed && isMouseHovered)">
              <b-link
                class="navbar-brand m-0"
                to="/"
              >
                <span class="brand-logo">
                  <b-img
                      src="@/assets/images/logo/logo-small.svg"
                      :alt="skin"
                  />
                </span>
              </b-link>
            </li>
            <!-- Logo -->
            <li class="nav-item d-flex mr-auto" v-else>
              <b-link
                class="navbar-brand m-0"
                to="/"
              >
                <span class="brand-logo">
                  <b-img
                      :src="skin !== 'dark' ? appLogoImage : appLogoImageLight"
                      :alt="skin"
                  />
                </span>
              </b-link>
            </li>
          </transition>

          <!-- Toggler Button -->
          <li class="nav-item nav-toggle d-flex">
            <b-link class="nav-link modern-nav-toggle mt-auto mb-auto">
              <feather-icon
                icon="XIcon"
                size="20"
                class="d-block d-xl-none"
                @click="toggleVerticalMenuActive"
              />
              <feather-icon
                :icon="collapseTogglerIconFeather"
                size="20"
                class="d-none d-xl-block collapse-toggle-icon text-dark"
                @click="toggleCollapsed"
              />
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->

    <!-- Shadow -->
    <div
      :class="{'d-block': shallShadowBottom}"
      class="shadow-bottom"
    />
    <!-- campaigns menu content-->
    <vertical-nav-menu-items
        :items="navMenuСampaigns"
        class="navigation navigation-main p-0"
    />

    <template v-if="!programList">
      <Spinner class="m-1" />
    </template>

    <template v-else-if="programList.length">
      <b-form-group class="ml-1 mr-1 mb-0" v-if="programList.length">
        <v-select
            @input="onSelect($event)"
            @open="onOpen"
            @close="onClose"
            :clearable="false"
            v-model="selectedProgram"
            class="v-select-grey-bg v-select-no-bd"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            label="title"
            :options="viewProgramList">
          <template #list-footer>
            <li ref="load" class="loader" v-show="hasNextPage">
              <Spinner class="m-1" />
            </li>
          </template>
        </v-select>
      </b-form-group>
    </template>

    <template v-else>
      <b-alert
          class="m-0"
          variant="warning"
          show
      >
        <div class="alert-body">
          <span>
            <strong>Внимание!</strong> Нет созданных компаний.
            <b-link to="/campaign/create" class="alert-link">
              Создать.
            </b-link>
          </span>
        </div>
      </b-alert>
    </template>
    <!-- main menu content-->
    <vue-perfect-scrollbar
      v-if="programList && programList.length"
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="evt => { shallShadowBottom = evt.srcElement.scrollTop > 0 }"
    >
      <vertical-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main"
      />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import _ from 'lodash';
import vSelect from 'vue-select';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import {
  BLink, BImg, BFormGroup, BAlert,
} from 'bootstrap-vue';
import { provide, computed, ref } from '@vue/composition-api';
import navMenuСampaigns from '@/navigation/vertical/campaign';
import navMenuItems from '@/navigation/vertical/main';
import useAppConfig from '@core/app-config/useAppConfig';
import { $themeConfig } from '@themeConfig';
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue';
import useVerticalNavMenu from './useVerticalNavMenu';

export default {
  data() {
    return {
      skin: useAppConfig().skin.value,
      observer: null,
      programList: this.$store.getters['program/list']?.items || [],
    };
  },

  computed: {
    viewProgramList() {
      const filtered = _.intersectionBy(this.programList, this.accessProrgams, 'id');
      return filtered;
    },

    accessProrgams() {
      return this.$store.getters['me/settings'].accessProrgams || [];
    },

    selectedProgram: {
      get() {
        return this.$store.getters['program/current'];
      },

      set(o) {
        this.$store.commit('program/SET_CURRENT', o);
      },
    },

    totalCount() {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }] */
      return this.$store.getters['program/list']._meta.totalCount;
    },

    currentPage() {
      return this.$store.getters['program/list']._meta.currentPage;
    },

    hasNextPage() {
      return this.programList.length < this.totalCount;
    },
  },

  methods: {
    async getModulesConfig() {
      await this.$store.dispatch('config/GetModulesConfig', {
        moduleId: this.selectedProgram.name,
      });
    },

    async getMainModulesConfig() {
      await this.$store.dispatch('config/GetMainModulesConfig');
    },

    async onSelect(e) {
      await this.getModulesConfig();

      this.$store.commit('program/SET_CURRENT', e);
    },

    async getProgramList(page) {
      const list = await this.$store.dispatch('program/GetProgramList', {
        page,
      });

      this.programList = this.programList ? this.programList.concat(list.items) : this.programList = list.items;

      if (!this.selectedProgram) {
        [this.selectedProgram] = this.programList;
      }
    },

    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },

    onClose() {
      this.observer.disconnect();
    },

    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent;
        const { scrollTop } = target.offsetParent;
        await this.getProgramList(this.currentPage + 1);
        await this.$nextTick();
        ul.scrollTop = scrollTop;
      }
    },
  },

  mounted() {
    this.getMainModulesConfig();

    if (!this.selectedProgram) {
      [this.selectedProgram] = this.programList;

      this.getModulesConfig();
    }

    if (!this.programList) {
      this.getProgramList(1);
    }

    this.observer = new IntersectionObserver(this.infiniteScroll);
  },

  components: {
    vSelect,
    VuePerfectScrollbar,
    VerticalNavMenuItems,
    BLink,
    BImg,
    BFormGroup,
    BAlert,
    Spinner: () => import('@/layouts/components/Spinner.vue'),
  },

  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props);

    const { skin } = useAppConfig();

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false);

    provide('isMouseHovered', isMouseHovered);

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    };

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'MenuIcon' : 'MenuIcon'));

    // App Name
    const { appName, appLogoImage, appLogoImageLight } = $themeConfig.app;

    return {
      navMenuItems,
      navMenuСampaigns,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,

      // App Name
      appName,
      appLogoImage,
      appLogoImageLight,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>
