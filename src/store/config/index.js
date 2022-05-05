import { getModulesConfig, getReports, getMainModulesConfig } from '@/api/config';

export default {
  namespaced: true,

  state: {
    modules: null,
  },

  getters: {
    modules: (state) => state.modules,
  },

  mutations: {
    SET_MODULES: (state, o) => {
      state.modules = o;
    },
  },

  actions: {
    async GetMainModulesConfig(o, data) {
      try {
        const res = await getMainModulesConfig(data);

        return res;
      } catch (e) {
        console.log('--- ', e);
      }

      return null;
    },

    async GetModulesConfig({ commit }, data) {
      try {
        const res = await getModulesConfig(data);

        commit('SET_MODULES', res.data);

        return res;
      } catch (e) {
        console.log('--- ', e);
      }

      return null;
    },

    async GetReports(a, data) {
      try {
        const res = await getReports(data);

        return res;
      } catch (e) {
        console.log('--- ', e);
      }

      return null;
    },
  },
};
