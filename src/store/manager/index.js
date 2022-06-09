import {
  getManagers, setManager, deleteManager, updateManager, getRoles, getOptions, setOption,
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
    options: null, // насторойки полей инпутов
  },
  getters: {
    list: (state) => state.list,
    roles: (state) => state.roles,
    options: (state) => state.options,
  },
  mutations: {
    SET_MANAGERS: (state, o) => {
      state.list = o;
    },

    SET_ROLES: (state, o) => {
      state.roles = o;
    },

    SET_OPTIONS: (state, options) => {
      state.options = options;
    },
  },
  actions: {
    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);
        const o = r.data.User.properties;

        const a = Object.keys(o).map((key) => ({
          key,
          label: o[key].title,
          sortable: true,
          data: o[key],
          visible: 'visible' in o[key] ? o[key].visible : true,
          readOnly: 'readOnly' in o[key] ? o[key].readOnly : false,
          tableVisible: 'table' in o[key] ? o[key].table : true,
        }));

        a.push({
          key: 'actions',
          sortable: false,
          label: 'Действия',
          visible: true,
          readOnly: true,
          tableVisible: true,
        });

        commit('SET_OPTIONS', a);
      } catch (e) {
        console.log('---error ', e);
      }
    },
    async SetOption({ commit }, data) {
      try {
        return await setOption(data);
      } catch (e) {
        // ...
      }

      return commit;
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
