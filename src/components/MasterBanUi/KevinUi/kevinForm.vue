<script lang="jsx" setup>
import {ElMessageBox, ElMessage} from "element-plus";
import draggable from 'vuedraggable'
import AddFormItem from './addFormItem.vue'
import kevinTable from './kevinTable.vue'
import kevinLog from "./kevinLog.vue";
import formRender from './formRender.vue'
import kevinCodeEditor from "./kevinCodeEditor.vue";
import AddWidget from "./addWidget.vue";
import photographyVue from './components/photography.vue';
import scriptEditor from './scriptEditor.vue';
import signleEdit from './signleEdit/index.vue'
import {useStore} from "vuex";

const store = useStore()
const vm = getCurrentInstance().proxy
const emit = defineEmits([
  'editBlockForm',
  'addBlockInTab',
  'blockDeleteInTab',
  'saveWidgetForm',
  'delteBulletBox',
  'saveTabGlobalScript',
  'saveBulletBoxScript',
  'saveSignleEdit',
  'tabClick',
])

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

const props = defineProps({
  form: {
    typeof: Object,
    default: () => {
    }
  },
  bolckFormParams: {
    typeof: Array,
    default: () => {
    }
  },
  bulletBox: {
    typeof: Array,
    default: () => {
    }
  },
  ghostClass: {
    typeof: String,
    default: 'ghost'
  },
  pageInfo: {
    typeof: Object,
    default: () => {
    }
  },
  businessConfigId: {
    typeof: String,
    default: ''
  },
  openEnv: {
    typeof: String,
    default: 'add'
  }
})
let form = reactive(props.form)
let bolckFormParams = ref(props.bolckFormParams)
let bulletBox = ref(props.bulletBox)
let ghostClass = ref(props.ghostClass)
let pageInfo = reactive(props.pageInfo)
let businessConfigId = ref(props.businessConfigId)
let openEnv = ref(props.openEnv)

let showsignleEdit = ref(false)
let activeName = ref('0')
let layoutParamsList = ref([])
let showScriptEditor = ref(false)
let showAddFormItem = ref(false)
let showKevinLog = ref(false)
let dialogWidget = reactive({})
let showKevinFormEditor = ref(false)
let showAddWidget = ref(false)
let editFor = ref('')
let showPhotographyVue = ref(false)
let diyKevinImageParams = reactive({})

onBeforeMount(() => {
  window.KevinFormthis = vm
})
onMounted(() => {

  /**
   * @author Coder
   * @date 2023/4/18
   * @des 执行表单tab绑定的方法
   */
  bolckFormParams.value.forEach((tabInfo, tabIndex) => {
    if (tabInfo.events) {
      for (let key in tabInfo.events) {
        eval(tabInfo.events[key])
      }
    }
    tabInfo.formList.forEach(formInfo => {
      if (formInfo.events) {
        for (let key in formInfo.events) {
          eval(formInfo.events[key])
        }
      }
    })
  })
})

/**
 * @author Coder
 * @date 2023/3/22
 * @des 打开添加样品弹框 并为该弹框进行复制操作
 */
