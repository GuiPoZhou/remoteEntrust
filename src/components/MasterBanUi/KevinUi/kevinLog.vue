<script lang="tsx" setup>
import {useStore} from "vuex";
import {defineComponent, ref, nextTick, getCurrentInstance, reactive, onMounted} from "vue";
import type {Ref} from "vue";
import formRenders from "./formRender.vue";
import AddWidget from "./addWidget.vue";
import kevinCodeEditor from "./kevinCodeEditor.vue";
import DetectType from '@/components/project/detectType.vue'
import selectItem from '@/components/DetectSubItemManage/selectItem.vue'
import AddTestItems from '@/components/project_items/addTestItems.vue'
import judgmentCriteria from "./components/judgmentCriteria.vue";
import bulletBoxScriptEditor from "./bulletBoxScriptEditor.vue";
import signleEdit from './signleEdit/index.vue'

const vm = getCurrentInstance().proxy

interface SaveAddFormParams {
  params: any,
  index: Number
}

defineComponent({
  name: 'kevin-log'
})

const store = useStore()
const emit = defineEmits<{
  (e: "close"): void
  (e: "saveAddForm", payload: SaveAddFormParams): void
  (e: "saveBulletBoxScript", payload: any): void
  (e: "saveSignleEdit", payload: any): void
  (e: "confirmFormDesgin"): void
}>()


let showbulletBoxScriptEditor: boolean = ref(false)
let showLog: Ref<boolean> = ref(false)
let form = reactive({
  extData: {}
})
let showAddWidget: boolean = ref(false)
let editIndex = ref(undefined)
let showKevinEditor: boolean = ref(false)
let showDetectType: boolean = ref(false)
let showselectItem: boolean = ref(false)
let editDataIndex = ref(undefined)
let showAddTestItems = ref(false)
let showjudgmentCriteria: boolean = ref(false)
let showsignleEdit: boolean = ref(false)
let openLogType = ref('')
let showOtherItem: boolean = ref(false)

const props = defineProps({
  widgetForm: {
    typeof: Object,
    default: () => {
    }
  },
  businessConfigId: {
    typeof: String,
    default: ''
  },
  itemBindType: Number,
  openEnv: {
    typeof: 'String',
    default: 'add'
  }
})

let widgetForm = reactive(props.widgetForm)
let businessConfigId = ref(props.businessConfigId)
let itemBindType = ref(props.itemBindType)

onMounted(() => {
  window.KevinLogThis = vm
})

function e_saveItem(itemParams) {
  console.log('itemParams', itemParams);
  console.log('ooo', vm);
  showselectItem = false;
  showOtherItem = false;

  const code = `
        (function(itemParams) {
            ${widgetForm.events.appendItemTable}
        })(itemParams)
    `;
  const fn = new Function('itemParams', code);
  fn(itemParams);
}

/**
 * @author Coder
 * @date 2023/4/6
 * @des 确定选择的检测类别
 */
function backfillCategory(params) {
  showDetectType = false
  eval(widgetForm.events.openSelectItem)
}

/**
 * @author Coder
 * @date 2023/4/6
 * @des
 */
function e_openDetectType() {
  showDetectType = true
}

/**
 * @author Coder
 * @date 2023/3/24
 * @des 管理弹框内的区域
 */
function e_editBulletBox() {
  showAddWidget = true
  nextTick(() => {
    vm.$refs.AddWidget.init(widgetForm)
  })
}

/**
 * @author Coder
 * @date 2023/4/19
 * @des 初次渲染打开
 */
function init() {
  showLog = true
  doEvents()
}

/**
 * @author Coder
 * @date 2023/4/25
 * @des 查看详情打开
 */
function detailInfoInit(data) {
  showLog = true
  eval(widgetForm.events.detailInfoInitEvents)
}

/**
 * @author Coder
 * @date 2023/3/27
 * @des 自动执行弹框组件绑定的全局事件
 */
function doEvents() {
  if (widgetForm.openEvents) {
    for (let key in widgetForm.openEvents) {
      eval(widgetForm.openEvents[key])
    }
  }
}

function editInit(index, type = 'customer') {
  openLogType = type
  showLog = true
  editIndex = index
}

function e_close() {
  console.log('关闭')
  emit('close')
}

function e_bottomBtnEvents(events: string) {
  let doEvents = new Function('that', events)
  doEvents(vm)
}

function e_saveEdit(params: any) {
  showAddWidget = false
  const eventPayLoad: SaveAddFormParams = {params: params, index: editIndex}
  emit('saveAddForm', eventPayLoad)
}

function e_showEditor() {
  showKevinEditor = true
  nextTick(() => {
    vm.$refs.kevinCodeEditor.init({codeJson: widgetForm})
  })
}

function e_saveFormEditor(params) {
  showKevinEditor = false
  const payLoad: SaveAddFormParams = {params: params.codeJson, index: editIndex}
  emit('saveAddForm', payLoad)
}

/**
 * @author Coder
 * @date 2023/3/28
 * @des 快速查询目标节点
 */
function getNode(tree: Array<any>, treeChildrenName: string, sourceAttributeName: string, sourceAttributeValue: string): Object {
  let targetAttribute = {}
  if (Array.isArray(tree) && tree.length > 0) {
    tree.some(node => {
      if (node[sourceAttributeName] === sourceAttributeValue) {
        targetAttribute = node
        return true;
      } else if (node[treeChildrenName] !== undefined) {
        let temp = getNode(node[treeChildrenName], treeChildrenName, sourceAttributeName, sourceAttributeValue, targetAttribute)
        if (Object.keys(temp).length > 0) {
          targetAttribute = temp
          return true
        }
      }
    })
  }
  return targetAttribute
}

