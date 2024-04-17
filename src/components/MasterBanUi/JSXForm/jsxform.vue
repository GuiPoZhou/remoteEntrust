<script lang="tsx" setup>
import {defineComponent, getCurrentInstance, nextTick, ref, watch} from "vue";
import draggable from 'vuedraggable'
import AddFormItem from './addFormItem.vue'
import ArrayUtil from "../utils/arrayUtil.js";
import {getToken} from '@/utils/auth.js'
import {ElMessageBox, ElMessage} from 'element-plus'
import {Search} from "@element-plus/icons-vue";
import {useStore} from "vuex";

const store = useStore()

const vm = getCurrentInstance()?.proxy
Date.prototype.format = function (format: string) {
  var args = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var i in args) {
    var n = args[i];
    if (new RegExp("(" + i + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
  }
  return format;
};

defineComponent({
  name: 'ml-form'
})
const props = defineProps({
  form: {
    type: Object,
    default: () => ({
      extData: {}
    })
  },
  formJSON: {
    type: Array,
    default: () => []
  },
  configId: {
    type: String,
    default: ''
  },
  group: {
    type: Object,
    default: () => ({})
  },
  ghostClass: {
    type: String,
    default: 'ghost'
  },
  env: {
    type: String,
    default: 'add'
  },
})

const emit = defineEmits([
  'jsxInput',
  'autoCompleteSugg',
  'autoCompleteSelect',
  'inputSlotEvents',
  'fileUploadOnSuccess',
  'filebeforeRemove',
  'fileBeforeUpload',
  'fielOnPreview',
  'showUploadFile',
  'removeUploadFile',
  'addExtForm',
])

let form = ref(props.form)
let formJSON = ref(props.formJSON)
let configId = ref(props.configId)
let group = ref(props.group)
let env = ref(props.env)
let ghostClass = ref(props.ghostClass)
let layoutParamsList = ref([])
let showAddFormItem = ref(false)

watch(props.formJSON, (newVal, oldVal) => {
  layoutParamsList.value = JSON.parse(JSON.stringify(newVal))
  e_checkEnv_EditDis()
}, {
  immediate: true,
  deep: true
})

//处理编辑环境下部分字段不允许操作的情况
function e_checkEnv_EditDis() {
  if (layoutParamsList.value.length == 0) {
    return
  }
  //处理文件上传actions
  layoutParamsList.value.forEach(item => {
    if (item.component == 'el-upload' && item.options && item.options.action) {
      item.options.action = `${vm.$BASE_API}${item.options.action}`
    }
  })
  // 处理编辑
  if (env.value == 'edit') {
    layoutParamsList.value.forEach(item => {
      if (item.options && item.options.disabledEdit == true) {
        item.disabled = true
      }
    })
  }
}

/**
 * @author Coder
 * @date 2023/1/4
 * @des 删除添加的扩展表单项
 */
function deleteExtItem(index) {
  ElMessageBox.confirm('确定移除该扩展项?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    layoutParamsList.value.splice(index, 1)
  })

}

function addCloseIcon(index) {
  // 动态添加的dom 在jsx中应当使用箭头函数执行具体的执行方法 防止添加完dom后 方法自动执行
  if (!store.state.system.closeDrag) {
    return (
        <div class="removearea">
          <el-popover
              placement="bottom"
              width="50"
              trigger="hover"
          >
            <div class="buttonArea">
              <el-button text type="primary" style="color:red" size="small" onClick={() => deleteExtItem(index)}>删除
              </el-button>
              {/* <el-button text type="primary" size="small">编辑</el-button> */}
            </div>
            <i
                slot="reference"
                class="el-icon-edit el-icon-setting"
                style="color:#00000;cursor:pointer;font-size:18px;"
            ></i>
          </el-popover>

        </div>
    )
  }
}

function jsxInput(params, label) {
  if (params.eventsList && params.eventsList.input) {
    let evnets = params.eventsList.input
    emit('jsxInput', {evnets, label})
  }
}

