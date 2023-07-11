import {
  getProfiles, getOptions, deleteProfile, getProfile, setOption, createProfile, updateProfile, getProfilesAll, getProfileAllSingle, getRoles, getProfilesAllOptions,
} from '@/api/profile';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: null, // список всех профилей
    roles: [],
    listAll: null,
    options: null, // насторойки полей инпутов
    optionsAll: null, // насторойки полей инпутов
  },
  getters: {
    list: (state) => state.list,
    listAll: (state) => state.listAll,
    options: (state) => state.options,
    optionsAll: (state) => state.optionsAll,
    roles: (state) => state.roles,
  },
  mutations: {
    SET_LIST: (state, user) => {
      state.list = user;
    },

    SET_LIST_ALL: (state, user) => {
      state.listAll = user;
    },

    SET_OPTIONS: (state, options) => {
      state.options = options;
    },

    SET_OPTIONS_ALL: (state, options) => {
      state.optionsAll = options;
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
    async UpdateProfile({ commit }, o) {
      await updateProfile(o);
    },

    async CreateProfile({ commit }, o) {
      await createProfile(o);
    },

    async DeleteProfile({ commit }, o) {
      await deleteProfile(o);
    },

    async GetProfiles({ commit }, o) {
      try {
        const users = await getProfiles(o);

        commit('SET_LIST', users.data);
      } catch (e) {
        commit('SET_LIST', null);
      }
    },

    async GetProfilesAll({ commit }, o) {
      try {
        const users = await getProfilesAll(o);

        commit('SET_LIST_ALL', users.data);
      } catch (e) {
        commit('SET_LIST_ALL', null);
      }
    },

    async GetProfile({ commit }, o) {
      const r = await getProfile(o);

      return r.data;
    },

    async GetProfileAllSingle({ commit }, o) {
      const r = await getProfileAllSingle(o);

      return r.data;
    },

    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);

        const o = r.data.Profile.properties;

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
        const r = await getProfilesAllOptions(data);
        const o = r.data.Profile.properties;

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
  },
};