function e_openSampleManageLog(e) {
  Object.assign(dialogWidget, e)
  showKevinLog.value = true
  nextTick(() => {
    vm.$refs.kevinLog.init()
  })
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 显示代码编辑器
 */
function e_showKevinFormEditor(params) {
  showKevinFormEditor.value = true
  nextTick(() => {
    vm.$refs.kevinCodeEditor.init(params)
  })
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 保存
 */
function e_saveFormEditor(params) {
  showKevinFormEditor.value = false
  emit('editBlockForm', params)
  // this.activeName = '0'
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 新增区域
 */
function e_addBlockInTab(tabindex) {

  ElMessageBox.confirm('确定要在当前tab下新增一个区域吗？').then(_ => {
    emit('addBlockInTab', tabindex)
  })


}

/**
 * @author Coder
 * @date 2023/3/23
 * @des tab下 block删除
 */
function e_blockDeleteInTab(tabIndex, blockIndex) {
  ElMessageBox.confirm('确定删除当前区域吗？').then(_ => {
    emit('blockDeleteInTab', {tabIndex, blockIndex})
  })

}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 开启选择区域项
 */
function e_doAddWidget(blockInfo) {
  editFor.value = 'mainForm'
  showAddWidget.value = true
  nextTick(() => {
    vm.$refs.AddWidget.init(blockInfo)
  })
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 保存添加的区域项
 */
function e_saveWidgetForm() {
  showAddWidget.value = false
  emit('saveWidgetForm')
}

/**
 * @author Coder
 * @date 2023/3/24
 * @des 进入弹框
 */
function e_editBulletBox(scope) {
  showKevinLog.value = true
  Object.assign(dialogWidget, scope.row)
  nextTick(() => {
    vm.$refs.kevinLog.init()
  })
}

/**
 * @author Coder
 * @date 2023/3/24
 * @des 渲染弹框管理列表
 */
function renderPopTable() {
  let scopedSlots = {
    "action": (scope) => {
      return <el-row>
        <el-col span={24}>
          <el-button text type="primary" onClick={() => {
            emit('delteBulletBox', scope.$index)
          }}>删除弹框
          </el-button>
          <el-button text type="primary" onClick={() => {
            e_editBulletBox(scope)
          }}>编辑弹框
          </el-button>
        </el-col>
      </el-row>
    }
  }
  let columns = [
    {
      "label": "弹框标题",
      "prop": "title",
      "checked": true,
      "align": "center",
    },
    {
      "label": "弹框唯一值",
      "prop": "anchorPoint",
      "checked": true,
      "align": "center",
      "valueType": "fixed"
    },
    {
      "label": "操作",
      "checked": true,
      "align": "center",
      "slotName": "action",
      "disabled": true,
    }
  ]
  return (
      <kevinTable key={Math.random()} scopedSlots={scopedSlots} border columns={columns} data={bulletBox.value}
                  style="width:100%;"></kevinTable>

  )
}

/**
 * @author Coder
 * @date 2023/3/25
 * @des 区块拖拽完成
 */
function e_draggableOver() {
  ElMessage.success('拖拽完成')
}

/**
 * @author Coder
 * @date 2023/4/4
 * @des 点击tab
 */
function tabClick() {

}

//打开高拍仪
function e_openPhotogray(params) {
  Object.assign(diyKevinImageParams, params)
  showPhotographyVue.value = true
  nextTick(() => {
    vm.$refs.photographyVue.init()
  })
}

//回填高拍仪内容
function appendGpImage(list) {
  showPhotographyVue.value = false
  list.map(item => {
    let obj = {
      showUrl: item,
      type: 'base64'
    }
    diyKevinImageParams.options.fileList.push(obj)
  })
}

// 打开全局事件脚本管理
function openGlobalScript({codeJson, index}) {
  showScriptEditor.value = true
  nextTick(() => {
    vm.$refs.scriptEditor.init(codeJson, index)
  })
}

function saveScriptEditor(params) {
  showScriptEditor.value = false
  emit('saveTabGlobalScript', params)
}

// 保存弹框脚本编辑
function saveBulletBoxScript(params) {
  emit('saveBulletBoxScript', params)
}

//开启单项编辑
function e_dosignleEdit(params) {
  showsignleEdit.value = true
  nextTick(() => {
    vm.$refs.signleEdit.init(params, 'listParamsList')
  })
}

// 保存单项编辑
function e_saveSignleEdit(info) {
  showsignleEdit.value = false
  emit('saveSignleEdit', info)
}

function render(createElement, context) {
  return (
      <div class="kevinFormContainer">
        <el-tabs v-model={activeName} type="card" v-on:tab-click={(tab, event) => {
          emit('tabClick', activeName)
        }}>
          {
            bolckFormParams.value.map((tabInfo, tabIndex) => {
              return (
                  <el-tab-pane label={tabInfo.tabTitle ? tabInfo.tabTitle : '看看自己写title了吗'}
                               name={String(tabIndex)}>
                    {
                      store.state.system.closeDrag ? '' :
                          <el-tooltip class="item" effect="light"
                                      content="管理维护该页签全局内自动执行脚本与手动执行脚本" placement="top-start">
                            <el-button type="success" size="small" style="margin-bottom:10px"
                                       onClick={() => {
                                         openGlobalScript({
                                           codeJson: tabInfo,
                                           index: tabIndex,
                                         })
                                       }}
                            >{tabInfo.tabTitle}页签全局脚本
                            </el-button>
                          </el-tooltip>
                    }
                    {
                      store.state.system.closeDrag ? '' :
                          <el-button type="warning" size="small" style="margin-bottom:10px"
                                     onClick={() => {
                                       e_showKevinFormEditor({
                                         codeJson: tabInfo,
                                         index: tabIndex,
                                         type: 'tab'
                                       })
                                     }}>{tabInfo.tabTitle}页签JSON
                          </el-button>
                    }
                    <draggable list={tabInfo.formList} animation={340}
                               disabled={store.state.system.closeDrag} group={{
                      name: `Tab${tabIndex}`,
                      pull: false,
                      put: false
                    }}
                               ghostClass={ghostClass.value} onEnd={() => {
                      e_draggableOver()
                    }}
                               className="drag-wrapper">
                      {
                        tabInfo.formList.map((blockInfo, blockIndex) => {
                          if (!blockInfo.isHide) {
                            return (
                                <div class={store.state.system.closeDrag ? '' : 'blockClass'}>
                                  {
                                    store.state.system.closeDrag ? '' : <el-row>
                                      <el-col span={24}>
                                        <el-button type="success" size="small" onClick={() => {
                                          e_doAddWidget(blockInfo)
                                        }}>区域内容新增
                                        </el-button>
                                        <el-button type="danger" size="small"
                                                   onClick={() => {
                                                     e_blockDeleteInTab(tabIndex, blockIndex)
                                                   }}
                                        >删除当前区域
                                        </el-button>
                                        <el-button type="warning" size="small" style="margin-bottom:10px"
                                                   onClick={() => {
                                                     e_showKevinFormEditor({
                                                       codeJson: blockInfo,
                                                       index: blockIndex,
                                                       parentIndex: tabIndex,
                                                       type: 'block'
                                                     })
                                                   }}
                                        >当前区域JSON
                                        </el-button>
                                      </el-col>
                                    </el-row>
                                  }
                                  {
                                    blockInfo.title ? <el-divider
                                        content-position="left">{blockInfo.title}</el-divider> : ''
                                  }
                                  <el-row>
                                    <formRender block-info={blockInfo}
                                                tab-info={tabInfo}
                                                formJSON={blockInfo.formList}
                                                env={KevinFormthis.openEnv}
                                                form={form} group={{
                                      name: `Block${blockIndex}`,
                                      pull: false,
                                      put: false
                                    }}
                                                onShowSampleEdit={(dialogWidget) => {
                                                  e_openSampleManageLog(dialogWidget)
                                                }}
                                                onOpenPhotogray={(params) => {
                                                  e_openPhotogray(params)
                                                }}
                                                onSignleEdit={(params) => {
                                                  e_dosignleEdit(params)
                                                }}
                                    />
                                  </el-row>
                                </div>
                            )
                          }
                        })
                      }
                    </draggable>
                    {
                      store.state.system.closeDrag ? '' : <el-row>
                        <el-col span={24}>
                          <el-button size="small" type="warning" style="width:100%;margin:20px 0"
                                     onClick={() => {
                                       e_addBlockInTab(tabIndex)
                                     }}
                          >区域新增

                          </el-button>
                        </el-col>
                      </el-row>
                    }
                  </el-tab-pane>
              )
            })
          }
        </el-tabs>
        {
          showKevinLog.value ? <kevinLog ref="kevinLog" open-env={KevinFormthis.openEnv}
                                         business-config-id={businessConfigId.value}
                                         widget-form={dialogWidget}
                                         onClose={() => {
                                           showKevinLog.value = false
                                         }}
                                         onSaveAddForm={() => {
                                           e_saveWidgetForm()
                                         }}
                                         onSaveBulletBoxScript={(params) => {
                                           saveBulletBoxScript(params)
                                         }}
                                         onSaveSignleEdit={(info) => {
                                           e_saveSignleEdit(info)
                                         }}
          /> : ''
        }
        {
          showKevinFormEditor.value ?
              <kevinCodeEditor ref="kevinCodeEditor"
                               onSave={(params) => {
                                 e_saveFormEditor(params)
                               }
                               }
                               onClose={() => {
                                 showKevinFormEditor.value = false
                               }}
              /> : ''
        }
        {
          showAddWidget.value ?
              <AddWidget editFor={editFor.value} businessConfigId={businessConfigId}
                         ref="AddWidget"
                         mainTableTags="ENTRUSTMENT_AGREEMENT"
                         onSaveAddForm={() => {
                           e_saveWidgetForm()
                         }} onClose={() => {
                showAddWidget.value = false
              }}
              />
              : ''
        }
        {
          showPhotographyVue.value ? <photographyVue ref="photographyVue" onClose={() => {
            showPhotographyVue.value = false
          }} onImgBaseList={(list) => {
            appendGpImage(list)
          }}/> : ''
        }
        {
          showScriptEditor.value ? <scriptEditor ref="scriptEditor" onClose={() => {
            showScriptEditor.value = false
          }} onSave={(params) => {
            saveScriptEditor(params)
          }}/> : ''
        }
        {
          showsignleEdit.value ? <signleEdit ref="signleEdit" onClose={() => {
            showsignleEdit.value = false
          }} onSaveSignleEdit={(info) => {
            e_saveSignleEdit(info)
          }}/> : ''
        }
      </div>
  )
}
</script>

<style lang="less" scoped>
.kevinFormContainer {
  width: 100%;
  background-color: #fff;

  /deep/ .el-divider__text.is-left {
    font-size: 16px;
  }

  /deep/ .el-form-item {
    margin-bottom: 8px
  }

  .el-row {
    display: flex; //设置布局
    flex-wrap: wrap; //进行换行操作
  }
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

.blockClass {
  border: 1px dashed #364BC6;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #EFF2FA;
  border-radius: 5px;
}
</style>
