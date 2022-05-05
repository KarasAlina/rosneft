import Vue from 'vue';
import Typograf from 'typograf';
import moment from 'moment';

const tp = new Typograf({ locale: ['ru', 'en-US'] });

Vue.filter('formatDate', (value, format) => moment(String(value)).format(format || 'MM/DD/YYYY'));

Vue.filter('typograf', (str) => tp.execute(str));

Vue.filter('capitalize', (value) => {
  if (!value) return '';
  const str = value.toString();
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Vue.filter('formatNumber', (val) => `${val}`.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));

Vue.filter('declOfNum', (val, number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];

  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
});

export default tp;