// input 获取
function mlInputFocus(params, label) {

}

/**
 * @author Coder
 * @date 2023/2/9
 * @des el-autocomplete 返回输入建议的方法
 */
function autoCompleteSugg(events, queryString, callback) {
  emit('autoCompleteSugg', {events, queryString, callback})
}

/**
 * @author Coder
 * @date 2023/2/9
 * @des autocomplete 选择事件
 */
function autoCompleteSelect(events, data) {
  emit('autoCompleteSelect', {events, data})
}

/**
 * @author Coder
 * @date 2023/2/9
 * @des 渲染el-autocomplete
 */
function renderELAutocomplete(params, index) {
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-autocomplete
                disabled={params.disabled} class="inline-input"
                v-model={form.value[params['prop']]}
                ref="asd"
                trigger-on-focus
                fetch-suggestions={(queryString, callback) => {
                  autoCompleteSugg(params.eventsList.fetchSuggestions, queryString, callback)
                }}
                onSelect={(data) => autoCompleteSelect(params.eventsList.select, data)}
                placeholder="请输入内容"
            ></el-autocomplete>

          </el-form-item>
        </el-col>
    )
  } else {
    return (

        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-autocomplete disabled={params.disabled} class="inline-input"
                             v-model={form.value.extData[params['prop']]} ref="asd"
                             trigger-on-focus fetch-suggestions={(queryString, callback) => {
              autoCompleteSugg(params.eventsList.fetchSuggestions, queryString, callback)
            }}
                             onSelect={(data) => autoCompleteSelect(params.eventsList.select, data)}
                             placeholder="请输入内容"
            ></el-autocomplete>

          </el-form-item>
        </el-col>
    )
  }

}

/**
 * @author Coder
 * @date 2023/2/10
 * @des input 查询按钮点击事件
 */
function inputBtnClick(events) {
  emit('inputSlotEvents', events)
}

/**
 * @author Coder
 * @date 2023/2/10
 * @des input 插槽按钮渲染以及事件
 */
function appenInputSlot(params) {
  return (
      <el-button icon="el-icon-search" disabled={params.disabled}
                 onClick={() => inputBtnClick(params.options.slotBtnFunc)}>
        <el-icon className="el-icon--search"><Search/></el-icon>
      </el-button>
  )
}


/**
 * @author Coder
 * @date 2023/1/3
 * @des 渲染el-input
 */
function renderELInput(params, index) {
  let type = 'text'
  params.component == 'textarea' ? type = 'textarea' : 'text'
  // 该函数以及下方出现对type进行判断的地方  是为了区分该formItem是属于固定的项还是扩展的项  fixed固定 ext扩展
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-input type={type} disabled={params.disabled} v-model={form.value[params['prop']]}
                      onBlur={() => {
                        params.eventsList && params.eventsList.blur ? eval(params.eventsList.blur) : ''
                      }}
                      onInput={() => {
                        jsxInput(params, form.value[params['prop']])
                      }}

            >
              {
                params.options && params.options.showSlotBtn ? appenInputSlot(params) : ''
              }
            </el-input>
          </el-form-item>
        </el-col>
    )
  } else {
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-input type={type} disabled={params.disabled}
                      v-model={form.value.extData[params['prop']]}
                      onBlur={() => {
                        params.eventsList && params.eventsList.blur ? eval(params.eventsList.blur) : ''
                      }}
                      onInput={() => {
                        jsxInput(params, form.value[params['prop']])
                      }}
            >
              {
                params.options && params.options.showSlotBtn ? appenInputSlot(params) : ''
              }
            </el-input>
          </el-form-item>
        </el-col>
    )
  }

}

/**
 * @author Coder
 * @date 2023/1/30
 * @des 渲染el-input-number
 */
