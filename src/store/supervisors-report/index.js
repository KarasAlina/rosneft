import {
  setItem, getList, getItem, deleteItem, getOptions, setOption,
} from '@/api/supervisors-report';

export default {
  namespaced: true,

  state: {
    data: null,
    options: null,
  },

  getters: {
    data: (state) => state.data,
    options: (state) => state.options,
  },

  mutations: {
    SET_DATA: (state, o) => {
      state.data = o;
    },
    SET_OPTIONS: (state, options) => {
      state.options = options;
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
    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);

        const o = r.data.SupervisorsReport.properties;

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
