import {
  getStages, getOptions, setOption, deleteStage, updateStage,
} from '@/api/stage';

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
    async UpdateStage({ commit }, o) {
      await updateStage(o);
    },

    async DeleteStage({ commit }, o) {
      await deleteStage(o);
    },
    async GetStages({ commit }, o) {
      try {
        const r = await getStages(o);

        commit('SET_LIST', r.data);
      } catch (e) {
        return Promise.reject(new Error(e));
      }
    },

    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);

        const o = r.data.ProgramStage.properties;

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
