<template>
  <el-form ref="signleParamsRef" :model="signleParams" class="demo-ruleForm" label-width="120px">
    <el-row style="padding:1rem;">
      <el-col :span="6">
        <el-form-item
            :rules="[{ required: true, message: '此项若为空请在json编辑器中进行维护(且唯一)', trigger: 'blur' }]"
            label="单项唯一值"
            prop="anchorPoint">
          <el-input v-model="signleParams.anchorPoint" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="padding:0 2rem;">
      <el-col :span="24">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="主表格配置" name="first">
            <el-row>
              <el-col :span="12">
                <el-divider content-position="left">主表格操作列事件管理</el-divider>
                <el-button size="small" style="margin: 5px 0;" type="primary"
                           @click="e_addMainTableActionButton">新增主表操作列按钮
                </el-button>
                <el-collapse v-model="mainTableActionActive" @change="e_changeMainTableActionCool">
                  <el-collapse-item v-for="(value, index) in signleParams.tableSlotButtons" :key="index"
                                    :name="index" :title="value.label">
                                        <span class="code-card__body"
                                              @click="e_clickMainTableActionEvents('mainAction', value.events, index)">
                                            {{
                                            value.events
                                          }}</span>
                  </el-collapse-item>
                </el-collapse>
                <el-divider content-position="left">主表格数据列管理</el-divider>

                <el-table :data="signleParams.tableColumns" height="400" style="width: 100%">
                  <el-table-column label="列名" prop="label">
                  </el-table-column>
                  <el-table-column label="参数key" prop="prop">
                  </el-table-column>
                  <el-table-column label="参数类型" prop="valueType">
                  </el-table-column>
                  <el-table-column label="参数类型" prop="valueType">
                  </el-table-column>
                  <el-table-column label="渲染类型" prop="editType">
                  </el-table-column>
                  <el-table-column label="事件" prop="slotRenderEvents" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template v-slot="scope">
                      <el-button v-if="scope.row.slotRenderEvents" type="text"
                                 @click="e_editMainTableDataEvents(scope.row.slotRenderEvents, scope.$index)">编辑事件脚本
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-divider content-position="left">表格多选事件脚本管理</el-divider>
                <el-form-item label="表格多选事件脚本" prop="selectionChange">
                  <el-input v-model="signleParams.events.selectionChange" readonly>
                    <el-button slot="append" size="small" @click="e_editSelectionChange">编辑</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <KevinEditor ref="KevinEditorMain" :options="options" @input="e_inputMainTableEditor"/>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="signleParams.haveChild" label="子表格配置" name="second">
            <el-row>
              <el-col :span="12">
                <el-divider content-position="left">子表格操作列事件管理</el-divider>
                <el-button size="mini" style="margin: 5px 0;" type="primary"
                           @click="e_addSubTableActionButton">新增子表操作列按钮
                </el-button>
                <el-table :data="signleParams.childTableSlotButtons" height="400" style="width: 100%">
                  <el-table-column label="按钮名称" prop="label">
                  </el-table-column>
                  <el-table-column label="按钮是否禁用脚本" prop="actionStatusEvents" show-overflow-tooltip>
                    <template v-slot="scope">
                                            <span
                                                :style="{ color: subTableScriptEditType == 'subStatus' && subTableScriptIndex == scope.$index ? '#409EFF' : '#000' }">{{
                                                scope.row.actionStatusEvents
                                              }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="按钮事件脚本" prop="events" show-overflow-tooltip>
                    <template v-slot="scope">
                                            <span
                                                :style="{ color: subTableScriptEditType == 'subEvents' && subTableScriptIndex == scope.$index ? 'rebeccapurple' : '#000' }">{{
                                                scope.row.events
                                              }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template v-slot="scope">
                      <el-button type="text"
                                 @click="e_editSubStatusScript(scope.row.actionStatusEvents, scope.$index)">编辑状态脚本
                      </el-button>
                      <el-button style="color: rebeccapurple;" type="text"
                                 @click="e_editSubTableEvents(scope.row.events, scope.$index)">编辑事件脚本
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12">
                <KevinEditor v-if="activeName == 'second'" ref="KevinEditorSub" :options="options"
                             @input="e_inputSubTableEditor"/>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row style="padding: 2rem;">
      <el-col :span=24>
        <el-button size="small" type="primary" @click="e_save">保存</el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage} from "element-plus";
import {reactive, ref, getCurrentInstance} from "vue";

const vm = getCurrentInstance()?.proxy as any
const emit = defineEmits(['close', 'save'])
import {MainParams, MainTableActionButtonInfo} from './interfaceTs/tableEdit';

let options = reactive({
  language: 'javascript'
})
let activeName = ref('first')
let signleParams = reactive<MainParams>({
  haveChild: true,
  anchorPoint: '',
  tableSlotButtons: [],
  childTableSlotButtons: [],
  tableColumns: [], // 添加 tableColumns 属性
  events: {
    selectionChange: ''
  }, // 初始化 events 为一个空对象
});
let mainTableActionActive = ref([])
let mainEditorClickType = ref('')
let mainTableEditorActionIndex = ref(0)
let mainTableDataActive = ref([])
let mainTableDataEventsIndex = ref(0)
let subTableScriptEditType = ref('')
let subTableScriptIndex = ref(0)

function e_editSelectionChange() {
  mainEditorClickType.value = 'mainTableSelectionChange'
  // 检查 events 是否已定义
  if (signleParams.events) {
    vm.$refs.KevinEditorMain.changeEditor({value: signleParams.events.selectionChange || ''});
  } else {
    // 如果 events 未定义，可以设置一个默认空字符串
    vm.$refs.KevinEditorMain.changeEditor({value: ''});
  }
}

function e_addSubTableActionButton() {
  ElMessageBox.prompt('请输入要新增的子表操作列按钮名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'test',
  }).then(({value}) => {
    let obj = {
      label: value,
      isHide: false,
      actionStatusEvents: 'return false',
      events: `console.log('新增的操作列按钮-${value}')`
    }
    signleParams.childTableSlotButtons.push(obj)
  }).catch(_ => {

  })
}

