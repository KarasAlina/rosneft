import qs from 'qs';
import request from '@/utils/request';

export function getSales(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/sale?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/sale/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/sale?${a}`,
    method: 'options',
  });
}
