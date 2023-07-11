import {
  getAnalyticsConfig, getAnalyticsData, getAnalyticsReport, getAnalyticsDashboard,
} from '@/api/analytics';

export default {
  namespaced: true,

  state: {
    data: null,
    reportsTitles: [],
  },

  getters: {
    data: (state) => state.data,
    reportsTitles: (state) => state.reportsTitles,
  },

  mutations: {
    SET_REPORT_TITLES: (state, o) => {
      state.reportsTitles = o;
    },
  },

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

    async GetAnalyticsConfig({ commit }, data) {
      try {
        const res = await getAnalyticsConfig(data);
        const list = [];
        Object.entries(res.data.reports).map(([key, value]) => {
          list.push({
            key,
            value: value.title,
          });
          return list;
        });
        commit('SET_REPORT_TITLES', list);
        return res;
      } catch (e) {
        console.log('--- ', e);
      }

      return null;
    },
  },
};
