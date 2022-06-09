import qs from 'qs';
import request from '@/utils/request';

export function getStatuses() {
  return request({
    url: '/bonus-point/statuses',
    method: 'get',
  });
}

export function getBonusPoint(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/bonus-point?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/bonus-point/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/bonus-point?${a}`,
    method: 'options',
  });
}
