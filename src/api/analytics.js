// import qs from 'qs';
import request from '@/utils/request';

export function getAnalyticsConfig(params) {
  return request({
    url: '/config/analytics',
    method: 'get',
    params,
  });
}

export function getAnalyticsData(data) {
  return request({
    url: `/analytics/date-line/${data.path}`,
    method: 'options',
    params: data.params,
  });
}

export function getAnalyticsReport(data) {
  return request({
    url: `/analytics/report/${data.path}`, // register_user, gender_user, age_user, city_user, city_code, city_receipt, count_code, count_receipt, average_code, average_receipt, register_code, register_receipt, sku_code, sku_receipt, prize_program, feedback_program, receipt_program, retail_code, retail_receipt
    method: 'get',
    params: data.params,
  });
}
