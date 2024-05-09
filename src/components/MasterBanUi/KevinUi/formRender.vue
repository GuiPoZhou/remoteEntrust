<script lang="jsx">
import {VueDraggableNext} from "vue-draggable-next";
import ArrayUtil from "./components/arrayUtil";
import kevinTable from './kevinTable.vue'
import kevinTreeTable from './kevinTreeTable.vue';
import {uploadFile} from '@/api/system/common'
import {getToken} from '@/utils/auth'
const MenuId = localStorage.getItem('menuId')
import Clipboard from 'clipboard'
import detaildocx from "@/components/MasterBanUi/KevinUi/components/detaildocx.vue";
import detailExcel from "@/components/MasterBanUi/KevinUi/components/detailExcel.vue";
import detailImg from "@/components/MasterBanUi/KevinUi/components/detailImg.vue";
import detailPdf from "@/components/MasterBanUi/KevinUi/components/detailPdf.vue";

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
    draggable: VueDraggableNext,
    kevinTable,
    kevinTreeTable,
    detaildocx,
    detailExcel,
    detailImg,
    detailPdf,
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
    blockInfo: {
      typeof: Object,
      default: () => {
      }
    },
    tabInfo: {
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
      layoutParamsList: [],
      showAddFormItem: false,
      getToken,
      componentsName: null,
      showComponent: false,
    }
  },
  created() {
    window.KevinRenderthis = this
  },
  methods: {

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
        this.formJSON.splice(index, 1)
      })

    },
    addCloseIcon(index, params) {
      // 动态添加的dom 在jsx中应当使用箭头函数执行具体的执行方法 防止添加完dom后 方法自动执行
      if (!this.$store.state.system.closeDrag) {
        return (
            <div class="removearea">
              <div class="rm-btn-area">
                <div class="rba-fun-icon" onClick={() => this.e_signleEdit(params)}>
                  <i class="el-icon-edit"></i>
                </div>

                <div class="rba-fun-icon rfi-delete" onClick={() => this.deleteExtItem(index)}>
                  <i class="el-icon-delete"></i>
                </div>

                {/* <el-button type="text" style="color:red" size="mini"
                                onClick={() => this.deleteExtItem(index)}>扩展字段删除
                            </el-button> */}
              </div>

            </div>
        )
      }
    },
    e_signleEdit(params) {
      this.$emit('signleEdit', params)
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
    e_copyParams() {
      var that = this
      var clipboard = new Clipboard('.copybox')
      clipboard.on('success', () => {
        that.$message.success('参数key复制成功')
        clipboard.destroy()
      })
    },
    // 输入性质表单的可视化编辑
    showEditEnterNode(index, params) {
      // 动态添加的dom 在jsx中应当使用箭头函数执行具体的执行方法 防止添加完dom后 方法自动执行
      if (!this.$store.state.system.closeDrag) {
        return (
            <div class={['removearea', params.isHide ? 'isHideSignle' : '']}>
              <div class="se_enter_info">
                <span class="s_e_i_tip copybox"
                      data-clipboard-text={params.type == 'fixed' ? `${params.prop}` : `extData.${params.prop}`}
                      onClick={() => {
                        this.e_copyParams()
                      }}>{params.type == 'fixed' ? `${params.prop}` : `extData.${params.prop}`}</span>
              </div>
              <div class="rm-btn-area">
                <div class="rba-fun-icon" onClick={() => this.e_signleEdit(params)}>
                  <i class="el-icon-edit"></i>
                </div>
                {
                  params.isHide ? <div class="rba-fun-icon" onClick={() => {
                    params.isHide = false;
                    this.$forceUpdate()
                  }}>
                    <i class="el-icon-view"></i>
                  </div> : <div class="rba-fun-icon" onClick={() => {
                    params.isHide = true;
                    this.$forceUpdate()
                  }}>
                    <i class="el-icon-circle-close"></i>
                  </div>
                }
                {
                  params.type == 'ext' ? <div class="rba-fun-icon rfi-delete" onClick={() => this.deleteExtItem(index)}>
                    <i class="el-icon-delete"></i>
                  </div> : ''
                }

              </div>

            </div>
        )
      }
    },

    /**
     * @author Coder
     * @date 2023/2/9
     * @des 渲染el-autocomplete
     */
    renderELAutocomplete(params, index) {
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-autocomplete
                    disabled={params.disabled} class="inline-input"
                    v-model={this.form[params['prop']]}
                    ref="asd"
                    trigger-on-focus
                    fetch-suggestions={(queryString, callback) => {
                      eval(params.events.fetchSuggestions)
                    }}
                    onSelect={(data) => eval(params.events.select)}
                    placeholder="请输入内容"
                ></el-autocomplete>

              </el-form-item>
            </el-col>
        )
      } else {
        return (

            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-autocomplete disabled={params.disabled} class="inline-input"
                                 v-model={this.form.extData[params['prop']]} ref="asd"
                                 trigger-on-focus
                                 fetch-suggestions={(queryString, callback) => {
                                   eval(params.events.fetchSuggestions)
                                 }}
                                 onSelect={(data) => eval(params.events.select)}
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
    appenInputSlot(options) {
      return (
          <el-button slot="append" icon="el-icon-search"
                     onClick={() => options.slotBtnFunc ? eval(options.slotBtnFunc) : ''}></el-button>
      )
    },
    /**
     * @author Coder
     * @date 2023/1/3
     * @des 渲染el-input
     */
    renderELInput(params, index) {
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }

      // 该函数以及下方出现对type进行判断的地方  是为了区分该formItem是属于固定的项还是扩展的项  fixed固定 ext扩展
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-input style={params.style} type={params.inputType ? params.inputType : 'text'}
                          readonly={params.readonly} disabled={params.disabled} v-model={this.form[params['prop']]}
                          placeholder={params.placeholder ? params.placeholder : ''}
                          onBlur={() => {
                            params.events && params.events.blur ? eval(params.events.blur) : ''
                          }}
                          onFocus={() => {
                            params.options && params.options.focus ? eval(params.options.focus) : ''
                          }}
                          nativeOnKeyup={(keyInfo) => {
                            params.events && params.events.enter ? eval(params.events.enter) : ''
                          }}


                >
                  {
                    !params.disabled && params.options && params.options.showSlotBtn ? this.appenInputSlot(params.options) : ''
                  }
                </el-input>
              </el-form-item>
            </el-col>
        )
      } else {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-input type={params.inputType ? params.inputType : 'text'} readonly={params.readonly}
                          disabled={params.disabled}
                          placeholder={params.placeholder ? params.placeholder : ''}
                          v-model={this.form.extData[params['prop']]}
                          onBlur={() => {
                            params.events && params.events.blur ? eval(params.events.blur) : ''
                          }}
                          onFocus={() => {
                            params.options && params.options.focus ? eval(params.options.focus) : ''
                          }}
                          nativeOnKeyup={(keyInfo) => {
                            params.events && params.events.enter ? eval(params.events.enter) : ''
                          }}

                >
                  {
                    params.options && params.options.showSlotBtn ? this.appenInputSlot(params.options) : ''
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
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-input-number disabled={params.disabled}
                                 min={params.options.min}
                                 readonly={params.readonly}
                                 max={params.options.max ? params.options.max : Infinity}
                                 precision={params.options.precision}
                                 placeholder={params.placeholder}
                                 v-model={this.form[params['prop']]}
                                 onChange={(newValue, oldValue) => {
                                   params.events && params.events.change ? eval(params.events.change) : ''
                                 }}
                ></el-input-number>
              </el-form-item>
            </el-col>
        )
      } else {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-input-number disabled={params.disabled}
                                 min={params.options.min}
                                 readonly={params.readonly}
                                 max={params.options.max ? params.options.max : Infinity}
                                 precision={params.options.precision}
                                 placeholder={params.placeholder}
                                 v-model={this.form.extData[params['prop']]}
                                 onChange={(newValue, oldValue) => {
                                   params.events && params.events.change ? eval(params.events.change) : ''
                                 }}
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
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-select disabled={params.disabled} v-model={this.form[params['prop']]}
                           placeholder={params.placeholder}
                           readonly={params.readonly}
                           multiple={params.multiple ? params.multiple : false}
                           allow-create={params.options.allowCreate}
                           filterable={params.options.filterable}
                           onChange={(e) => {
                             (params.events && params.events.change) ? eval(params.events.change) : ''
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
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-select disabled={params.disabled} v-model={this.form.extData[params['prop']]}
                           placeholder={params.placeholder}
                           readonly={params.readonly}
                           multiple={params.multiple ? params.multiple : false}
                           allow-create={params.options.allowCreate}
                           filterable={params.options.filterable}
                           onChange={(e) => {
                             (params.events && params.events.change) ? eval(params.events.change) : ''
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
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
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
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-date-picker disabled={params.disabled}
                                v-model={this.form[params['prop']]}
                                readonly={params.readonly}
                                type={params.options.type ? params.options.type : 'date'}
                                placeholder="选择日期"
                                value-format={params.options.format ? params.options.format : 'yyyy-MM-dd'}
                                format={params.options.value ? params.options.value : 'yyyy-MM-dd'}
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
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-date-picker disabled={params.disabled}
                                v-model={this.form.extData[params['prop']]}
                                readonly={params.readonly}
                                type={params.options.type ? params.options.type : 'date'}
                                placeholder="选择日期"
                                format={params.options.value ? params.options.value : 'yyyy-MM-dd'}
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
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
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
                this.showEditEnterNode(index, params)
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
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-radio-group disabled={params.disabled} v-model={this.form[params['prop']]}
                                onInput={(e) => {
                                  (params.events && params.events.input) ? eval(params.events.input) : ''
                                }}>
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
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-radio-group disabled={params.disabled} v-model={this.form.extData[params['prop']]}
                                onInput={(e) => {
                                  (params.events && params.events.input) ? eval(params.events.input) : ''
                                }}>

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
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-switch disabled={params.disabled} v-model={this.form[params['prop']]}></el-switch>
              </el-form-item>
            </el-col>
        )
      } else {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
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
      if (params.isHide == true && this.$store.state.system.closeDrag) {
        return ('')
      }
      if (params.type == 'fixed') {
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
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
                this.showEditEnterNode(index, params)
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
    // 渲染级联选择器
    renderELCascader(params, index) {
      if (params.hider == true) {
        return ('')
      }
      if (params.type == 'fixed') {
        let cc = {
          props: params.options.props
        }
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
                <el-cascader class="inline-input"
                             disabled={params.disabled}
                             options={params.options.options}
                             v-model={this.form[params['prop']]}
                             ref="asd"
                             {...{props: cc}}
                             clearable
                             filterable
                             props={params.options.props}
                             onChange={(e) => {
                               (params.events && params.events.change) ? eval(params.events.change) : ''
                             }}
                ></el-cascader>
              </el-form-item>
            </el-col>
        )
      } else {
        let cc = {
          props: params.options.props
        }
        return (
            <el-col key={index} span={params.col}>
              {
                this.showEditEnterNode(index, params)
              }
              <el-form-item label={params.label} prop={`extData.${params['prop']}`} rules={params.rules}>
                <el-cascader disabled={params.disabled} v-model={this.form.extData[params['prop']]}
                             placeholder={params.placeholder}
                             options={params.options.options}
                             clearable
                             {...{props: cc}}
                             filterable
                             onChange={(e) => {
                               (params.events && params.events.change) ? eval(params.events.change) : ''
                             }}
                >
                </el-cascader>
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
                  this.detailFile(params, prop)
                }}>查看
                </el-button>
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
        let debounceTimer = null
        let that = this
        return (
            <el-col key={index} span={params.col}>
              {
                this.addCloseIcon(index, params)
              }
              <el-form-item label={params.label}>
                <el-upload
                    action={this.$BASE_API + params.options.action + '?Authorization=' + getToken() + '&MenuId=' + localStorage.getItem('menuId')}
                    disabled={params.disabled} auto-upload={!!params.options.autoUpload}
                    accept={params.options.accept ? params.options.accept : '-'}
                    headers={params.options.headers}
                    drag={params.options.drag}
                    scopedSlots={scopedSlots}
                    ref={params.anchorPoint}
                    before-upload={(file) => {
                      eval(params.events.beforeUpload)
                    }}
                    // 这块需要尤其注意  在upload中 on-事件 是以属性来定义的
                    {...{
                      props: {
                        "on-success": (res, file) => {
                          eval(params.events.onSuccess)
                        },
                        "on-change": (file, fileList) => {
                          clearTimeout(debounceTimer);
                          debounceTimer = setTimeout(() => {
                            new Function('file', 'fileList', 'params', 'that', params.events.onChange)(file, fileList, params, that);
                          }, 1000); // 1000 毫秒的防抖时间
                        }
                      }
                    }}
                    multiple={!!params.options.multiple}
                    showFileList={true}
                    file-list={!params.options.multiple ? params.options.fileList : []}
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
              {
                params.options.fileList.length > 0 ? <el-col span={24}>
                  <el-table
                      show-header={false}
                      data={params.options.fileList}
                  >
                    <el-table-column label="文件名" prop="name"></el-table-column>
                    <el-table-column label="操作">
                      {
                        (scope, rowIndex) => (
                            <div>
                              <el-button type="text" size="small" onClick={() => {
                                this.detailFile2(params, scope.row)
                              }}>查看
                              </el-button>
                              <el-button type="text" size="small" onClick={() => {
                                new Function('file', params.events.downloadFile)(scope.row)
                              }}>下载
                              </el-button>
                              {
                                !params.options.hideDelte && this.env != 'detail' ?
                                    <el-button style="color:red" type="text" size="small"
                                               onClick={() => {
                                                 new Function('file', 'params', params.events.removeUploadFile)(scope.row, params)
                                               }}>删除
                                    </el-button> : ''
                              }
                            </div>
                        )
                      }
                    </el-table-column>
                  </el-table>
                </el-col> : ''
              }

            </el-col>
        )
      }
    },
    //查看文件操作
    detailFile(params, prop) {
      window.open(window.location.protocol + '/prod-api/' + prop.file.url, "_blank");
    },
    // 批量上传查看
    detailFile2(params, prop) {
      console.log(prop)
      const imgFileType = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"]
      if (!prop.filePath) {
        this.$message.warning(" 参数中缺少 filePath 文件路径");
        return;
      }
      let fileType = this.getFileExtension(prop.url);
      fileType = fileType.toLowerCase();
      if (fileType == "xlsx") {
        this.showExcel = true;
        this.$nextTick(() => {
          this.$refs.excelRef.init(prop);
        });
      } else if (fileType == "pdf") {
        this.showPdf = true;
        this.$nextTick(() => {
          this.$refs.pdfRef.init(prop);
        });
      } else if (fileType == "docx") {
        this.showDoc = true;
        this.$nextTick(() => {
          this.$refs.docRef.init(prop);
        });
      } else if (imgFileType.indexOf(fileType) != -1) {
        this.showImg = true;
        this.$nextTick(() => {
          console.log(this.$refs)
          this.$refs.imgRef.init(prop);
        });
      } else {
        window.location.href = window.globalEnv.VUE_APP_BASE_API
            + '/common/uploadFileDownload?fileName='
            + prop.fileName
            + '&filePath='
            + prop.filePath
            + '&Authorization='
            + getToken()
            + '&MenuId=' + localStorage.getItem('menuId');
      }
    },
    getFileExtension(url) {
      // 使用正则表达式来查找文件扩展名
      const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      const matches = url.match(regex);

      // 如果匹配成功，返回文件扩展名
      if (matches && matches.length > 1) {
        return matches[1];
      }

      // 如果没有找到扩展名，返回空字符串
      return "";
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
    },

    renderELTreeTable(item, index) {
      if (item.isHide == true) {
        return ('')
      }
      var scopedSlots = {}
      item.tableColumns.forEach((columnInfo, columnIndex) => {
        if (!columnInfo.valueType) {
          columnInfo.valueType = 'fixed'
        }
        if (columnInfo.slotName == 'action') {
          scopedSlots['action'] = (scope) => {
            return (
                <div>
                  {
                    item.tableSlotButtons.map(slotButtonInfo => {
                      if (!slotButtonInfo.isHide) {
                        return (
                            <el-button type="text"
                                       disabled={this.checkMainTableActionEvents(slotButtonInfo, item, columnInfo, scope)}
                                       onClick={() => {
                                         slotButtonInfo.events ? eval(slotButtonInfo.events) : ''
                                       }}>{slotButtonInfo.label}</el-button>
                        )
                      }

                    })
                  }
                </div>
            )
          }
        } else {
          if (columnInfo.editType) {
            scopedSlots[columnInfo['slotName']] = (scope) => {
              if (!scope.row.extData) {
                scope.row.extData = {}
              }
              switch (columnInfo.editType) {
                case 'span':
                  return (
                      <span>{eval(columnInfo.slotRenderEvents)}</span>
                  )
                  break;
                case 'el-input':
                  return (
                      columnInfo.valueType == 'fixed' ?
                          <el-input className="tableSlotInput"
                                    onBlur={() => {
                                      columnInfo.events && columnInfo.events.blur ? eval(columnInfo.events.blur) : ''
                                    }}
                                    onInput={() => {
                                      columnInfo.events && columnInfo.events.input ? eval(columnInfo.events.input) : ''
                                    }}
                                    key={columnIndex}
                                    disabled={columnInfo.disabled}
                                    v-model={scope.row[columnInfo['prop']]}></el-input>
                          :
                          <el-input class="tableSlotInput"
                                    onBlur={() => {
                                      columnInfo.events && columnInfo.events.blur ? eval(columnInfo.events.blur) : ''
                                    }}
                                    onInput={() => {
                                      columnInfo.events && columnInfo.events.input ? eval(columnInfo.events.input) : ''
                                    }}
                                    key={columnIndex}
                                    disabled={columnInfo.disabled}
                                    v-model={scope.row.extData[columnInfo['prop']]}></el-input>
                  )
                  break;
                case 'el-input-number':
                  return (
                      columnInfo.valueType == 'fixed' ?
                          <el-input-number className="tableSlotInput"
                                           key={columnIndex}
                                           min={columnInfo.min * 1}
                                           disabled={columnInfo.disabled || this.mainTableInputStatus(item, columnInfo, scope)}
                                           v-model={scope.row[columnInfo['prop']]}></el-input-number>
                          :
                          <el-input-number class="tableSlotInput"
                                           key={columnIndex}
                                           min={columnInfo.min * 1}
                                           disabled={columnInfo.disabled || this.mainTableInputStatus(item, columnInfo, scope)}
                                           v-model={scope.row.extData[columnInfo['prop']]}></el-input-number>
                  )
                  break;
                case 'el-link':
                  return (
                      columnInfo.valueType == 'fixed' ?
                          <el-link underline={false}
                                   type="primary" onClick={() => {
                            eval(columnInfo.linkEvents)
                          }}>{columnInfo.slotRenderEvents ? eval(columnInfo.slotRenderEvents) : scope.row[columnInfo['prop']]}</el-link>
                          :
                          <el-link underline={false}
                                   type="primary" onClick={() => {
                            eval(columnInfo.linkEvents)
                          }}>{columnInfo.slotRenderEvents ? eval(columnInfo.slotRenderEvents) : scope.row.extData[columnInfo['prop']]}</el-link>
                  )
                  break;
                case 'el-select':
                case 'select':
                  return (

                      this.renderTableSelect(columnInfo, scope)

                  )
                  break;
                case "kevin-table-tags":
                  return (
                      this.renderKevinTableTags(columnInfo, scope, item)
                  )
                  break;
              }
            }
          } else {
            scopedSlots[columnInfo['slotName']] = (scope) => {
              if (!scope.row.extData) {
                scope.row.extData = {}
              }
              return (
                  columnInfo.valueType == 'fixed' ?
                      <span>{scope.row[columnInfo.prop]}</span> :
                      <span>{scope.row.extData[columnInfo.prop]}</span>
              )
            }
          }

        }

      })

      return (
          <el-col span={item.col}>
            {
              this.renderTableEditArea(item)
            }
            <kevinTreeTable tree-props={item.treeProps} row-key={item.rowKey} ref={item.anchorPoint} setColumn={true}
                            key={item.anchorPoint}
                            height={item.height ? item.height : '300'}
                            columns={item.tableColumns}
                            data={item.tableData}
                            checkSelectable={item.checkSelectable}
                            style="width:100%;" border
                            scopedSlots={scopedSlots}
                            onSelectionChange={(e) => {
                              item.events && item.events.selectionChange ? eval(item.events.selectionChange) : item.tableSelections = e
                            }}/>

          </el-col>
      )
    },
    selectable(columnInfo) {
      return (row) => {
        const selectionFunction = new Function('row', columnInfo.typeSelectionCode);
        return selectionFunction(row);
      };
    },

    /**
     * @author Coder
     * @date 2023/3/22
     * @des 渲染el-table
     */
    renderELTable(item, index) {
      if (item.isHide == true) {
        return ('')
      }
      /**
       * @author Coder
       * @date 2023/3/21
       * @des eltable 插槽定义
       */
      var scopedSlots = {}
      item.tableColumns.forEach((columnInfo, columnIndex) => {
        if (!columnInfo.valueType) {
          columnInfo.valueType = 'fixed'
        }
        if (columnInfo.type == 'selection' && columnInfo.typeSelectionCode) {
          columnInfo.selectable = this.selectable(columnInfo)

        }
        if (columnInfo.slotName == 'action') {
          scopedSlots['action'] = (scope) => {
            return (
                <div>
                  {
                    item.tableSlotButtons.map(slotButtonInfo => {
                      if (!slotButtonInfo.isHide) {
                        if (!this.checkMainTableActionEvents(slotButtonInfo, item, columnInfo, scope)) {
                          return (
                              <el-button type="text"
                                         onClick={() => {
                                           slotButtonInfo.events ? eval(slotButtonInfo.events) : ''
                                         }}>{slotButtonInfo.label}</el-button>
                          )
                        }

                      }

                    })
                  }
                </div>
            )
          }
        } else if (columnInfo.slotName == 'index') {
          scopedSlots['index'] = (scope) => {
            return (
                <div>
                  {++scope.$index}
                </div>
            )
          }
        } else {
          if (columnInfo.editType) {
            scopedSlots[columnInfo['slotName']] = (scope) => {
              if (!scope.row.extData) {
                scope.row.extData = {}
              }
              switch (columnInfo.editType) {
                case 'span':
                  return (
                      <span>{eval(columnInfo.slotRenderEvents)}</span>
                  )
                  break;
                case 'el-input':
                  return (
                      columnInfo.valueType == 'fixed' ?
                          <el-input className="tableSlotInput"
                                    onBlur={() => {
                                      columnInfo.events && columnInfo.events.blur ? eval(columnInfo.events.blur) : ''
                                    }}
                                    onFocus={() => {
                                      columnInfo.events && columnInfo.events.focus ? eval(columnInfo.events.focus) : ''
                                    }}
                                    onInput={(value) => {
                                      columnInfo.events && columnInfo.events.input ? eval(columnInfo.events.input) : ''
                                    }}
                                    nativeOnKeyup={(keyInfo) => {
                                      if (keyInfo.keyCode == 13) {
                                        columnInfo.events && columnInfo.events.enter ? new Function('keyInfo', eval(columnInfo.events.enter))(keyInfo) : ''
                                      }
                                    }}
                                    key={columnIndex}
                                    disabled={columnInfo.disabled}
                                    v-model={scope.row[columnInfo['prop']]}></el-input>
                          :
                          <el-input class="tableSlotInput"
                                    onBlur={() => {
                                      columnInfo.events && columnInfo.events.blur ? eval(columnInfo.events.blur) : ''
                                    }}
                                    onFocus={() => {
                                      columnInfo.events && columnInfo.events.focus ? eval(columnInfo.events.focus) : ''
                                    }}
                                    onInput={(value) => {
                                      columnInfo.events && columnInfo.events.input ? eval(columnInfo.events.input) : ''
                                    }}
                                    nativeOnKeyup={(keyInfo) => {
                                      columnInfo.events && columnInfo.events.enter ? eval(columnInfo.events.enter) : ''
                                    }}
                                    key={columnIndex}
                                    disabled={columnInfo.disabled}
                                    v-model={scope.row.extData[columnInfo['prop']]}></el-input>
                  )
                  break;
                case 'el-input-number':
                  return (
                      columnInfo.valueType == 'fixed' ?
                          <el-input-number className="tableSlotInput"
                                           onChange={(e) => {
                                             columnInfo.events && columnInfo.events.change ? eval(columnInfo.events.change) : ''
                                           }}
                                           key={columnIndex}
                                           min={columnInfo.min * 1}
                                           disabled={columnInfo.disabled || this.mainTableInputStatus(item, columnInfo, scope)}
                                           v-model={scope.row[columnInfo['prop']]}></el-input-number>
                          :
                          <el-input-number class="tableSlotInput"
                                           onChange={(e) => {
                                             columnInfo.events && columnInfo.events.change ? eval(columnInfo.events.change) : ''
                                           }}
                                           key={columnIndex}
                                           min={columnInfo.min * 1}
                                           disabled={columnInfo.disabled || this.mainTableInputStatus(item, columnInfo, scope)}
                                           v-model={scope.row.extData[columnInfo['prop']]}></el-input-number>
                  )
                  break;
                case 'el-link':
                  return (
                      columnInfo.valueType == 'fixed' ?
                          <el-link underline={false}
                                   type="primary" onClick={() => {
                            eval(columnInfo.linkEvents)
                          }}>{columnInfo.slotRenderEvents ? eval(columnInfo.slotRenderEvents) : scope.row[columnInfo['prop']]}</el-link>
                          :
                          <el-link underline={false}
                                   type="primary" onClick={() => {
                            eval(columnInfo.linkEvents)
                          }}>{columnInfo.slotRenderEvents ? eval(columnInfo.slotRenderEvents) : scope.row.extData[columnInfo['prop']]}</el-link>
                  )
                  break;
                case 'el-select':
                case 'select':
                  return (

                      this.renderTableSelect(columnInfo, scope)

                  )
                  break;
                case "kevin-table-tags":
                  return (
                      this.renderKevinTableTags(columnInfo, scope, item)
                  )
                  break;
              }
            }
          } else {
            // 展开行渲染
            if (columnInfo['type'] == 'expand') {
              scopedSlots[columnInfo['slotName']] = (scope) => {
                return (this.renderELTableChild(item, columnInfo, scope))
              }
            } else {
              scopedSlots[columnInfo['slotName']] = (scope) => {
                if (!scope.row.extData) {
                  scope.row.extData = {}
                }
                return (
                    columnInfo.valueType == 'fixed' ?
                        <span>{scope.row[columnInfo.prop]}</span> :
                        <span>{scope.row.extData[columnInfo.prop]}</span>
                )
              }
            }

          }
        }
      })
      return (
          <el-col span={item.col}>
            {
              this.renderTableEditArea(item)
            }
            {
              this.renderTableTopButton(item)
            }
            {
              item.title ? <el-divider content-position="center">{item.title}</el-divider> : ""
            }
            <kevinTable tree-props={item.treeProps} ref={item.anchorPoint} key={item.anchorPoint}
                        span-method={this.objectSpanMethod(item)}
                        height={item.height ? item.height : '300'} default-expand-all
                        columns={item.tableColumns}
                        data={item.tableData}
                        hiddenSelection={item.hiddenSelection}
                        style="width:100%;" border
                        scopedSlots={scopedSlots} onSelectionChange={(e) => {
              item.events && item.events.selectionChange ? eval(item.events.selectionChange) : item.tableSelections = e
            }}></kevinTable>

          </el-col>

      )
    },
    //渲染table内的tags
    renderKevinTableTags(columnInfo, scope, item) {
      return (
          <div class="kevinTableTags">
            {
              scope.row[columnInfo.prop].map((tagsItem, tagsIndex) => {
                return (
                    <el-tag closable={columnInfo.options.closable && item.tableEnv != 'detail'} onClose={() => {
                      columnInfo.options && columnInfo.options.closeEvents ? eval(columnInfo.options.closeEvents) : ''
                    }}>{tagsItem[columnInfo.options.showKey]}</el-tag>
                )
              })
            }
            {
              columnInfo.options.buttons.map(buttonInfo => {
                if (item.tableEnv != 'detail') {
                  return (
                      <el-button type={buttonInfo.type ? buttonInfo.type : 'primary'} size="mini" onClick={() => {
                        buttonInfo.events ? eval(buttonInfo.events) : ''
                      }}>{buttonInfo.label}</el-button>
                  )
                }

              })
            }
          </div>
      )
    },
    //渲染动态table行内增加列表
    getSpanArr(data, tableInfo) {
      tableInfo.mergeArr.forEach((key, index1) => {
        let count = 0; // 用来记录需要合并行的起始位置
        tableInfo.mergeObj[key] = []; // 记录每一列的合并信息
        data.forEach((item, index) => {
          // index == 0表示数据为第一行，直接 push 一个 1
          if (index === 0) {
            tableInfo.mergeObj[key].push(1);
          } else {
            // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
            if (item[key] === data[index - 1][key]) {
              tableInfo.mergeObj[key][count] += 1;
              tableInfo.mergeObj[key].push(0);
            } else {
              // 如果当前行和上一行其值不相等
              count = index; // 记录当前位置
              tableInfo.mergeObj[key].push(1); // 重新push 一个 1
            }
          }
        })
      })
    },
    // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }
    objectSpanMethod(item) {
      if (item.spanMethod) {
        return (({row, column, rowIndex, columnIndex}) => {
          // 判断列的属性
          if (item.mergeArr.indexOf(column.property) !== -1) {
            // 判断其值是不是为0
            if (item.mergeObj[column.property][rowIndex]) {
              return [item.mergeObj[column.property][rowIndex], 1]
            } else {
              // 如果为0则为需要合并的行
              return [0, 0];
            }
          }
        })
      }
    },
    getRowKey() {
      return ((row) => {
        return row.id || Math.random()
      })
    },
    renderTableSelect(columnInfo, scope) {
      return (
          columnInfo.valueType == 'fixed' ?
              <el-select disabled={columnInfo.disabled} v-model={scope.row[columnInfo.prop]} placeholder="请选择"
                         onChange={(e) => {
                           columnInfo.events && columnInfo.events.change ? eval(columnInfo.events.change) : ''
                         }}>
                {
                  columnInfo.options.options.map(optioninfo => {
                    return (
                        <el-option
                            label={optioninfo.label}
                            value={optioninfo.value}>
                        </el-option>
                    )
                  })
                }

              </el-select> : <el-select disabled={columnInfo.disabled} v-model={scope.row.extData[columnInfo.prop]}
                                        placeholder="请选择" onChange={(e) => {
                columnInfo.events && columnInfo.events.change ? eval(columnInfo.events.change) : ''
              }}>
                {
                  columnInfo.options.options.map(optioninfo => {
                    return (
                        <el-option
                            label={optioninfo.label}
                            value={optioninfo.value}>
                        </el-option>
                    )
                  })
                }

              </el-select>
      )
    },
    renderTableEditArea(item) {
      if (!this.$store.state.system.closeDrag) {
        return (
            <div class="renderTableEditArea">
              <div class="rt-btn-area">
                <div class="rba-fun-icon" onClick={() => this.e_signleEdit(item)}>
                  <i class="el-icon-edit"></i>
                </div>
                <div class="rba-fun-icon rfi-delete">
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
        )
      }

    },
    /**
     * @author Coder
     * @date 2023/5/23
     * @des 主表 输入系列 禁止编制
     */
    mainTableInputStatus(item, columnInfo, scope) {
      if (!columnInfo.slotInputStatusEvents) {
        return false
      } else {
        var that = this
        return new Function('that', 'item', 'columnInfo', 'scope', columnInfo.slotInputStatusEvents)(that, item, columnInfo, scope)
      }
    },
    /**
     * @author Coder
     * @date 2023/5/23
     * @des 主表 操作列 按钮操作限制
     */
    checkMainTableActionEvents(slotButtonInfo, item, columnInfo, scope) {
      if (!slotButtonInfo.actionStatusEvents) {
        return false
      } else {
        var that = this
        return new Function('that', 'item', 'columnInfo', 'scope', slotButtonInfo.actionStatusEvents)(that, item, columnInfo, scope)
      }
    }, /**
     * @author Coder
     * @date 2023/5/23
     * @des 主表 操作列 按钮操作限制
     */
    checkSubTableActionEvents(slotButtonInfo, item, columnInfo, parentScope, childScope) {
      if (!slotButtonInfo.actionStatusEvents) {
        return false
      } else {
        var that = this
        return new Function('that', 'item', 'columnInfo', 'parentScope', 'childScope', slotButtonInfo.actionStatusEvents)(that, item, columnInfo, parentScope, childScope)
      }
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 渲染展开行table
     */
    renderELTableChild(item, columnInfo, parentScope) {
      let scopedSlots = {}
      item.childTableColums.forEach((childColumsInfo, childColumsIndex) => {
        if (childColumsInfo.slotName == 'action') {
          scopedSlots['action'] = (childScope) => {
            return (
                <div>
                  {
                    item.childTableSlotButtons.map(slotButtonInfo => {
                      if (!slotButtonInfo.isHide) {
                        return (

                            <el-button type="text"
                                       disabled={this.checkSubTableActionEvents(slotButtonInfo, item, columnInfo, parentScope, childScope)}
                                       onClick={() => {
                                         slotButtonInfo.events ? eval(slotButtonInfo.events) : ''
                                       }}>{slotButtonInfo.label}</el-button>
                        )
                      }

                    })
                  }
                </div>
            )
          }
        } else if (childColumsInfo.slotName == 'index') {
          scopedSlots['index'] = (childScope) => {
            return (
                <div>
                  {++childScope.$index}
                </div>
            )
          }
        } else {
          if (childColumsInfo.editType) {
            scopedSlots[childColumsInfo['slotName']] = (scope) => {
              if (!scope.row.extData) {
                scope.row.extData = {}
              }
              switch (childColumsInfo.editType) {
                case 'span':
                  return (
                      <span>{eval(childColumsInfo.slotRenderEvents)}</span>
                  )
                  break;
                case 'el-input':
                  return (
                      childColumsInfo.valueType == 'fixed' ?
                          <el-input className="tableSlotInput"
                                    onBlur={() => {
                                      childColumsInfo.events && childColumsInfo.events.blur ? eval(childColumsInfo.events.blur) : ''
                                    }}
                                    onInput={(value) => {
                                      childColumsInfo.events && childColumsInfo.events.input ? eval(childColumsInfo.events.input) : ''
                                    }}
                                    nativeOnKeyup={(keyInfo) => {
                                      childColumsInfo.events && childColumsInfo.events.enter ? eval(childColumsInfo.events.enter) : ''
                                    }}
                                    key={childColumsIndex}
                                    disabled={childColumsInfo.disabled}
                                    v-model={scope.row[childColumsInfo['prop']]}></el-input>
                          :
                          <el-input class="tableSlotInput"
                                    onBlur={() => {
                                      childColumsInfo.events && childColumsInfo.events.blur ? eval(childColumsInfo.events.blur) : ''
                                    }}
                                    onInput={(value) => {
                                      childColumsInfo.events && childColumsInfo.events.input ? eval(childColumsInfo.events.input) : ''
                                    }}
                                    nativeOnKeyup={(keyInfo) => {
                                      childColumsInfo.events && childColumsInfo.events.enter ? eval(childColumsInfo.events.enter) : ''
                                    }}
                                    key={childColumsIndex}
                                    disabled={childColumsInfo.disabled}
                                    v-model={scope.row.extData[childColumsInfo['prop']]}></el-input>
                  )
                  break;
                case 'el-input-number':
                  return (
                      childColumsInfo.valueType == 'fixed' ?
                          <el-input-number className="tableSlotInput"
                                           key={childColumsIndex}
                                           min={childColumsInfo.min * 1}
                                           disabled={childColumsInfo.disabled || this.mainTableInputStatus(item, childColumsInfo, scope)}
                                           v-model={scope.row[childColumsInfo['prop']]}></el-input-number>
                          :
                          <el-input-number class="tableSlotInput"
                                           key={childColumsIndex}
                                           min={childColumsInfo.min * 1}
                                           disabled={childColumsInfo.disabled || this.mainTableInputStatus(item, childColumsInfo, scope)}
                                           v-model={scope.row.extData[childColumsInfo['prop']]}></el-input-number>
                  )
                  break;
                case 'el-link':
                  return (
                      childColumsInfo.valueType == 'fixed' ?
                          <el-link underline={false}
                                   type="primary" onClick={() => {
                            eval(childColumsInfo.linkEvents)
                          }}>{childColumsInfo.slotRenderEvents ? eval(childColumsInfo.slotRenderEvents) : scope.row[childColumsInfo['prop']]}</el-link>
                          :
                          <el-link underline={false}
                                   type="primary" onClick={() => {
                            eval(childColumsInfo.linkEvents)
                          }}>{childColumsInfo.slotRenderEvents ? eval(childColumsInfo.slotRenderEvents) : scope.row.extData[childColumsInfo['prop']]}</el-link>
                  )
                  break;
                case 'el-selct':
                case 'select':
                  return (

                      this.renderTableSelect(childColumsInfo, scope)

                  )
                  break;
                case "kevin-table-tags":
                  return (
                      this.renderKevinTableTags(childColumsInfo, scope, item)
                  )
                  break;
              }
            }
          } else {
            scopedSlots[childColumsInfo['slotName']] = (childScope) => {
              if (!childScope.row.extData) {
                childScope.row.extData = {}
              }
              return (
                  childColumsInfo.valueType == 'fixed' ?
                      <span>{childScope.row[childColumsInfo.prop]}</span> :
                      <span>{childScope.row.extData[childColumsInfo.prop]}</span>
              )
            }
          }

        }
      })
      return (
          <kevinTable ref={item.anchorPoint} key={item.anchorPoint} scopedSlots={scopedSlots}
                      columns={item.childTableColums}
                      data={parentScope.row.subInfoGiveList} style="width:100%;"></kevinTable>
      )
    },
    /**
     * @author Coder
     * @date 2023/3/21
     * @des 列渲染方法
     */
    doSlotRenderEvents(events, row) {
      var doEvents = new Function('row', events)
      return doEvents(row)
    },
    //table内按钮事件实现
    tableButtonEvents(events, scope, item) {
      let doEvents = new Function('item', 'index', events)
      doEvents(item, scope.$index)

    },
    /**
     * @author Coder
     * @date 2023/3/21
     * @des 表单link点击事件实现
     */
    e_linkEvents(events, scope, item, blockInfo) {
      var doEvents = new Function('blockInfo', 'item', 'row', events)
      doEvents(blockInfo, item, scope.row)
    },
    /**
     * @author Coder
     * @date 2023/3/21
     * @des 渲染table上方的按钮
     */
    renderTableTopButton(item) {
      if (item.tableButtons && item.tableButtons.length > 0) {
        return (
            item.tableButtons.map(tbInfo => {
              if (!tbInfo.isHide) {
                return (
                    <el-button style="margin-bottom:10px" type="primary"
                               size="mini" onClick={() => {
                      eval(tbInfo.events)
                    }}>{tbInfo.label}</el-button>
                )
              }

            })
        )

      }
    },
    /**
     * @author Coder
     * @date 2023/3/21
     * @des table顶部按钮事件
     */
    e_tableTopButtonEvents(events, tbInfo) {
      var that = this
      this.dialogWidget = tbInfo.widgetBody
      var dd = new Function(['that', 'tbInfo'], events)
      dd(that)
    },
    /**
     * @author Coder
     * @date 2023/3/22
     * @des 渲染el-button
     */
    renderELButton(item, index) {

      if (item.formList && item.formList.length > 0) {
        return (
            <el-col span={item.col}>

              {
                item.formList.map(buttonInfo => {
                  if (buttonInfo.isHide == true) {
                    return ('')
                  } else {
                    return (
                        <div class="renderButtonArea">
                          {
                            this.showButtonEditArea(buttonInfo)
                          }
                          <el-button type={buttonInfo.type ? buttonInfo.type : '-'}
                                     size={buttonInfo.size ? buttonInfo.size : '-'}
                                     onClick={() => {
                                       buttonInfo.events ? eval(buttonInfo.events) : ''
                                     }}

                          >


                            {buttonInfo.label}
                          </el-button>
                        </div>


                    )
                  }
                })
              }
            </el-col>
        )
      }
    },
    showButtonEditArea(item) {
      if (!this.$store.state.system.closeDrag) {
        item.component = 'el-button'
        return (
            <div class="buttoneditarea">
              <div class="be-fun-icon" onClick={() => this.e_signleEdit(item)}>
                <i class="el-icon-edit"></i>
              </div>
            </div>
        )
      }

    },
    // 打开签名组件
    e_openKevinSign(params) {
      this.$emit('openKevinSign', params)
    },
    e_deleteKevinSign(params) {
      this.$confirm('确定清除签名').then(() => {
        params.options.fileList = []
      })
    },
    // 渲染签字屏组件
    renderKevinSign(params, index) {
      return (
          <el-col key={index} span={params.col}>
            <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
              <el-row>
                {
                  this.env != 'detail' ? (
                      <el-col span={24}>
                        <el-button type="primary" size="mini" onClick={() => {
                          this.e_openKevinSign(params)
                        }}>开始签名
                        </el-button>
                        <el-button type="danger" size="mini" onClick={() => {
                          this.e_deleteKevinSign(params)
                        }}>清除签名
                        </el-button>
                      </el-col>
                  ) : ''
                }

                <el-col span={24}>
                  <div class="kevinimagearea">
                    {
                      params.options.fileList.length != 0 ? params.options.fileList.map((fileInfo, fileIndex) => {
                        return (
                            <div class="ki-list">
                              <el-image
                                  style="width: 150px; height: 150px"
                                  preview-src-list={[fileInfo.showUrl]}
                                  src={fileInfo.showUrl}
                              ></el-image>
                            </div>
                        )
                      }) : ''
                    }
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
      )
    },
    //渲染自定义图片组件,图片通过内容的按钮来实现图片上传、高拍仪上传，、、、、未来其他的上传方式
    renderKevinImage(params, index) {
      return (
          <el-col key={index} span={params.col}>
            <el-form-item label={params.label} prop={params['prop']} rules={params.rules}>
              <el-row>
                <input type="file" ref="fileInput" style="display: none;"
                       onChange={(e) => {
                         this.hidenInputUpload(e, params)
                       }}/>
                {
                  this.env != 'detail' ? (
                      <el-col span={24}>
                        <el-button type="primary" size="mini" onClick={() => {
                          this.e_diyUploadImage()
                        }}>上传图片
                        </el-button>
                        <el-button type="primary" size="mini" onClick={() => {
                          this.e_openPhotogray(params)
                        }}>高拍仪
                        </el-button>
                      </el-col>
                  ) : ''
                }

                <el-col span={24}>
                  <div class="kevinimagearea">
                    {
                      params.options.fileList.length != 0 ? params.options.fileList.map((fileInfo, fileIndex) => {
                        return (
                            <div class="ki-list">
                              <el-image
                                  style="width: 150px; height: 150px"
                                  preview-src-list={[fileInfo.showUrl]}
                                  src={fileInfo.showUrl}
                              ></el-image>
                              <el-row>
                                <el-col span={24}>
                                  <i class="el-icon-download kil-icon ki-upload" onClick={() => {
                                    this.downloadKevinImage(fileInfo)
                                  }}></i>
                                  {
                                    this.env != 'detail' ? (
                                        <i class="el-icon-delete  kil-icon ki-delete" onClick={() => {
                                          this.deleteKevinImage(params.options.fileList, fileIndex)
                                        }}></i>) : ''
                                  }

                                </el-col>
                              </el-row>

                            </div>
                        )
                      }) : ''
                    }
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
      )
    },
    //删除自定义图片组件的中的图片
    deleteKevinImage(list, index) {
      this.$confirm('确定删除该张图？').then(_ => {
        list.splice(index, 1)
      })
    },
    e_diyUploadImage() {
      this.$refs.fileInput.click();
      this.$refs.fileInput.accept = "image/*"

    },
    e_openPhotogray(params) {
      this.$emit('openPhotogray', params)
    },
    //隐藏域input上传图片
    hidenInputUpload(e, params) {
      console.log('params', params)
      const file = this.$refs.fileInput.files[0]; // 获取选中的文件
      const formData = new FormData(); // 新建 FormData 实例
      formData.append('file', file)
      uploadFile(formData).then(re => {
        re.showUrl = this.$BASE_API + '/' + re.url
        re.type = 'file'
        params.options.fileList.push(re)
      })
    },
    //下载
    downloadKevinImage(fileInfo) {
      if (fileInfo.type == 'file') {
        this.downloadFileByName(fileInfo)
      } else if (fileInfo.type == 'base64') {
        this.downloadBase64Image(fileInfo.showUrl, new Date().getTime() + '.jpg');
      }
    },
    //渲染分页
    renderElPagination(params) {
      if (params.isHide == true) {
        return ('')
      }
      return (
          <el-col span={params.col}>
            {
              this.renderTableEditArea(params)
            }
            <pagination v-show="total > 0" total={params.total} page={params.pageNum} pageSizes={params.pageSizes}
                        limit={params.pageSize} v-on:pagination={(pageInfo) => {
              eval(params.events)
            }}/>
          </el-col>
      )
    },
    // 渲染Tabs标签页
    renderELTabs(params, index) {
      if (params.isHide == true) {
        return ('')
      }
      return (
          <el-col span={params.col}>
            {
              this.renderTableEditArea(params)
            }
            <el-tabs v-model={params.activeName} type={params.type ? params.type : '-'} v-on:tab-click={() => {
              params.events ? eval(params.events) : ''
            }}>
              {
                params.tabList.map(tabInfo => {
                  return (
                      <el-tab-pane label={tabInfo.label} name={tabInfo.value}></el-tab-pane>
                  )
                })
              }

            </el-tabs>
          </el-col>
      )
    },
  },
  render(createElement, context) {
    return (
        <div class="container">

          <draggable list={this.formJSON} animation={340} group={this.group} ghostClass={this.ghostClass}
                     disabled={this.$store.state.system.closeDrag}
                     className="drag-wrapper"
          >
            {
              this.formJSON.map((item, index) => {
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
                  case 'el-table':
                    return (this.renderELTable(item, index))
                    break
                  case 'el-table-tree':
                    return (this.renderELTreeTable(item, index))
                    break
                  case 'el-button':
                    return (this.renderELButton(item, index))
                    break;
                  case 'kevin-image':
                    return (this.renderKevinImage(item, index))
                    break;
                  case 'kevin-sign':
                    return (this.renderKevinSign(item, index))
                    break;
                  case 'el-tabs':
                    return (this.renderELTabs(item, index))
                    break;
                  case 'el-pagination':
                    return (this.renderElPagination(item, index))
                    break;
                  case 'el-cascader':
                    return (this.renderELCascader(item, index))
                    break;

                }
              })
            }
          </draggable>
          {
            <detailExcel ref="excelRef" onClose={() => {
              this.showExcel = null
            }}/>
          }
          {
            <detailPdf ref="pdfRef" onClose={() => {
              this.showPdf = null
            }}/>
          }
          {
            <detaildocx ref="docRef" onClose={() => {
              this.showDoc = null
            }}/>
          }
          {
            <detailImg ref="imgRef" onClose={() => {
              this.showImg = null
            }}/>
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

.container > div {
  display: flex;
  flex-wrap: wrap
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
  width: 98%;
  height: 94px;
  background: rgba(254, 213, 93, 0.3);
  position: absolute;
  z-index: 22;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  border: 1px dashed #FED55D;
  right: 3%;
  top: 6%;
}

.isHideSignle {
  background: rgba(158, 186, 248, 0.3);
}

.se_enter_info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 30%;
}

.s_e_i_tip {
  padding: 12px 12px;
  background-color: #FED55D;
  color: #364BC6;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.rm-btn-area {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 3px;
}

.rba-fun-icon {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  border: 1px solid #364BC6;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 0.4rem;
}

.rba-fun-icon i {
  font-size: 0.5rem;
  color: #364BC6;
}

.rba-fun-icon:hover {

  background-color: #364BC6;
}

.rba-fun-icon:hover i {
  color: #fff;

}

.rfi-delete {
  border: 1px solid red;
}

.rfi-delete i {
  color: red;
}

.rfi-delete:hover {
  background-color: red;
  color: #fff;
}

.rfi-delete:hover i {
  color: #fff;
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

/deep/ .tableSlotInput .el-input__inner {
  text-align: center;
}

.kevinimagearea {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 20px 0;

  .ki-list {
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    .kil-icon {
      font-size: 18px;
      display: inline-block;
      margin-top: 25px;
      cursor: pointer;
    }

    .ki-upload {
      color: green;
      margin-right: 20px;
    }

    .ki-delete {
      color: red;
    }
  }
}

.renderButtonArea {
  display: inline-block;
  position: relative;
  margin-right: 11px;

  .buttoneditarea {
    width: 100%;
    height: 100%;
    background: rgba(254, 213, 93, 0.6);
    position: absolute;
    z-index: 22;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 1px dashed #FED55D;

    .be-fun-icon {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 1px solid #364BC6;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 0.4rem;
      font-size: 0.6rem;

      &:hover {
        background-color: #364BC6;
        color: #fff;
      }
    }
  }
}

.renderTableEditArea {
  width: 100%;
  height: 100%;
  background: rgba(254, 213, 93, 0.3);
  position: absolute;
  z-index: 22;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  border: 1px dashed #FED55D;

  .rt-btn-area {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-top: 3px;
  }
}

.kevinTableTags {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  /deep/ .el-button {
    margin-left: 5px;
  }
}
</style>
