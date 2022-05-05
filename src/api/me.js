import request from '@/utils/request';

export function getProrgams() {
  return request({
    url: '/user/programs',
    method: 'get',
  });
}

export function getRoles() {
  return request({
    url: '/user/roles',
    method: 'get',
  });
}

export function getUser() {
  return request({
    url: '/user/me',
    method: 'get',
  });
}

export function signIn(params) {
  return request({
    url: '/user/login',
    method: 'get',
    params,
  });
}

export function forgotPassword(params) {
  return request({
    url: '/user/forgot-password',
    method: 'get',
    params,
  });
}

export function singOut() {
  return request({
    url: '/user/logout',
    method: 'post',
  });
}
