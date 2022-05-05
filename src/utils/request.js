import Vue from 'vue';
import VueNoty from 'vuejs-noty';
import 'vuejs-noty/dist/vuejs-noty.css';
import axios from 'axios';
import { getToken } from '@/utils/auth';

const store = require('../store');

Vue.use(VueNoty);

const BASE_API = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_API_DEV;

const service = axios.create({
  baseURL: BASE_API,
  timeout: 10000,
});

service.interceptors.request.use((config) => {
  const conf = config;

  conf.headers['Content-Type'] = 'application/json';

  if (getToken()) {
    conf.headers.Authorization = getToken();
  }

  return conf;
}, (error) => {
  Promise.reject(error);
});

service.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      const r = response?.data;

      store.default.dispatch('me/SingOut', true);

      return Promise.reject(r);
    }

    if (response?.status < 500) {
      const r = response?.data;

      if (Array.isArray(r)) {
        r.forEach((item) => {
          Vue.noty.error(`<b>Ошибка. </b> <div>${item?.message}</div>`);
        });
      } else {
        Vue.noty.error(`<b>Ошибка. </b> <div>${r && r?.name}</div><div>${r && r?.message}</div>`);
      }

      return Promise.reject(new Error(r));
    }

    if (response?.status >= 500) {
      Vue.noty.error(`<b>Oops. Что-то пошло не так. Пожалуйста, повторите позже.</b> <div>${error}</div>`);
    }

    return Promise.reject(new Error(response));
  },
);

export { BASE_API };

export default service;
