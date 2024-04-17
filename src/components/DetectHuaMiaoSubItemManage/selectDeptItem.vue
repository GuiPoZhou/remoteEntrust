<template>
  <BoDialog :dia-log-show="selectDeptItemShow" dia-log-title="选择检测项目" dia-log-width="80%" @close="close">
    <template slot="bologbody">
      <el-container style="height: 300px; border: 1px solid #eee">
        <!-- 左侧维护深度列表 -->
        <el-aside width="323px">
          <div style="text-align: left">
            <el-button center size="small" type="primary" @click="e_addDepth"
            >添加深度
            </el-button>
          </div>
          <el-table
              ref="deptTable"
              :cell-style="{ padding: '5px' }"
              :data="deptTableData"
              :row-style="{ height: '20px' }"
              border
              element-loading-background="rgba(0, 0, 0, 0.8)"
              element-loading-spinner="el-icon-loading"
              height="230"
              style="width: 100%"
          >
            <el-table-column align="center" label="" width="55">
              <template v-slot="scope">
                <el-radio
                    v-model="currentDepthRow"
                    :label="scope.row"
                    @change="e_selectDepRow(scope)"
                ><i></i
                ></el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center" label="深度" prop="dept">
              <template v-slot="scope">
                <el-input v-model="scope.row.depth" placeholder="深度"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-popconfirm
                    title="确定删除该行吗？"
                    @onConfirm="e_deleteDepth(scope)"
                >
                  <el-button
                      slot="reference"
                      icon="el-icon-delete"
                      size="small"
                      text
                  >删除
                  </el-button>
                </el-popconfirm>
                <el-button
                    icon="icon iconfont iconbsl-icon-fuzhi"
                    size="small"
                    text type="primary"
                    @click="e_copyDepth(scope.row)"
                >复制
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <!-- 右侧深度对应已选项目列表 -->
        <el-container style="margin-left: 10px">
          <div style="width: 100%">
            <div style="text-align: center">
              <h2>
                {{ '已选择项目（共' + deptItemTableData.length + '个）' }}
              </h2>
            </div>

            <el-table
                ref="groupItemTable"
                :cell-style="{ padding: '2px' }"
                :data="deptItemTableData"
                :row-style="{ height: '20px' }"
                border
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-spinner="el-icon-loading"
                height="230"
                style="width: 100%"
            >
              <el-table-column
                  :show-overflow-tooltip="true"
                  label="项目名称"
                  prop="itemName"
              />
              <el-table-column
                  label="方法编码"
                  prop="itemCode"
                  show-overflow-tooltip
              />
              <el-table-column label="检测方法" prop="subname"/>
              <el-table-column label="检测部位" prop="stroma"/>
              <el-table-column label="现场检测">
                <template v-slot="scope">
                  <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      :value="scope.row.sceneDetect"
                      active-color="#5B7BFA"
                      disabled
                      inactive-color="#dadde5"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="客户指定" prop="customerAppoint">
                <template v-slot="scope">
                  <el-switch
                      v-model="scope.row.customerAppoint"
                      :active-value="1"
                      :inactive-value="0"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template v-slot="scope">
                  <el-popconfirm
                      title="确定删除该行吗？"
                      @onConfirm="deleteItem(scope)"
                  >
                    <el-button
                        slot="reference"
                        icon="el-icon-delete"
                        size="small"
                        text type="primary"
                    >删除
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-container>
      </el-container>
      <!-- 底部待选区域 -->
      <div style="margin-top: 10px; height: 300px">
        <el-tabs
            :value="selectItemType"
            tab-position="left"
            type="border-card"
            @tab-click="handleClick"
        >
          <el-tab-pane label="按项目" name="item">
            <itemList
                ref="itemList"
                :selectedItems="deptItemTableData"
                @parseSelectedItems="parseSelectedItems"
            />
          </el-tab-pane>

          <el-tab-pane label="按分组" name="group">
            <groupList
                ref="groupList"
                :selectedItems="deptItemTableData"
                @parseSelectedItems="parseSelectedItems"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

    </template>
    <template slot="bologfooter">
      <el-button center type="primary" @click="saveItem">保存</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </BoDialog>
</template>

<script>
import itemList from './itemList'
import groupList from './groupList'

