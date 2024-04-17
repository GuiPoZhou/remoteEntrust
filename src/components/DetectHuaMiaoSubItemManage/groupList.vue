<template>
  <el-container style="height: 420px; border: 1px solid #eee">
    <el-aside width="300px">
      <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
        <el-form-item label="类别名称" prop="detectName">
          <el-input v-model="groupName" style="width: 150px" @keydown.enter.native="getGroupList"></el-input>
        </el-form-item>
      </el-form>
      <el-table ref="groupTable" v-loading="loading" :cell-style="{ padding: '5px' }" :data="groupTableData"
                :row-style="{ height: '20px' }" border
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" height="230"
                style="width: 100%"
                @row-click="initGroupItemList">
        <el-table-column label="分组名称" prop="groupName"/>
      </el-table>
    </el-aside>
    <el-container style="margin-left: 10px">
      <div style="width: 100%">
        <el-table ref="groupItemTable" v-loading="loading" :cell-style="{ padding: '2px' }" :data="groupItemTableData"
                  :row-key="getRowKeys" :row-style="{ height: '20px' }"
                  :tree-props="{ children: 'voListZ' }"
                  border element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"
                  height="420" style="width: 100%" @select="parseSelectedItems"
                  @select-all="parseSelectedAllItems" @selection-change="selectionChange">
          <el-table-column :selectable="checkSelect" type="selection" width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="检测项目名称" prop="itemName">
            <template scope="scope">
              {{ scope.row.itemParentId == 0 ? scope.row.itemName : '' }}
            </template>
          </el-table-column>
          <!-- <el-table-column
              prop="itemNameEn"
              label="项目英文名称"
              :show-overflow-tooltip="true"
          >
          </el-table-column> -->
          <el-table-column :show-overflow-tooltip="true" label="子项目名称" prop="itemName">
            <template scope="scope">
              {{ scope.row.itemParentId != 0 ? scope.row.itemName : '' }}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="方法编码" prop="itemCode"/>
          <el-table-column :show-overflow-tooltip="true" label="方法中文名称" prop="methodNameCn"/>
          <el-table-column :show-overflow-tooltip="true" label="检测方法" prop="subname"/>
          <el-table-column :show-overflow-tooltip="true" label="检测部位" prop="stroma"/>
          <el-table-column label="执行标准号">
            <template v-slot="scope">
              <span>
                {{ getZXBZCode(scope.row.itemLimitList) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="执行标准名称">
            <template v-slot="scope">
              <span>
                {{ getZXBZName(scope.row.itemLimitList) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="执行标准要求">
            <template v-slot="scope">
              <span>
                {{ getZXBZYaoQiu(scope.row.itemLimitList) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="现场检测">
            <template v-slot="scope">
              <el-switch :active-value="1" :inactive-value="0" :value="scope.row.sceneDetect" active-color="#5B7BFA"
                         disabled inactive-color="#dadde5">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                    :total="total"
                    @pagination="getGroupItems"/>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import {getGroupList, getGroupItemList} from '@/api/envCheckScheme/config'

export default {
  name: 'groupList',
  data() {
    return {
      form: {},
      // 遮罩层
      loading: false,
      groupItemTableData: [],
      groupTableData: [],
      groupName: undefined,
      // 检测类别
      detectCategory: undefined,
      //记录单类别
      recordType: undefined,
      // 查询参数
      queryParams: {
        pageSize: 10000,
        pageNum: 1,
        //记录单类别
        recordType: undefined
      },
      groupId: undefined,
      total: 0
    }
  },
  props: {
    selectedItems: Array
  },
  methods: {
    getZXBZCode(list) {
      if (!list || list.length == 0) {
        return ''
      }
      let item = list.map((ilinfo) => {
        return ilinfo.standardCode;
      });
      return item.join('；');
    },
    getZXBZName(list) {
      if (!list || list.length == 0) {
        return ''
      }
      let item = list.map((ilinfo) => {
        return ilinfo.standardName;
      });
      return item.join('；');
    },
    getZXBZYaoQiu(list) {
      if (!list || list.length == 0) {
        return ''
      }
      let item = list.map((ilinfo) => {
        return ilinfo.limitDesc;
      });
      return item.join('；');
    },
    getRowKeys(row) {
      return row.id
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
      let notSelItemList = this.groupItemTableData.filter(item => {
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
      this.groupItemTableData.map(item => {
        if (sameItemIdList.indexOf(item.itemId) != -1) {
          item.isSelect = false
        } else {
          item.isSelect = true
        }
      })
    },
    initGroupList(detectType, recordType) {
      this.detectCategory = detectType
      this.queryParams.recordType = recordType
      this.getGroupList()
    },

    getGroupList() {
      var param = {}
      param.groupName = this.groupName
      getGroupList(param, this.detectCategory).then((response) => {
        this.groupTableData = response.data
        this.groupItemTableData = []
        return false
      })
    },

    initGroupItemList(row, column, event) {
      this.groupId = row.id
      this.getGroupItems()
    },

    getGroupItems() {
      this.groupItemTableData = []
      let params = {
        groupId: this.groupId,
        query: this.queryParams
      }
      getGroupItemList(params, this.detectCategory).then((res) => {
        let arr = res.data.list
        this.groupItemTableData = arr
        this.groupItemTableData.map(item => {
          item.itemId = item.id
          item.detectType = item.detectCategory
          item.itemCode = item.methodCode
          item.subname = item.childMethodName
          item.subItemName = item.subItemNameCn
          item.sceneDetect = Number(item.isScene)
          item.parentId = item.itemParentId
          item.customerAppoint = 0
          if (item.voListZ !== null) {
            item.voListZ.map(items => {
              items.itemId = items.id
              items.detectType = items.detectCategory
              items.customerAppoint = 0
              items.parentId = items.itemParentId
              items.itemCode = items.methodCode
              items.subname = items.childMethodName
              items.subItemName = items.subItemNameCn
              items.sceneDetect = Number(items.isScene)
            })
          }
        })
        //重新组装编码调整所需的数据结构  做到前后统一 排除之前后台接口返回参数值不统一的问题
        // arr.map(item => {
        //   let obj = {
        //     isSelect: false,
        //     customerAppoint: 0,//客户指定 0否 1是
        //     itemCode: item.methodCode,//方法编号
        //     itemName: item.itemNameCn,//检测项目名称
        //     itemNameEn: item.itemNameEn,//检测项目名称
        //     detectType: item.detectCategory,
        //     itemId: item.id,//检测项目ID
        //     stroma: item.stroma,//检测部位
        //     methodNameCn: item.methodNameCn,
        //     subname: item.childMethodName,//检测方法
        //     itemParentId: item.itemParentId,//父类id
        //     subItemName: item.subItemNameCn,//子项目名称
        //     sceneDetect: Number(item.isScene)//是否现场检测 0否 1是
        //   }
        //   this.groupItemTableData.push(obj)
        // })
        this.total = res.data.total
        // 初始化勾选项
        this.$nextTick(() => {
          let alreadySelectedItemIds = this.selectedItems.map(
              (item) => item.itemId
          )
          this.groupItemTableData.forEach((itemMethod) => {
            if (alreadySelectedItemIds.indexOf(itemMethod.itemId) >= 0) {
              this.$refs.groupItemTable.toggleRowSelection(itemMethod, true)
            } else {
              this.$refs.groupItemTable.toggleRowSelection(itemMethod, false)
            }
          })
        })
      })
    },
    checkSelect(row) {
      if (row.itemParentId == 0) {
        return true
      } else {
        return false
      }
    },
    parseSelectedItems(selection, row) {
      this.groupItemTableData.map((itemA) => {
        selection.map((itemB) => {
          if (itemA.itemParentId === itemB.itemId) {
            selection.push(itemA)
          }
        })
      })
      let currentSelectedItems = JSON.parse(JSON.stringify(selection))
      this.$emit('parseSelectedItems', {
        currentSelectedItems: currentSelectedItems,
        allItem: this.groupItemTableData
      })
      this.check()
    },
    selectionChange(selection) {

      let currentSelectedItems = JSON.parse(JSON.stringify(selection))
      this.$emit('parseSelectedItems', {
        currentSelectedItems: currentSelectedItems,
        allItem: this.groupItemTableData
      })
      this.check()
    },
    parseSelectedAllItems(selection) {
      let currentSelectedItems = []
      if (selection.length) {
        currentSelectedItems = JSON.parse(JSON.stringify(this.groupItemTableData))
      }
      this.$emit('parseSelectedItems', {
        currentSelectedItems: currentSelectedItems,
        allItem: this.groupItemTableData
      })
      this.check()
    },
    /**
     * @author 焦政
     * @date 2022/7/23
     * @des 对底部全部检测项目列表 根据上方已选进行勾选
     */
    customerSel(itemId) {
      this.$nextTick(() => {
        if (this.selectedItems.length == 0) {
          this.$refs.groupItemTable.clearSelection()
          return
        }
        this.$nextTick(() => {
          this.groupItemTableData.map((item) => {
            if (itemId == item.itemId) {
              this.$refs.groupItemTable.toggleRowSelection(item, false);
            }
          });
        });
      });
    },
    unSelectItem(delItem) {
      //去掉勾选
      this.groupItemTableData.forEach((item) => {
        if (item.itemId === delItem.itemId) {
          this.$refs.groupItemTable.toggleRowSelection(item, false)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-aside {
  padding: 5px !important;
  margin: 0px !important;
}

/*aside{*/
/*  padding:10px*/
/*}*/
</style>
