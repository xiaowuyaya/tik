import { http } from '../utils/request'

export function addEnvironment(data) {
  return http.request({
    url: '/environment/add',
    method: 'POST',
    data,
  })
}
