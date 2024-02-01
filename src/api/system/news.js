//消息接口
import request from '@/utils/request'

export  function  getNews(){
	return request({
		url:'/v1/noticerecord?pageNum=1&pageSize=100',
		method: 'get'
	})
}
