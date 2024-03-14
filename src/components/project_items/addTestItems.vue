<template>
  <div>
    <BoDialog :diaLogShow="diaLogShow" diaLogTitle="新增检测项目" diaLogWidth="80%"
              @close="e_close">
      <template slot="bologbody" v-slot:bologbody>
        <el-row style="margin-bottom: 10px">
          <el-col>
            <p>已选择项目</p>
          </el-col>
          <el-col>
            <el-button :disabled="isdisabled" size="small" type="primary"
                       @click="createGroup">创建分组
            </el-button>
            <el-button :disabled="isdisabled" size="small" type="primary"
                       @click="specifyJudgmentCriteria">指定判定标准
            </el-button>
          </el-col>
        </el-row>

        <el-table
            ref="selectedItemArr"
            :cell-style="{ padding: '2px' }"
            :data="selectedItemList"
            :row-style="{ height: '20px' }"
            :span-method="selectedMergeMethod"
            border
            height="300"
            style="width: 100%;"
        >
          <el-table-column align="center" label="序号" type="index" width="62px"/>
          <el-table-column :show-overflow-tooltip="true" align="center" label="项目名称" prop="itemId">
            <template #default="scope">
              {{ scope.row.itemNameCn }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="方法编号" prop="itemId">
            <template #default="scope">
              {{ scope.row.methodCode }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="方法名称" prop="itemId">
            <template #default="scope">
              {{ scope.row.methodName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="执行标准" prop="standardTypeName">
            <template #default="scope">
              {{
                scope.row.itemLimitList.length ==
                0 ? '' : echoData(scope.row.itemLimitList[0].standardType, standardTypeList)
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="产品分类" prop="standardCategoryName">
            <template #default="scope">
              {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardCategoryName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="执行标准号" prop="standardCode">
            <template #default="scope">
              {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardCode }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="执行标准名称" prop="standardName">
            <template #default="scope">
              {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="判定标准要求" prop="limitDesc">
            <template #default="scope">
              {{ scope.row.limitDesc }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button size="small" style="color: #ff5d5d" type="text"
                         @click="e_delete(scope.row,scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-tabs
            v-model="selectItemType"
            style="margin-top: 15px"
            tab-position="left"
            type="border-card"
            @tab-click="handleClick"
        >
          <el-tab-pane label="按项目" name="item">

            <el-form ref="itemNameParam"
                     :inline="true"
                     :model="itemNameParam"
                     @submit.native.prevent>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="项目名称：" prop="itemName">
                    <el-input v-model="itemNameParam.itemName" clearable style="width: 100%;"
                              @clear="ItemNameSearchbtn"
                              @keyup.native.enter="ItemNameSearchbtn"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="方法编号" prop="methodCode">
                    <el-input v-model="itemNameParam.methodCode"
                              @clear="ItemNameSearchbtn"
                              @keyup.native.enter="ItemNameSearchbtn"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button center size="small" type="primary" @click="ItemNameSearchbtn">搜索
                  </el-button>
                  <el-button center size="small" @click="ItemNameResetbtn">重置
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-col :span="6">
              <el-table
                  ref="itemNameTable"
                  v-loading="loading"
                  :cell-style="{ padding: '2px' }"
                  :data="itemNameList"
                  :row-style="{ height: '20px' }"
                  border
                  max-height="250"
                  style="width: 100%"
                  @row-click="itemNameClick"
              >
                <el-table-column align="center" label="序号" type="index"
                                 width="65"/>
                <el-table-column align="center" label="项目名称"
                                 prop="itemNameCn"/>
                <el-table-column align="center" label="方法编号"
                                 prop="methodCode"/>
              </el-table>
              <pagination
                  v-show="itemNameTotal > 0"
                  :limit.sync="itemNameParam.pageSize"
                  :page.sync="itemNameParam.pageNum"
                  :pageSizes="pageSizes"
                  :total="itemNameTotal"
                  @pagination="ItemNameSearchbtn"
              />
            </el-col>
            <el-col :span="18">
              <!--检测项目list   start-->
              <el-table
                  ref="projectArr"
                  v-loading="loading"
                  :data="projectList"
                  :span-method="projectMergeMethod"
                  border
                  max-height="250"
                  style="width: 100%;margin-left:10px"
                  @select="handleSelectionChange"
                  @select-all="projectSelectAllCheck"
              >
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column align="center" label="序号" type="index" width="62px"/>
                <el-table-column align="center" label="方法名称" prop="">
                  <template #default="scope">
                    {{ scope.row.methodName }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="执行标准" prop="">
                  <template #default="scope">
                    {{
                      scope.row.itemLimitList.length ==
                      0 ? '' : echoData(scope.row.itemLimitList[0].standardType, standardTypeList)
                    }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="判定标准要求" prop="limitDesc">
                  <template #default="scope">
                    {{ scope.row.limitDesc }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="产品分类" prop="standardCategoryName">
                  <template #default="scope">
                    {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardCategoryName }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="执行标准号" prop="standardCode">
                  <template #default="scope">
                    {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardCode }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="执行标准名称" prop="standardName">
                  <template #default="scope">
                    {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardName }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <!--检测项目list   end-->
          </el-tab-pane>
          <el-tab-pane label="按分组" name="group">
            <el-row>
              <el-col :span="6">
                <el-form ref="groupParam"
                         :inline="true"
                         :model="groupParam"
                         @submit.native.prevent>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="分组名称：" prop="groupName">
                        <el-input v-model="groupParam.groupName" clearable style="width: 100%;"
                                  @clear="GroupSearchbtn"
                                  @keyup.native.enter="GroupSearchbtn"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <!--分组表格 start-->
                <el-table
                    ref="groupTable"
                    v-loading="loading"
                    :cell-style="{ padding: '2px' }"
                    :data="groupList"
                    :row-style="{ height: '20px' }"
                    border
                    max-height="250"
                    style="width: 100%"
                    @row-click="groupTableClick"
                >
                  <el-table-column align="center" label="序号" type="index"
                                   width="65"/>
                  <el-table-column align="center" label="分组名称"
                                   prop="groupName"/>
                </el-table>
                <pagination
                    v-show="groupListTotal > 0"
                    :limit.sync="groupParam.pageSize"
                    :page.sync="groupParam.pageNum"
                    :pageSizes="pageSizes"
                    :total="groupListTotal"
                    @pagination="getGroupData"
                />
                <!--分组表格 end-->
              </el-col>
              <el-col :span="18">
                <!--检测项目list   start-->
                <el-table
                    ref="itemArr"
                    v-loading="loading"
                    :data="itemList"
                    :span-method="itemMergeMethod"
                    border
                    max-height="308"
                    style="width: 100%;margin-left:10px"
                    @select="(selection, row)=>{handleSelectionChange(selection, row,'item')}"
                    @select-all="groupSelectAllCheck"
                >
                  <el-table-column type="selection" width="45"></el-table-column>
                  <el-table-column align="center" label="序号" type="index" width="62px"/>
                  <el-table-column :show-overflow-tooltip="true" align="center" label="项目名称" prop="itemNameCn">
                    <template #default="scope">
                      {{ scope.row.itemNameCn }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="方法编号" prop="methodCode">
                    <template #default="scope">
                      {{ scope.row.methodCode }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="方法名称" prop="methodName">
                    <template #default="scope">
                      {{ scope.row.methodName }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="执行标准" prop="standardTypeName">
                    <template #default="scope">
                      {{
                        scope.row.itemLimitList.length ==
                        0 ? '' : echoData(scope.row.itemLimitList[0].standardType, standardTypeList)
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="判定标准要求" prop="limitDesc">
                    <template #default="scope">
                      {{ scope.row.limitDesc }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="产品分类" prop="standardCategoryName">
                    <template #default="scope">
                      {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardCategoryName }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="执行标准号" prop="standardCode">
                    <template #default="scope">
                      {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardCode }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="执行标准名称" prop="standardName">
                    <template #default="scope">
                      {{ scope.row.itemLimitList.length == 0 ? '' : scope.row.itemLimitList[0].standardName }}
                    </template>
                  </el-table-column>

                </el-table>
                <!--检测项目list   end-->
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template slot="bologfooter" v-slot:bologfooter>
        <el-button size="small" type="primary" @click="e_preservation">保存</el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </template>
    </BoDialog>
    <CheckJudgmentCriteria v-if="showCriteria" ref="CheckJudgmentCriteria"
                           @close="closeCriteria"></CheckJudgmentCriteria>
    <GroupAdd v-if="showGroupAdd" ref="GroupAdd" @close="showGroupAdd = false" @reload="closeGroupAdd"></GroupAdd>
  </div>
</template>
<script lang="ts" setup>
import BoContainerMixin from '@/mixins/boContainer.js'
import chopper from '@/mixins/chopper.js'
import CheckJudgmentCriteria from "./checkjudgmentCriteria.vue";
import GroupAdd from "./groupAdd.vue";
import {defineComponent, getCurrentInstance, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const emit = defineEmits(['reload', 'cancel'])
defineComponent({
  mixins: [BoContainerMixin, chopper]
})
const vm = getCurrentInstance().proxy
let isFullScreen: boolean = ref(true)
let diaLogShow: boolean = ref(false)
let loading: boolean = ref(false)
let showCriteria: boolean = ref(false)
let showGroupAdd: boolean = ref(false)
let selectItemType: string = ref('item')
let merge: Array<any> = ref(['itemId', 'mergeStandardTypeId'])
let standardTypeList = ref(vm.getDicts('STANDARD_TYPE'))
let pageSizes: Array<number> = ref([100, 200, 500])
// 按项目请求参数
let itemNameParam: object = reactive({
  itemName: null,
  pageSize: 100,
  pageNum: 1,
  isAdd: false,
  methodCode: null,
  id: null
})
// 按分组请求参数
let groupParam: object = reactive({
  groupName: null,
  pageSize: 100,
  pageNum: 1
})
let projectParams: object = reactive({
  itemNameCn: null,
  pageSize: 100,
  pageNum: 1
})
let selectedItemList: Array<any> = ref([])//已选择数据列表
let itemNameList: Array<any> = ref([])//按项目 项目名称列表
let projectList: Array<any> = ref([])
let itemList: Array<any> = ref([])
let groupList: Array<any> = ref([])
let isdisabled: boolean = ref(false)
let itemNameTotal: number = ref(0)
let projectTotal: number = ref(0)
let groupListTotal: number = ref(0)
let detectCategoryInfo: object = reactive({})
let detectCategory: string | number = ref(null)

async function init(id: number | string, arr: Array, e: object): void {
  Object.assign(detectCategoryInfo, e)
  if (arr.length !== 0) {
    arr.map(itemInfo => {
      if (itemInfo.itemLimitList == null) {
        itemInfo.itemLimitList = []
      }
    })
    selectedItemList = arr
    getSelectedMergeArr(selectedItemList, merge)
  }
  diaLogShow = true
  detectCategory.value = id
  getItemNameList()
  getGroupData()
}

async function getItemNameList() {
  let params = Object.assign({...itemNameParam, detectCategory: detectCategory || ''})
  let getData = await vm.$net('/standard/v1/itemMethods/getItemList', 'get', params)
  if (getData.code == 200) {
    itemNameList = getData.data.list
    itemNameTotal = getData.data.total
    projectList = []
  }
}

// 获取项目列表
async function getProjectData(type: string, data: any) {
  loading = true
  let params = Object.assign({...projectParams, detectCategory})
  if (type == 'itemMenthodId') {
    params.id = data
  }
  try {
    let getData = await vm.$net('/standard/v1/itemMethods/getItemLimitList', 'get', params)
    if (getData.code == 200) {
      projectList = getData.data
      projectList.map((item) => {
        item.itemId = item.id
        if (item.itemLimitList == null || item.itemLimitList == undefined) {
          item.itemLimitList = []
        } else {
          item.limitDesc = item.itemLimitList.map((item) => {
            item.standardCategoryName = item.productionName
            return item.limitDesc
          }).join(',')
        }
        item.mergeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType) + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardProductionId)
        item.mergeStandardTypeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType)
      })
      nextTick(() => {
        projectList.map((item1) => {
          selectedItemList.map((item2) => {
            if (item1.mergeId == item2.mergeId) {
              vm.$refs.projectArr.toggleRowSelection(item1, true)
            }
          })
        })
      })
      loading = false
    }
  } catch (e) {
    loading = false
  }
  vm.getProjectMergeArr(projectList, merge)
}

//按分组查询检测项目
async function groupTableClick(row) {
  loading = true
  try {
    let getData = await vm.$net(`/standard/v1/itMeGroups/getDetailByIdNew/${row.id}`, 'get')
    if (getData.code == 200) {
      itemList = getData.data.detailList
      itemList.map((item) => {
        item.itemId = item.id
        if (item.itemLimitList == null) {
          item.itemLimitList = []
        } else {
          item.limitDesc = item.itemLimitList.map((item) => {
            item.standardCategoryName = item.productionName
            return item.limitDesc
          }).join(',')
        }
        item.mergeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType) + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardProductionId)
        item.mergeStandardTypeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType)
      })
      nextTick(() => {
        itemList.map((item1) => {
          selectedItemList.map((item2) => {
            if (item1.mergeId == item2.mergeId) {
              vm.$refs.itemArr.toggleRowSelection(item1, true)
            }
          })
        })
      })
      loading = false
    }
  } catch (e) {
    loading = false
  }
  vm.getItemMergeArr(itemList, merge)
}

function itemNameClick(e) {
  getProjectData('itemMenthodId', e.id)
}

// 创建分组
function createGroup() {
  if (selectedItemList.length == 0) {
    ElMessage.info('请添加检测项目')
    return
  }
  // 传给后端的数据
  let repeatArr = repeat(JSON.parse(JSON.stringify(selectedItemList)))
  repeatArr.map((item) => {
    let arr = []
    selectedItemList.map((item2) => {
      if (item.itemId == item2.itemId) {
        arr = arr.concat(item2.itemLimitList)
      }
    })
    item.itemLimitList = arr
  })
  let params = {
    detectCategory: detectCategoryInfo.id,
    detectCategoryName: detectCategoryInfo.name,
    detailList: repeatArr
  }
  showGroupAdd = true
  nextTick(() => {
    vm.$refs.GroupAdd.init(params)
  })
}

// 创建分组回调
function closeGroupAdd() {
  showGroupAdd = false
  itemList = []
  getGroupData()
}

// 指定判定标准
function specifyJudgmentCriteria() {
  if (selectedItemList.length == 0) {
    ElMessage.error('请先选择检测项目')
    return
  }
  // 传给后端的数据
  let repeatArr = repeat(JSON.parse(JSON.stringify(selectedItemList)))
  repeatArr.map((item) => {
    let arr = []
    this.selectedItemList.map((item2) => {
      if (item.itemId == item2.itemId) {
        arr = arr.concat(item2.itemLimitList)
      }
    })
    item.itemLimitList = arr
  })
  var dataList = repeatArr
  for (var i in dataList) {
    var itemLimitlist = JSON.parse(JSON.stringify(dataList[i].itemLimitList));
    var arr = new Array;
    var newarr = new Array;
    for (var x in itemLimitlist) {
      var index = arr.indexOf(itemLimitlist[x].decideStandardId);
      if (index < 0) {
        arr.push(itemLimitlist[x].decideStandardId);
        newarr.push(itemLimitlist[x])
      } else {
        if (newarr[index].limitDesc && itemLimitlist[x].limitDesc) {
          newarr[index].limitDesc = newarr[index].limitDesc + ',' + itemLimitlist[x].limitDesc
        } else if (!newarr[index].limitDesc && itemLimitlist[x].limitDesc) {
          newarr[index].limitDesc = itemLimitlist[x].limitDesc
        }
      }
    }
    dataList[i].childList = newarr;
  }
  dataList.map(item => {
    item.childList.map((items => {
      items.standardCategoryName = items.productionName
    }))
  })
  showCriteria = true
  nextTick(() => {
    vm.$refs.CheckJudgmentCriteria.init(dataList, detectCategoryInfo)
  })
}

// 添加判定标准回调
function closeCriteria(data) {
  // 存储处理后的数据
  let arr = []
  data.map((item) => {
    // 去重得到不同产品分类id
    let repeatArr = repeatArr(JSON.parse(JSON.stringify(item.itemLimitList)))
    repeatArr = repeatArr.map((item) => item.standardType)
    // 遍历不同产品分类 将不同产品分类分为多条数据
    if (repeatArr.length > 0) {
      repeatArr.map((itemA) => {
        let itemLimitList = []
        item.itemLimitList.map((itemB) => {
          if (itemA == itemB.standardType) {
            itemLimitList.push(itemB)
          }
        })
        let obj = {
          ...item,
          itemLimitList: itemLimitList
        }
        arr.push(obj)
      })
    } else {
      arr.push(item)
    }
  })
  arr.map((item) => {
    if (item.itemLimitList == null) {
      item.itemLimitList = []
    } else {
      item.limitDesc = item.itemLimitList.map((item) => {
        item.standardCategoryName = item.productionName
        return item.limitDesc
      }).join(',')
    }
    item.mergeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType) + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardProductionId)
    item.mergeStandardTypeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType)
  })
  projectList = []
  itemList = []
  showCriteria = false
  selectedItemList = arr
  vm.getSelectedMergeArr(selectedItemList, merge)
}

function repeatArr(data) {
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = 1; j < data.length; j++) {
      if (i != j) {
        if (data[i].standardType == data[j].standardType) {
          data.splice(j, 1)
          j--
        }
      }
    }
  }
  return data
}

// 分组搜索
function ItemNameSearchbtn() {
  getItemNameList()
}

// 分组搜索
function ItemNameResetbtn() {
  vm.$refs.itemNameParam.resetFields()
  projectList = []
  getItemNameList()
}

// 分组搜索
function GroupSearchbtn() {
  getGroupData()
}

// 项目搜索
function ProjectSearchbtn() {
  getProjectData()
}

// 项目重置按钮
function ProjectResetbtn() {
  vm.$refs.projectParams.resetFields()
  getProjectData()
}

// tab切换
function handleClick(tab) {
  if (tab.name == 'item') {
    vm.$refs.projectParams.resetFields()
    vm.$refs.itemNameParam.resetFields()
    projectList = []
    getItemNameList()
  } else {
    groupParam.groupName = ''
    getGroupData()
    itemList = []
  }
  selectItemType = tab.name
}

// 手动选择
function handleSelectionChange(selection, row) {
  let selected = selection.length && selection.indexOf(row) !== -1
  if (selected) {
    row = JSON.parse(JSON.stringify(row))
    let arr = []
    selectedItemList.map((item) => {
      if (item.mergeStandardTypeId == row.mergeStandardTypeId) {
        arr.push(item)
      }
    })
    if (arr.length > 0) {
      projectList.map((item1) => {
        if (item1.mergeId == row.mergeId) {
          this.$refs.projectArr.toggleRowSelection(item1, false)
        }
      })
      itemList.map((item1) => {
        if (item1.mergeId == row.mergeId) {
          this.$refs.itemArr.toggleRowSelection(item1, false)
        }
      })
      ElMessage.warning('不能选择相同检测项目相同执行标准下的产品分类')
    } else {
      let dataIndex = null
      selectedItemList.map((item1, index) => {
        if (item1.itemId == row.itemId) {
          dataIndex = index
        }
      })
      if (dataIndex != null) {
        selectedItemList.splice(dataIndex, 0, row)
      } else {
        selectedItemList.push(row)
      }
    }
  } else {
    //取消选中
    var index = selectedItemList.findIndex(function (item) {
      return item.mergeId === row.mergeId
    })
    selectedItemList.splice(index, 1)
  }
  vm.getSelectedMergeArr(selectedItemList, merge)
}

// 分组列表是否全选
function groupSelectAllCheck(selection) {
  //判断是全选还是取消全选
  let isAllChecked = false
  if (selection.length > 0) {
    isAllChecked = true

    // 通过(合并检测项目id和执行标准id的mergeStandardTypeId字段) 对比已选择检测项目和全选数据  来判断
    let identicalArr = []
    selectedItemList.map((itemA) => {
      selection.map((itemB) => {
        if (itemA.mergeStandardTypeId == itemB.mergeStandardTypeId) {
          identicalArr.push(itemB)
        }
      })
    })

    if (identicalArr.length > 0) {
      // 恢复复选框
      let copyArr = JSON.parse(JSON.stringify(selectedItemList))
      vm.$refs.itemArr.clearSelection()
      copyArr.map((itemA) => {
        itemList.map((itemB) => {
          if (itemA.mergeId == itemB.mergeId) {
            vm.$refs.itemArr.toggleRowSelection(itemB, true)
          }
        })
      })
      ElMessage.warning('不能选择相同检测项目相同执行标准下的产品分类')
      return
    }
  }
  let arr = JSON.parse(JSON.stringify(itemList))
  arr.forEach(row => {
    let index = selectedItemList.findIndex(function (item) {
      return item.mergeId === row.mergeId
    })
    if (isAllChecked && index == -1) {
      //全选状态 && 已选表格不存在这个检测项目
      let dataIndex = null
      selectedItemList.map((item1, index) => {
        if (item1.itemId == row.itemId) {
          dataIndex = index
        }
      })
      if (dataIndex != null) {
        selectedItemList.splice(dataIndex, 0, row)
      } else {
        selectedItemList.push(row)
      }
    } else if (!isAllChecked && index > -1) {
      //取消全选 && 已选表格存在这个检测项目
      selectedItemList.splice(index, 1)
    }
  })
  vm.getSelectedMergeArr(selectedItemList, merge)
}

// 项目列表是否全选
function projectSelectAllCheck(selection) {
  //判断是全选还是取消全选
  let isAllChecked = false
  if (selection.length > 0) {
    isAllChecked = true

    // 通过去重 (合并检测项目id和执行标准id的字段) 来判断
    let repeatArr = repeatMergeStandardTypeIdArr(JSON.parse(JSON.stringify(selection)))

    // 通过(合并检测项目id和执行标准id的字段) 对比已选择检测项目和全选数据  来判断
    let identicalArr = []
    selectedItemList.map((itemA) => {
      selection.map((itemB) => {
        if (itemA.mergeStandardTypeId == itemB.mergeStandardTypeId) {
          identicalArr.push(itemB)
        }
      })
    })

    if (repeatArr.length < selection.length || identicalArr.length > 0) {
      // 恢复复选框
      let copyArr = JSON.parse(JSON.stringify(selectedItemList))
      vm.$refs.projectArr.clearSelection()
      copyArr.map((itemA) => {
        projectList.map((itemB) => {
          if (itemA.mergeId == itemB.mergeId) {
            vm.$refs.projectArr.toggleRowSelection(itemB, true)
          }
        })
      })
      ElMessage.warning('不能选择相同检测项目相同执行标准下的产品分类')
      return
    }
  }
  let arr = JSON.parse(JSON.stringify(projectList))
  arr.forEach(row => {
    let index = selectedItemList.findIndex(function (item) {
      return item.mergeId === row.mergeId
    })
    if (isAllChecked && index == -1) {
      //全选状态 && 已选表格不存在这个检测项目
      let dataIndex = null
      selectedItemList.map((item1, index) => {
        if (item1.itemId == row.itemId) {
          dataIndex = index
        }
      })
      if (dataIndex != null) {
        selectedItemList.splice(dataIndex, 0, row)
      } else {
        selectedItemList.push(row)
      }
    } else if (!isAllChecked && index > -1) {
      //取消全选 && 已选表格存在这个检测项目
      selectedItemList.splice(index, 1)
    }
  })
  vm.getSelectedMergeArr(selectedItemList, merge)
}

// 去重 (合并检测项目id和执行标准id的字段)
function repeatMergeStandardTypeIdArr(data) {
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = 1; j < data.length; j++) {
      if (i != j) {
        if (data[i].mergeStandardTypeId == data[j].mergeStandardTypeId) {
          data.splice(j, 1)
          j--
        }
      }
    }
  }
  return data
}

// 保存 按钮
function e_preservation() {
  if (selectedItemList.length == 0) {
    ElMessage.warning('请选择检测项目')
    return
  }
  diaLogShow = false
  emit('reload', selectedItemList)
}

// 数据去重
function repeat(data) {
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = 1; j < data.length; j++) {
      if (i != j) {
        if (data[i].itemId == data[j].itemId) {
          data.splice(j, 1)
          j--
        }
      }
    }
  }
  return data
}

// 删除 操作
function e_delete(row, index) {
  selectedItemList.splice(index, 1)
  nextTick(() => {
    projectList.map((item1) => {
      if (item1.mergeId == row.mergeId) {
        vm.$refs.projectArr.toggleRowSelection(item1, false)
      }
    })
    itemList.map((item1) => {
      if (item1.mergeId == row.mergeId) {
        vm.$refs.itemArr.toggleRowSelection(item1, false)
      }
    })
  })
  vm.getSelectedMergeArr(selectedItemList, merge)
}

// 关闭
function e_close() {
  diaLogShow = false
  emit('cancel')
}
</script>

<style scoped>
.classFor {
  border-bottom: 1px solid #dfe6ec;
  width: 140%;
  margin-left: -12px;
  line-height: 30px;
}

.classFor div {
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.classFor:last-child {
  border-bottom: none
}
</style>
