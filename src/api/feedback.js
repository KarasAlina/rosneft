import qs from 'qs';
import request from '@/utils/request';

export function getFeedback(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/feedback?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/feedback/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/feedback?${a}`,
    method: 'options',
  });
}
