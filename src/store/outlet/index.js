import {
  getOutlet, getOptions, setOption, deleteOutlet, updateOutlet,
} from '@/api/outlet';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null,
    options: null, // насторойки полей инпутов
  },
  getters: {
    list: (state) => state.list,
    options: (state) => state.options,
  },
  mutations: {
    SET_LIST: (state, user) => {
      state.list = user;
    },

    SET_OPTIONS: (state, options) => {
      state.options = options;
    },
  },
  actions: {
    async GetOutlet({ commit }, o) {
      try {
        const r = await getOutlet(o);

        commit('SET_LIST', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);
        const o = r.data.Outlet.properties;

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
    async DeleteOutlet({ commit }, o) {
      await deleteOutlet(o);
    },
    async UpdateOutlet({ commit }, o) {
      await updateOutlet(o);
    },
  },
};
