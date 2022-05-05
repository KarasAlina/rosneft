import Vue from 'vue';
import VueNumber from 'vue-number-animation';
import * as dayjs from 'dayjs';
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue';
import VueCompositionAPI from '@vue/composition-api';
import { VLazyImagePlugin } from 'v-lazy-image';
import LoadScript from 'vue-plugin-load-script';
import VueMask from 'v-mask';

import router from './router';
import store from './store';
import App from './App.vue';

// Global Components
import './global-components';

// Global filters
import './utils/filters';

// 3rd party plugins
import '@/libs/portal-vue';
import '@/libs/toastification';
import '@/libs/vue-select';
import '@/libs/clipboard';

// import '@/libs/acl';
// import '@/libs/portal-vue';
// import '@/libs/clipboard';
import '@/libs/sweet-alerts';

Vue.use(VLazyImagePlugin);
Vue.prototype.$date = dayjs;

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);

// Composition API
Vue.use(VueCompositionAPI);

// LoadScript
Vue.use(LoadScript);

// VueNumber
Vue.use(VueNumber);

// v-mask
Vue.use(VueMask);

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css'); // For form-wizard

// import core styles
require('@core/scss/core.scss');

// import assets styles
require('@/assets/scss/style.scss');

require('@core/scss/vue/libs/vue-select.scss');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
