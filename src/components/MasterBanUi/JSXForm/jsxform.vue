<script>
import draggable from 'vuedraggable'
import AddFormItem from './addFormItem.vue'
import ArrayUtil from "../utils/arrayUtil";
import {digitUppercase} from '@/utils/index'
import {getToken} from '@/utils/auth'

Date.prototype.format = function (format) {
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
}
export default {
  name: 'ml-form',
  components: {
    draggable,
    AddFormItem
  },
  props: {
    form: {
      typeof: Object,
      default: () => {
      }
    },
    formJSON: {
      typeof: Array,
      default: () => {
      }
    },
    configId: {
      typeof: String,
      default: ''
    },
    group: {
      typeof: Object,
      default: () => {
      }
    },
    ghostClass: {
      typeof: String,
      default: 'ghost'
    },
    env: {
      typeof: 'String',
      default: 'add'
    },
  },
  data() {
    return {
      digitUppercase,
      layoutParamsList: [],
      showAddFormItem: false,
      getToken

    }
  },
  watch: {
    formJSON: {
      handler(newVal) {
        this.layoutParamsList = JSON.parse(JSON.stringify(newVal))
        this.e_checkEnv_EditDis()
      },
      immediate: true,
      deep: true,
    },

  },
  methods: {
    //处理编辑环境下部分字段不允许操作的情况
    e_checkEnv_EditDis() {
      if (this.layoutParamsList.length == 0) {
        return
      }
      //处理文件上传actions
      this.layoutParamsList.forEach(item => {
        if (item.component == 'el-upload' && item.options && item.options.action) {
          item.options.action = `${this.$BASE_API}${item.options.action}`
        }
      })
      // 处理编辑
      if (this.env == 'edit') {
        this.layoutParamsList.forEach(item => {
          if (item.options && item.options.disabledEdit == true) {
            item.disabled = true
          }
        })
      }
    },
    /**
     * @author Coder
     * @date 2023/1/4
     * @des 删除添加的扩展表单项
     */
    deleteExtItem(index) {
      this.$confirm('确定移除该扩展项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.layoutParamsList.splice(index, 1)
      })

    },
    addCloseIcon(index) {
      // 动态添加的dom 在jsx中应当使用箭头函数执行具体的执行方法 防止添加完dom后 方法自动执行
      if (!this.$store.state.system.closeDrag) {
        return (
            <div class="removearea">
              <el-popover
                  placement="bottom"
                  width="50"
                  trigger="hover"
              >
                <div class="buttonArea">
                  <el-button type="text" style="color:red" size="mini" onClick={() => this.deleteExtItem(index)}>删除
                  </el-button>
                  {/* <el-button type="text" size="mini">编辑</el-button> */}
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
    },
    jsxInput(params, label) {
      if (params.eventsList && params.eventsList.input) {
        let evnets = params.eventsList.input
        this.$emit('jsxInput', {evnets, label})
      }

    },
    // input 获取
    mlInputFocus(params, label) {

    },
    /**
     * @author Coder
     * @date 2023/2/9
     * @des el-autocomplete 返回输入建议的方法
     */
    autoCompleteSugg(events, queryString, callback) {
      this.$emit('autoCompleteSugg', {events, queryString, callback})
    },
    /**
     * @author Coder
     * @date 2023/2/9
     * @des autocomplete 选择事件
     */
    autoCompleteSelect(events, data) {
      this.$emit('autoCompleteSelect', {events, data})
    },
    /**
     * @author Coder
     * @date 2023/2/9
     * @des 渲染el-autocomplete
     */
    renderELAutocomplete(params, index) {
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-autocomplete
                    disabled={params.disabled} class="inline-input"
                    v-model={this.form[params['prop']]}
                    ref="asd"
                    trigger-on-focus
                    fetch-suggestions={(queryString, callback) => {
                      this.autoCompleteSugg(params.eventsList.fetchSuggestions, queryString, callback)
                    }}
                    onSelect={(data) => this.autoCompleteSelect(params.eventsList.select, data)}
                    placeholder="请输入内容"
                ></el-autocomplete>

              </el-form-item>
            </el-col>
        )
      } else {
        return (

            <el-col key={index} span={params.col}>
              {
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-autocomplete disabled={params.disabled} class="inline-input"
                                 v-model={this.form.extData[params['prop']]} ref="asd"
                                 trigger-on-focus fetch-suggestions={(queryString, callback) => {
                  this.autoCompleteSugg(params.eventsList.fetchSuggestions, queryString, callback)
                }}
                                 onSelect={(data) => this.autoCompleteSelect(params.eventsList.select, data)}
                                 placeholder="请输入内容"
                ></el-autocomplete>

              </el-form-item>
            </el-col>
        )
      }

    },
    /**
     * @author Coder
     * @date 2023/2/10
     * @des input 查询按钮点击事件
     */
    inputBtnClick(events) {
      this.$emit('inputSlotEvents', events)
    },
    /**
     * @author Coder
     * @date 2023/2/10
     * @des input 插槽按钮渲染以及事件
     */
    appenInputSlot(params) {
      return (
          <el-button slot="append" icon="el-icon-search" disabled={params.disabled}
                     onClick={() => this.inputBtnClick(params.options.slotBtnFunc)}></el-button>
      )
    },
    /**
     * @author Coder
     * @date 2023/1/3
     * @des 渲染el-input
     */
    renderELInput(params, index) {
      let type = 'text'
      params.component == 'textarea' ? type = 'textarea' : 'text'
      // 该函数以及下方出现对type进行判断的地方  是为了区分该formItem是属于固定的项还是扩展的项  fixed固定 ext扩展
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-input type={type} disabled={params.disabled} v-model={this.form[params['prop']]}
                          onBlur={() => {
                            params.eventsList && params.eventsList.blur ? eval(params.eventsList.blur) : ''
                          }}
                          onInput={() => {
                            this.jsxInput(params, this.form[params['prop']])
                          }}

                >
                  {
                    params.options && params.options.showSlotBtn ? this.appenInputSlot(params) : ''
                  }
                </el-input>
              </el-form-item>
            </el-col>
        )
      } else {
        return (
            <el-col key={index} span={params.col}>
              {
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-input type={type} disabled={params.disabled}
                          v-model={this.form.extData[params['prop']]}
                          onBlur={() => {
                            params.eventsList && params.eventsList.blur ? eval(params.eventsList.blur) : ''
                          }}
                          onInput={() => {
                            this.jsxInput(params, this.form[params['prop']])
                          }}
                >
                  {
                    params.options && params.options.showSlotBtn ? this.appenInputSlot(params) : ''
                  }
                </el-input>
              </el-form-item>
            </el-col>
        )
      }

    },
    /**
     * @author Coder
     * @date 2023/1/30
     * @des 渲染el-input-number
     */
    renderELInputNumber(params, index) {
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-input-number disabled={params.disabled} min={params.options.min}
                                 max={params.options.max}
                                 v-model={this.form[params['prop']]}
                ></el-input-number>
              </el-form-item>
            </el-col>
        )
      } else {
        return (
            <el-col key={index} span={params.col}>
              {
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-input-number disabled={params.disabled} min={params.options.min}
                                 max={params.options.max}
                                 v-model={this.form.extData[params['prop']]}
                ></el-input-number>
              </el-form-item>
            </el-col>
        )
      }
    },
    //selectchange
    el_selectChange(e) {
      this.$forceUpdate()
    },
    /**
     * @author Coder
     * @date 2023/1/3
     * @des 渲染el-select
     */
    renderELSelect(params, index) {
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-select disabled={params.disabled} v-model={this.form[params['prop']]}
                           placeholder={params.placeholder}
                           allow-create={params.options.allowCreate}
                           filterable={params.options.filterable}
                           onChange={(e) => {
                             this.el_selectChange(e)
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
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-select disabled={params.disabled} v-model={this.form.extData[params['prop']]}
                           placeholder={params.placeholder}
                           allow-create={params.options.allowCreate}
                           filterable={params.options.filterable}
                           onChange={(e) => {
                             this.el_selectChange(e)
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

    },
    //刷新datePicker
    updateDatePicker() {
      this.$forceUpdate()
    },
    /**
     * @author Coder
     * @date 2023/1/3
     * @des 渲染el-date-picker
     */
    renderELDatePicker(params, index) {
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
                                v-model={this.form[params['prop']]}
                                type={params.options.type ? params.options.type : 'date'}
                                placeholder="选择日期"
                                value-format={params.options.format ? params.options.format : 'yyyy-MM-dd'}
                                onInput={() => {
                                  this.updateDatePicker()
                                }}
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
        )
      } else {
        if (!this.form.extData[params['prop']] && params.options.showCurrentTime) {
          this.form.extData[params['prop']] = currentDate
        }
        return (
            <el-col key={index} span={params.col}>
              {
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-date-picker disabled={params.disabled}
                                v-model={this.form.extData[params['prop']]}
                                type={params.options.type ? params.options.type : 'date'}
                                placeholder="选择日期"
                                value-format={params.options.format ? params.options.format : 'yyyy-MM-dd'}
                                onInput={() => {
                                  this.updateDatePicker()
                                }}
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
        )
      }

    },
    /**
     * @author Coder
     * @date 2023/1/30
     * @des 渲染time选择
     */
    renderELTimeSelct(params, index) {
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-time-select disabled={params.disabled}
                                v-model={this.form[params['prop']]}
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
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-time-select disabled={params.disabled}
                                v-model={this.form.extData[params['prop']]}
                                placeholder="选择时间"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
        )
      }
    },
    /**
     * @author Coder
     * @date 2023/1/4
     * @des 渲染el-radio
     */
    renderELRadio(params, index) {
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-radio-group disabled={params.disabled} v-model={this.form[params['prop']]}>
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
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-radio-group disabled={params.disabled} v-model={this.form.extData[params['prop']]}>

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

    },
    /**
     * @author Coder
     * @date 2023/1/4
     * @des 渲染el-switch
     */
    renderELSwitch(params, index) {
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-switch disabled={params.disabled} v-model={this.form[params['prop']]}></el-switch>
              </el-form-item>
            </el-col>
        )
      } else {
        return (
            <el-col key={index} span={params.col}>
              {
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-switch disabled={params.disabled}
                           v-model={this.form.extData[params['prop']]}></el-switch>
              </el-form-item>
            </el-col>
        )
      }

    },
    /**
     * @author Coder
     * @date 2023/1/30
     * @des 渲染el-checkbox
     */
    renderELCheckBox(params, index) {
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-checkbox-group disabled={params.disabled} v-model={this.form[params['prop']]}>
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
                this.addCloseIcon(index)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-checkbox-group disabled={params.disabled} v-model={this.form.extData[params['prop']]}>

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

    },
    /**
     * @author Coder
     * @date 2023/2/10
     * @des 上传组件 上传
     */
    fileUploadOnSuccess(events, res, file) {
      this.$emit('fileUploadOnSuccess', {events, res, file})
    },
    /**
     * @author Coder
     * @date 2023/2/10
     * @des 上传组件 删除
     */
    filebeforeRemove(evnets, file) {
      this.$emit('filebeforeRemove', {evnets, file})
    },
    fileOnRemove(events, file, fileList) {
      // events(file, fileList)
      // this.$emit('fileOnRemove', {events, file, fileList})
    },
    fileBeforeUpload(events, file) {
      this.$emit('fileBeforeUpload', {events, file})
    },
    fielOnPreview(events, file) {
      this.$emit('fielOnPreview', {events, file})
    },
    e_showUploadFile(events, file) {

      this.$emit('showUploadFile', {events, file})
    },
    e_removeUploadFile(events, file, params) {
      var arrayUtil = new ArrayUtil()
      params.options.fujianList = arrayUtil.arrRemoveJson(params.options.fujianList, 'uid', file.uid)
      this.$emit('removeUploadFile', {events, file})
    },
    /**
     * @author Coder
     * @date 2023/2/10
     * @des 渲染上传文件
     */
    renderELUpload(params, index) {
      if (params.isHide == true) {
        return ('')
      }
      var scopedSlots = {
        file: (prop) => {
          return (
              <div>
                <span style="padding-right: 20px">{prop.file.name}</span>
                <el-button type="text" size="small" onClick={() => {
                  eval(params.events.downloadFile)
                }}>下载
                </el-button>
                {
                  !params.options.hideDelte ?
                      <el-button v-show={this.env != 'detail'} style="color:red" type="text" size="small"
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
    },
    async e_ShowAddFormItem() {
      if (this.configId == '') {
        this.$message.error('请配置业务参数ID')
        return
      }
      this.showAddFormItem = true
      let res = await this.$net(`formLayout/getExDataConfig?id=${this.configId}`, 'get')
      if (res.code == 200) {
        res.data.forEach(item => {
          item.col = 8
        })
        this.$nextTick(() => {
          this.$refs.AddFormItem.init(res.data, JSON.parse(JSON.stringify(this.layoutParamsList)))
        })
      } else {
        this.$message.error('请查看是否配置自定义表单')
      }


    },
    /**
     * @author Coder
     * @date 2023/1/4
     * @des 关闭新增表单项
     */
    e_closeAddFormItem() {
      this.showAddFormItem = false
    },
    /**
     * @author Coder
     * @date 2023/1/4
     * @des 确定选择的表单项
     */
    e_selFormItem(row) {
      this.showAddFormItem = false
      this.$emit('addExtForm', row)
    }
  },
  render(createElement, context) {
    return (
        <div class="container">
          <draggable list={this.formJSON} animation={340} group={this.group} ghostClass={this.ghostClass}
                     disabled={this.$store.state.system.closeDrag}
                     className="drag-wrapper"
          >
            {

              this.layoutParamsList.map((item, index) => {
                switch (item.component) {
                  case 'el-autocomplete':
                    return (this.renderELAutocomplete(item, index))
                    break
                  case 'el-input':
                  case 'input':
                  case 'textarea':
                    return (this.renderELInput(item, index))
                    break
                  case 'el-input-number':
                  case 'number':
                    return (this.renderELInputNumber(item, index))
                    break
                  case 'el-select':
                  case 'select':
                    return (this.renderELSelect(item, index))
                    break
                  case 'el-date-picker':
                  case 'date':
                    return (this.renderELDatePicker(item, index))
                    break
                  case 'el-time-select':
                  case 'time':
                    return (this.renderELTimeSelct(item, index))
                    break
                  case 'el-radio':
                  case 'radio':
                    return (this.renderELRadio(item, index))
                    break
                  case 'el-switch':
                    return (this.renderELSwitch(item, index))
                    break
                  case 'el-checkbox':
                  case 'checkbox':
                    return (this.renderELCheckBox(item, index))
                    break
                  case 'el-upload':
                    return (this.renderELUpload(item, index))
                    break;
                }
              })
            }
          </draggable>
          {
            // 加载新增表单项的弹框
            this.showAddFormItem ? <AddFormItem ref="AddFormItem" onClose={this.e_closeAddFormItem}
                                                onSelFormItem={this.e_selFormItem}
            /> : ''
          }
        </div>
    )
  }
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
