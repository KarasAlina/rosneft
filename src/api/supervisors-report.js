import qs from 'qs';
import request from '@/utils/request';

export function getList(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/supervisors-report?${a}`,
    method: 'get',
  });
}

export function getItem(id) {
  return request({
    url: `/supervisors-report/${id}`,
    method: 'get',
  });
}

export function deleteItem(id) {
  return request({
    url: `/supervisors-report/${id}`,
    method: 'delete',
  });
}

export function setItem(data) {
  return request({
    url: '/supervisors-report',
    method: 'post',
    data,
  });
}

export function setOption(data) {
  return request({
    url: `/supervisors-report/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/supervisors-report?${a}`,
    method: 'options',
  });
}
