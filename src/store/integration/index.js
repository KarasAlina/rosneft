import {
  getIntegration, deleteIntegration, setIntegration, updateIntegration,
} from '@/api/integration';
/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null,
  },
  getters: {
    list: (state) => state.list,
  },
  mutations: {
    SET_INTEGRATION_LIST: (state, list) => {
      state.list = list;
    },
  },
  actions: {
    async GetIntegration({ commit }, params) {
      try {
        const list = await getIntegration(params);

        commit('SET_INTEGRATION_LIST', list.data);

        return list.data;
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async DeleteIntegration({ commit }, id) {
      await deleteIntegration(id);
    },

    async SetIntegration({ commit }, o) {
      await setIntegration(o);
    },

    async UpdateIntegration({ commit }, o) {
      await updateIntegration(o);
    },
  },
};
