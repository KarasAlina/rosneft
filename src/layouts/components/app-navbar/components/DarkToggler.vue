<template>
  <b-nav-item @click="skin = isDark ? 'light' : 'dark'">
    <feather-icon
      size="21"
      :icon="`${isDark ? 'Sun' : 'Moon'}Icon`"
    />
  </b-nav-item>
</template>

<script>
import { computed } from '@vue/composition-api';
import { BNavItem } from 'bootstrap-vue';
import useAppConfig from '@core/app-config/useAppConfig';

export default {
  components: {
    BNavItem,
  },
  setup() {
    const { skin } = useAppConfig();

    const isDark = computed(() => skin.value === 'dark');

    return { skin, isDark };
  },
};
</script>
