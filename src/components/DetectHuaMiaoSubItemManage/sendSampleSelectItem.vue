<!--选择项目-->
<template>
  <el-dialog
      :append-to-body="true"
      :fullscreen="isFullScreen"
      :modal-append-to-body="false"
      :show-close="false"
      :visible.sync="sendSampleSelectItemShow"
      center
      height="700px"
      width="1000px"
      @close="close"
  >
    <div slot="title" class="dialog-title">
      <span class="topTilte">已选择项目（共{{ sampleNum }}个）</span>
      <div class="topRight">
        <!-- 最小化 -->
        <i
            v-if="isFullScreen"
            class="el-icon-minus rightIcon"
            @click="isFullScreen = false"
        ></i>
        <!-- 最大化 -->
        <i
            v-if="!isFullScreen"
            class="el-icon-full-screen rightIcon"
            @click="isFullScreen = true"
        ></i>
        <!-- 关闭 -->
        <i class="el-icon-close rightIcon" @click="close"></i>
      </div>
    </div>
    <!--
      <el-dialog
        :title="'已选择项目（共' + sampleNum + '个）'"
        :visible.sync="selectItemShow"
        append-to-body
        width="1000px"
        height="700px"
        center
        :before-close="close"
        :show-close="true"
        @close="close"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >-->
    <el-table
        ref="selectedItemTable"
        :cell-style="{ padding: '2px' }"
        :data="selectedItemTableData"
        :row-style="{ height: '20px' }"
        border
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        element-loading-text="拼命加载中"
        height="300"
        style="width: 100%"
    >
      <el-table-column
          :show-overflow-tooltip="true"
          label="项目名称"
          prop="itemNameCn"
      />
      <el-table-column label="方法编码" prop="methodCode"/>
      <el-table-column label="检测方法" prop="childMethodName"/>
      <el-table-column label="检测部位" prop="stroma"/>
      <!--			<el-table-column label="现场检测">-->
      <!--				<template v-slot="scope">-->
      <!--					<el-switch-->
      <!--						active-color="#5B7BFA"-->
      <!--						inactive-color="#dadde5"-->
      <!--						v-model="scope.row.isScene"-->
      <!--						:active-value="1"-->
      <!--						:inactive-value="0"-->
      <!--						disabled-->
      <!--					>-->
      <!--					</el-switch>-->
      <!--				</template>-->
      <!--			</el-table-column>-->
      <el-table-column label="客户指定" prop="customerAppoint">
        <template v-slot="scope">
          <el-switch
              v-model="scope.row.customerAppoint"
              :active-value="1"
              :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template v-slot="scope">
          <el-button
              icon="el-icon-delete"
              size="small"
              text type="primary"
              @click="deleteItem(scope.$index, scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 10px; height: 400px">
      <el-tabs
          :value="selectItemType"
          tab-position="left"
          type="border-card"
          @tab-click="handleClick"
      >
        <el-tab-pane label="按项目" name="item">
          <itemList
              ref="itemList"
              :selectedItems="selectedItemTableData"
              @parseSelectedItems="parseSelectedItems"
          />
        </el-tab-pane>

        <el-tab-pane label="按分组" name="group">
          <groupList
              ref="groupList"
              :selectedItems="selectedItemTableData"
              @parseSelectedItems="parseSelectedItems"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button center type="primary" @click="saveItem">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import itemList from './itemList'
import groupList from './groupList'

export default {
  name: 'selectItem',
  components: {
    itemList,
    groupList
  },
  computed: {
    //已选择项目样品数
    sampleNum() {
      return this.selectedItemTableData.length
    }
  },
  props: {
    sendSampleSelectItemShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //选中项目的方式 item:按项目选择 ，group:按组选择
      selectItemType: 'group',
      //检测类别
      detectType: this.$store.state.BeiYuan.detectType,
      //记录单类别
      recordType: undefined,
      selectedItemTableData: [],
      isFullScreen: true
    }
  },
  methods: {
    initItemList(detectType, selectedItems, recordType) {
      this.detectType = detectType
      this.selectItemType = 'item'
      this.selectedItemTableData = selectedItems
      this.$nextTick(() => {
        this.recordType = recordType
        this.$refs.itemList.initItemList(this.detectType, recordType)
      })
    },
    //保存选中项目
    saveItem() {
      this.selectedItemTableData.forEach((item) => {
        this.$set(
            item,
            'customerAppoint',
            item.customerAppoint === undefined ? false : item.customerAppoint
        )
      })
      this.selectedItemTableData.map(item => {
        if (!item.itemId) {
          item.itemId = item.id
        }
      })
      this.$emit('saveItem', this.selectedItemTableData)
      this.close()
    },
    //取消按钮操作
    close() {
      this.$emit('update:sendSampleSelectItemShow', false)
    },
    handleClick(tab, event) {
      this.selectItemType = tab.name
      this.$nextTick(() => {
        if (this.selectItemType === 'group') {
          this.$refs.groupList.initGroupList(this.detectType, this.recordType)
        } else {
          this.$refs.itemList.initItemList(this.detectType, this.recordType)
        }
      })
    },

    //操作未选中项目时解析已选中项目
    parseSelectedItems({currentSelectedItems, allItem}) {
      //所有项目列表--选中项目id
      let currentSelectedItemIds = currentSelectedItems.map(
          (itemMethod) => itemMethod.id
      )

      //所有项目列表中--项目id
      let allItemIds = allItem.map((itemMethod) => itemMethod.id)

      //所有项目列表--未选中 项目id
      let currentUnSelectedItemIds = allItemIds.filter((id) => {
        return currentSelectedItemIds.indexOf(id) < 0
      })

      //已选项目列表中 项目id
      let alreadySelectedItemIds = this.selectedItemTableData.map(
          (itemMethod) => itemMethod.id
      )

      //添加
      currentSelectedItems.forEach((itemMethod) => {
        if (alreadySelectedItemIds.indexOf(itemMethod.id) < 0) {
          this.selectedItemTableData.push(itemMethod)
        }
      })

      //删除未选中项
      for (let i = this.selectedItemTableData.length - 1; i >= 0; i--) {
        let itemId = this.selectedItemTableData[i].itemId
        if (currentUnSelectedItemIds.indexOf(itemId) >= 0) {
          this.selectedItemTableData.splice(i, 1)
        }
      }
    },
    //删除项目
    deleteItem(index, item) {
      //删除选重行
      this.selectedItemTableData.splice(index, 1)

      this.$nextTick(() => {
        if (this.selectItemType === 'group') {
          this.$refs.groupList.unSelectItem(item)
        } else {
          this.$refs.itemList.unSelectItem(item)
        }
      })
    }
  }
}
</script>

<style scoped></style>
