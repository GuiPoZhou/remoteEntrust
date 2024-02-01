import request from '@/utils/request'

/******************************************设备台账***********************************************/

// 查询设备树列表
export function getDevtreeList(query) {
  return request({
    url: '/equipmentTree/selectTree',
    method: 'get',
    params: query,
  })
}
//设备树新增
export function addDevtree(data) {
  return request({
    url: '/equipmentTree',
    method: 'post',
    data,
  })
}
// 修改设备树列表
export function editDevtreeList(data) {
  return request({
    url: '/equipmentTree',
    method: 'put',
    data,
  })
}
// 设备树删除
export function deleteDevtree(id) {
  return request({
    url: '/equipmentTree/' + id,
    method: 'delete',
  })
}
// 设备台账列表
export function getBookList(query) {
  return request({
    url: '/equipmentInstrument/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addEquipmentInstrument(data) {
  return request({
    url: '/equipmentInstrument',
    method: 'post',
    data,
  })
}
// 查看详情
export function getEquipmentdetail(id) {
  return request({
    url: '/equipmentInstrument/' + id,
    method: 'get',
  })
}
// 修改
export function editEquipment(data) {
  return request({
    url: '/equipmentInstrument',
    method: 'put',
    data,
  })
}
// 调整分类
export function adjustTreeclass(data) {
  return request({
    url: '/equipmentInstrument/updateTreeId',
    method: 'post',
    data,
  })
}
// 删除
export function deleteEquipment(data) {
  return request({
    url: '/equipmentInstrument',
    method: 'delete',
    data
  })
}
// 设备选择
export function getOptionList(data) {
  return request({
    url: '/equipmentInstrument/optionList',
    method: 'post',
    data,
  })
}

/******************************************设备状态***********************************************/

// 设备状态列表
export function getEquipmentStatusList(query) {
  return request({
    url: '/equipmentStatusHis/queryInstrumentList',
    method: 'get',
    params: query,
  })
}
// 修改
export function editEquipmentStatus(data) {
  return request({
    url: '/equipmentStatusHis/addEquipmentStatusHis',
    method: 'post',
    data,
  })
}
// 历史
export function getEquipmentStatusHis(query) {
  return request({
    url: '/equipmentStatusHis/queryEquipmentStatusHis',
    method: 'get',
    params: query,
  })
}

/******************************************使用记录***********************************************/

// 使用记录列表
export function getEquipmentUseRecordList(query) {
  return request({
    url: '/equipmentUseRecord/queryInstrumentList',
    method: 'get',
    params: query,
  })
}
// 使用记录时间段校验
export function checkTimeUseRecord(data) {
  return request({
    url: '/equipmentUseRecord/validatorEquipmentUseRecord',
    method: 'post',
    data,
  })
}
// 添加
export function addEquipmentUseRecord(data) {
  return request({
    url: '/equipmentUseRecord/addEquipmentUseRecord',
    method: 'post',
    data,
  })
}
// 查看记录列表
export function lookEquipmentUseRecordList(query) {
  return request({
    url: '/equipmentUseRecord/queryEquipmentUseRecord',
    method: 'get',
    params: query,
  })
}
// 删除使用记录
export function delUseRecord(useRecordIds) {
  return request({
    url: '/equipmentUseRecord/delEquipmentUseRecord/' + useRecordIds,
    method: 'get',
  })
}
// 导出使用记录
export function exportUseRecord(query) {
  return request({
    url: '/equipmentUseRecord/exportUseRecord',
    method: 'get',
    params: query
  })
}

/******************************************维护保养***********************************************/

// 维护保养计划列表
export function getMaintainPlanList(query) {
  return request({
    url: '/equipmentMaintainPlan/list',
    method: 'get',
    params: query,
  })
}
// 新增计划
export function addEquipmentplan(data) {
  return request({
    url: '/equipmentMaintainPlan',
    method: 'post',
    data,
  })
}
// 查看详情
export function getEquipmentplanDetail(id) {
  return request({
    url: '/equipmentMaintainPlan/' + id,
    method: 'get',
  })
}
// 修改
export function editEquipmentPlan(data) {
  return request({
    url: '/equipmentMaintainPlan',
    method: 'put',
    data,
  })
}
// 删除计划
export function deleteMaintainPlan(id) {
  return request({
    url: '/equipmentMaintainPlan/' + id,
    method: 'delete',
  })
}
// 批量提交
export function submitMaintainPlan(data) {
  return request({
    url: '/equipmentMaintainPlan/submit',
    method: 'post',
    data,
  })
}
// 待执行计划列表
export function getWatingplanList(query) {
  return request({
    url: '/equipmentMaintainRecord/planList',
    method: 'get',
    params: query,
  })
}
// 详情
export function getMaintainRecordDetail(id) {
  return request({
    url: '/equipmentMaintainRecord/' + id,
    method: 'get',
  })
}
// 执行
export function addMaintainRecord(data) {
  return request({
    url: '/equipmentMaintainRecord',
    method: 'post',
    data,
  })
}
// 保养记录列表
export function getrecordList(query) {
  return request({
    url: '/equipmentMaintainRecord/recordList',
    method: 'get',
    params: query,
  })
}
// 删除保养记录
export function deleteMaintainRecord(data) {
  return request({
    url: '/equipmentMaintainRecord',
    method: 'delete',
    data
  })
}
// 批量提交
export function submitRecord(data) {
  return request({
    url: '/equipmentMaintainRecord/submitRecord',
    method: 'post',
    data,
  })
}

/******************************************期间核查***********************************************/

// 期间核查计划列表
export function getCheckPlanList(query) {
  return request({
    url: '/equipmentCheckPlan/list',
    method: 'get',
    params: query,
  })
}
// 新增计划
export function addEquipmentCheckPlan(data) {
  return request({
    url: '/equipmentCheckPlan',
    method: 'post',
    data,
  })
}
// 修改
export function editEquipmentCheckPlan(data) {
  return request({
    url: '/equipmentCheckPlan',
    method: 'put',
    data,
  })
}
// 查看详情
export function getEquipmentCheckPlanDetail(id) {
  return request({
    url: '/equipmentCheckPlan/' + id,
    method: 'get',
  })
}
// 删除计划
export function deleteCheckPlan(id) {
  return request({
    url: '/equipmentCheckPlan/' + id,
    method: 'delete',
  })
}
// 批量提交
export function submitCheckPlan(data) {
  return request({
    url: '/equipmentCheckPlan/submit',
    method: 'post',
    data,
  })
}
// 待执行计划列表
export function getCheckRecordList(query) {
  return request({
    url: '/equipmentCheckRecord/planList',
    method: 'get',
    params: query,
  })
}
// 执行
export function addCheckRecord(data) {
  return request({
    url: '/equipmentCheckRecord',
    method: 'post',
    data,
  })
}
// 核查记录列表
export function getrecordCheckList(query) {
  return request({
    url: '/equipmentCheckRecord/recordList',
    method: 'get',
    params: query,
  })
}
// 查看详情
export function getCheckRecordDetail(id) {
  return request({
    url: '/equipmentCheckRecord/' + id,
    method: 'get',
  })
}
// 删除核查记录记录
export function deleteCheckRecord(data) {
  return request({
    url: '/equipmentCheckRecord',
    method: 'delete',
    data
  })
}
// 批量提交
export function checksubmitRecord(data) {
  return request({
    url: '/equipmentCheckRecord/submitRecord',
    method: 'post',
    data,
  })
}

/******************************************检定校准***********************************************/

// 检定校准计划列表
export function getCalibrationPlanList(query) {
  return request({
    url: '/equipmentCalibrationPlan/list',
    method: 'get',
    params: query,
  })
}
// 新增计划
export function addCalibrationPlan(data) {
  return request({
    url: '/equipmentCalibrationPlan',
    method: 'post',
    data,
  })
}
// 修改
export function editCalibrationPlan(data) {
  return request({
    url: '/equipmentCalibrationPlan',
    method: 'put',
    data,
  })
}
// 查看详情
export function getCalibrationPlanDetail(id) {
  return request({
    url: '/equipmentCalibrationPlan/' + id,
    method: 'get',
  })
}
// 删除计划
export function deleteCalibrationPlan(id) {
  return request({
    url: '/equipmentCalibrationPlan/' + id,
    method: 'delete',
  })
}
// 批量提交
export function submitCalibrationPlan(data) {
  return request({
    url: '/equipmentCalibrationPlan/submit',
    method: 'post',
    data,
  })
}
// 待执行计划列表
export function getCalibrationRecordList(query) {
  return request({
    url: '/equipmentCalibrationRecord/planList',
    method: 'get',
    params: query,
  })
}
// 执行
export function addCalibrationRecord(data) {
  return request({
    url: '/equipmentCalibrationRecord',
    method: 'post',
    data,
  })
}
// 记录列表
export function getCaliRecordList(query) {
  return request({
    url: '/equipmentCalibrationRecord/recordList',
    method: 'get',
    params: query,
  })
}
// 查看详情
export function getCaliRecordDetail(id) {
  return request({
    url: '/equipmentCalibrationRecord/' + id,
    method: 'get',
  })
}
// 删除核查记录记录
export function deleteCaliRecord(data) {
  return request({
    url: '/equipmentCalibrationRecord',
    method: 'delete',
    data
  })
}
// 批量提交
export function CaliRecordSubmit(data) {
  return request({
    url: '/equipmentCalibrationRecord/submitRecord',
    method: 'post',
    data,
  })
}

/******************************************设备维修***********************************************/

// 列表
export function getApplyList(query) {
  return request({
    url: '/equipmentRepairApply/queryEquipmentRepairApplyList',
    method: 'get',
    params: query,
  })
}
// 添加申请
export function addEquipmentRepairApply(data) {
  return request({
    url: '/equipmentRepairApply/addEquipmentRepairApply',
    method: 'post',
    data,
  })
}
// 查看详情
export function getRepairApplyDetail(repairId) {
  return request({
    url: '/equipmentRepairApply/queryEquipmentRepairApply/' + repairId,
    method: 'get',
  })
}
// 修改申请
export function editEquipmentRepairApply(data) {
  return request({
    url: '/equipmentRepairApply/updateEquipmentRepairApply',
    method: 'post',
    data,
  })
}
// 删除
export function delRepairApply(repaiIds) {
  return request({
    url: '/equipmentRepairApply/delEquipmentRepairApply/' + repaiIds,
    method: 'get',
  })
}
// 提交
export function submitRepairApply(repairIds) {
  return request({
    url: '/equipmentRepairApply/submitEquipmentRepairApply/' + repairIds,
    method: 'get',
  })
}
// 记录列表
export function getApplyRecordList(query) {
  return request({
    url: '/equipmentRepairRecord/queryEquipmentRepairRecordList',
    method: 'get',
    params: query,
  })
}
// 记录新增/执行
export function addEquipmentRepairRecord(data) {
  return request({
    url: '/equipmentRepairRecord/addEquipmentRepairRecord',
    method: 'post',
    data,
  })
}
// 记录修改
export function editEquipmentRepairRecord(data) {
  return request({
    url: '/equipmentRepairRecord/updateEquipmentRepairRecord',
    method: 'post',
    data,
  })
}
// 查看详情
export function getRecordIdApplyDetail(recordId) {
  return request({
    url: '/equipmentRepairRecord/queryEquipmentRepairRecord/' + recordId,
    method: 'get',
  })
}
// 记录删除
export function delRepairRecord(repaiIds) {
  return request({
    url: '/equipmentRepairRecord/delEquipmentRepairRecord/' + repaiIds,
    method: 'get',
  })
}
// 记录提交
export function submitRepairRecord(repairIds) {
  return request({
    url: '/equipmentRepairRecord/submitEquipmentRepairRecord/' + repairIds,
    method: 'get',
  })
}
// 维修申请审核
export function mainCompleteAudit(data) {
  return request({
    url: '/equipmentRepairApply/completeAudit',
    method: 'post',
    data,
  })
}
// 记录审核
export function mainCompleteRecordAudit(data) {
  return request({
    url: '/equipmentRepairRecord/completeAudit',
    method: 'post',
    data,
  })
}

/******************************************设备报废申请***********************************************/

// 列表
export function getScrapApplyList(query) {
  return request({
    url: '/equipmentScrapApply/queryEquipmentScrapApplyList',
    method: 'get',
    params: query,
  })
}
// 添加
export function addEquipmentScrapApply(data) {
  return request({
    url: '/equipmentScrapApply/addEquipmentScrapApply',
    method: 'post',
    data,
  })
}
// 修改
export function editEquipmentScrapApply(data) {
  return request({
    url: '/equipmentScrapApply/updateEquipmentScrapApply',
    method: 'post',
    data,
  })
}
// 查看详情
export function getScrapApplyDetail(scrapId) {
  return request({
    url: '/equipmentScrapApply/queryEquipmentScrapApply/' + scrapId,
    method: 'get',
  })
}
// 提交
export function submitScrapApply(scrapIds) {
  return request({
    url: '/equipmentScrapApply/submitEquipmentScrapApply/' + scrapIds,
    method: 'get',
  })
}
// 删除
export function delScrapApply(scrapIds) {
  return request({
    url: '/equipmentScrapApply/delEquipmentScrapApply/' + scrapIds,
    method: 'get',
  })
}
// 报废审核
export function scrapCompleteAudit(data) {
  return request({
    url: '/equipmentScrapApply/completeAudit',
    method: 'post',
    data,
  })
}

export function exportEquipment(param) {
	return request({
		url: '/equipmentInstrument/export',
		method: 'get',
		params: param,
	})
}

