import qs from 'qs';
import request from '@/utils/request';

export function getIntegration(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/program?${a}`,
    method: 'get',
  });
}

export function deleteIntegration(id) {
  return request({
    url: `/program/${id}`,
    method: 'delete',
  });
}

export function setIntegration(data) {
  return request({
    url: '/program',
    method: 'post',
    data,
  });
}

export function updateIntegration(data) {
  return request({
    url: `/program/${data.id}`,
    method: 'put',
    data: data.fields,
  });
}
