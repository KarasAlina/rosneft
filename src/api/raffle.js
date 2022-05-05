import qs from 'qs';
import request from '@/utils/request';

export function getRaffle(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/raffle?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/raffle/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/raffle?${a}`,
    method: 'options',
  });
}
