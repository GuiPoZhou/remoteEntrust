import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 文件上传
export function uploadFile(data) {
    let Authorization = `Bearer ${getToken()}`
    let headers = {
        'Content-Type': 'multipart/form-data', "Authorization": Authorization
    }
    console.log('headers', headers)
    return request({
        url: '/common/upload',
        method: 'post',
        data,
        headers,
    })
}