function e_inputSubTableEditor(code) {
  let subButtonInfo = signleParams.childTableSlotButtons[subTableScriptIndex.value]
  if (subTableScriptEditType.value == 'subStatus') {
    subButtonInfo.actionStatusEvents = formatCode(code)
  } else if (subTableScriptEditType.value == 'subEvents') {
    subButtonInfo.events = formatCode(code)
  }
  signleParams.childTableSlotButtons[subTableScriptIndex.value] = subButtonInfo
}

function e_editSubTableEvents(code, index) {
  subTableScriptEditType.value = 'subEvents'
  subTableScriptIndex.value = index
  vm.$refs.KevinEditorSub.changeEditor({value: code})
}

function e_editSubStatusScript(code, index) {
  subTableScriptEditType.value = 'subStatus'
  subTableScriptIndex.value = index
  vm.$refs.KevinEditorSub.changeEditor({value: code})
}

function e_editMainTableDataEvents(code, index) {
  mainEditorClickType.value = 'mainData'
  mainTableDataEventsIndex.value = index
  vm.$refs.KevinEditorMain.changeEditor({value: code})
}

function e_addMainTableActionButton() {
  ElMessageBox.prompt('请输入要新增的操作列按钮名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'test',
  }).then(({value}) => {
    let obj: MainTableActionButtonInfo = {
      label: value,
      isHide: false,
      events: `console.log('新增的操作列按钮-${value}')`
    }
    signleParams.tableSlotButtons.push(obj)
  }).catch(_ => {

  })
}

function e_inputMainTableEditor(code: string) {
  if (mainEditorClickType.value === 'mainAction') {
    let actionInfo = signleParams.tableSlotButtons[mainTableEditorActionIndex.value];
    if (!actionInfo) {
      throw new Error('Invalid index in tableSlotButtons');
    }
    actionInfo.events = formatCode(code);
    signleParams.tableSlotButtons[mainTableEditorActionIndex.value] = actionInfo;
  } else if (mainEditorClickType.value === 'mainData') {
    let dataInfo = signleParams.tableColumns[mainTableDataEventsIndex.value];
    if (!dataInfo) {
      throw new Error('Invalid index in tableColumns');
    }
    dataInfo.slotRenderEvents = formatCode(code);
    signleParams.tableColumns[mainTableDataEventsIndex.value] = dataInfo;
  } else if (mainEditorClickType.value === 'mainTableSelectionChange') {
    if (signleParams.events) {
      signleParams.events.selectionChange = formatCode(code);
    } else {
      signleParams.events = {selectionChange: formatCode(code)};
    }
  }
}

function e_clickMainTableActionEvents(editType, code, index) {
  mainEditorClickType.value = editType
  mainTableEditorActionIndex.value = index
  vm.$refs.KevinEditorMain.changeEditor({value: code})
}

function e_changeMainTableDataCool(activeNames) {
  if (activeNames.length > 0) {
    mainTableDataActive.value = activeNames.slice(-1); // 只保留最后一个打开的项
  }
}

function e_changeMainTableActionCool(activeNames) {
  if (activeNames.length > 0) {
    mainTableActionActive.value = activeNames.slice(-1); // 只保留最后一个打开的项
  }
}

function handleClick() {
  mainEditorClickType.value = ''
  mainTableDataEventsIndex.value = -1
  subTableScriptEditType.value = ''
  subTableScriptIndex.value = -1
}

function appendParams(params) {
  console.log('params', params)
  signleParams = JSON.parse(JSON.stringify(params))
  if (!signleParams.events || !signleParams.events.selectionChange) {
    signleParams.events = {
      selectionChange: ''
    }
  }
}

function e_save() {
  vm.$refs.signleParamsRef.validate(v => {
    if (v) {
      console.log('this.signleParams', signleParams)
      emit('save', signleParams)
    }
  })
}

function e_close() {
  emit('close')
}

function formatCode(code) {
  // 去除开头和结尾的空白字符
  code = code.trim();

  // 在大括号前后添加空格
  code = code.replace(/\s*{\s*/g, ' { ').replace(/\s*}\s*/g, ' } ');

  // 在逗号前后添加空格
  code = code.replace(/,(\S)/g, ', $1');

  // 返回格式化后的代码
  return code;
}
</script>
