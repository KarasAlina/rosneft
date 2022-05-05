import qs from 'qs';
import request from '@/utils/request';

export function setOption(data) {
  return request({
    url: `/receipt/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/receipt?${a}`,
    method: 'options',
  });
}

export function getChecks(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/receipt?${a}`,
    method: 'get',
  });
}

export function getCheck(data) {
  return request({
    url: `/receipt/${data.id}`,
    method: 'get',
    params: data.params,
  });
}

export function deleteCheck(data) {
  return request({
    url: `/receipt/${data.id}?moduleId=${data.moduleId}`,
    method: 'delete',
  });
}

export function updateCheck(data) {
  return request({
    url: `/receipt/${data.id}?moduleId=${data.moduleId}`,
    method: 'put',
    data: data.fields,
  });
}
