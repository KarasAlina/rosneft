import {
  getBonusPoint, getOptions, setOption, getStatuses,
} from '@/api/bonus-point';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null,
    statuses: null,
    options: null, // насторойки полей инпутов
  },
  getters: {
    list: (state) => state.list,
    statuses: (state) => state.statuses,
    options: (state) => state.options,
  },
  mutations: {
    SET_LIST: (state, user) => {
      state.list = user;
    },

    SET_STATUSES: (state, status) => {
      state.statuses = status;
    },

    SET_OPTIONS: (state, options) => {
      state.options = options;
    },
  },
  actions: {
    async GetStatuses({ commit }) {
      try {
        const r = await getStatuses();

        const a = Object.keys(r.data).map(key => ({
          key,
          value: r.data[key],
        }));

        commit('SET_STATUSES', a);
      } catch (e) {
        console.log('--- ', e);
      }
    },
    async GetBonusPoint({ commit }, o) {
      try {
        const r = await getBonusPoint(o);

        commit('SET_LIST', r.data);
      } catch (e) {
        return Promise.reject(new Error(e));
      }
    },

    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);
        
        const o = r.data.BonusPoint.properties;

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
        return Promise.reject(new Error(e));
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