export default {
  name: 'selectDeptItem',
  components: {
    itemList,
    groupList
  },
  computed: {
    //已选择项目样品数
    /*	sampleNum() {
                return this.deptItemTableData.length;
            }*/
  },
  data() {
    return {
      isFullScreen: true,
      selectDeptItemShow: false,
      sampleNum: 0,
      //选中项目的方式 item:按项目选择 ，group:按组选择
      selectItemType: 'item',
      //检测类别
      detectType: this.$store.state.BeiYuan.detectType,
      deptTableData: [], //深度列表
      currentDepthRow: {}, //当前选择的深度行
      currentDepthRowIndex: -1, //当前选择的深度行索引
      deptItemTableData: [], //深度对应的已选项目
      selectedItemTableData: []
    }
  },
  methods: {
    /*
     *@author: 焦政
     *@date: 2021-01-14 19:11:01
     *@description: 编辑回显
     */
    init(data, detectType) {
      console.log('回填数据', data)
      this.detectType = detectType
      this.selectDeptItemShow = true
      if (data.length > 0) {
        data.forEach((item) => {
          let obj = {
            depth: item.depth,
            deptItemTableData: item.itemList
          }
          this.deptTableData.push(obj)
        })
        this.currentDepthRow = this.deptTableData[0]
        this.deptItemTableData = this.deptTableData[0].deptItemTableData || []
        this.currentDepthRowIndex = 0
      }
      this.$nextTick(() => {
        this.$refs.itemList.initItemList(this.detectType)
      })
    },
    /*
     *@author: 焦政
     *@date: 2021-01-13 11:50:20
     *@description: 增加深度
     */
    e_addDepth() {
      let obj = {
        depth: '',
        deptItemTableData: []
      }
      this.deptTableData.push(obj)
    },
    /*
     *@author: 焦政
     *@date: 2021-01-13 12:41:25
     *@description: 删除一行深度
     */
    e_deleteDepth(scope) {
      let rowIndex = scope.$index
      this.deptTableData.splice(rowIndex, 1)
    },
    /*
     *@author: 焦政
     *@date: 2021-01-13 12:55:03
     *@description: 复制一行深度
     */
    e_copyDepth(row) {
      console.log(row)
      let obj = JSON.parse(JSON.stringify(row))
      obj.time = new Date().getTime()
      this.deptTableData.push(obj)
    },
    /*
     *@author: 焦政
     *@date: 2021-01-13 13:12:22
     *@description: 选择深度行
     */
    e_selectDepRow(scope) {
      if (this.currentDepthRow.depth === '') {
        this.$message({
          message: '请填写深度值',
          type: 'warning'
        })
        this.currentDepthRow = {}
        return
      }
      this.currentDepthRowIndex = scope.$index
      let arr =
          this.deptTableData[this.currentDepthRowIndex].deptItemTableData || []
      this.deptItemTableData = arr
      if (this.selectItemType === 'group') {
        this.$refs.groupList.initGroupList(this.detectType)
      } else {
        this.$refs.itemList.initItemList(this.detectType)
      }
    },
    /*
     *@author: 焦政
     *@date: 2021-01-15 13:42:02
     *@description: 删除已选深度下面对应的某个项目
     */
    deleteItem(scope) {
      let proIndex = scope.$index;
      this.deptTableData[this.currentDepthRowIndex].deptItemTableData.splice(
          proIndex,
          1
      );
      if (this.selectItemType == 'item') {
        this.$refs.itemList.customerSel(scope.row.itemId)
      } else {
        this.$refs.groupList.customerSel(scope.row.itemId)
      }
    },
    /*
     *@author: 焦政
     *@date: 2021-01-13 13:00:59
     *@description: 按项目组件 选择时间回调
     */
    parseSelectedItems(data) {
      if (typeof this.currentDepthRow.depth == 'undefined') {
        this.$message({
          message: '请先选择要添加的深度',
          type: 'warning'
        })
        return
      }
      // this.deptTableData[this.currentDepthRowIndex].deptItemTableData = this.deptTableData[this.currentDepthRowIndex].deptItemTableData?this.deptTableData[this.currentDepthRowIndex].deptItemTableData:[]
      //所有项目列表--选中项目id
      let currentSelectedItemIds = data.currentSelectedItems.map(
          (itemMethod) => itemMethod.itemId
      )
      //所有项目列表中--项目id
      let allItemIds = data.allItem.map((itemMethod) => itemMethod.itemId)
      //所有项目列表--未选中 项目id
      let currentUnSelectedItemIds = allItemIds.filter((id) => {
        return currentSelectedItemIds.indexOf(id) < 0
      })
      //已选项目列表中 项目id
      let alreadySelectedItemIds = this.deptItemTableData.map(
          (itemMethod) => itemMethod.itemId
      )

      //添加
      data.currentSelectedItems.forEach((itemMethod) => {
        if (alreadySelectedItemIds.indexOf(itemMethod.itemId) < 0) {
          // this.deptTableData[this.currentDepthRowIndex].deptItemTableData.push(itemMethod);
          this.deptItemTableData.push(itemMethod)
        }
      })

      //删除未选中项
      for (let i = this.deptItemTableData.length - 1; i >= 0; i--) {
        let itemId = this.deptItemTableData[i].itemId
        if (currentUnSelectedItemIds.indexOf(itemId) >= 0) {
          // this.deptTableData[this.currentDepthRowIndex].deptItemTableData.splice(i, 1);
          this.deptItemTableData.splice(i, 1)
        }
      }

      this.deptTableData[this.currentDepthRowIndex].deptItemTableData =
          this.deptItemTableData
      console.log(this.deptItemTableData)
    },
    /*
     *@author: 焦政
     *@date: 2021-01-13 14:08:02
     *@description: 保存已选数据
     */
    saveItem() {
      this.$emit('saveDeptItem', this.deptTableData)
      this.close()
    },
    initItemList(detectType, selectedItems) {
      this.selectItemType = 'item'
      this.selectedItemTableData = selectedItems
      this.$nextTick(() => {
        this.detectType = detectType
        this.$refs.itemList.initItemList(detectType)
      })
    },
    handleClick(tab, event) {
      this.selectItemType = tab.name
      this.$nextTick(() => {
        if (this.selectItemType === 'group') {
          this.$refs.groupList.initGroupList(this.detectType)
        } else {
          this.$refs.itemList.initItemList(this.detectType)
        }
      })
    },
    //取消按钮操作
    close() {
      this.selectDeptItemShow = false
      this.$emit('closedDepItem', false)
    }
  }
}
</script>

<style scoped>
/deep/ .el-dialog__body,
.el-dialog__header {
  padding-top: 0px !important;
}

aside {
  padding: 5px;
}
</style>
