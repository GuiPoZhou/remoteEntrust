<template>
  <div>
    <el-drawer
        :append-to-body="true"
        :close-on-press-escape="false"
        :visible.sync="showDrawer"
        :with-header="false"
        :wrapperClosable="false"
        size="95%">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="新增表单" name="form">
          <el-tabs v-model="activeFormType">
            <el-tab-pane label="固定字段" name="fixed">
              <FixedForm :main-table-tags="this.mainTableTags" @confirm="e_confirmFixedAdd"/>
            </el-tab-pane>
            <el-tab-pane label="扩展字段" name="ext">

              <AddFormItem :codingSampleExtData="codingSampleExtData" :currentSelList="currentSelFormList"
                           :entrustSampleExtData="entrustSampleExtData" :formJSON="extDataList" :height="500"
                           addType="form"
                           @selFormItem="e_saveAddForm"/>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="新增Table" name="table">
          <AddFormItem :codingSampleExtData="codingSampleExtData" :currentSelList="currentTableUseList"
                       :entrustSampleExtData="entrustSampleExtData" :formJSON="extDataList" addType="table"
                       @selFormItem="e_addNewColumsByExt"/>
          <el-form ref="newTableInfo" :model="newTableInfo" class="demo-ruleForm" label-width="110px"
                   style="margin:20px 0">
            <el-row>
              <el-col :span="6">
                <el-form-item label="table所占长度" prop="col">
                  <el-input v-model="newTableInfo.col" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :rules="[{ required: true, message: '请输入table标签', trigger: 'blur' }]"
                              label="table标签"
                              prop="anchorPoint">
                  <el-input v-model="newTableInfo.anchorPoint"
                            placeholder="用于定位该table，进行数据操作"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="table title" prop="title">
                  <el-input v-model="newTableInfo.title"
                            placeholder="用于显示table上方的标题"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="table高度" prop="tableHeight">
                  <el-input v-model="newTableInfo.tableHeight"
                            placeholder="设置table的高度"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否加入子表" prop="haveChild">
                  <el-radio-group v-model="newTableInfo.haveChild" @input="e_checkIsNeedExpand">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-divider content-position="left">Table列管理（即可从上方列表选择添加，也可手动添加）</el-divider>
          <el-button size="mini" style="margin: 20px 0" type="success" @click="e_addNewColumn">添加新列
          </el-button>
          <el-table
              :data="newTableInfo.tableColumns"
              border
              style="width: 100%">
            <el-table-column
                align="center"
                label="列名(label)"
                prop="label"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.label"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="键名(prop)"
                prop="prop"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.prop"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="可输入插槽类型(editType)"
                prop="editType"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.editType" clearable>
                  <el-option label="span" value="span"></el-option>
                  <el-option label="el-input" value="el-input"></el-option>
                  <el-option label="el-input-number" value="el-input-number"></el-option>
                  <el-option label="el-link" value="el-link"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="ElLink事件脚本(linkEvents)"
                prop="linkEvents"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.linkEvents" type="textarea"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="插槽事件脚本(slotRenderEvents)"
                prop="slotRenderEvents"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.slotRenderEvents" type="textarea"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="键插槽标识(slotName)"
                prop="slotName"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.slotName"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="列类型(type)"
                prop="type"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.type"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="列对齐方式(align)"
                prop="align"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.align">
                  <el-option label="left" value="left"></el-option>
                  <el-option label="center" value="center"></el-option>
                  <el-option label="right" value="right"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="值类型（固定/扩展）(valueType)"
                prop="valueType"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.valueType">
                  <el-option label="fixed" value="fixed"></el-option>
                  <el-option label="ext" value="ext"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="e_deleteColumnslist(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider content-position="left">Table操作列功能按钮添加</el-divider>
          <el-button size="mini" style="margin: 20px 0" type="success" @click="e_addNewSlotsButton">
            添加功能按钮
          </el-button>

          <el-table
              :data="newTableInfo.tableSlotButtons"
              border
              style="width: 100%">
            <el-table-column
                align="center"
                label="功能名称"
                prop="label"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.label"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="是否隐藏"
                prop="isHide"
            >
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.isHide">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="功能脚本"
                prop="events"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.events" type="textarea"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="列类型"
                prop="type"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.type"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="e_deleteSlotsButton(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="newTableInfo.haveChild">
            <el-divider content-position="left">Table子表列定义</el-divider>
            <el-button size="mini" style="margin: 20px 0" type="success" @click="e_addChildTableColumns">
              添加子表新列
            </el-button>
            <el-table
                :data="newTableInfo.childTableColums"
                border
                style="width: 100%">
              <el-table-column
                  align="center"
                  label="列名(label)"
                  prop="label"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.label"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="键名(prop)"
                  prop="prop"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.prop"></el-input>
                </template>
              </el-table-column>

              <el-table-column
                  align="center"
                  label="键插槽标识(slotName)"
                  prop="slotName"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.slotName"></el-input>
                </template>
              </el-table-column>

              <el-table-column
                  align="center"
                  label="列对齐方式(align)"
                  prop="align"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.align">
                    <el-option label="left" value="left"></el-option>
                    <el-option label="center" value="center"></el-option>
                    <el-option label="right" value="right"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="值类型（固定/扩展）(valueType)"
                  prop="valueType"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.valueType">
                    <el-option label="fixed" value="fixed"></el-option>
                    <el-option label="ext" value="ext"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="e_deleteChildColumnslist(scope.$index)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增按钮" name="button">
          <el-button size="mini" type="primary" @click="e_addNewButton">新增按钮</el-button>
          <el-table
              :data="buttonInfo.formList"
              style="width: 100%">
            <el-table-column
                align="center"
                label="按钮名称(label)"
                prop="label"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.label"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="按钮标识(anchorPoint)"
                prop="label"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.anchorPoint"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="主题类型(type)"
                prop="type"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.type">
                  <el-option label="默认" value="-"></el-option>
                  <el-option label="primary" value="primary"></el-option>
                  <el-option label="success" value="success"></el-option>
                  <el-option label="warning" value="warning"></el-option>
                  <el-option label="danger" value="danger"></el-option>
                  <el-option label="info" value="info"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="按钮尺寸"
                prop="size"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.size">
                  <el-option label="默认" value="-"></el-option>
                  <el-option label="medium" value="medium"></el-option>
                  <el-option label="small" value="small"></el-option>
                  <el-option label="mini" value="mini"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="按钮唯一标签"
                prop="anchorPoint"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.anchorPoint"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="按钮事件脚本"
                prop="events"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.events" type="textarea"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="e_delteButton(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="editFor=='bulletBox'" label="弹框信息" name="bulletBox">
          <el-form ref="bulletBoxInfo" :model="bulletBoxInfo" class="demo-ruleForm" label-width="110px"
                   style="margin:20px 0">
            <el-row>
              <el-col :span="6">
                <el-form-item :rules="[{ required: true, message: '请输入弹框标题', trigger: 'blur' }]" label="弹框标题"
                              prop="title">
                  <el-input v-model="bulletBoxInfo.title"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :rules="[{ required: true, message: '请输入弹框唯一标记', trigger: 'blur' }]"
                              label="弹框唯一标记"
                              prop="anchorPoint">
                  <el-input v-model="bulletBoxInfo.anchorPoint"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">弹框底部按钮管理</el-divider>
            <el-button size="small" type="primary" @click="e_addBulletBottomButton">新增底部按钮</el-button>
            <el-table
                :data="bulletBoxInfo.bodyButtons" border
                style="width: 100%">
              <el-table-column
                  align="center"
                  label="按钮名称(label)"
                  prop="label"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.label"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="主题类型(type)"
                  prop="type"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type">
                    <el-option label="默认" value="-"></el-option>
                    <el-option label="primary" value="primary"></el-option>
                    <el-option label="success" value="success"></el-option>
                    <el-option label="warning" value="warning"></el-option>
                    <el-option label="danger" value="danger"></el-option>
                    <el-option label="info" value="info"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="按钮尺寸"
                  prop="size"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.size">
                    <el-option label="默认" value="-"></el-option>
                    <el-option label="medium" value="medium"></el-option>
                    <el-option label="small" value="small"></el-option>
                    <el-option label="mini" value="mini"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="按钮事件脚本"
                  prop="events"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.events" type="textarea"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="e_deleteBulletBottomButton(scope.$index)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
        <el-row style="margin:20px 0">
          <el-col :span="24">
            <el-button v-if="activeName !='form'" size="small" type="primary" @click="e_saveNewTable">
              保存
            </el-button>
            <el-button size="small" @click="e_close">关闭</el-button>
          </el-col>
        </el-row>
      </el-tabs>

    </el-drawer>
  </div>
</template>
<script>
import AddFormItem from "./addFormItem.vue";
import FixedForm from "./components/fixedForm.vue";

export default {
  components: {
    AddFormItem,
    FixedForm
  },
  props: {
    businessConfigId: {
      typeof: String,
      default: ''
    },
    // 为谁编辑  主单-mainForm  弹框-bulletBox
    editFor: {
      typeof: String,
      default: ''
    },
    mainTableTags: {
      typeof: String,
      default: 'ENTRUSTMENT_AGREEMENT'
    }
  },
  data() {
    return {
      showDrawer: false,
      activeFormType: 'fixed',
      activeName: "form",
      expandInfo: {
        "type": "expand",
        "width": "55",
        "fixed": "left",
        "slotName": "expand",
        "valueType": "fixed"
      },
      newTableInfo: {
        "col": 24,
        "component": "el-table",
        "haveChild": false,
        "isHide": false,
        "linkTarget": "",
        "anchorPoint": "",
        "tableHeight": "",
        "tableData": [],
        "tableColumns": [
          {
            "label": "选择",
            "prop": "selection",
            "type": "selection",
            "width": "55",
            "disabled": true,
            "checked": true,
            "fixed": "left"
          },
          // {
          //     "label": "序号",
          //     "prop": "index",
          //     "type": "index",
          //     "width": "55",
          //     "disabled": true,
          //     "checked": true,
          //     "fixed": "left"
          // },
          {
            "label": "操作",
            "checked": true,
            "align": "center",
            "slotName": "action",
            "fixed": "right",
            "disabled": true,
            "width": "220",
            "valueType": "fixed"
          }
        ],
        "tableSlotButtons": [],
        "tableButtons": [],
        "tableSelections": [],
        "childTableColums": [],
      },
      extDataList: [],//从表单实例获取的动态字段
      entrustSampleExtData: [],//委托样品扩展字段
      codingSampleExtData: [],//编码样品扩展字段
      currentSelFormList: [],
      currentTableUseList: [],
      buttonInfo: {
        col: 24,
        "component": "el-button",
        formList: []
      },
      bulletBoxInfo: {}
    }
  },
  methods: {
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 删除弹框底部按钮
     */
    e_deleteBulletBottomButton(index) {
      this.$confirm('确定删除该按钮吗？').then(() => {
        this.bulletBoxInfo.bodyButtons.splice(index, 1)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 新增弹框底部按钮
     */
    e_addBulletBottomButton() {
      let params = {
        label: '底部按钮',
        type: 'primary',
        events: ''
      }
      this.bulletBoxInfo.bodyButtons.push(params)
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 删除按钮
     */
    e_delteButton(index) {
      this.$confirm('确定删除该按钮？').then(() => {
        this.buttonInfo.formList.splice(index, 1)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 新增按钮
     */
    e_addNewButton() {
      let params = {
        label: '新按钮',
        type: 'primary',
        isHide: false,
        anchorPoint: '',
        size: "small"
      }
      this.buttonInfo.formList.push(params)
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 删除子表列
     */
    e_deleteChildColumnslist(index) {
      this.$confirm('确定删除子表的改列').then(() => {
        this.newTableInfo.childTableColums.splice(index, 1)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 添加子表列
     */
    e_addChildTableColumns() {
      let params = {
        "label": "子表列名",
        "prop": "",
        "checked": true,
        "align": "center",
        "slotName": "itemName",
        "valueType": "fixed"
      }
      this.newTableInfo.childTableColums.push(params)
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 查看是否是否需要子表
     */
    e_checkIsNeedExpand(e) {
      if (e) {
        this.newTableInfo.tableColumns.unshift(this.expandInfo)
      } else {
        this.newTableInfo.tableColumns.forEach((item, i) => {
          if (item.slotName == 'expand' || item.type == 'expand') {
            this.newTableInfo.tableColumns.splice(i, 1)
          }
        })
      }
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 删除操作列插槽按钮
     */
    e_deleteSlotsButton(index) {
      this.$confirm('确定删除该功能按钮以及包含的事件脚本？').then(() => {
        this.newTableInfo.tableSlotButtons.splice(index, 1)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 添加新的操作列插槽按钮
     */
    e_addNewSlotsButton() {
      let params = {
        label: '新按钮',
        isHide: false,
        events: ''
      }
      this.newTableInfo.tableSlotButtons.push(params)
    },
    /**
     * @author Coder
     * @date 2023/3/26
     * @des 确定固定字段的添加
     */
    e_confirmFixedAdd(form) {
      if (this.editFor == 'mainForm') {
        console.log('mainForm', form)
        this.blockInfo.formList.push(form)
        this.$emit('saveAddForm')
      } else {
        console.log('bufORM', form)
        this.bulletBoxInfo.formList.push(form)
        this.$emit('saveAddForm', this.bulletBoxInfo)
      }
    },

    /**
     * @author Coder
     * @date 2023/3/24
     * @des 保存
     */
    e_saveNewTable() {
      if (this.editFor == 'mainForm') {
        if (this.activeName == 'table') {
          this.$refs.newTableInfo.validate(v => {
            if (v) {
              this.blockInfo.formList.push(this.newTableInfo)
              this.$emit('saveAddForm')
            }
          })
        } else if (this.activeName == 'button') {
          console.log('this.buttonInfo', this.buttonInfo)
          this.blockInfo.formList.push(this.buttonInfo)
          this.$emit('saveAddForm')
        }

      } else {
        if (this.activeName == 'bulletBox') {
          this.$emit('saveAddForm', this.bulletBoxInfo)
        } else if (this.activeName == 'table') {
          this.bulletBoxInfo.formList.push(this.newTableInfo)
          this.$emit('saveAddForm', this.bulletBoxInfo)
        } else if (this.activeName == 'button') {
          this.bulletBoxInfo.formList.push(this.buttonInfo)
          this.$emit('saveAddForm', this.bulletBoxInfo)
        }

      }

    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 添加新的扩展字段成为新列
     */
    e_addNewColumsByExt(e) {
      let params = {
        ...e,
        valueType: 'ext',
        slotName: `${e.prop}`
      }
      this.newTableInfo.tableColumns.push(params)
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 删除列管理 行
     */
    e_deleteColumnslist(index) {
      this.$confirm('确定删除该行吗').then(() => {
        this.newTableInfo.tableColumns.splice(index, 1)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 添加行
     */
    e_addNewColumn() {
      this.newTableInfo.tableColumns.push({label: '新列'})
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 确定选择的form
     */
    e_saveAddForm(formInfo) {
      formInfo.anchorPoint = formInfo.prop
      formInfo.rules = []
      if (this.editFor == 'mainForm') {
        this.blockInfo.formList.push(formInfo)
        this.$emit('saveAddForm')
      } else {
        this.bulletBoxInfo.formList.push(formInfo)
        console.log('this.bulletBoxInfo', this.bulletBoxInfo)
        this.$emit('saveAddForm', this.bulletBoxInfo)
      }

    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 渲染
     */
    init(blockInfo) {
      this.currentSelFormList = JSON.parse(JSON.stringify(blockInfo.formList))
      this.blockInfo = blockInfo
      if (this.editFor == 'bulletBox') {
        this.bulletBoxInfo = JSON.parse(JSON.stringify(this.blockInfo))
      }
      this.showDrawer = true
      this.e_getExtDataList()
      this.e_getBindSampleAndSubSAample()
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 根据业务类型ID获取扩展字段
     */
    e_getExtDataList() {
      this.$net(`formLayout/getExDataConfig?id=${this.businessConfigId}`, 'get').then(re => {
        re.data.forEach(item => {
          item.col = 8
        })
        this.extDataList = re.data
      })
    },

    /**
     * @author Coder
     * @date 2023/4/13
     * @des 根据业务类型ID获取绑定改类型上面的委托样品和编码样品的扩展字段
     */
    e_getBindSampleAndSubSAample() {
      this.$net(`formLayout/getEntrustInfoAndCodingExDataConfig?id=${this.businessConfigId}`, 'get').then(re => {
        let entrustSampleExtData = [],
            codingSampleExtData = []
        entrustSampleExtData = re.data.entrustInfo
        codingSampleExtData = re.data.sampleCoding

        entrustSampleExtData.forEach(item => {
          item.col = 8
        })
        codingSampleExtData.forEach(item => {
          item.col = 8
        })
        this.entrustSampleExtData = entrustSampleExtData
        this.codingSampleExtData = codingSampleExtData

      })
    },
    e_close() {
      this.$emit('close')
    }
  }
}
</script>
