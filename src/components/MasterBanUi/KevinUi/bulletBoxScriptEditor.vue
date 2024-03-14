<template>
  <div>
    <el-drawer v-model="showDrawer" :append-to-body="true" :close-on-press-escape="false" :visible.sync="showDrawer"
               :with-header="false"
               :wrapperClosable="false" size="95%">
      <div class="scriptallarea">
        <div class="sa-left">
          <el-divider content-position="left">弹框手动执行事件管理</el-divider>
          <el-button size="small" style="margin-bottom: 4px;" type="primary"
                     @click="e_addClickEvents">新增手动执行脚本
          </el-button>
          <el-table :data="events" style="width: 100%">
            <el-table-column label="事件名称" prop="label">
            </el-table-column>
            <el-table-column label="事件脚本" prop="value" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" @click="e_editClickEvents(scope)">编辑脚本</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider content-position="left">弹框自动执行事件管理</el-divider>
          <el-button size="small" style="margin-bottom: 4px;" type="primary"
                     @click="e_addopenEvents">新增自动执行脚本
          </el-button>
          <el-table :data="openEvents" style="width: 100%">
            <el-table-column label="事件名称" prop="label">
            </el-table-column>
            <el-table-column label="事件脚本" prop="value" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" @click="e_editOpenEvents(scope)">编辑脚本</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider content-position="left">弹框底部按钮管理</el-divider>
          <el-table :data="bodyButtons" style="width: 100%">
            <el-table-column label="按钮名称" prop="label">
            </el-table-column>
            <el-table-column label="按钮类型" prop="type">
              <template v-slot="scope">
                <el-select v-model="scope.row.type">
                  <el-option label="主要按钮" value="primary"></el-option>
                  <el-option label="危险按钮" value="danger"></el-option>
                  <el-option label="信息按钮" value="warning"></el-option>
                  <el-option label="成功按钮" value="success"></el-option>
                </el-select>
              </template>

            </el-table-column>
            <el-table-column label="按钮事件" prop="events" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" @click="e_editBodyButtonScript(scope)">编辑脚本</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-row style="margin-top: 2rem;">

            <el-col :span="24">
              <el-button size="small" type="success" @click="save">保存</el-button>
              <el-button size="small" @click="e_close">取消</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="sa-right">
          <KevinEditor ref="KevinEditor" :options="options" @input="handleEditorInput"/>
        </div>
      </div>

    </el-drawer>
  </div>
</template>

<script lang="ts" setup>

import {getCurrentInstance, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

// 定义需要的类型接口
interface EventItem {
  label: string;
  value: string;
}

interface BodyButtonInfo {
  events: string;
}

interface BulletBoxParams {
  events: Record<string, string>;
  openEvents: Record<string, string>;
  anchorPoint: number;
  bodyButtons: BodyButtonInfo[];
}

const vm = getCurrentInstance()?.proxy as any;
const emit = defineEmits(['saveBulletBoxScript', 'close']);
let showDrawer = ref(false);
let options = reactive<{ language: 'javascript' }>({language: 'javascript'});
let codeValue = ref('');
let editTage = ref('');
let bodyButtons = ref<BodyButtonInfo[]>([]);
let activeName = ref('events');
let activeNames = ref<string[]>([]);
let anchorPoint = ref<number>(0);
let events = ref<EventItem[]>([]);
let editBodyButtonIndex = ref<number>(0);
let clickEventsTableIndex = ref<number>(0);
let openEventsTableIndex = ref<number>(0);
let openEvents = ref<EventItem[]>([]);
let currentCode = ref('');
let eventsName = ref('');
let key = ref('');

function handleEditorInput(value) {
  if (editTage.value == 'bodybuttonscript') {
    let bodyButtonInfo = bodyButtons.value[editBodyButtonIndex.value]
    bodyButtonInfo.events = formatCode(value)
    bodyButtons.value[editBodyButtonIndex.value] = bodyButtonInfo
  } else if (editTage.value == 'clickEvents') {
    let clickEventsInfo = events.value[clickEventsTableIndex.value]
    clickEventsInfo.value = formatCode(value)
    events.value[clickEventsTableIndex.value] = clickEventsInfo
  } else if (editTage.value == 'openEventsEdit') {
    let openEventsInfo = openEvents.value[openEventsTableIndex.value]
    openEventsInfo.value = formatCode(value)
    openEvents.value[openEventsTableIndex.value] = openEventsInfo
  }
}

function e_editOpenEvents(scope) {
  editTage.value = 'openEventsEdit'
  openEventsTableIndex.value = scope.$index
  vm.$refs.KevinEditor.changeEditor({value: scope.row.value});
}

function e_editClickEvents(scope) {
  editTage.value = 'clickEvents'
  clickEventsTableIndex.value = scope.$index
  vm.$refs.KevinEditor.changeEditor({value: scope.row.value});
}

function e_editBodyButtonScript(scope) {
  console.log('scope.row.events', scope.row.events)
  editTage.value = 'bodybuttonscript'
  editBodyButtonIndex.value = scope.$index
  vm.$refs.KevinEditor.changeEditor({value: scope.row.events});
}

function e_addopenEvents() {

  ElMessageBox.prompt('请输入脚本名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'test',
  }).then(({value}) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (regex.test(value)) {
      let labelList = openEvents.value.map(item => {
        return item.label
      })
      if (labelList.indexOf(value) == -1) {
        openEvents.value.push({label: value, value: "console.log('新增自动执行脚本')"})
      } else {
        ElMessage.error('请勿重复命名')
      }
    } else {
      ElMessage.error('输入内容必须符合javascript对象key的命名规范')
    }
  }).catch(_ => {

  })
}

