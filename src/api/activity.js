import qs from 'qs';
import request from '@/utils/request';

export function setOption(data) {
  return request({
    url: `/activity/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/activity?${a}`,
    method: 'options',
  });
}

export function getActivityList(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/activity?${a}`,
    method: 'get',
  });
}

export function getActivity(data) {
  return request({
    url: `/activity/${data.id}`,
    method: 'get',
    params: data.params,
  });
}

export function deleteActivity(data) {
  return request({
    url: `/activity/${data.id}?moduleId=${data.moduleId}`,
    method: 'delete',
  });
}

export function updateActivity(data) {
  return request({
    url: `/activity/${data.id}?moduleId=${data.moduleId}`,
    method: 'put',
    data: data.fields,
  });
}

export function createActivity(data) {
  return request({
    url: `/activity?moduleId=${data.moduleId}`,
    method: 'post',
    data: data.fields,
  });
}
