<template>
  <div>
    <el-tabs v-model="showActiveName" style="margin-bottom: 5px" type="card" @tab-click="e_changeShow">
      <el-tab-pane label="单项目查询" name="first">
        <el-form ref="queryParams" :model="queryParams" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.itemName" clearable @clear="getItemList"
                          @keyup.enter.native="getItemList"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="方法编号">
                <el-input v-model="queryParams.methodCode" clearable @clear="getItemList"
                          @keyup.enter.native="getItemList"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="现场检测">
                <el-select v-model="queryParams.isScene" clearable @change="getItemList">
                  <el-option label="否" value="false"></el-option>
                  <el-option label="是" value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="多项目查询" name="second">
        <el-input v-model="searchItemNames" placeholder="输入项目名称，多个项目名称以中文顿号 '  、' 间隔"
                  type="textarea"
                  @blur="e_searchItemByMostName"></el-input>
      </el-tab-pane>
    </el-tabs>
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <span>查询范围：</span>
        <el-radio-group v-model="searchScope">
          <el-radio :label="-1">全部方法</el-radio>
          <el-radio :label="1">常用方法</el-radio>
          <el-radio :label="0">非常用方法</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <!--@select="parseSelectedItems" @select-all="parseSelectedAllItems"      -->
    <el-table ref="itemTable" v-loading="loading" :cell-style="{ padding: '2px' }" :data="itemTableData"
              :row-key="getRowKeys" :row-style="{ height: '20px' }"
              :tree-props="{children: 'voListZ'}" border element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-spinner="el-icon-loading"
              element-loading-text="拼命加载中" height="330"
              style="width: 100%" @selection-change="selectionChange">
      <el-table-column :reserve-selection="true" :selectable="checkSelect" type="selection" width="50">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          label="检测项目名称"
          prop="itemName"
      >
        <!--        <template scope="scope">-->
        <!--          {{scope.row.itemParentId == 0?scope.row.itemName:''}}-->
        <!--        </template>-->
      </el-table-column>
      <!-- <el-table-column
          prop="itemNameEn"
          label="项目英文名称"
          :show-overflow-tooltip="true"
      >
      </el-table-column> -->
      <!--      <el-table-column-->
      <!--        prop="itemName"-->
      <!--        label="子项目名称"-->
      <!--        :show-overflow-tooltip="true"-->
      <!--      >-->
      <!--        <template scope="scope">-->
      <!--          {{scope.row.itemParentId != 0?scope.row.itemName:''}}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
          :show-overflow-tooltip="true"
          label="方法编码"
          prop="itemCode"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="方法中文名称"
          prop="methodNameCn"
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
    <pagination v-show="total > 0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                :total="total" @pagination="paginationChange"/>
  </div>
</template>

<script>
import {getItemList} from '@/api/standardManagement/itemMethod'

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
        itemName: undefined,
        methodCode: undefined,
        //检测类别
        detectCategory: undefined,
        // 记录单类别
        recordType: undefined,
        isScene: undefined,
        pageNum: 1,
        pageSize: 10
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
          itemNameEn: item.itemNameEn,//检测项目名称
          itemId: item.id,//检测项目ID
          stroma: item.stroma,//检测部位
          subname: item.childMethodName,//检测方法
          itemParentId: item.itemParentId,//父类id
          subItemName: item.subItemNameCn,//子项目名称
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
      getItemList(this.queryParams).then((response) => {
        let arr = response.data.list;
        this.itemTableData = arr
        this.itemTableData.map(item => {
          item.itemId = item.id
          item.detectType = item.detectCategory
          item.itemCode = item.methodCode
          item.subname = item.childMethodName
          item.subItemName = item.subItemNameCn
          item.sceneDetect = Number(item.isScene)
          item.parentId = item.itemParentId
          item.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
          item.customerAppoint = 0
          if (item.voListZ !== null) {
            item.voListZ.map(items => {
              items.itemId = items.id
              items.parentId = items.itemParentId
              items.detectType = items.detectCategory
              items.customerAppoint = 0
              items.itemCode = items.methodCode
              items.subname = items.childMethodName
              items.subItemName = items.subItemNameCn
              items.sceneDetect = Number(items.isScene)
              items.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
            })
          }
        })
        //重新组装编码调整所需的数据结构  做到前后统一 排除之前后台接口返回参数值不统一的问题
        // arr.map(item => {
        //   let obj = {
        //     isSelect: false,
        //     detectType: item.detectCategory,
        //     customerAppoint: 0,//客户指定 0否 1是
        //     itemCode: item.methodCode,//方法编号
        //     itemName: item.itemNameCn,//检测项目名称
        //     itemId: item.id,//检测项目ID
        //     methodNameCn: item.methodNameCn,
        //     stroma: item.stroma,//检测部位
        //     subname: item.childMethodName,//检测方法
        //     itemParentId: item.itemParentId,//父类id
        //     subItemName: item.subItemNameCn,//子项目名称
        //     sceneDetect: Number(item.isScene),//是否现场检测 0否 1是
        //       children: item.voListZ,//是否现场检测 0否 1是
        //   }
        //   this.itemTableData.push(obj)
        // })

        // this.itemTableData = this.handleTree(this.itemTableData, "itemId", "itemParentId");
        console.log(this.itemTableData)
        this.total = response.data.total;
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
              if (row.itemParentId == 0) {
                this.$refs.itemTable.toggleRowSelection(row, true)
              }
            }
          })
          this.check()
        })
      })
    },
    async initItemList(detectType, recordType) {
      this.queryParams.detectCategory = detectType
      // this.queryParams.detectCategory = this.$store.state.BeiYuan.categoriesId ? this.$store.state.BeiYuan.categoriesId : detectType;
      this.$nextTick(() => {
        this.queryParams.recordType = recordType
        this.$forceUpdate()
      })
      await this.getItemList()
    },
    /**
     * @author Coder
     * @date 2023/3/31
     * @des 根据产品类别 查询检测项目
     */
    async useDetectSearch(detectType, recordType) {
      this.queryParams.detectCategory = detectType
      this.$nextTick(() => {
        this.queryParams.recordType = recordType
        this.$forceUpdate()
      })
      await this.getItemList()
    },
    checkSelect(row) {
      // if (row.voListZ == null) {
      //     row.voListZ = []
      // }
      if (row.itemParentId == 0) {
        return true
      } else {
        return false
      }
      // if (row.voListZ.length == 0) {
      //   return false
      // } else {
      //   return true
      // }
    },
    parseSelectedItems(selection, row) {
      this.itemTableData.map((itemA) => {
        selection.map((itemB) => {
          if (itemA.itemParentId === itemB.itemId) {
            selection.push(itemA)
          }
        })
      })
      let currentSelectedItems = JSON.parse(JSON.stringify(selection))
      this.$emit('parseSelectedItems', {
        currentSelectedItems: currentSelectedItems,
        allItem: this.itemTableData
      })
      this.check()
    },
    selectionChange(selection) {

      let currentSelectedItems = JSON.parse(JSON.stringify(selection))
      this.$emit('parseSelectedItems', {
        currentSelectedItems: currentSelectedItems,
        allItem: this.itemTableData
      })
      this.check()
    },
    parseSelectedAllItems(selection) {
      let currentSelectedItems = []
      if (selection.length) {
        currentSelectedItems = JSON.parse(JSON.stringify(this.itemTableData))
      }
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
      //    根据相同项的ID 进行取消勾选
      this.itemTableData.map(item => {
        if (sameItemIdList.indexOf(item.itemId) != -1) {
          item.isSelect = false
        } else {
          item.isSelect = true
        }
      })
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
