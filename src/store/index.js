import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

// Modules
import app from './app';
import me from './me'; // midl client
import program from './program'; // промо
import profile from './profile'; // end client program
import outlet from './outlet'; // end client список торговых точек
import prize from './prize'; // end client список призов
import superProfile from './super-profile'; // end client global
import manager from './manager'; // midl client managers
import integration from './integration'; // end client program
import activity from './activity';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
import analytic from './analytic';
import config from './config';
import raffle from './raffle';
import sale from './sale';
import plan from './plan';
import stage from './stage';
import exportData from './export';
import report from './report';
import supervisorsReport from './supervisors-report';
import bonusPoint from './bonus-point';
import mailing from './mailing';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    integration,
    program,
    me,
    manager,
    profile,
    superProfile,
    app,
    appConfig,
    mailing,
    verticalMenu,
    outlet,
    prize,
    activity,
    analytic,
    config,
    raffle,
    sale,
    plan,
    stage,
    exportData,
    report,
    supervisorsReport,
    bonusPoint,
  },
  strict: process.env.DEV,
  plugins: [createPersistedState({
    key: process.env.VUE_APP_STATE_KEY,
  })],
});
