import qs from 'qs';
import request from '@/utils/request';

export function getItems(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/mailing?${a}`,
    method: 'get',
  });
}

export function getItem(id) {
  return request({
    url: `/mailing/${id}`,
    method: 'get',
  });
}

export function setItem(data) {
  return request({
    url: 'mailing',
    method: 'post',
    data,
  });
}

export function deleteItem(id) {
  return request({
    url: `/mailing/${id}`,
    method: 'delete',
  });
}

export function getStatuses() {
  return request({
    url: '/mailing/statuses',
    method: 'get',
  });
}

export function getOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/mailing?${a}`,
    method: 'options',
  });
}

export function getRecipientList(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/mailing-recipient-list?${a}`,
    method: 'get',
  });
}

export function getRecipientListOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/mailing-recipient-list?${a}`,
    method: 'options',
  });
}

export function setRecipientListItem(data) {
  return request({
    url: 'mailing-recipient-list',
    method: 'post',
    data,
  });
}

export function getRecipient(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/mailing-recipient?${a}`,
    method: 'get',
  });
}

export function createRecipient(data) {
  return request({
    url: 'mailing-recipient',
    method: 'post',
    data,
  });
}

export function getRecipientOptions(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/mailing-recipient?${a}`,
    method: 'options',
  });
}

export function getRecipientById(id) {
  return request({
    url: `/mailing-recipient/${id}`,
    method: 'get',
  });
}

export function getTemplateList(params) {
  const a = qs.stringify(params, { encode: false });

  return request({
    url: `/mailing-template?${a}`,
    method: 'get',
  });
}
