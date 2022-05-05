import {
  getChecks, getOptions, deleteCheck, getCheck, setOption, updateCheck,
} from '@/api/check';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null,
    options: null,
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
    async UpdateCheck({ commit }, o) {
      await updateCheck(o);
    },

    async DeleteCheck({ commit }, o) {
      await deleteCheck(o);
    },

    async GetChecks({ commit }, o) {
      try {
        const users = await getChecks(o);

        commit('SET_LIST', users.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetCheck({ commit }, o) {
      const r = await getCheck(o);

      return r.data;
    },

    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);

        const o = r.data.Receipt.properties;

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
  },
};
