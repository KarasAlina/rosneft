<template>
  <layout-vertical>
    <keep-alive>
      <router-view />
    </keep-alive>

    <template #navbar="{ toggleVerticalMenuActive }">
      <navbar :toggle-vertical-menu-active="toggleVerticalMenuActive" />
    </template>
  </layout-vertical>
</template>

<script>
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue';
import Navbar from '@/layouts/components/app-navbar/Navbar.vue';

export default {
  components: {
    LayoutVertical,
    Navbar,
  },
};
</script>
