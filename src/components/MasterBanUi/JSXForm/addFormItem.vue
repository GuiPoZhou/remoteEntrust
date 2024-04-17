<template>
  <ml-dialog ref="BoDislog" :dia-log-show="showlog" dia-log-title="引入字段" dia-log-width="50%" @close="e_close">
    <template #bologbody>
      <el-table
          ref="formJSONTable"
          :data="formJSON"
          style="width: 100%">
        <el-table-column
            align="center"
            label="表单标题"
            prop="label"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="表单类型"
            prop="type"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="参数Key"
            prop="keyName"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="所占行"
            prop="col"
        >
          <template v-slot="scope">
            <el-input-number v-model="scope.row.col" :max="24" :min="1" size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
        >
          <template v-slot="scope">
            <el-button v-if="checkKey(scope.row.keyName)" text type="primary" @click="e_selFormItem(scope.row)">选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #bologfooter>
      <el-button size="small" @click="e_close">关闭</el-button>
    </template>
  </ml-dialog>
</template>
<script setup>
import {ElMessage} from 'element-plus'

const vm = getCurrentInstance.proxy()
defineComponent({
  name: "addFormItem"
})
let showlog = ref(false)
let formJSON = ref([])
let currentlist = ref([])
let configFormType = ref(['input', 'textarea', 'checkbox', 'radio', 'time', 'date', 'select', 'number'])
let paramsTypeList = ref([
  {
    label: '固定字段',
    value: 'fixed'
  },
  {
    label: '扩展字段',
    value: 'ext'
  }
])
const emit = defineEmits(['close', 'selFormItem'])

function e_changeParamsType(e, index) {
  let obj = formJSON.value[index]
  obj.paramsType = e
  formJSON.value[index] = obj
  nextTick(() => {
    vm.$refs.formJSONTable.doLayout()
    console.log(formJSON.value)
  })

}

function init(list, e) {
  formJSON.value = JSON.parse(JSON.stringify(list))
  showlog.value = true
  vm.$refs.BoDislog.isFullScreen = false
  currentlist.value = e

}

function checkKey(prop) {
  let propList = currentlist.value.map(item => {
    return item.prop
  })
  return propList.indexOf(prop) === -1;
}

function e_close() {
  emit('close')
}

function e_selFormItem(row) {
  if (configFormType.value.indexOf(row.type) === -1) {
    ElMessage.warning('暂不支持该类型')
    return
  }
  let obj = {
    label: row.label,
    prop: row.keyName,
    type: 'ext',
    col: row.col,
    component: row.type,
    options: row.options
  }
  emit('selFormItem', obj)
}
</script>

