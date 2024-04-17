<template>
  <div>
    <!--        <el-tabs v-model="showActiveName" type="card" @tab-click="e_changeShow" style="margin-bottom: 5px">-->
    <!--            <el-tab-pane label="单项目查询" name="first">-->
    <!--                <el-form ref="queryParams" :model="queryParams" label-width="80px" >-->
    <!--                    <el-row>-->
    <!--                        <el-col :span="8">-->
    <!--                            <el-form-item label="项目名称">-->
    <!--                                <el-input v-model="queryParams.itemName" clearable @clear="getItemList"  @keyup.enter.native="getItemList"></el-input>-->
    <!--                            </el-form-item>-->
    <!--                        </el-col>-->
    <!--                        <el-col :span="8">-->
    <!--                            <el-form-item label="方法编号">-->
    <!--                                <el-input v-model="queryParams.methodCode" clearable @clear="getItemList" @keyup.enter.native="getItemList"></el-input>-->
    <!--                            </el-form-item>-->
    <!--                        </el-col>-->
    <!--                        <el-col :span="8">-->
    <!--                            <el-form-item label="方法编号">-->
    <!--                                <el-select v-model="queryParams.isScene" clearable @change="getItemList">-->
    <!--                                    <el-option label="否" value="false"></el-option>-->
    <!--                                    <el-option label="是" value="true"></el-option>-->
    <!--                                </el-select>-->
    <!--                            </el-form-item>-->
    <!--                        </el-col>-->
    <!--                    </el-row>-->
    <!--                </el-form>-->
    <!--            </el-tab-pane>-->
    <!--            <el-tab-pane label="多项目查询" name="second">-->
    <!--                <el-input type="textarea" placeholder="输入项目名称，多个项目名称以中文顿号 '  、' 间隔"-->
    <!--                          v-model="searchItemNames"-->
    <!--                          @blur="e_searchItemByMostName"></el-input>-->
    <!--            </el-tab-pane>-->
    <!--        </el-tabs>-->
    <!--        <el-row style="margin-bottom: 10px">-->
    <!--            <el-col :span="24">-->
    <!--                <span>查询范围：</span>-->
    <!--                <el-radio-group v-model="searchScope">-->
    <!--                    <el-radio :label="-1">全部方法</el-radio>-->
    <!--                    <el-radio :label="1">常用方法</el-radio>-->
    <!--                    <el-radio :label="0">非常用方法</el-radio>-->
    <!--                </el-radio-group>-->
    <!--            </el-col>-->
    <!--        </el-row>-->
    <el-table ref="itemTable" v-loading="loading" :cell-style="{ padding: '2px' }" :data="itemTableData"
              :row-key="getRowKeys" :row-style="{ height: '20px' }"
              border element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"
              height="330" style="width: 100%" @selection-change="parseSelectedItems">
      <el-table-column :reserve-selection="true" :selectable="checkSelect" type="selection" width="50">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          label="检测项目名称"
          prop="itemName"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="方法编码"
          prop="itemCode"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="检测方法"
          prop="subname"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="检测部位"
          prop="stroma"
      />

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
    </el-table>
    <!--        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"-->
    <!--                    :limit.sync="queryParams.pageSize" @pagination="paginationChange"/>-->
  </div>
</template>

