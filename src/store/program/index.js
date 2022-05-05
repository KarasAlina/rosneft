import getProgram from '@/api/program';
/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null,
    current: null,
  },
  getters: {
    list: (state) => state.list,
    current: (state) => state.current,
  },
  mutations: {
    SET_PROGRAM_LIST: (state, list) => {
      state.list = list;
    },

    SET_CURRENT: (state, o) => {
      state.current = o;
    },
  },
  actions: {
    async GetProgramList({ commit }, params) {
      try {
        const list = await getProgram(params);

        commit('SET_PROGRAM_LIST', list.data);

        return list.data;
      } catch (e) {
        console.log('--- ', e);
      }
    },
  },
};
