import request from '@/utils/request'

// 查询业务单默认配置列表
export function listTemplate(query) {
  return request({
    url: '/template/default/list',
    method: 'get',
    params: query
  })
}

// 查询业务单默认配置详细
export function getTemplate(id) {
  return request({
    url: '/template/default/edit/' + id,
    method: 'get'
  })
}

// 新增业务单默认配置
export function addTemplate(data) {
  return request({
    url: '/template/default',
    method: 'post',
    data: data
  })
}

// 修改业务单默认配置
export function updateTemplate(data) {
  return request({
    url: '/template/default',
    method: 'put',
    data: data
  })
}

// 删除业务单默认配置
export function delTemplate(id) {
  return request({
    url: '/template/default/' + id,
    method: 'delete'
  })
}

// 导出业务单默认配置
export function exportTemplate(query) {
  return request({
    url: '/template/default/export',
    method: 'get',
    params: query
  })
}
