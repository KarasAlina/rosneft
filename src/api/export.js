import qs from 'qs';
import request from '@/utils/request';

export function getList(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/export?${a}`,
    method: 'get',
  });
}

export function getItem(id) {
  return request({
    url: `/export/${id}`,
    method: 'get',
  });
}

export function deleteItem(id) {
  return request({
    url: `/export/${id}`,
    method: 'delete',
  });
}

export function setItem(data) {
  return request({
    url: '/export',
    method: 'post',
    data,
  });
}
