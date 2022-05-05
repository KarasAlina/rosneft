<template>
  <div class="navbar-header d-xl-block d-none">
    <ul class="nav navbar-nav">
      <li class="nav-item">
        <b-link
          class="navbar-brand"
          to="/"
        >
          <span class="brand-logo">
            <b-img
              :src="skin !== 'dark' ? appLogoImage : appLogoImageLight"
              alt="logo"
            />
          </span>
        </b-link>
      </li>
    </ul>
  </div>
</template>

<script>
import useAppConfig from '@core/app-config/useAppConfig';
import { BLink, BImg } from 'bootstrap-vue';
import { $themeConfig } from '@themeConfig';

export default {
  data() {
    return {
      skin: useAppConfig().skin.value,
    };
  },
  components: {
    BLink,
    BImg,
  },
  setup() {
    // App Name
    const { appName, appLogoImage, appLogoImageLight } = $themeConfig.app;
    return {
      appName,
      appLogoImage,
      appLogoImageLight,
    };
  },
};
</script>

<style>

</style>