function renderELInputNumber(params, index) {
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-input-number disabled={params.disabled} min={params.options.min}
                             max={params.options.max}
                             v-model={form.value[params['prop']]}
            ></el-input-number>
          </el-form-item>
        </el-col>
    )
  } else {
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-input-number disabled={params.disabled} min={params.options.min}
                             max={params.options.max}
                             v-model={form.value.extData[params['prop']]}
            ></el-input-number>
          </el-form-item>
        </el-col>
    )
  }
}

//selectchange
function el_selectChange(e) {
  vm.$forceUpdate()
}

/**
 * @author Coder
 * @date 2023/1/3
 * @des 渲染el-select
 */
function renderELSelect(params, index) {
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-select disabled={params.disabled} v-model={form.value[params['prop']]}
                       placeholder={params.placeholder}
                       allow-create={params.options.allowCreate}
                       filterable={params.options.filterable}
                       onChange={(e) => {
                         el_selectChange(e)
                       }}
            >
              {
                params.options.options.map((item, index) => {
                  return (
                      <el-option label={item.label}
                                 value={item.value}
                      ></el-option>
                  )
                })

              }
            </el-select>
          </el-form-item>
        </el-col>
    )
  } else {
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-select disabled={params.disabled} v-model={form.value.extData[params['prop']]}
                       placeholder={params.placeholder}
                       allow-create={params.options.allowCreate}
                       filterable={params.options.filterable}
                       onChange={(e) => {
                         el_selectChange(e)
                       }}
            >
              {
                params.options.options.map((item, index) => {
                  return (
                      <el-option label={item.label}
                                 value={item.value}
                      ></el-option>
                  )
                })
              }

            </el-select>
          </el-form-item>
        </el-col>
    )
  }

}

//刷新datePicker
function updateDatePicker() {
  vm.$forceUpdate()
}

/**
 * @author Coder
 * @date 2023/1/3
 * @des 渲染el-date-picker
 */
function renderELDatePicker(params, index) {
  if (!params.options) {
    params.options = {
      showCurrentTime: false,
      format: 'yyyy-MM-dd'
    }
  }
  let currentDate;
  if (params.options && params.options.showCurrentTime) {
    currentDate = new Date().format(params.options.format ? params.options.format : 'yyyy-MM-dd')
  }
  if (params.type == 'fixed') {
    if (!this.form[params['prop']] && params.options.showCurrentTime) {
      this.form[params['prop']] = currentDate
    }
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-date-picker disabled={params.disabled}
                            v-model={form.value[params['prop']]}
                            type={params.options.type ? params.options.type : 'date'}
                            placeholder="选择日期"
                            value-format={params.options.format ? params.options.format : 'yyyy-MM-dd'}
                            onInput={() => {
                              updateDatePicker()
                            }}
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
    )
  } else {
    if (!form.value.extData[params['prop']] && params.options.showCurrentTime) {
      form.value.extData[params['prop']] = currentDate
    }
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-date-picker disabled={params.disabled}
                            v-model={form.value.extData[params['prop']]}
                            type={params.options.type ? params.options.type : 'date'}
                            placeholder="选择日期"
                            value-format={params.options.format ? params.options.format : 'yyyy-MM-dd'}
                            onInput={() => {
                              updateDatePicker()
                            }}
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
    )
  }

}

/**
 * @author Coder
 * @date 2023/1/30
 * @des 渲染time选择
 */
function renderELTimeSelct(params, index) {
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-time-select disabled={params.disabled}
                            v-model={form.value[params['prop']]}
                            placeholder="选择时间"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
    )
  } else {
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-time-select disabled={params.disabled}
                            v-model={form.value.extData[params['prop']]}
                            placeholder="选择时间"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
    )
  }
}

/**
 * @author Coder
 * @date 2023/1/4
 * @des 渲染el-radio
 */
