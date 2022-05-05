import request from '@/utils/request';

export default function getProgram(params) {
  return request({
    url: '/program',
    method: 'get',
    params,
  });
}