//关闭
function confirmCriteria(list: any, events: string) {
  console.log('指定回调', list)
  console.log('指定回调', events)
  showjudgmentCriteria = false
  new Function('that', 'list', events)(vm, list)
}

// 管理弹框脚本
function e_editBulletboxScript() {
  console.log(widgetForm)
  showbulletBoxScriptEditor = true
  nextTick(() => {
    vm.$refs.bulletBoxScriptEditor.init(widgetForm)
  })
}

// 保存弹框的脚本编辑
function e_saveBulletBoxScript(params: any) {
  showbulletBoxScriptEditor = false
  emit('saveBulletBoxScript', params)
}

// 开启单项编辑
function e_dosignleEdit(params: any) {
  showsignleEdit = true
  nextTick(() => {
    vm.$refs.signleEdit.init(params, 'bulletBox')
  })
}

// 保存单项编辑
function e_saveSignleEdit(info: any) {
  showsignleEdit = false
  emit('saveSignleEdit', info)
}

function render(createElement, context) {
  return (
      <div>
        <ml-dialog
            ref="KevinLogMlDialog" dia-log-show={showLog} dia-log-title={widgetForm.title}
            dia-log-width="60%"
            show-edit-drag={vm.$checkPermi(['micFoundation:entrustCommon:formlayout']) && openLogType == 'editBullet'}
            onConfirmFormDesgin={() => {
              emit('confirmFormDesgin')
            }} has-permi={true} onClose={() => {
          e_close()
        }}>
          <template v-slots:bologbody>
            <el-form ref="kevinLogForm" props={{model: form}} label-width="120px"
                     label-position={widgetForm.formLabelPosition ? widgetForm.formLabelPosition : 'top'}>
              {store.state.system.closeDrag ? '' : <el-row style="margin-bottom:10px">
                <el-col span={24}>
                  <el-button type="primary" size="small" onClick={() => {
                    e_editBulletBox()
                  }}>管理弹框内容
                  </el-button>
                  <el-button type="success" size="small" onClick={() => {
                    e_editBulletboxScript()
                  }}>弹框内容脚本
                  </el-button>
                  <el-button type="warning" size="small" onClick={() => {
                    e_showEditor()
                  }}>弹框内容JSON
                  </el-button>
                </el-col>
              </el-row>}
              <formRenders ref="formRender" formJSON={widgetForm.formList} form={form} group={Math.random()}
                           onSignleEdit={(params) => {
                             e_dosignleEdit()
                           }}/>
            </el-form>
          </template>
          <template v-slots:bologfooter>
            {
              widgetForm.bodyButtons.map(buttonInfo => {
                if (!buttonInfo.isHide) {
                  return (
                      <el-button
                          type={buttonInfo.type ? buttonInfo.type : 'primary'}
                          size={buttonInfo.size ? buttonInfo.size : 'small'}
                          onClick={() => {
                            eval(buttonInfo.events)
                          }}
                      >
                        {buttonInfo.label}
                      </el-button>
                  )
                }
              })
            }
          </template>
        </ml-dialog>
        {
          showAddWidget ?
              <AddWidget ref="AddWidget" editFor="bulletBox" businessConfigId={businessConfigId}
                         mainTableTags="ENTRUST_INFO_GIVE"
                         onClose={() => {
                           showAddWidget = false
                         }}
                         onSaveAddForm={(params) => {
                           e_saveEdit()
                         }}
              /> : ''

        }
        {
          showKevinEditor ? <kevinCodeEditor ref="kevinCodeEditor" onSave={(params) => {
            e_saveFormEditor(params)
          }} onClose={() => {
            showKevinEditor = false
          }}/> : ''
        }
        {
          showDetectType ?
              <DetectType
                  ref="DetectType"
                  visible={showDetectType}
                  onCancel={() => {
                    showDetectType = false
                  }}
                  onHandleClick={(params) => {
                    backfillCategory(params)
                  }}
              /> : ''

        }
        {
          this.showselectItem ? <selectItem ref="selectItem" onCancel={() => {
            console.log('g庇33')
            this.showselectItem = false
          }} onSaveItem={(params) => {
            this.e_saveItem(params)
          }}/> : ''
        }
        {
          this.showOtherItem ? <selectOther ref="selectItem2" onCancel={() => {
            console.log('故案123')
            this.showOtherItem = false
          }} onSaveItem={(params) => {
            this.e_saveItem(params)
          }}/> : ''
        }
        {
          this.showAddTestItems ? <AddTestItems ref="AddTestItems" onCancel={() => {
            console.log('f的')
            this.showselectItem = false
          }} onReload={(params) => {
            this.e_saveItem(params)
          }}/> : ''
        }
        {
          this.showjudgmentCriteria ? <judgmentCriteria ref="judgmentCriteria" onClose={(list, events) => {
            this.confirmCriteria(list, events)
          }}/> : ''
        }
        {
          this.showbulletBoxScriptEditor ? <bulletBoxScriptEditor ref="bulletBoxScriptEditor" onClose={() => {
            this.showbulletBoxScriptEditor = false
          }} onSaveBulletBoxScript={(params) => {
            this.saveBulletBoxScript(params)
          }}/> : ''
        }
        {
          this.showsignleEdit ? <signleEdit ref="signleEdit" onClose={() => {
            this.showsignleEdit = false
          }} onSaveSignleEdit={(info) => {
            this.e_saveSignleEdit(info)
          }}/> : ''
        }
      </div>
  )
}
</script>