function e_addClickEvents() {
  ElMessageBox.prompt('请输入脚本名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'test',
  }).then(({value}) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (regex.test(value)) {
      let labelList = events.value.map(item => {
        return item.label
      })
      if (labelList.indexOf(value) == -1) {
        events.value.push({label: value, value: "console.log('新增手动执行脚本')"})
      } else {
        ElMessage.error('请勿重复命名')
      }
    } else {
      ElMessage.error('输入内容必须符合javascript对象key的命名规范')
    }
  }).catch(_ => {

  })
}

function save() {
  let eventsObj = {}
  if (events.value.length != 0) {
    events.value.forEach(item => {
      eventsObj[item.label] = item.value
    })
  }
  let openEventsList = {}
  if (openEvents.value.length != 0) {
    openEvents.value.forEach(item => {
      openEventsList[item.label] = item.value
    })
  }
  let saveParams = {
    events: eventsObj,
    openEvents: openEventsList,
    anchorPoint: anchorPoint.value,
    bodyButtons: bodyButtons.value
  }
  console.log('saveParams', saveParams)
  emit('saveBulletBoxScript', saveParams)
}

function e_clickCurrentCode(eventsNameObj, codeObj, keyObj) {
  eventsName.value = eventsNameObj
  currentCode.value = codeObj
  key.value = keyObj
  vm.$refs.KevinEditor.changeEditor({value: codeObj});
}

function init(params: BulletBoxParams) {
  showDrawer.value = true;
  anchorPoint.value = params.anchorPoint;

  if (Object.keys(params.events).length === 0) {
    events.value = [];
  } else {
    events.value = Object.entries(params.events).map(([key, value]) => ({
      label: key,
      value,
    }));
  }

  if (Object.keys(params.openEvents).length === 0) {
    openEvents.value = [];
  } else {
    openEvents.value = Object.entries(params.openEvents).map(([key, value]) => ({
      label: key,
      value,
    }));
  }

  bodyButtons.value = params.bodyButtons;
  console.log(openEvents.value);
}

function handleClick() {
  activeNames.value = []
  eventsName.value = ''
  key.value = ''
  // this.$refs.KevinEditor.changeEditor({ value: '' });
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

function handleCollapseChange(activeName) {
  if (activeName.length > 0) {
    activeNames.value = activeName.slice(-1); // 只保留最后一个打开的项
  }
}

function e_close() {
  emit('close')
}
</script>
<style lang="less" scoped>
.scriptallarea {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  .sa-left {
    width: 30%;
    height: 100%;
    overflow: auto;
    padding: 0 1rem;
  }

  .sa-right {
    flex: 1;
    height: 100%;

    .remark {
      font-size: 16px;
      font-weight: bold;
      color: red;
      display: block;
      margin-bottom: 15px;
    }
  }

  .code-card__body {
    display: block;
    margin: 10px;
    cursor: pointer;
    padding: 10px;
    max-height: 13rem;
    border: 1px solid #ccc;
    border-radius: 1rem;
    overflow: hidden;
  }
}
</style>
