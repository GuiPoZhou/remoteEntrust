<script lang="jsx">

import {ElMessageBox, ElMessage} from "element-plus";
import {VueDraggableNext} from "vue-draggable-next";
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

export default {
  components: {
    draggable: VueDraggableNext,
    AddFormItem,
    kevinTable,
    kevinLog,
    formRender,
    kevinCodeEditor,
    AddWidget,
    photographyVue,
    scriptEditor,
    signleEdit
  },
  props: {
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
  },
  data() {
    return {
      showsignleEdit: false,
      activeName: '0',
      layoutParamsList: [],
      showScriptEditor: false,
      showAddFormItem: false,
      showKevinLog: false,
      dialogWidget: {},
      showKevinFormEditor: false,
      showAddWidget: false,
      editFor: '',//设计器当前环境
      showPhotographyVue: false,
      diyKevinImageParams: {}
    }
  },
  watch: {},
  created() {
    window.KevinFormthis = this
  },
  mounted() {
    console.log(this, 'thishits')
    /**
     * @author Coder
     * @date 2023/4/18
     * @des 执行表单tab绑定的方法
     */
    this.bolckFormParams.forEach((tabInfo, tabIndex) => {
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
  },
  methods: {
    /**
     * @author Coder
     * @date 2023/3/22
     * @des 打开添加样品弹框 并为该弹框进行复制操作
     */
    e_openSampleManageLog(dialogWidget) {
      this.dialogWidget = dialogWidget
      this.showKevinLog = true
      this.$nextTick(() => {
        this.$refs.kevinLog.init()
      })
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 显示代码编辑器
     */
    e_showKevinFormEditor(params) {
      this.showKevinFormEditor = true
      this.$nextTick(() => {
        this.$refs.kevinCodeEditor.init(params)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 保存
     */
    e_saveFormEditor(params) {
      this.showKevinFormEditor = false
      this.$emit('editBlockForm', params)
      // this.activeName = '0'
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 新增区域
     */
    e_addBlockInTab(tabindex) {
      ElMessageBox.confirm('确定要在当前tab下新增一个区域吗？').then(_ => {
        this.$emit('addBlockInTab', tabindex)
      })


    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des tab下 block删除
     */
    e_blockDeleteInTab(tabIndex, blockIndex) {
      ElMessageBox.confirm('确定删除当前区域吗？').then(_ => {
        this.$emit('blockDeleteInTab', {tabIndex, blockIndex})
      })

    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 开启选择区域项
     */
    e_doAddWidget(blockInfo) {
      this.editFor = 'mainForm'
      this.showAddWidget = true
      this.$nextTick(() => {
        this.$refs.AddWidget.init(blockInfo)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 保存添加的区域项
     */
    e_saveWidgetForm() {
      this.showAddWidget = false
      this.$emit('saveWidgetForm')
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 进入弹框
     */
    e_editBulletBox(scope) {
      this.showKevinLog = true
      this.dialogWidget = scope.row
      this.$nextTick(() => {
        this.$refs.kevinLog.init()
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 渲染弹框管理列表
     */
    renderPopTable() {
      let scopedSlots = {
        "action": (scope) => {
          return (
              <el-row>
                <el-col span={24}>
                  <el-button type="text" onClick={() => {
                    this.$emit('delteBulletBox', scope.$index)
                  }}>删除弹框
                  </el-button>
                  <el-button type="text" onClick={() => {
                    this.e_editBulletBox(scope)
                  }}>编辑弹框
                  </el-button>
                </el-col>
              </el-row>
          )
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
          <kevinTable key={Math.random()} scopedSlots={scopedSlots} border columns={columns} data={this.bulletBox}
                      style="width:100%;"></kevinTable>

      )

    },
    /**
     * @author Coder
     * @date 2023/3/25
     * @des 区块拖拽完成
     */
    e_draggableOver() {
      ElMessage.success('拖拽完成')
    },
    /**
     * @author Coder
     * @date 2023/4/4
     * @des 点击tab
     */
    tabClick() {

    },
    //打开高拍仪
    e_openPhotogray(params) {
      this.diyKevinImageParams = params
      this.showPhotographyVue = true
      this.$nextTick(() => {
        this.$refs.photographyVue.init()
      })
    },
    //回填高拍仪内容
    appendGpImage(list) {
      this.showPhotographyVue = false
      list.map(item => {
        let obj = {
          showUrl: item,
          type: 'base64'
        }
        this.diyKevinImageParams.options.fileList.push(obj)
      })
    },
    // doTabEvents(tabInfo,tabIndex){
    //     for(let key in tabInfo.events){
    //         eval(tabInfo.events[key])
    //     }
    // }
    // 打开全局事件脚本管理
    openGlobalScript({codeJson, index}) {
      this.showScriptEditor = true
      this.$nextTick(() => {
        this.$refs.scriptEditor.init(codeJson, index)
      })
    },
    saveScriptEditor(params) {
      this.showScriptEditor = false
      this.$emit('saveTabGlobalScript', params)
    },
    // 保存弹框脚本编辑
    saveBulletBoxScript(params) {
      this.$emit('saveBulletBoxScript', params)
    },
    //开启单项编辑
    e_dosignleEdit(params) {
      this.showsignleEdit = true
      this.$nextTick(() => {
        this.$refs.signleEdit.init(params, 'listParamsList')
      })
    },
    // 保存单项编辑
    e_saveSignleEdit(info) {
      this.showsignleEdit = false
      this.$emit('saveSignleEdit', info)
    },
  },
  render(createElement, context) {
    console.log(this.$store)
    return (
        <div class="kevinFormContainer">
          <el-tabs v-model={this.activeName} type="card" v-on:tab-click={(tab, event) => {
            this.$emit('tabClick', this.activeName)
          }}>
            {
              this.bolckFormParams.map((tabInfo, tabIndex) => {
                return (
                    <el-tab-pane label={tabInfo.tabTitle ? tabInfo.tabTitle : '看看自己写title了吗'}
                                 name={String(tabIndex)}>
                      {
                        this.$store.state.system.closeDrag ? '' :
                            <el-tooltip class="item" effect="light"
                                        content="管理维护该页签全局内自动执行脚本与手动执行脚本" placement="top-start">
                              <el-button type="success" size="small" style="margin-bottom:10px"
                                         onClick={() => {
                                           this.openGlobalScript({
                                             codeJson: tabInfo,
                                             index: tabIndex
                                           })
                                         }}>{tabInfo.tabTitle}页签全局脚本
                              </el-button>
                            </el-tooltip>
                      }
                      {
                        this.$store.state.system.closeDrag ? '' :
                            <el-button type="warning" size="small" style="margin-bottom:10px"
                                       onClick={() => {
                                         this.e_showKevinFormEditor({
                                           codeJson: tabInfo,
                                           index: tabIndex,
                                           type: 'tab'
                                         })
                                       }}>{tabInfo.tabTitle}页签JSON
                            </el-button>
                      }

                      <draggable list={tabInfo.formList} animation={340} item-key="id"
                                 disabled={this.$store.state.system.closeDrag} group={{
                        name: `Tab${tabIndex}`,
                        "item-key": "id",
                        pull: false,
                        put: false
                      }}
                                 ghostClass={this.ghostClass} onEnd={() => {
                        this.e_draggableOver()
                      }}
                                 className="drag-wrapper"
                      >
                        {

                          tabInfo.formList.map((blockInfo, blockIndex) => {
                            if (!blockInfo.isHide) {
                              return (

                                  <div class={this.$store.state.system.closeDrag ? '' : 'blockClass'}>
                                    {
                                      this.$store.state.system.closeDrag ? '' : <el-row>
                                        <el-col span={24}>

                                          <el-button type="success"
                                                     size="mini" onClick={() => {
                                            this.e_doAddWidget(blockInfo)
                                          }}>区域内容新增
                                          </el-button>
                                          <el-button type="danger" size="mini"
                                                     onClick={() => {
                                                       this.e_blockDeleteInTab(tabIndex, blockIndex)
                                                     }
                                                     }>删除当前区域
                                          </el-button>
                                          <el-button type="warning" size="mini"
                                                     style="margin-bottom:10px"
                                                     onClick={() => {
                                                       this.e_showKevinFormEditor({
                                                         codeJson: blockInfo,
                                                         index: blockIndex,
                                                         parentIndex: tabIndex,
                                                         type: 'block'
                                                       })
                                                     }}>当前区域JSON
                                          </el-button>
                                        </el-col>
                                      </el-row>
                                    }

                                    {
                                      blockInfo.title ? <el-divider
                                          content-position="left">{blockInfo.title}</el-divider> : ''
                                    }


                                    <el-row>
                                      <formRender blockInfo={blockInfo}
                                                  tabInfo={tabInfo}
                                                  formJSON={blockInfo.formList}
                                                  env={KevinFormthis.openEnv}
                                                  form={this.form} group={{
                                        name: `Block${blockIndex}`,
                                        pull: false,
                                        put: false
                                      }}
                                                  onShowSampleEdit={(dialogWidget) => {
                                                    this.e_openSampleManageLog(dialogWidget)
                                                  }}
                                                  onOpenPhotogray={(params) => {
                                                    this.e_openPhotogray(params)
                                                  }}
                                                  onSignleEdit={(params) => {
                                                    this.e_dosignleEdit(params)
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
                        this.$store.state.system.closeDrag ? '' : <el-row>
                          <el-col span={24}>
                            <el-button size="small" type="warning" style="width:100%;margin:20px 0"
                                       onClick={() => {
                                         this.e_addBlockInTab(tabIndex)
                                       }
                                       }>区域新增
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
            this.showKevinLog ?
                <kevinLog ref="kevinLog" open-env={KevinFormthis.openEnv} businessConfigId={this.businessConfigId}
                          widgetForm={this.dialogWidget}
                          onClose={() => {
                            this.showKevinLog = false
                          }} onSaveAddForm={() => {
                  this.e_saveWidgetForm()
                }} onSaveBulletBoxScript={(params) => {
                  this.saveBulletBoxScript(params)
                }} onSaveSignleEdit={(info) => {
                  this.e_saveSignleEdit
                }}/> : ''
          }
          {
            this.showKevinFormEditor ?
                <kevinCodeEditor ref="kevinCodeEditor" onSave={(params) => {
                  this.e_saveFormEditor(params)
                }} onClose={() => {
                  this.showKevinFormEditor = false
                }}/> : ''
          }
          {
            this.showAddWidget ?
                <AddWidget editFor={this.editFor} businessConfigId={this.businessConfigId} ref="AddWidget"
                           mainTableTags="ENTRUSTMENT_AGREEMENT"
                           onSaveAddForm={() => {
                             this.e_saveWidgetForm()
                           }} onClose={() => {
                  this.showAddWidget = false
                }}/> : ''
          }
          {
            this.showPhotographyVue ? <photographyVue ref="photographyVue" onClose={() => {
              this.showPhotographyVue = false
            }} onImgBaseList={(list) => {
              this.appendGpImage(list)
            }}/> : ''
          }
          {
            this.showScriptEditor ? <scriptEditor ref="scriptEditor" onClose={() => {
              this.showScriptEditor = false
            }} onSave={(params) => {
              this.saveScriptEditor(params)
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
