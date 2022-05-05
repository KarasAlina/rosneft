import qs from 'qs';
import request from '@/utils/request';

export function getPrizes(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/prize?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/prize/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/prize?${a}`,
    method: 'options',
  });
}
