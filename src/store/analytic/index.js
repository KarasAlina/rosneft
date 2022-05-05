import {
  getAnalyticsConfig, getAnalyticsData, getAnalyticsReport,
} from '@/api/analytics';

export default {
  namespaced: true,

  state: {
    data: null,
  },

  getters: {
    data: (state) => state.data,
  },

  mutations: {},

  actions: {
    async GetAnalyticsReport(o, data) {
      try {
        const res = await getAnalyticsReport(data);

        return res;
      } catch (e) {
        console.log('--- ', e);
      }

      return null;
    },

    async GetAnalyticsData(o, data) {
      try {
        const res = await getAnalyticsData(data);
        console.log(res);
        return res;
      } catch (e) {
        console.log('--- ', e);
      }

      return null;
    },

    async GetAnalyticsConfig(o, data) {
      try {
        const res = await getAnalyticsConfig(data);

        return res;
      } catch (e) {
        console.log('--- ', e);
      }

      return null;
    },
  },
};
