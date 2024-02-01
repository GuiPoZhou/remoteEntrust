import request from '@/utils/request'

export function getBusinessCodeList() {
  return request({
    url: '/template/execution/getBusinessCodeList',
    method: 'get'
  })
}


// 查询业务单运行实例列表
export function listExecutionTemplate(query) {
  return request({
    url: '/template/execution/list',
    method: 'get',
    params: query
  })
}

// 查询业务单运行实例列表-不分页
export function listAllExecutionTemplate(query) {
	return request({
		url: '/template/execution/listAll',
		method: 'get',
		params: query
	})
}
// 查询业务单运行实例详细
export function getExecutionTemplate(id) {
  return request({
    url: '/template/execution/' + id,
    method: 'get'
  })
}

// 新增业务单运行实例
export function addExecutionTemplate(data) {
  return request({
    url: '/template/default/add',
    method: 'post',
    data: data
  })
}

// 编辑业务单运行实例
export function editExecutionTemplate(id) {
  return request({
    url: 'template/execution/edit/'+id,
    method: 'post',
  })
}

// 修改业务单运行实例
export function updateExecutionTemplate(data) {
  return request({
    url: '/template/execution/update/',
    method: 'put',
    data: data
  })
}

// 删除业务单运行实例
export function delExecutionTemplate(id) {
  return request({
    url: '/template/execution/remove/' + id,
    method: 'delete'
  })
}

// 删除业务单运行实例-ELN
export function delExecutionTemplateEln(id) {
  return request({
    url: '/template/execution/removeEln/' + id,
    method: 'delete'
  })
}
export function updateStatus(id, status) {
  return request({
    url: '/template/execution/updateStatus',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

// 删除业务单运行实例
export function copyExecutionTemplate(id) {
  return request({
    url: '/template/execution/copy/' + id,
    method: 'get'
  })
}


//获取ELN 公共表单表单数据
export function parseELNConfig(executionTemplateId) {
	return request({
		url: '/v1/dynamicELN/' + executionTemplateId + '/parseELNConfig',
		method: 'get'
	})
}
//获取ELN 表单对应的检测项目
export function getItemMethodOptionList(executionTemplateId) {
	return request({
		url: '/v1/dynamicELN/' + executionTemplateId + '/getItemMethodOptionList',
		method: 'get'
	})
}
