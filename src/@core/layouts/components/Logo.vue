<template>
  <div>
    <img v-if="skin.value !== 'dark'" src="@/assets/images/logo/logo.svg" alt=""/>
    <img v-else src="@/assets/images/logo/logo.svg" alt=""/>
  </div>
</template>

<script>
import useAppConfig from '@core/app-config/useAppConfig';

export default {
  data() {
    return {
      skin: useAppConfig().skin,
    };
  },
};
</script>
