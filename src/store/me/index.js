import {
  signIn, singOut, getUser, getRoles, getProrgams, forgotPassword,
} from '@/api/me';
import { setToken, removeToken } from '@/utils/auth';
import router from '@/router';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    data: null,
    settings: {
      perPage: 5,
      perPageList: Object.freeze([5, 10, 15, 25, 50]),
      accessProrgams: null,
    },
    roles: [],
  },
  getters: {
    data: (state) => state.data,
    settings: (state) => state.settings,
    roles: (state) => state.roles,
  },
  mutations: {
    SET_USER_SETTINGS: (state, o) => {
      state.settings[o.prop] = o.value;
    },

    SET_USER: (state, user) => {
      state.data = user;
    },

    SET_ROLES: (state, o) => {
      state.roles = o;
    },

    SET_TOKEN: (state, token) => {
      setToken(token);
    },

    REMOVE_TOKEN: () => {
      removeToken();
    },
  },
  actions: {
    async GetAccessProrgams({ commit }) {
      try {
        const res = await getProrgams();
        console.log(res);
        commit('SET_USER_SETTINGS', {
          prop: 'accessProrgams',
          value: res.data,
        });

        return res;
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetRoles({ commit }) {
      try {
        const r = await getRoles();

        const a = Object.keys(r.data).map(key => ({
          key,
          value: r.data[key],
        }));

        commit('SET_ROLES', a);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetUser({ commit }) {
      try {
        const user = await getUser();

        commit('SET_USER', user.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    SignIn({ commit }, data) {
      return (async () => signIn(data))();
    },

    ForgotPassword({ commit }, data) {
      return (async () => forgotPassword(data))();
    },

    async SingOut({ commit }, local) {
      console.log('---', 'singOut');

      (document.getElementById('spinner')).classList.remove('-hide');

      if (local) {
        commit('REMOVE_TOKEN');

        commit('SET_USER', null);
      } else {
        try {
          await singOut();

          commit('REMOVE_TOKEN');

          commit('SET_USER', null);
        } catch (e) {
          console.log('--- ', e);
        }
      }

      await router.replace('/user/login').catch(() => {});

      window.localStorage.removeItem(process.env.VUE_APP_STATE_KEY);

      document.location.reload(true);
    },
  },
};
