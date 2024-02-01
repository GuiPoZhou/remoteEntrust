/*
 *@author: 焦政
 *@date: 2021-07-17 11:22:26
 *@description:我的所有的业务数据 全局管理
*/
import { net } from '@/api/requestList'
const BeiYuan = {
    state: {
        categoriesType: 1,//用来区分是土壤或者一些需要在编辑点位时拥有深度的选项  1为需要深度  0则不需要深度的其他检测项
        categoriesId: '',//检测类别对应的ID，该ID主要为了在添加点位时，进行查询该ID下对应的所有检测项目
        submitType: 0,//区分是新增还是修改 0 新增  1修改
        planType: '',
        planTypeName: '',//方案名称
        detectName: '',//检测类别名称
        detectType: '',//检测类型
        detectId: '',//检测类别ID
        bindProcess: '',//审批流程
        entrustType: '',//委托类型
        entrustTypeStr: '',//委托类型名称
        entrustAgreementId: '',//当前协议ID
        entrustInfoId: '',//委托信息ID
        openEntrustType: 1,// 1 新增或编辑  0查看  查看协议详情方式
        entrustCode: '',//委托编号
        customerName: '',//客户名称
        planElementShowType: 0,//0新增  1查看
		uploadFileCheck: ['bmp','gif','jpg','jpeg','png','doc','docx','xls','xlsx','ppt',
			'pptx','html','htm','txt','rar','zip','gz','bz2','pdf','bpmn','bar'
		],// 上传文件后端不做限制时所能接受的文件类型
		sampleId: null, //批次管理保存时存储的id
		//委托单状态
        entrustStatusList: [
            {
                value: 1,
                label: '草稿'
            },
            {
                value: 2,
                label: '撤回'
            },
            {
                value: 3,
                label: '退回'
            },
            {
                value: 4,
                label: '待审批'
            },
            {
                value: 5,
                label: '审批中'
            },
            {
                value: 6,
                label: '待提交'
            },
            {
                value: 7,
                label: '调整中'
            },
            {
                value: 9,
                label: '完成'
            },
        ],
        sampleTypeList: [
            {
                value: 1,
                label: '普通样品'
            },
            {
                value: 2,
                label: '明码平行'
            },
            {
                value: 3,
                label: '加标样'
            },
            {
                value: 4,
                label: '盲样'
            },
            {
                value: 5,
                label: '全程序空白'
            },
            {
                value: 6,
                label: '现场空白'
            },
            {
                value: 7,
                label: '运输空白'
            },
            {
                value: 8,
                label: '设备空白'
            },
            {
                value: 9,
                label: '穿透样品'
            },
			{
				value: 10,
				label: '空白质控'
			},
			{
				value: 11,
				label: '淋洗液空白'
			},{
				value: 12,
				label: '暗码平行'
			},
        ],
        pointId: '',//当前选择的点位ID
        currentLQCType: 1,//实验质控类型
        openLQCType: 0,//0新增 1编辑
        detectTypeList: [],//检测类别列表
        sampleStatusList: [],//样品状态列表
        dataType: 0,//0个人 1部门
        openBatchType: 0,//打开批次业务弹框的当前状态 0 待接收  1已建批次
        batchInfo: {},//批次信息 检测批次管理跳转实验室质控与实验室质控相关使用数据
        sampleSource: 1,//1采样 2送样
        currentUserInfo: {},//当前登录人的所有信息
        delegationType120: [//委托类型
            {
                label: '职业卫生',
                value: 1,
                children: [
                    {
                        label: '职业卫生检测',
                        value: 2,
                    },
                    {
                        label: '职业卫生日常监测与评价',
                        value: 3
                    },
                    {
                        label: '职业病危害现状评价',
                        value: 4
                    },
                    {
                        label: '职业卫生控制效果评价',
                        value: 5
                    }
                ]
            }
        ],
        delegationType119: [//委托类型
            {
                label: '环境卫生',
                value: 1,
                children: [
                    {
                        label: '环境监测/检测',
                        value: 11
                    },
                    {
                        label: '竣工环境保护验收',
                        value: 12
                    },
                    {
                        label: '场地调查',
                        value: 13
                    },
                    {
                        label: '环境影响评价检测',
                        value: 14
                    },
                    {
                        label: '突发环境事件风险防控措施隐患排查',
                        value: 15
                    },

                ]
            },
            {
                label: '公共卫生',
                value: 2,
                children: [
                    {
                        label: '职业卫生检测',
                        value: 21,
                    },
                    {
                        label: '职业卫生日常监测与评价',
                        value: 22
                    },
                    {
                        label: '职业病危害现状评价',
                        value: 23
                    },
                    {
                        label: '职业卫生控制效果评价',
                        value: 24
                    }
                ]
            },
            {
                label: '农业检测',
                value: 3,
                children: [
                    {
                        label: '产地环境',
                        value: 31,
                    },
                    {
                        label: '农产品检测',
                        value: 32
                    },
                    {
                        label: '耕地检测',
                        value: 33
                    },
                ]
            }
        ],
        delegationType121: [
            {
                label: '环境检测',
                value: 1
            },
            {
                label: '职业卫生检测',
                value: 2
            },
            {
                label: '公共卫生检测',
                value: 3
            },
            {
                label: '农产品检测（农业检测）',
                value: 4
            },
            {
                label: '产地环境监测（农业检测）',
                value: 5
            }
        ],
        delegationType123: [//委托类型
            {
                label: '环境卫生',
                value: 1,
                children: [
                    {
                        label: '环境监测/检测',
                        value: 11
                    },
                    {
                        label: '竣工环境保护验收',
                        value: 12
                    },
                    {
                        label: '场地调查',
                        value: 13
                    },
                    {
                        label: '环境影响评价检测',
                        value: 14
                    },
                    {
                        label: '突发环境事件风险防控措施隐患排查',
                        value: 15
                    },

                ]
            },
            {
                label: '公共卫生',
                value: 2,
                children: [
                    {
                        label: '职业卫生检测',
                        value: 21,
                    },
                    {
                        label: '职业卫生日常监测与评价',
                        value: 22
                    },
                    {
                        label: '职业病危害现状评价',
                        value: 23
                    },
                    {
                        label: '职业卫生控制效果评价',
                        value: 24
                    }
                ]
            },
            {
                label: '农业检测',
                value: 3,
                children: [
                    {
                        label: '产地环境',
                        value: 31,
                    },
                    {
                        label: '农产品检测',
                        value: 32
                    },
                    {
                        label: '耕地检测',
                        value: 33
                    },
                ]
            },
            {
                label: '职业卫生',
                value: 4,
                children: [
                    {
                        label: '职业卫生日常检测与评价',
                        value: 41
                    }
                ]
            }
        ],
        delegationType124: [
            {
                label: '职业卫生',
                value: 1,
                children: [
                    {
                        label: '职业卫生检测',
                        value: 11
                    },
                    {
                        label: '职业病危害现状p评价',
                        value: 12
                    },
                    {
                        label: '职业卫生控制效果评价',
                        value: 13
                    }
                ]
            }
        ], // 合同职位
        delegationType125: [
            {
                label: '环境监测',
                value: '1'
            },
            {
                label: '职业卫生监测',
                value: '2'
            },
            {
                label: '公共卫生监测',
                value: '3'
            },
            {
                label: '肥料检测（农业检测）',
                value: '4'
            },
            {
                label: '农产品检测（农业检测）',
                value: '5'
            },
            {
                label: '产地环境检测（农业检测）',
                value: '6'
            },
        ], //合同基础分类二
        methodReport: [
            {
                label: '快递',
                value: '1'
            },
            {
                label: '甲方自取',
                value: '2'
            },
            {
                label: '乙方送达(另收适当费用)',
                value: '3'
            }
        ], // 书面报告发放方式
        detectCategoryList: [
            {
                label: '委托监测',
                value: 1
            },
            {
                label: '送检',
                value: 2
            },
        ],
        detectCategoryListWithTake: [ //检测类别
            {
                label: '委托检测',
                value: 'c1'
            },
            {
                label: '监督性检测',
                value: 'c2'
            },
            {
                label: '执法检测',
                value: 'c3'
            },
            {
                label: '应急检测',
                value: 'c4'
            },
            {
                label: '其他',
                value: 'c5'
            },

        ],
        detectCategoryListSend: [
            {
                label: '委托',
                value:	1
            },
            {
                label: '监督',
                value: 2
            },
            {
                label: '仲裁',
                value:	3
            },
        ],
        detectCategoryListWithSend: [
            {
                label: '委托送样',
                value: 's1'
            },
            {
                label: '能力验证',
                value: 's2'
            },
            {
                label: '盲样考核',
                value: 's3'
            },
            {
                label: '比对送样',
                value: 's4'
            },
            {
                label: '其他送样',
                value: 's5'
            },
        ],
        entrustCategoryList: [
            {
                label: 'MB(监测站或政府委托检测)',
                value: 1
            },
            {
                label: 'HB(环评检测)',
                value: 2
            },
            {
                label: 'QB(其他)',
                value: 3
            },
        ],//委托类别
        contractCategoryList: [
            {
                label: 'MB(监测站或政府委托检测)',
                value: 1
            },
            {
                label: 'HB(环评检测)',
                value: 2
            },
            {
                label: 'QB(其他)',
                value: 3
            },//合同类别
        ],
        sampleHisConfigId: '',//采样记录配置ID
        codeCalculateTypeList:[],//编码计算方式
		monthList: [
			{label: '全部', value: null},
			{label: '1月', value: 1},
			{label: '2月', value: 2},
			{label: '3月', value: 3},
			{label: '4月', value: 4},
			{label: '5月', value: 5},
			{label: '6月', value: 6},
			{label: '7月', value: 7},
			{label: '8月', value: 8},
			{label: '9月', value: 9},
			{label: '10月', value: 10},
			{label: '11月', value: 11},
			{label: '12月', value: 12},
		],//月份
		laboratoryQCTypeList: [
			{
				value: 0,
				label: '加标'
			},
			{
				value: 1,
				label: '加标平行'
			},
			{
				value: 2,
				label: '实验室平行'
			},
			{
				value: 3,
				label: '实验室空白'
			},
			{
				value: 4,
				label: '有证物质'
			},
			{
				value: 5,
				label: '校核验证'
			},
			{
				value: 6,
				label: '稀释样品'
			},
			{
				value: 7,
				label: '替代物加标'
			},
			{
				value: 8,
				label: '校准零点'
			},
		], //实验室质控
		QCTypeList_px:[],//现场平行质控
		QCTypeList_kb:[],//现场空白质控
    },
    mutations: {
        set_codeCalculateTypeList(state,list){
            state.codeCalculateTypeList = list
        },
        set_sampleHisConfigId(state, id) {
            state.sampleHisConfigId = id
        },
        set_currentUserInfo(state, info) {
            state.currentUserInfo = info
        },
        set_sampleSource(state, type) {
            state.sampleSource = type
        },
        set_openLQCType(state, type) {
            state.openLQCType = type
        },
        set_batchInfo(state, info) {
            state.batchInfo = info
        },
        set_openBatchType(state, type) {
            state.openBatchType = type
        },
        set_dataType(state, type) {
            state.dataType = type
        },
        set_openEntrustType(state, type) {
            state.openEntrustType = type
        },
        set_currentLQCType(state, type) {
            state.currentLQCType = type
        },
        set_pointId(state, id) {
            state.pointId = id
        },
        set_detectId(state, id) {
            state.detectId = id
        },
        set_planElementShowType(state, type) {
            state.planElementShowType = type
        },
        set_customerName(state, customerName) {
            state.customerName = customerName
        },
        set_entrustInfoId(state, entrustInfoId) {
            state.entrustInfoId = entrustInfoId
        },
        set_entrustCode(state, entrustCode) {
            state.entrustCode = entrustCode
        },
        set_entrustAgreementId(state, id) {
            state.entrustAgreementId = id
        },
        set_entrustTypeStr(state, entrustTypeStr) {
            state.entrustTypeStr = entrustTypeStr
        },
        set_entrustType(state, id) {
            state.entrustType = id
        },
        set_bindProcess(state, id) {
            state.bindProcess = id
        },
        set_detectType(state, type) {
            state.detectType = type
        },
        set_detectName(state, name) {
            state.detectName = name
        },
        set_planTypeName(state, type) {
            state.planTypeName = type
        },
        set_planType(state, type) {
            state.planType = type
        },
        set_submitType(state, type) {
            state.submitType = type
        },
        set_categoriesType(state, type) {
            state.categoriesType = type
        },
        set_categoriesId(state, id) {
            state.categoriesId = id
        },
        set_detectTypeList(state, list) {
            state.detectTypeList = list
        },
        set_sampleStatusList(state, list) {
            state.sampleStatusList = list
        },
        set_authCategoryList(state, list) {
            state.initAuthCategoryListData = list
        },
		set_laboratoryQCTypeList(state, list) {
			state.laboratoryQCTypeList = list
		},
		set_QCTypeList_px(state, list) {
			state.QCTypeList_px = list
		},
		set_QCTypeList_kb(state, list) {
			state.QCTypeList_kb = list
		},
    },
    actions: {
        /*
         *@author: 焦政
         *@date: 2021-10-21 16:02:42
         *@description:获取当前登录人的信息
        */
        getCurrentUserInfo({ commit }) {
            net('/system/user/profile', 'get').then(re => {
                console.log('当前登录人信息', re.data)
                commit('set_currentUserInfo', re.data)
            })
        },
        /*
         *@author: 焦政
         *@date: 2021-09-27 13:33:48
         *@description:获取样品的检测类别  获取到的数据 应用到调整记录列表中的检测类别数据过滤
        */
        getDetectTypeList({ commit }) {
            net('/standard/v1/detectCategorys/getList?onlyShowLeaf=true', 'get').then(re => {
                 commit('set_detectTypeList', re.data)
            })
        },
        /*
         *@author: 焦政
         *@date: 2021-09-27 13:34:40
         *@description:获取样品状态，获取到的数据 应用到调整记录列表中的样品状态数据过滤
        */
        getSampleStatus({ commit }) {
            net('system/dict/data/listAll?dictType=sample_status', 'get').then(re => {
                commit('set_sampleStatusList', re.data)
            })
        },

        //获取授权类别
        initAuthCategoryList({ commit }) {
            net('system/dict/data/list?dictType=auth_type', 'get').then(re => {
                commit('set_authCategoryList', re.rows)
            })
        },
		// 获取质控
		get_QCTypeList({commit}) {
			net('/system/dict/data/type/quality_control_type','get').then(res => {
				if (res.code === 200) {
                    if (res.data) {
                        let params= {
                            qcTypeName: '实验室质控',
                            qcType: res.data.filter(item => item.dictLabel == '实验室质控')[0].dictCode,
                            pageSize: 100000,
                            pageNum:1,
                        }
                        net('/v1/quality/control/list','get',params).then(res => {
                            if (res.code === 200) {
                                res.data.list.map(item => {
                                    item.value = item.qcNo
                                })
                                commit('set_laboratoryQCTypeList', res.data.list)
                            }
                        })
                        let params2= {
                            qcTypeName: '现场质控-空白',
                            qcType:  res.data.filter(item => item.dictLabel == '现场质控-空白')[0].dictCode,
                            pageSize: 100000,
                            pageNum:1,
                        }
                        net('/v1/quality/control/list','get',params2).then(res => {
                            if (res.code === 200) {
                                res.data.list.map(item => {
                                    item.value = item.qcNo
                                })
                                commit('set_QCTypeList_kb', res.data.list)
                            }
                        })
                        let params3= {
                            qcTypeName: '现场质控-平行',
                            qcType:  res.data.filter(item => item.dictLabel == '现场质控-平行')[0].dictCode,
                            pageSize: 100000,
                            pageNum:1,
                        }
                        net('/v1/quality/control/list','get',params3).then(res => {
                            if (res.code === 200) {
                                res.data.list.map(item => {
                                    item.value = item.qcNo
                                })
                                commit('set_QCTypeList_px', res.data.list)
                            }
                        })
                    }

				}
			})
		},
        // 获取编码计算方式
        getcodeCalculateTypeList({commit}){
            // net('system/dict/data/list?dictType=code_calculate', 'get').then(re => {
            //     commit('set_codeCalculateTypeList', re.rows)
            // })
			commit('set_codeCalculateTypeList', [
				{
					dictLabel: '平均',
					dictValue: 1
				},{
					dictLabel: '最大',
					dictValue: 2
				},{
					dictLabel: '最小',
					dictValue: 3
				},{
					dictLabel: '舍弃最大、最小后取平均',
					dictValue: 4
				},{
					dictLabel: '舍弃小于最大1/4后剩下取均值',
					dictValue: 5
				},{
					dictLabel: '合并',
					dictValue: 6
				},{
					dictLabel: '无',
					dictValue: 7
				},
			])
        }
    }

}

export default BeiYuan
