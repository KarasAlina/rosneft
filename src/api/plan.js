import qs from 'qs';
import request from '@/utils/request';

export function getPlans(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/program-plan?${a}`,
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/program-plan/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/program-plan?${a}`,
    method: 'options',
  });
}

export function deletePlan(data) {
  return request({
    url: `/program-plan/${data.id}?moduleId=${data.moduleId}`,
    method: 'delete',
  });
}

export function updatePlan(data) {
  return request({
    url: `/program-plan/${data.id}?moduleId=${data.moduleId}`,
    method: 'put',
    data: data.fields,
  });
}
