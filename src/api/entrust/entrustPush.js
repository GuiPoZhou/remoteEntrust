import request from '@/utils/request'
//待推送列表
export function listWaitPush(data) {
  return request({
    url: '/base/v1/taskPush/listWaitPush',
    method: 'post',
    data: data
  })
}
//任务推送
export function taskPush(taskIdCodes) {
  return request({
    url: '/base/v1/taskPush/push',
    method: 'post',
    data: taskIdCodes
  })
}




// --------
//已推送列表
export function listPushed(data) {
  return request({
    url: '/base/v1/taskPush/listPushed',
    method: 'post',
    data: data
  })
}

