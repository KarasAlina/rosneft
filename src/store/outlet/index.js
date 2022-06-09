import {
  getOutlet, getOptions, setOption, deleteOutlet, updateOutlet, getOutletsAll, getOutletsAllSingle, getOptionsAll, getOutletTypes,
} from '@/api/outlet';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null,
    listAll: null,
    options: null, // насторойки полей инпутов
    optionsAll: null, // насторойки полей инпутов
    types: null,
  },
  getters: {
    list: (state) => state.list,
    listAll: (state) => state.listAll,
    options: (state) => state.options,
    optionsAll: (state) => state.optionsAll,
    types: (state) => state.types,
  },
  mutations: {
    SET_LIST: (state, data) => {
      state.list = data;
    },

    SET_LIST_ALL: (state, data) => {
      state.listAll = data;
    },

    SET_OPTIONS: (state, options) => {
      state.options = options;
    },

    SET_OPTIONS_ALL: (state, options) => {
      state.optionsAll = options;
    },

    SET_TYPES: (state, type) => {
      state.types = type;
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
    async GetOutletTypes({ commit }, o) {
      try {
        const r = await getOutletTypes(o);
        const a = Object.keys(r.data).map(key => ({
          key,
          value: r.data[key],
        }));
        commit('SET_TYPES', a);
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

    async GetOptionsAll({ commit }, data) {
      try {
        const r = await getOptionsAll(data);
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

        commit('SET_OPTIONS_ALL', a);
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
    async GetOutletsAll({ commit }, o) {
      try {
        const item = await getOutletsAll(o);

        commit('SET_LIST_ALL', item.data);
      } catch (e) {
        commit('SET_LIST_ALL', null);
      }
    },
    async GetOutletsAllSingle({ commit }, o) {
      const r = await getOutletsAllSingle(o);

      return r.data;
    },
  },
};
