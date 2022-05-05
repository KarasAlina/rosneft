import qs from 'qs';
import request from '@/utils/request';

export function getCodes(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/code?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/code/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/code?${a}`,
    method: 'options',
  });
}
