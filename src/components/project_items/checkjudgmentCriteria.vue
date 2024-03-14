<template>
  <div class="groupAdd">
    <ml-dialog ref="mlDialog" :dia-log-show="addShow" dia-log-title="指定判定标准" dia-log-width="60%"
               @close="close">
      <template slot="bologbody">
        <el-form ref="queryForm" :inline="true" :model="queryParams" :prop="queryParams" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="检测类别" prop="detectCategoryName">
                <el-input v-model="queryParams.detectCategoryName" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="9" style="padding-right: 10px">
            <div class="head-top">适用执行标准</div>
            <el-table ref="categoryList" :data="categoryList" :row-key="getRowKey" :tree-props="{children: 'childList'}" border
                      empty-text="暂无数据" style="width: 100%" @selection-change="selRow"
                      @select-all="selectAll">
              <el-table-column align="center" type="selection" width="60"></el-table-column>
              <el-table-column align="center" label="序号" type="index" width="60"></el-table-column>
              <el-table-column align="center" label="执行标准号" prop="standardCode"
                               show-overflow-tooltip></el-table-column>
              <el-table-column align="center" label="执行标准分类" prop="standardTypeName"
                               show-overflow-tooltip></el-table-column>
              <el-table-column align="center" label="执行标准名称" prop="standardName"
                               show-overflow-tooltip></el-table-column>
              <el-table-column align="center" label="产品分类" prop="standardCategoryName"
                               show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="15">
            <div class="flex head-top">
              <div>待制定检测项目列表</div>
            </div>
            <el-table ref="multipleTableDevice" :data="tableList" :row-class-name="tableRowClassName" border
                      style="width: 100%" @selection-change="projectChange">
              <el-table-column align="center" type="selection" width="55"/>
              <el-table-column label="序号" type="index" width="60"/>
              <el-table-column align="center" label="项目名称" prop="itemNameCn" show-overflow-tooltip/>
              <el-table-column align="center" label="方法编号" prop="methodCode" show-overflow-tooltip/>
              <el-table-column align="center" label="方法名称" prop="methodName" show-overflow-tooltip/>
              <el-table-column align="center" label="执行标准" prop="standardTypeName">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip :content="echoData(item.standardType,standardTypeList)" class="item" effect="dark"
                                placement="top-start">
                      <div>{{ echoData(item.standardType, standardTypeList) }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="产品分类" prop="standardCategoryName">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip :content="item.standardCategoryName" class="item" effect="dark"
                                placement="top-start">
                      <div>{{ item.standardCategoryName }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="执行标准号" prop="standardCode">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip :content="item.standardCode" class="item" effect="dark" placement="top-start">
                      <div>{{ item.standardCode }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="执行标准名称" prop="standardName">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip :content="item.standardName" class="item" effect="dark" placement="top-start">
                      <div>{{ item.standardName }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="判定标准要求" prop="limitDesc">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip :content="item.limitDesc" class="item" effect="dark" placement="top-start">
                      <div>{{ item.limitDesc }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </template>
      <template slot="bologfooter">
        <el-button size="small" type="cyan" @click="e_confrim">指定判定标准</el-button>
        <el-button size="small" type="primary" @click="clearResult">撤销判定标准</el-button>
        <el-button size="small" @click="close">关闭</el-button>
      </template>
    </ml-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      addShow: false,
      queryParams: {
        detectCategoryName: '',
        detectCategory: '',
      },
      categoryList: [],
      standardTypeList: this.getDictionary('STANDARD_TYPE'),
      tableList: [],
      biaozhunList: [],
      projectList: [],
      ids: [],
      newprojectList: [],
      standardTypeList: this.getDictionary('STANDARD_TYPE'),

    }
  },
  methods: {
    init(data, params) {
      this.addShow = true
      this.tableList = data
      this.queryParams.detectCategoryName = params.name
      this.queryParams.detectCategory = params.id
      this.getCategory()
    },
    getRowKey(row) {
      return row.id
    },
    // 获取执行标准
    async getCategory() {
      var categoryData = await this.$net('/decideStandard/v1/standardProduction/queryStandardProduction', 'get', {detectcategory: this.queryParams.detectCategory})
      this.categoryList = categoryData.data
      // this.getChildData(this.categoryList)
      // console.log(this.categoryList)
    },
    // 获取child数据
    getChildData(arr) {
      arr.map((item) => {
        this.allDataList.push(item)
        if (item.childList.length != 0) {
          this.getChildData(item.childList)
        }
      })
    },
    // 选择执行标准
    selRow(select) {
      this.biaozhunList = select
      var type = select.map(item => {
        return item.standardType
      })
      console.log(select)
      var str = type.join(",") + ",";
      for (let i = 0; i < type.length; i++) {
        if (str.replace(type[i] + ",", "").indexOf(type[i] + ",") > -1) {
          this.$message.error('不能选择重复的标准分类')
          break
        }
      }
      this.ids = select.map((item) => item.id)
    },
    // 选择检测项目
    projectChange(val) {
      this.projectList = val
      this.newprojectList = val
      console.log('检测项目', this.projectList)
    },
    selectAll(select) {
      // this.$refs.categoryList.clearSelection()
      // this.$nextTick(() => {
      //     if (this.selectList.length != 0) {
      //         this.allDataList.map((item) => {
      //             if (item.id == this.selectList[0].id) {
      //                 this.$refs.categoryList.toggleRowSelection(item, true)
      //             }
      //         })
      //     }
      // })
    },
    async e_confrim() {
      if (this.biaozhunList.length == 0) {
        this.$message.error('请选择适用执行标准')
        return
      }
      if (this.projectList.length == 0) {
        this.$message.error('请选择指定执行标准的检测项目')
        return
      }
      var type = this.biaozhunList.map(item => {
        return item.standardType
      })
      var num = 0
      var str = type.join(",") + ",";
      for (let i = 0; i < type.length; i++) {
        if (str.replace(type[i] + ",", "").indexOf(type[i] + ",") > -1) {
          num++
          break
        }
      }
      if (num !== 0) {
        this.$message.error('不能选择重复的标准分类')
        return
      }
      var proList = await this.$net(`/decideStandard/v1/standard/${this.ids.join(',')}/getItemLimits`, 'get')
      localStorage.setItem('ItemLimits', JSON.stringify(proList.data))
      var list = proList.data
      var arr = new Array;
      var newarr = new Array;
      for (var i in list) {
        var index = arr.indexOf(list[i].decideStandardId + '_' + list[i].itemName);
        if (index < 0) {
          arr.push(list[i].decideStandardId + '_' + list[i].itemName);
          newarr.push(list[i]);
        } else {
          if (newarr[index].limitDesc && list[i].limitDesc) {
            newarr[index].limitDesc = newarr[index].limitDesc + ',' + list[i].limitDesc
          } else if (!newarr[index].limitDesc && list[i].limitDesc) {
            newarr[index].limitDesc = list[i].limitDesc
          }
        }
      }
      newarr.map(items => {
        this.biaozhunList.map(itembiaozhun => {
          if (items.decideStandardId == itembiaozhun.decidestandardId) {
            items.standardTypeName = itembiaozhun.standardTypeName
            items.standardCode = itembiaozhun.standardCode
            items.standardName = itembiaozhun.standardName
            items.standardCategoryName = itembiaozhun.standardCategoryName
          }
        })
      })
      for (var i in this.projectList) {
        console.log(i);
        var newList = new Array;
        for (var x in newarr) {
          if (newarr[x].itemName == this.projectList[i].itemNameCn) {
            newList.push(newarr[x]);
          }
        }
        if (newarr) {
          this.$set(this.projectList[i], 'childList', newList)
        }

        var newList1 = new Array;
        var objs = JSON.parse(localStorage.getItem('ItemLimits'))
        for (var y in objs) {
          if (objs[y].itemName == this.projectList[i].itemNameCn) {
            newList1.push(objs[y]);
          }
        }
        if (objs) {
          this.$set(this.projectList[i], 'itemLimitList', newList1)
        }

      }
      var num = this.fn2(proList.data)
      let newData = this.projectList.filter(
          (a) => !num.some((b) => a.itemNameCn === b.itemName)
      )
      var arrs = []
      this.projectList.map(items => {
        num.map(item => {
          if (items.itemNameCn == item.itemName) {
            arrs.push(item)
          }
        })
      })
      console.log(arrs)
      var message = '<p>共指定检测项目' + this.projectList.length + '个，' +
          '其中' + arrs.length + '个成功，' +
          (this.projectList.length - arrs.length) + '个未成功。</p>'
      for (var i in newData) {
        message += '<p>' + newData[i].itemNameCn + '检测项目不存在判定限值</p>'
      }

      this.$alert(message, '指定说明', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        callback: action => {
        }
      });
      this.clearSelect()
    },
    // 添加上指定执行标准 改变行样式
    tableRowClassName({row, rowIndex}) {
      if (row.childList.length > 0) {
        return 'success-row'
      }
    },
    fn2(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.itemName) && res.set(arr.itemName, arr.itemName));
    },
    // 撤销执行标准
    clearResult() {
      if (this.projectList.length == 0) {
        this.$message.error('请选择待指定检测项目列表')
        return
      }
      for (var i = 0; i < this.projectList.length; i++) {
        this.projectList[i].childList = []
        this.projectList[i].itemLimitList = []
      }
      this.clearSelect()
    },
    // 清空选择的值
    clearSelect() {
      this.$refs.multipleTableDevice.clearSelection()
    },
    async close() {
      localStorage.removeItem('ItemLimits')
      this.$emit('close', this.tableList)
      this.projectList = []
      this.tableList = []
      this.biaozhunList = []
    }
  },
}
</script>
<style lang="less" scoped>
.head-top {
  background: #f0f0f0;
  padding: 8px 10px;
  justify-content: space-between;
  align-items: center;
}

/deep/ .success-row {
  background: #e0ffd1 !important;
}

.classFor {
  border-bottom: 1px solid #dfe6ec;
  width: 140%;
  margin-left: -12px;
  line-height: 30px;
}

.classFor:last-child {
  border-bottom: none
}

.classFor div {
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
