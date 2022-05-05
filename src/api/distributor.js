import qs from 'qs';
import request from '@/utils/request';

export function getDistributor(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/distributor?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/distributor/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/distributor?${a}`,
    method: 'options',
  });
}
