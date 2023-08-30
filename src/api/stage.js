import qs from 'qs';
import request from '@/utils/request';

export function getStages(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/program-stage?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/program-stage/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/program-stage?${a}`,
    method: 'options',
  });
}

export function deleteStage(data) {
  return request({
    url: `/program-stage/${data.id}?moduleId=${data.moduleId}`,
    method: 'delete',
  });
}

export function updateStage(data) {
  return request({
    url: `/program-stage/${data.id}?moduleId=${data.moduleId}`,
    method: 'put',
    data: data.fields,
  });
}
