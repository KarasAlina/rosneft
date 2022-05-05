// import qs from 'qs';
import request from '@/utils/request';

export function getModulesConfig(params) {
  return request({
    url: '/config/modules',
    method: 'get',
    params,
  });
}

export function getReports(params) {
  return request({
    url: '/config/reports',
    method: 'get',
    params,
  });
}

export function getMainModulesConfig() {
  return request({
    url: '/config/main-modules',
    method: 'get',
  });
}
