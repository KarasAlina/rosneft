import {
  getActivityList, getOptions, deleteActivity, getActivity, setOption, updateActivity, createActivity,
} from '@/api/activity';
import { getProfiles } from '@/api/profile';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null,
    options: null,
    profiles: null,
  },
  getters: {
    list: (state) => state.list,
    options: (state) => state.options,
    profiles: (state) => state.profiles,
  },
  mutations: {
    SET_PROFILES: (state, o) => {
      state.profiles = o;
    },

    SET_LIST: (state, user) => {
      state.list = user;
    },

    SET_OPTIONS: (state, options) => {
      state.options = options;
    },
  },
  actions: {
    async GetProfiles({ commit }, o) {
      try {
        const r = await getProfiles(o);

        commit('SET_PROFILES', r.data);

        return r.data;
      } catch (e) {
        console.log('--- ', e);
      }
    },

    SetActivity({ commit }, data) {
      return (async () => createActivity(data))();
    },

    async UpdateActivity({ commit }, o) {
      await updateActivity(o);
    },

    async DeleteActivity({ commit }, o) {
      await deleteActivity(o);
    },

    async GetActivityList({ commit }, o) {
      try {
        const r = await getActivityList(o);

        commit('SET_LIST', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetActivity({ commit }, o) {
      const r = await getActivity(o);

      return r.data;
    },

    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);

        const o = r.data.Activity.properties;

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
