import request from '@/utils/request'

// 获取页面配置
export function  getPageConfig(id) {
  return request({
    url: '/template/execution/edit/'+id,
    method: 'post'
  })
}
export function  updatePageConfig(pageConfig) {
  return request({
    url: '/template/execution/updatePage',
    method: 'post',
    data: pageConfig
  })
}
