import request from '@/utils/request'

// 新增数据
export function addData(data) {
  return request({
    url: '/base/template',
    method: 'post',
    data: data
  })
}

// 修改数据
export function updateData(id, data) {
  return request({
    url: '/base/template/' + id,
    method: 'put',
    data: data
  })
}

// 创建标签详情
export function createLabel(data) {
  return request({
    url: '/labelManagement/lableDetail',
    method: 'post',
    data
  })
}
// 获取标签详情
export function getLabelDetail(id) {
  return request({
    url:`/labelManagement/labelDetail/${id}`,
    method: 'get',
  })
}