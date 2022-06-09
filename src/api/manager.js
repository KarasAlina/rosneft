import qs from 'qs';
import request from '@/utils/request';

export function getRoles() {
  return request({
    url: '/user/roles',
    method: 'get',
  });
}

export function getManagers(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/user?${a}`,
    method: 'get',
  });
}

export function setManager(data) {
  return request({
    url: '/user',
    method: 'post',
    data,
  });
}

export function getManager(id) {
  return request({
    url: `/user/${id}`,
    method: 'get',
  });
}

export function updateManager(data) {
  return request({
    url: `/user/${data.id}`,
    method: 'put',
    data: data.fields,
  });
}

export function deleteManager(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete',
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/user?${a}`,
    method: 'options',
  });
}

export function setOption(data) {
  return request({
    url: `/user/${data.key}`,
    method: 'put',
    params: data.params,
  });
}
