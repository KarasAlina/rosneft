import {
  setItem, getList, getItem, deleteItem,
} from '@/api/report';

export default {
  namespaced: true,

  state: {
    data: null,
  },

  getters: {
    data: (state) => state.data,
  },

  mutations: {
    SET_DATA: (state, o) => {
      state.data = o;
    },
  },

  actions: {
    async SetItem(a, data) {
      try {
        const o = await setItem(data);

        return o;
      } catch (e) {
        return e;
      }
    },

    async GetList({ commit }, data) {
      try {
        const o = await getList(data);

        commit('SET_DATA', o.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetItem(a, id) {
      try {
        const o = await getItem(id);

        return o;
      } catch (e) {
        return e;
      }
    },

    async DeleteItem(a, id) {
      try {
        const o = await deleteItem(id);

        return o;
      } catch (e) {
        return e;
      }
    },
  },
};
