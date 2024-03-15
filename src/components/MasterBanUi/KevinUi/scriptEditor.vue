<template>
  <div>
    <el-drawer :append-to-body="true" :close-on-press-escape="false" :visible.sync="showDrawer" :with-header="false"
               :wrapperClosable="false" size="95%">
      <div class="scriptallarea">
        <div class="sa-left">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="自动执行脚本(events)" name="events">
              <el-button size="small" style="margin-bottom: 4px;" type="primary" @click="e_addAutoRun">新增自执行脚本
              </el-button>
              <el-collapse v-model="activeNames" @change="handleCollapseChange">
                <el-collapse-item v-for="(value, key) in events" :key="key" :name="key" :title="key">
                                    <span class="code-card__body" @click="e_clickCurrentCode('events', value, key)"> {{
                                        value
                                      }}</span>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="手动执行脚本(passiveEvents)" name="passiveEvents">
              <el-button size="small" style="margin-bottom: 4px;" type="primary" @click="e_addPassiveEvents">
                新增手动执行脚本
              </el-button>

              <el-collapse v-model="activeNames" @change="handleCollapseChange">
                <el-collapse-item v-for="(value, key) in passiveEvents" :key="key" :name="key" :title="key">
                                    <span class="code-card__body"
                                          @click="e_clickCurrentCode('passiveEvents', value, key)">
                                        {{ value }}</span>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>
          </el-tabs>

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
import {ref, reactive, getCurrentInstance} from 'vue'

const vm = getCurrentInstance()?.proxy as any
import {ElMessage, ElMessageBox} from 'element-plus'

const emit = defineEmits(['close', 'save'])

let showDrawer = ref(false)
let options = reactive({
  language: 'javascript'
})
let codeValue = ref('')
let activeName = ref('events')
let activeNames = ref([])
let editTabIndex = ref(0)
let events = reactive({})
let passiveEvents = reactive({})
let currentCode = ref('')
let eventsName = ref('')
let key = ref('')

function e_addPassiveEvents() {
  ElMessageBox.prompt('请输入脚本名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'test',
  }).then(({value}) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (regex.test(value)) {
      if (!passiveEvents.hasOwnProperty(value)) {
        passiveEvents[value] = "console.log('新增手动执行脚本')"
      } else {
        ElMessage.error('请勿重复命名')
      }

    } else {
      ElMessage.error('输入内容必须符合javascript对象key的命名规范')
    }
  }).catch(_ => {

  })
}

function e_addAutoRun() {
  ElMessageBox.prompt('请输入脚本名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'test',
  }).then(({value}) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (regex.test(value)) {
      if (!events.hasOwnProperty(value)) {
        events[value] = "console.log('新增自动执行脚本')"
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
  emit('save', {events, passiveEvents, tabIndex: editTabIndex.value})
}

function e_clickCurrentCode(eventsNameR, code, keyR) {
  eventsName.value = eventsNameR
  currentCode.value = code
  key.value = keyR
  vm.$refs.KevinEditor.changeEditor({value: code});
}

function init(codeJson, index) {
  let tabInfo = JSON.parse(JSON.stringify(codeJson))
  events = tabInfo.events
  passiveEvents = tabInfo.passiveEvents
  editTabIndex.value = index
  showDrawer.value = true
}

function handleClick() {
  activeNames.value = []
  eventsName.value = ''
  key.value = ''
  vm.$refs.KevinEditor.changeEditor({value: ''});
}

function handleEditorInput(value) {
  if (eventsName) {
    vm[`${eventsName.value}`][`${key.value}`] = formatCode(value)
  }
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

function handleCollapseChange(activeNamesR) {
  if (activeNames.length > 0) {
    activeNames.value = activeNamesR.slice(-1); // 只保留最后一个打开的项
  }
}

function e_close() {
  emit('close')
}

defineExpose({
  init
})
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
