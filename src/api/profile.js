import qs from 'qs';
import request from '@/utils/request';

export function getRoles() {
  return request({
    url: '/profile/roles',
    method: 'get',
  });
}

export function setOption(data) {
  return request({
    url: `/profile/field/${data.key}`,
    method: 'put',
    params: data.params,
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/profile?${a}`,
    method: 'options',
  });
}

export function getProfiles(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/profile?${a}`,
    method: 'get',
  });
}

export function getProfile(data) {
  return request({
    url: `/profile/${data.id}`,
    method: 'get',
    params: data.params,
  });
}

export function deleteProfile(data) {
  return request({
    url: `/profile/${data.id}?moduleId=${data.moduleId}`,
    method: 'delete',
  });
}

export function createProfile(data) {
  return request({
    url: `/profile?moduleId=${data.moduleId}`,
    method: 'post',
    data: data.fields,
  });
}

export function updateProfile(data) {
  return request({
    url: `/profile/${data.id}?moduleId=${data.moduleId}`,
    method: 'put',
    data: data.fields,
  });
}

export function getProfilesAll(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/profile-all?${a}`,
    method: 'get',
  });
}

export function getProfileAllSingle(data) {
  return request({
    url: `/profile-all/${data.id}`,
    method: 'get',
    params: data.params,
  });
}
