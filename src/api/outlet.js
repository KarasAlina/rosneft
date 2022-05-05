import qs from 'qs';
import request from '@/utils/request';

export function getOutlet(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/outlet?${a}`,
    method: 'get',
  });
}

export function deleteOutlet(data) {
  return request({
    url: `/outlet/${data.id}?moduleId=${data.moduleId}`,
    method: 'delete',
  });
}

export function setOption(data) {
  return request({
    url: `/outlet/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/outlet?${a}`,
    method: 'options',
  });
}
export function updateOutlet(data) {
  return request({
    url: `/outlet/${data.id}?moduleId=${data.moduleId}`,
    method: 'put',
    data: data.fields,
  });
}
