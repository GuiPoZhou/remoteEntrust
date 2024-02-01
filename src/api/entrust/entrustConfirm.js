import request from '@/utils/request'
//待确认列表
export function listWaitConfirm(data) {
  return request({
    url: '/base/v1/taskConfirm/listWaitConfirm',
    method: 'post',
    data: data
  })
}
//获取委托信息
export function getEntrustInfo(idCode) {
  return request({
    url: '/base/v1/register/tasks/' + idCode,
    method: 'get'
  })
}

//根据委托查询样品
export function getSamplesInfo(taskIdCode,query) {
  return request({
    url: '/base/v1/register/samples/task/' + taskIdCode,
    method: 'get',
    params:query
  })
}
//获取样品信息
export function getSamplesBaseInfo(idCode) {
  return request({
    url: '/base/v1/register/samples/' + idCode,
    method: 'get'
  })
}
//更新样品信息
export function updateSamples(data) {
  return request({
    url: '/base/v1/register/samples',
    method: 'put',
    data: data
  })
}


// 按样品展示-检测项目（样品已添加的检测项目）
export function itemListBySample(sampleIdCode) {
  return request({
    url: '/base/v1/register/samples/itemListBySample/' + sampleIdCode,
    method: 'get'
  })
}
//按项目查看检测项目
export function queryItemList(query) {
  return request({
    url: '/base/v1/register/samples/queryItemList',
    method: 'get',
    params:query
  })
}
// 检测项目分组信息
export function queryItemGroup(data) {
  return request({
    url: '/base/v1/register/samples/queryItemGroup',
    method: 'get',
    params:data
  })
}

//按分组查看检测项目
export function queryGroupItemList(query) {
  return request({
    url: '/base/v1/register/samples/queryGroupItemList',
    method: 'get',
    params:query
  })
}





//复制添加检测项目列表
export function samplesList(query) {
  return request({
    url: '/base/v1/register/samples/samplesList',
    method: 'get',
    params:query
  })
}
// 复制添加检测项目列表的确定按钮
export function cloneItem(query) {
  return request({
    url: '/base/v1/register/samples/cloneItem',
    method: 'get',
    params:query
  })
}

//删除检验项目
export function deleteItem(ids) {
  return request({
    url: '/base/v1/register/samples/deleteItem/' + ids,
    method: 'delete'
  })
}

//添加检测项目
export function addItem(data) {
  return request({
    url: '/base/v1/register/samples/addItem',
    method: 'post',
    data: data
  })
}
//检测项目保存顺序
export function saveOrder(data) {
  return request({
    url: '/base/v1/register/samples/saveOrder',
    method: 'post',
    data: data
  })
}


//通过
export function confirmPass(data) {
  return request({
    url: '/base/v1/taskConfirm/confirmPass',
    method: 'post',
    data: data
  })
}
//退回
export function confirmReject(data) {
  return request({
    url: '/base/v1/taskConfirm/confirmReject',
    method: 'post',
    data: data
  })
}


// --------
//已确认列表
export function listConfirm(data) {
  return request({
    url: '/base/v1/taskConfirm/listConfirm',
    method: 'post',
    data: data
  })
}
//已确认的委托书列表查询
export function downloadAgreementList(idCode) {
  return request({
    url: '/base/v1/taskConfirm/downloadAgreementList/' + idCode,
    method: 'get'
  })
}
//委托书下载
export function downloadAgreement(data) {
  return request({
    url: '/base/v1/taskConfirm/downloadAgreement',
    method: 'post',
    data: data
  })
}
//委托书上传
export function uploadAgreement(idCode,data) {
  return request({
    url: '/base/v1/taskConfirm/uploadAgreement/' + idCode,
    method: 'post',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: data
  })
}


//已确认的撤销
export function confirmBack(data) {
  return request({
    url: '/base/v1/taskConfirm/confirmBack',
    method: 'post',
    data: data
  })
}
//退回原因查询
export function queryBackAction(data) {
  return request({
    url: '/base/v1/taskConfirm/queryBackAction',
    method: 'post',
    data: data
  })
}


// 样品类别
export function getSampleCate(query) {
  return request({
    url: '/base/v1/register/productions/list',
    method: 'get',
    params: query
  })
}



//企业端
//提交委托
export function submitTask(data) {
  return request({
    url: '/base/v1/register/tasks/submitTask',
    method: 'post',
    data: data
  })
}
//新增委托
export function addTask() {
  return request({
    url: '/base/v1/register/tasks',
    method: 'post',
  })
}

//暂存委托
export function saveAsTask(data) {
  return request({
    url: '/base/v1/register/tasks/saveAsTask',
    method: 'post',
    data: data
  })
}


//删除样品
export function deleteSample(idArray) {
  return request({
    url: '/base/v1/register/samples/'+idArray,
    method: 'delete',
  })
}

//复制样品
export function cloneSample(idCode) {
  return request({
    url: '/base/v1/register/samples/clone',
    method: 'get',
    params: idCode
  })
}


//新增样品信息
export function addSample(data) {
  return request({
    url: '/base/v1/register/samples',
    method: 'post',
    data: data
  })
}

//新增空白样品信息
export function addEmptySample(data) {
  return request({
    url: '/base/v1/register/samples/addEmptySample',
    method: 'post',
    data: data
  })
}

//删除委托
export function deleteTask(ids) {
  return request({
    url: `/v1/entrustRemoteAgreement/${ids}`,
    method: 'delete',
  })
}

//已确认的委托书列表查询
export function downloadReportList(param) {
  return request({
    url: '/base/v1/register/tasks/listReport',
    method: 'post',
    data: param
  })
}
// 下载
export function downloabUrl(data) {
  return request({
    url: '/system/config/configKey/LIMS_DOWNLOAD_REPORT_ZIP',
    method: 'get',
    params: data
  })
}
