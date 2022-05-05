<template>
  <!-- Error page-->
  <div class="misc-wrapper">
    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2 class="mb-1">
          Страница не найдена
        </h2>
        <p class="mb-2">
          Oops! Запрошенный URL не был найден на этом сервере.
        </p>

        <b-button
          variant="primary"
          class="mb-2 btn-sm-block"
          href="/"
        >
          На главную
        </b-button>

        <!-- image -->
        <b-img
          fluid
          :src="imgUrl"
          alt="Error page"
        />
      </div>
    </div>
  </div>
<!-- / Error page-->
</template>

<script>
/* eslint-disable  */
import { BButton, BImg } from 'bootstrap-vue';
import store from '@/store/index';

export default {
  components: {
    BButton,
    BImg,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/error.svg'),
    };
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/error-dark.svg');
        return this.downImg;
      }
      return this.downImg;
    },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
