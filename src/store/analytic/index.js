import {
  getAnalyticsConfig, getAnalyticsData, getAnalyticsReport, getAnalyticsDashboard,
} from '@/api/analytics';

export default {
  namespaced: true,

  state: {
    data: null,
    reportsTitle: [
      {
        key: 'profile_registration',
        value: 'Участники',
      },
    ],
  },

  getters: {
    data: (state) => state.data,
    reportsTitle: (state) => state.reportsTitle,
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

    async GetAnalyticsDashboard(o, data) {
      try {
        const res = await getAnalyticsDashboard(data);
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
