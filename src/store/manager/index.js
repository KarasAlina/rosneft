import {
  getManagers, setManager, deleteManager, updateManager, getRoles,
} from '@/api/manager';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: [],
    roles: [],
    sort: {
      sortBy: null,
      sortDesc: null,
    },
  },
  getters: {
    list: (state) => state.list,
    roles: (state) => state.roles,
  },
  mutations: {
    SET_MANAGERS: (state, o) => {
      state.list = o;
    },

    SET_ROLES: (state, o) => {
      state.roles = o;
    },
  },
  actions: {
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

    async GetManagers({ commit }, data) {
      try {
        const r = await getManagers(data);

        commit('SET_MANAGERS', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    SetManager({ commit }, data) {
      return (async () => setManager(data))();
    },

    async DeleteManager({ commit }, id) {
      await deleteManager(id);
    },

    async UpdateManager({ commit }, data) {
      await updateManager(data);
    },
  },
};
