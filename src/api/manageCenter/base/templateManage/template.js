import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/base/template',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getData(id) {
  return request({
    url: '/base/template/' + id,
    method: 'get'
  })
}

// 删除
export function delData(id) {
  return request({
    url: '/base/template/' + id,
    method: 'delete'
  })
}

// 状态修改
export function updateDataStatus(id, status) {
  const data = {
    status
  }
  return request({
    url: '/base/template/' + id + '/updataStatus?status=' + status,
    method: 'put',
    data: data
  })
}