<script>
export default {
  name: 'itemList',
  data() {
    return {
      searchItemNames: '', //多项目查询
      searchScope: -1, //查询范围初始值
      showActiveName: 'first',
      // 遮罩层
      loading: false,
      itemTableData: [
        {
          sampleName: ''
        }
      ],
      queryParams: {
        methodId: '',
        detectCategory: undefined,
      },
      selectedItem: [],
      total: 0
    }
  },
  props: {
    selectedItems: Array,
    required: true
  },
  watch: {
    /*
     *@author: 焦政
     *@date: 2022-05-05 17:12:53
     *@description:根据查询范围进行查询
     */
    searchScope(val) {
      if (val != -1) {
        this.queryParams.commonMethod = this.searchScope
      } else {
        delete this.queryParams.commonMethod
      }
      if (this.showActiveName == 'first') {
        this.getItemList()
      } else {
        this.e_searchItemByMostName()
      }
    },
    showActiveName(val) {
      if (val == 'first') {
        this.getItemList()
      } else if (val == 'second' && this.searchItemNames) {
        this.e_searchItemByMostName()
      }
    }
  },
  methods: {
    clearBtn() {
      this.$refs.itemTable.clearSelection()
    },
    getRowKeys(row) {
      return row.id
    },
    // 切换分页效果
    paginationChange() {
      if (this.showActiveName === 'second') {
        this.e_searchItemByMostName()
      } else {
        this.getItemList()
      }
    },
    /*
     *@author: 焦政
     *@date: 2022-05-05 17:19:35
     *@description:多项目查询
     */
    async e_searchItemByMostName() {
      if (!this.searchItemNames) {
        this.getItemList()
        return
      }
      this.queryParams.itemMethodNames = this.searchItemNames
      let getRes = await this.$net(
          '/standard/v1/itemMethods/getItemsByNames',
          'get',
          this.queryParams
      )
      let arr = getRes.data.list;
      this.itemTableData = []
      //重新组装编码调整所需的数据结构  做到前后统一 排除之前后台接口返回参数值不统一的问题
      arr.map(item => {
        let obj = {
          isSelect: false,
          customerAppoint: 0,//客户指定 0否 1是
          itemCode: item.methodCode,//方法编号
          itemName: item.itemNameCn,//检测项目名称
          itemId: item.id,//检测项目ID
          stroma: item.stroma,//检测部位
          subname: item.childMethodName,//检测方法
          sceneDetect: Number(item.isScene),//是否现场检测 0否 1是
        }
        this.itemTableData.push(obj)
      })
      this.total = getRes.data.total;
      // 初始化勾选项
      this.$nextTick(() => {
        let rowIds = []
        for (var i = 0; i < this.selectedItems.length; i++) {
          rowIds.push(this.selectedItems[i]['itemId'])
        }
        this.$refs.itemTable.clearSelection()
        this.itemTableData.forEach((row) => {
          if (rowIds.indexOf(row.itemId) >= 0) {
            this.$refs.itemTable.toggleRowSelection(row, true)
          }
        })
        this.check()
      })
    },
    /*
     *@author: 焦政
     *@date: 2022-04-25 15:25:43
     *@description:切换 单项目查询 多项目查询
     */
    e_changeShow(e) {
      this.searchScope = -1
    },
    /*
     *@author: 焦政
     *@date: 2022-05-05 17:07:42
     *@description:切换查询范围
     */
    e_changeSearchScope() {
      this.getItemList()
    },
    getItemList() {
      this.$net('/standard/v1/itemMethods/getItemByMethodId', 'get', this.queryParams).then(response => {
        let arr = response.data;
        this.itemTableData = []
        //重新组装编码调整所需的数据结构  做到前后统一 排除之前后台接口返回参数值不统一的问题
        arr.map(item => {
          let obj = {
            isSelect: false,
            customerAppoint: 0,//客户指定 0否 1是
            itemCode: item.methodCode,//方法编号
            itemName: item.itemNameCn,//检测项目名称
            itemId: item.id,//检测项目ID
            stroma: item.stroma,//检测部位
            subname: item.childMethodName,//检测方法
            sceneDetect: Number(item.isScene),//是否现场检测 0否 1是
          }
          this.itemTableData.push(obj)
        })
        // 初始化勾选项
        this.$nextTick(() => {

          let rowIds = []
          for (var i = 0; i < this.selectedItems.length; i++) {
            //切记：贝源里面所有选择检测项目的地方，或者用到检测项目id地方 要用itemId
            rowIds.push(this.selectedItems[i]['itemId'])
          }
          this.$refs.itemTable.clearSelection()
          this.itemTableData.forEach((row) => {
            if (rowIds.indexOf(row.itemId) >= 0) {
              this.$refs.itemTable.toggleRowSelection(row, true)
            }
          })
          this.check()
        })
      })
    },
    async initItemList(methodId) {
      this.queryParams.detectCategory = this.$store.state.BeiYuan.detectType
      this.queryParams.methodId = methodId
      await this.getItemList()
    },
    checkSelect(row) {
      return row.isSelect == true
    },
    parseSelectedItems(e) {
      const res = new Map()
      e = e.filter((a) => !res.has(a.itemName) && res.set(a.itemName, 1))
      this.$nextTick(() => {
        if (e.length > 0) {
          // 全选时先选中
          this.itemTableData.map((item, index) => {
            if (item.itemId === e[0].itemId) {
              this.$refs.itemTable.toggleRowSelection(item, true)
            }
          })
          // 取消选中那些灰色选项
          this.itemTableData.map(item => {
            if (!item.isSelect) {
              this.$refs.itemTable.toggleRowSelection(item, false)
            }
          })
        }

      })
      let currentSelectedItems = JSON.parse(JSON.stringify(e))
      this.$emit('parseSelectedItems', {
        currentSelectedItems: currentSelectedItems,
        allItem: this.itemTableData
      })
      this.check()
    },
    check() {
      //已选项目名称列表
      let selItemNameList = this.selectedItems.map(item => {
        return item.itemName
      })
      //  获取已选项目ID
      let selItemIDList = this.selectedItems.map(item => {
        return item.itemId
      })
      //    获取未选项
      let notSelItemList = this.itemTableData.filter(item => {
        return selItemIDList.indexOf(item.itemId) == -1
      })
      //    比对未选项目列表中的项目名称 与已选项目项目名称进行比对 筛选出相同项目名称的ID
      let sameItemNameList = notSelItemList.filter(item => {
        return selItemNameList.indexOf(item.itemName) != -1
      })
      //    获取相同项的id
      let sameItemIdList = sameItemNameList.map(item => {
        return item.itemId
      })
      // console.log('sameItemIdList',sameItemIdList)
      //    根据相同项的ID 进行取消勾选
      this.itemTableData.map(item => {
        if (sameItemIdList.indexOf(item.itemId) != -1) {
          // console.log(item.itemNameCn)
          item.isSelect = false
        } else {
          item.isSelect = true
        }
      })
      // console.log('this.itemTableData',this.itemTableData)
    },
    /**
     * @author 焦政
     * @date 2022/7/23
     * @des 对底部全部检测项目列表 根据上方已选进行勾选
     */
    customerSel(itemId) {
      this.$nextTick(() => {
        if (this.selectedItems.length == 0) {
          this.$refs.itemTable.clearSelection()
          return
        }
        this.$nextTick(() => {
          this.itemTableData.map((item) => {
            if (itemId == item.itemId) {
              this.$refs.itemTable.toggleRowSelection(item, false);
            }
          });
        });
      });
    },
    unSelectItem(delItem) {
      //去掉勾选
      this.itemTableData.forEach((item) => {
        if (item.itemId === delItem.itemId) {
          this.$refs.itemTable.toggleRowSelection(item, false)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
