import {
  getRecipientList,
  getRecipientListOptions,
  getItems,
  getOptions,
  getTemplateList,
  getStatuses,
  getItem,
  deleteItem,
  setRecipientListItem,
  setItem,
  createRecipient,
  getRecipient,
  getRecipientById,
  getRecipientOptions,
} from '@/api/mailing';

/* eslint-disable */

export default {
  namespaced: true,
  state: {
    list: [],
    recipientList: [],
    recipientListComplete: [],
    templates: [],
    statuses: [],
    options: null,
    recipientListOptions: null,
    recipientListCompleteOptions: null,
    sort: {
      sortBy: null,
      sortDesc: null,
    },
  },
  getters: {
    list: (state) => state.list,
    options: (state) => state.options,
    templates: (state) => state.templates,
    statuses: (state) => state.statuses,
    recipientList: (state) => state.recipientList,
    recipientListOptions: (state) => state.recipientListOptions,
    recipientListComplete: (state) => state.recipientListComplete,
    recipientListCompleteOptions: (state) => state.recipientListCompleteOptions,
  },
  mutations: {
    SET_ITEMS: (state, o) => {
      state.list = o;
    },
    SET_RECIPIENT_LIST: (state, o) => {
      state.recipientList = o;
    },
    SET_RECIPIENT_LIST_COMPLETE: (state, o) => {
      state.recipientListComplete = o;
    },
    SET_OPTIONS: (state, options) => {
      state.options = options;
    },
    SET_TEMPLATES: (state, templates) => {
      state.templates = templates;
    },
    SET_STATUSES: (state, statuses) => {
      state.statuses = statuses;
    },
    SET_RECIPIENT_LIST_OPTIONS: (state, options) => {
      state.recipientListOptions = options;
    },
    SET_RECIPIENT_LIST_COMPLETE_OPTIONS: (state, options) => {
      state.recipientListCompleteOptions = options;
    },
  },
  actions: {
    async GetOptions({ commit }, data) {
      try {
        const r = await getOptions(data);
        console.log(r);
        const o = r.data.Mailing.properties;

        const a = Object.keys(o).map((key) => ({
          key,
          label: o[key].title,
          sortable: true,
          data: o[key],
          visible: 'visible' in o[key] ? o[key].visible : true,
          readOnly: 'readOnly' in o[key] ? o[key].readOnly : false,
          tableVisible: 'table' in o[key] ? o[key].table : true,
        }));
        commit('SET_OPTIONS', a);
      } catch (e) {
        console.log('---error ', e);
      }
    },
    async GetItems({ commit }, data) {
      try {
        const r = await getItems(data);

        commit('SET_ITEMS', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },
    async GetItem({ commit }, o) {
      const r = await getItem(o);

      return r.data;
    },

    async GetRecipientListOptions({ commit }, data) {
      try {
        const r = await getRecipientListOptions(data);
        const o = r.data.MailingRecipientList.properties;

        const a = Object.keys(o).map((key) => ({
          key,
          label: o[key].title,
          sortable: true,
          data: o[key],
          visible: 'visible' in o[key] ? o[key].visible : true,
          readOnly: 'readOnly' in o[key] ? o[key].readOnly : false,
          tableVisible: 'table' in o[key] ? o[key].table : true,
        }));
        a.unshift({
          key: 'selected',
          sortable: false,
          label: '',
          visible: true,
          readOnly: true,
          tableVisible: true,
        });
        commit('SET_RECIPIENT_LIST_OPTIONS', a);
      } catch (e) {
        console.log('---error ', e);
      }
    },
    async GetRecipientOptions({ commit }, data) {
      try {
        const r = await getRecipientOptions(data);
        console.log(r);
        const o = r.data.MailingRecipient.properties;

        const a = Object.keys(o).map((key) => ({
          key,
          label: o[key].title,
          sortable: true,
          data: o[key],
          visible: 'visible' in o[key] ? o[key].visible : true,
          readOnly: 'readOnly' in o[key] ? o[key].readOnly : false,
          tableVisible: 'table' in o[key] ? o[key].table : true,
        }));
        a.unshift({
          key: 'selected',
          sortable: false,
          label: '',
          visible: true,
          readOnly: true,
          tableVisible: true,
        });
        commit('SET_RECIPIENT_LIST_COMPLETE_OPTIONS', a);
      } catch (e) {
        console.log('---error ', e);
      }
    },
    async GetRecipientList({ commit }, data) {
      try {
        const r = await getRecipientList(data);

        commit('SET_RECIPIENT_LIST', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },
    async GetRecipient({ commit }, data) {
      try {
        const r = await getRecipient(data);

        commit('SET_RECIPIENT_LIST_COMPLETE', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetRecipientById({ commit }, data) {
      try {
        const r = await getRecipientById(data);

        return r.data;
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetTemplateList({ commit }, data) {
      try {
        const r = await getTemplateList(data);
        commit('SET_TEMPLATES', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    async GetStatuses({ commit }, data) {
      try {
        const r = await getStatuses(data);
        commit('SET_STATUSES', r.data);
      } catch (e) {
        console.log('--- ', e);
      }
    },

    SetRecipientListItem({ commit }, data) {
      return (async () => setRecipientListItem(data))();
    },

    CreateRecipient({ commit }, data) {
      return (async () => createRecipient(data))();
    },

    SetItem({ commit }, data) {
      return (async () => setItem(data))();
    },

    async DeleteItem({ commit }, id) {
      await deleteItem(id);
    },
  },
};