function renderELRadio(params, index) {
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-radio-group disabled={params.disabled} v-model={form.value[params['prop']]}>
              {
                params.options.options.map((item, index) => {
                  return (
                      <el-radio label={item.value}
                      >{item.label}</el-radio>
                  )
                })
              }
            </el-radio-group>
          </el-form-item>
        </el-col>
    )
  } else {
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-radio-group disabled={params.disabled} v-model={form.value.extData[params['prop']]}>

              {
                params.options.options.map((item, index) => {
                  return (
                      <el-radio label={item.value}
                      >{item.label}</el-radio>
                  )
                })
              }
            </el-radio-group>
          </el-form-item>
        </el-col>
    )
  }

}

/**
 * @author Coder
 * @date 2023/1/4
 * @des 渲染el-switch
 */
function renderELSwitch(params, index) {
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-switch disabled={params.disabled} v-model={form.value[params['prop']]}></el-switch>
          </el-form-item>
        </el-col>
    )
  } else {
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-switch disabled={params.disabled}
                       v-model={form.value.extData[params['prop']]}></el-switch>
          </el-form-item>
        </el-col>
    )
  }

}

/**
 * @author Coder
 * @date 2023/1/30
 * @des 渲染el-checkbox
 */
function renderELCheckBox(params, index) {
  if (params.type == 'fixed') {
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
            <el-checkbox-group disabled={params.disabled} v-model={form.value[params['prop']]}>
              {
                params.options.options.map((item, index) => {
                  return (
                      <el-checkbox label={item.value}
                      >{item.label}</el-checkbox>
                  )
                })
              }
            </el-checkbox-group>
          </el-form-item>
        </el-col>
    )
  } else {
    return (
        <el-col key={index} span={params.col}>
          {
            addCloseIcon(index)
          }
          <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
            <el-checkbox-group disabled={params.disabled} v-model={form.value.extData[params['prop']]}>

              {
                params.options.options.map((item, index) => {
                  return (
                      <el-checkbox label={item.value}
                      >{item.label}</el-checkbox>
                  )
                })
              }
            </el-checkbox-group>
          </el-form-item>
        </el-col>
    )
  }

}

/**
 * @author Coder
 * @date 2023/2/10
 * @des 上传组件 上传
 */
function fileUploadOnSuccess(events, res, file) {
  emit('fileUploadOnSuccess', {events, res, file})
}

/**
 * @author Coder
 * @date 2023/2/10
 * @des 上传组件 删除
 */
function filebeforeRemove(evnets, file) {
  emit('filebeforeRemove', {evnets, file})
}

function fileBeforeUpload(events, file) {
  emit('fileBeforeUpload', {events, file})
}

function fielOnPreview(events, file) {
  emit('fielOnPreview', {events, file})
}

function e_showUploadFile(events, file) {
  emit('showUploadFile', {events, file})
}

function e_removeUploadFile(events, file, params) {
  var arrayUtil = new ArrayUtil()
  params.options.fujianList = arrayUtil.arrRemoveJson(params.options.fujianList, 'uid', file.uid)
  emit('removeUploadFile', {events, file})
}

/**
 * @author Coder
 * @date 2023/2/10
 * @des 渲染上传文件
 */
function renderELUpload(params, index) {
  if (params.isHide == true) {
    return ('')
  }
  var scopedSlots = {
    file: (prop) => {
      return (
          <div>
            <span style="padding-right: 20px">{prop.file.name}</span>
            <el-button text type="primary" size="small" onClick={() => {
              eval(params.events.downloadFile)
            }}>下载
            </el-button>
            {
              !params.options.hideDelte ?
                  <el-button v-show={env.value != 'detail'} style="color:red" text type="primary" size="small"
                             onClick={() => {
                               eval(params.events.removeUploadFile)
                             }}>删除
                  </el-button> : ''
            }
          </div>
      )
    }
  }
  if (params.type == 'fixed') {
    let action = params.options.action + '?Authorization=' + getToken() + '&MenuId=' + localStorage.getItem('menuId')
    return (
        <el-col key={index} span={params.col}>
          <el-form-item label={params.label}>
            <el-upload action={action}
                       disabled={params.disabled}
                       accept={params.options.accept ? params.options.accept : '-'}
                       headers={params.options.headers}
                       drag={params.options.drag}
                       scopedSlots={scopedSlots}
                       before-upload={(file) => {
                         eval(params.events.beforeUpload)
                       }}
                // 这块需要尤其注意  在upload中 on-事件 是以属性来定义的
                       {...{
                         props: {
                           "on-success": (res, file) => {
                             eval(params.events.onSuccess)
                           }
                         }
                       }}
                       multiple={true}
                       showFileList={true}
                       file-list={params.options.fileList}
            >
              {
                params.options.drag ?
                    <div className="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> : ''
              }
              {
                !params.disabled ? <el-button type="primary" size="small">上传</el-button> : ''
              }

            </el-upload>
          </el-form-item>
        </el-col>
    )
  }
}

async function e_ShowAddFormItem() {
  if (configId.value == '') {
    ElMessage.error('请配置业务参数ID')
    return
  }
  showAddFormItem.value = true
  let res = await vm.$net(`formLayout/getExDataConfig?id=${configId.value}`, 'get')
  if (res.code == 200) {
    res.data.forEach(item => {
      item.col = 8
    })
    nextTick(() => {
      vm.$refs.AddFormItem.init(res.data, JSON.parse(JSON.stringify(layoutParamsList.value)))
    })
  } else {
    ElMessage.error('请查看是否配置自定义表单')
  }
}

/**
 * @author Coder
 * @date 2023/1/4
 * @des 关闭新增表单项
 */
function e_closeAddFormItem() {
  showAddFormItem.value = false
}

/**
 * @author Coder
 * @date 2023/1/4
 * @des 确定选择的表单项
 */
function e_selFormItem(row) {
  showAddFormItem.value = false
  emit('addExtForm', row)
}

function render(createElement, context) {
  return (
      <div class="container">
        <draggable list={formJSON.value} animation={340} group={group.value} ghostClass={ghostClass.value}
                   disabled={store.state.system.closeDrag}
                   className="drag-wrapper"
        >
          {

            this.layoutParamsList.map((item, index) => {
              switch (item.component) {
                case 'el-autocomplete':
                  return (renderELAutocomplete(item, index))
                  break
                case 'el-input':
                case 'input':
                case 'textarea':
                  return (renderELInput(item, index))
                  break
                case 'el-input-number':
                case 'number':
                  return (renderELInputNumber(item, index))
                  break
                case 'el-select':
                case 'select':
                  return (renderELSelect(item, index))
                  break
                case 'el-date-picker':
                case 'date':
                  return (renderELDatePicker(item, index))
                  break
                case 'el-time-select':
                case 'time':
                  return (renderELTimeSelct(item, index))
                  break
                case 'el-radio':
                case 'radio':
                  return (renderELRadio(item, index))
                  break
                case 'el-switch':
                  return (renderELSwitch(item, index))
                  break
                case 'el-checkbox':
                case 'checkbox':
                  return (renderELCheckBox(item, index))
                  break
                case 'el-upload':
                  return (renderELUpload(item, index))
                  break;
              }
            })
          }
        </draggable>
        {
          // 加载新增表单项的弹框
          showAddFormItem.value ? <AddFormItem ref="AddFormItem" onClose={e_closeAddFormItem}
                                               onSelFormItem={e_selFormItem}
          /> : ''
        }
      </div>
  )
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  background-color: #fff;
}

.el-row > div {
  width: 100%;
}

.el-col {
  position: relative;

  .deleteItemIcon {
    width: 15px;
    height: 15px;
    position: absolute;
    left: -4px;
    top: -2px;
    cursor: pointer;
  }
}

.ghost {
  background-color: #66b1ff !important;
}

.removearea {
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.4);
  position: absolute;
  z-index: 22;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.buttonArea {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-button + .el-button,
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 0;
    margin-top: 10px
  }
}
</style>
