<template>

  <div>
    <!-- 添加或修改业务单运行实例对话框 -->
    <el-dialog v-model="showTableColumnConfig" :close-on-click-modal="false" :close-on-press-escape="false" :fullscreen="isFullScreen"
               :title="title"
               append-to-body height="100hv" width="100wv" @close="cancel">
      <el-row v-if="$store.state.user.roles.includes('admin')">
        <el-col :span="24">
          <el-button size="small" type="primary" @click="showMainForm">配置主表属性</el-button>
          <el-divider direction="vertical"/>
          <el-button size="small" type="success" @click="showRelationForm">添加关联表属性</el-button>
          <el-divider direction="vertical"/>
          <el-button size="small" type="success" @click="showAggregateForm">配置聚合查询</el-button>
          <el-divider direction="vertical"/>
          <el-button size="small" type="success" @click="preview">预览列表</el-button>
          <el-divider direction="vertical"/>
          <el-button size="small" type="success" @click="previewSql">预览Sql脚本</el-button>
        </el-col>
        <el-col :span="24">
          <el-divider></el-divider>
          <el-switch
              v-model="finalTableConfig.showMorePanel"
              :active-value="true"
              :inactive-value="false"
              active-text="启用高级搜索"
              inactive-text="关闭高级搜索"
          >
          </el-switch>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row>
        <el-col :span="24">
          <el-table
              ref="multipleTable"
              :data="finalTableConfig.allColumns"
              row-key="id"
              style="width: 100%">
            <el-table-column v-if="$store.state.user.roles.includes('admin')" class-name="handle" label="属性key"
                             prop="id" width="150"/>

            <el-table-column v-if="$store.state.user.roles.includes('admin')" label="属性别名"
                             prop="label">
              <template #default="scope">
                <el-input v-model="scope.row.aliasName" :disabled="scope.row.sourceType > 2"
                          placeholder="请输入属性别名"/>
              </template>
            </el-table-column>
            <el-table-column v-if="$store.state.user.roles.includes('admin')" label="属性类型" prop="label"
                             width="150">
              <template #default="scope">{{
                  scope.row.mateType === 1 ? '元属性' : scope.row.mateType === 2 ? '扩展' : '聚合'
                }}-
                {{ scope.row.sourceType === 1 ? '主表' : scope.row.sourceType === 2 ? '关联' : '聚合' }}
              </template>
            </el-table-column>
            <!--                        <el-table-column label="属性来源" prop="label" width="80"-->
            <!--                                         v-if="$store.state.user.roles.includes('admin')">-->
            <!--                            <template slot-scope="scope">-->
            <!--                                {{ scope.row.sourceType === 1 ? '主表' : scope.row.sourceType === 2 ? '关联表' : '聚合属性' }}-->
            <!--                            </template>-->
            <!--                        </el-table-column>-->
            <el-table-column label="属性label" prop="label">
              <template #default="scope">
                <el-input v-model="scope.row.label" placeholder="请输入列表属性label"/>
              </template>
            </el-table-column>
            <el-table-column label="列表隐藏" prop="hidden" width="50">
              <template #default="scope">
                <el-switch v-model="scope.row.hidden"/>
              </template>
            </el-table-column>
            <el-table-column label="导出数据" prop="hidden" width="50">
              <template #default="scope">
                <el-switch v-model="scope.row.export"/>
              </template>
            </el-table-column>
            <el-table-column label="允许排序" prop="sort" width="50">
              <template #default="scope">
                <el-switch v-model="scope.row.sort" @change="changeSort($event, scope.$index)"/>
              </template>
            </el-table-column>
            <el-table-column label="默认排序" prop="sort" width="50">
              <template #default="scope">
                <!--                                <el-switch v-model="scope.row.defaultSort" :disabled="!scope.row.sort" @change="changeDefaultSort($event, scope.$index)"/>-->
                <el-switch v-model="scope.row.defaultSort" :disabled="!scope.row.sort"/>
              </template>
            </el-table-column>
            <el-table-column label="排序顺序" prop="sort" width="80">
              <template #default="scope">
                <el-input v-model="scope.row.defaultSortNum" :disabled="!scope.row.defaultSort"
                          placeholder="请输入排序顺序"/>
              </template>
            </el-table-column>
            <el-table-column label="排序方式" prop="sort" width="100">
              <template #default="scope">
                <el-select slot="prepend" v-model="scope.row.sortType"
                           :disabled="!scope.row.defaultSort" :placeholder="'请选择查询逻辑'" placeholder="请选择">
                  <el-option :key="0" :value="0" label="降序"/>
                  <el-option :key="1" :value="1" label="升序"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="宽度" prop="width" width="80">
              <template #default="scope">
                <el-input v-model="scope.row.width" placeholder="请输入宽度"/>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="width" width="70">
              <template #default="scope">
                <el-link type="danger" @click="sortUp(scope.$index, scope.row)">↑上移↑</el-link>
                <el-link type="danger" @click="sortDown(scope.$index, scope.row)">↓下移↓</el-link>
              </template>
            </el-table-column>
            <el-table-column label="查询条件" prop="search" type="expand" width="50">
              <template #default="scope">
                <el-card class="box-card">
                  <div slot="header">
                    <span>[ {{ scope.row.label }} ] : 查询条件配置</span>
                  </div>
                  <div>
                    <el-table
                        :data="[scope.row]"
                    >
                      <el-table-column label="启用查询" prop="hidden" width="80">
                        <template #default="scope">
                          <el-switch v-model="scope.row.search"/>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" label="Having" prop="having"
                                       width="80">
                        <template #default="scope">
                          <el-switch v-model="scope.row.having"/>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" label="隐藏条件" prop="searchHidden"
                                       width="80">
                        <template #default="scope">
                          <el-switch v-model="scope.row.searchHidden"/>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" :disabled="!scope.row.search" label="渲染顺序(降序)"
                                       prop="queryOrderIndex"
                                       width="180">
                        <template #default="scope">
                          <el-input-number v-model="scope.row.queryOrderIndex" :min="0" controls-position="right"/>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" :disabled="!scope.row.search" label="栅格宽度" prop="gridWidth"
                                       width="180">
                        <template #default="scope">

                          <el-tooltip class="item"
                                      content="排除查询按钮部分,等分24列,渲染查询面板时会计算满足栅格总和<=24的查询条件,若>24,则出现高级搜索按钮,其他条件亦通过高级搜索面板渲染."
                                      effect="dark"
                                      placement="top">
                            <el-input-number v-model="scope.row.gridWidth" :max="24" :min="1"
                                             controls-position="right"/>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" :disabled="!scope.row.search" label="查询条件Label宽度"
                                       prop="labelWidth"
                                       width="180">
                        <template #default="scope">
                          <el-input-number v-model="scope.row.labelWidth" :min="0" controls-position="right"/>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" label="查询控件类型" prop="search"
                                       width="180">
                        <template #default="scope">
                          <el-select slot="prepend" v-model="scope.row.searchType" :disabled="!scope.row.search"
                                     :placeholder="'查询控件类型'" placeholder="请选择"
                                     @change="initSearchTypeValue(scope.row)">
                            <el-option :key="0" :value="0" label="文本"/>
                            <el-option :key="1" :value="1" label="数字"/>
                            <el-option :key="2" :value="2" label="下拉"/>
                            <el-option :key="7" :value="7" label="下拉树"/>
                            <el-option :key="4" :value="4" label="时间"/>
                            <el-option :key="5" :value="5" label="日期"/>
                            <el-option :key="6" :value="6" label="时间+日期"/>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" label="查询逻辑" prop="search"
                                       width="180">
                        <template #default="scope">
                          <el-select slot="prepend" v-model="scope.row.searchLogic"
                                     :disabled="!scope.row.search" :placeholder="'请选择查询逻辑'" placeholder="请选择"
                                     @change="initSearchLogic(scope.row)">
                            <el-option :key="0" :value="0" label="等于"/>
                            <el-option :key="10" :disabled="![5, 6].includes(scope.row.searchType)" :value="10"
                                       label="等于(动态日期)"/>
                            <el-option :key="1" :value="1" label="不等于"/>
                            <el-option :key="2" :value="2" label="包含"/>
                            <el-option :key="3" :value="3" label="大于"/>
                            <el-option :key="4" :value="4" label="大于等于"/>
                            <el-option :key="5" :value="5" label="小于"/>
                            <el-option :key="6" :value="6" label="小于等于"/>
                            <el-option :key="7" :disabled="![1, 4, 5, 6].includes(scope.row.searchType)" :value="7"
                                       label="区间(固定区间)"/>
                            <el-option :key="9" :disabled="![5, 6].includes(scope.row.searchType)" :value="9"
                                       label="区间(动态日期)"/>
                            <el-option :key="8" :disabled="![2].includes(scope.row.searchType)" :value="8"
                                       label="IN集合"/>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" label="系统参数" prop="searchHidden"
                                       width="80">
                        <template #default="scope">
                          <el-switch v-model="scope.row.sysQueryType"/>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="$store.state.user.roles.includes('admin')" align="center" label="默认查询条件"
                                       prop="label">
                        <template #default="scope">
                          <el-input v-if="scope.row.searchType === 0 && !scope.row.sysQueryType"
                                    v-model="scope.row.defaultQueryValue"
                                    class="input-with-select"
                                    placeholder="请输入默认查询条件"/>
                          <el-select v-if="scope.row.searchType === 0 && scope.row.sysQueryType" slot="prepend"
                                     v-model="scope.row.sysQueryValue" :clearable="true"
                                     :placeholder="'请输入默认查询条件'"
                                     placeholder="请选择"
                                     style="width: 100%">
                            <el-option :key="0" :value="0" label="登录人ID"/>
                            <el-option :key="1" :value="1" label="登录人nickname"/>
                            <el-option :key="2" :value="2" label="登录人部门ID"/>
                            <el-option :key="3" :value="3" label="登录人部门名称"/>
                          </el-select>
                          <el-input-number v-else-if="scope.row.searchType === 1 && scope.row.searchLogic !== 7" v-model="scope.row.defaultQueryValue"
                                           controls-position="right"/>
                          <el-row v-else-if="scope.row.searchType === 1 && scope.row.searchLogic === 7">
                            <el-col :span="24">
                              <NumberRange v-model="scope.row.defaultQueryValue"/>
                            </el-col>
                          </el-row>

                          <el-button v-else-if="scope.row.searchType === 2" size="small" type="primary"
                                     @click="selectOptionConfig(scope.row)">配置数据源
                          </el-button>

                          <el-button v-else-if="scope.row.searchType === 7" size="small" type="primary"
                                     @click="selectTreeOptionConfig(scope.row)">配置数据源
                          </el-button>
                          <el-row v-else-if="scope.row.searchType === 4">
                            <el-col :span="24">
                              <el-time-picker v-if="scope.row.searchLogic !== 7" v-model="scope.row.defaultQueryValue"

                                              placeholder="请选择时间" style="width: 100%"
                                              value-format="HH:mm:ss"/>
                              <el-time-picker v-if="scope.row.searchLogic === 7" v-model="scope.row.defaultQueryValue"
                                              end-placeholder="结束时间"
                                              is-range placeholder="选择时间范围"
                                              range-separator="至" start-placeholder="开始时间"
                                              style="width: 100%" value-format="HH:mm:ss"/>
                            </el-col>
                          </el-row>
                          <el-row v-else-if="scope.row.searchType === 5">
                            <el-col :span="24">
                              <el-date-picker v-if="![7, 9, 10].includes(scope.row.searchLogic)" v-model="scope.row.defaultQueryValue"
                                              :picker-options="pickerOptions" align="right" placeholder="选择日期" style="width: 100%"
                                              type="date"
                                              value-format="yyyy-MM-dd"/>
                              <el-date-picker v-if="scope.row.searchLogic === 7" v-model="scope.row.defaultQueryValue"
                                              :picker-options="pickerRangeOptions" align="right" end-placeholder="结束日期" range-separator="至"
                                              start-placeholder="开始日期" style="width: 100%"
                                              type="daterange" unlink-panels
                                              value-format="yyyy-MM-dd" @focus="dataPickerClick(scope.row)"/>

                              <div v-if="scope.row.searchLogic === 9">
                                <el-select slot="prepend" v-model="scope.row.dynamicDateType"
                                           :placeholder="'请选择查询逻辑'"
                                           placeholder="请选择" style="width: 100%">
                                  <el-option :key="0" :value="0" label="本周"/>
                                  <el-option :key="1" :value="1" label="本月"/>
                                  <el-option :key="2" :value="2" label="本季度"/>
                                </el-select>
                              </div>

                              <div v-if="scope.row.searchLogic === 10">
                                <el-select slot="prepend" v-model="scope.row.dynamicDateType"
                                           :placeholder="'请选择查询逻辑'"
                                           placeholder="请选择" style="width: 100%">
                                  <el-option :key="0" :value="0" label="当天"/>
                                  <el-option :key="1" :value="1" label="本周第一天"/>
                                  <el-option :key="2" :value="2" label="本月第一天"/>
                                  <el-option :key="3" :value="3" label="本季度第一天"/>
                                </el-select>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row v-else-if="scope.row.searchType === 6">
                            <el-col :span="24">
                              <el-date-picker v-if="![7, 9, 10].includes(scope.row.searchLogic)"
                                              v-model="scope.row.defaultQueryValue" :picker-options="pickerOptions"
                                              align="right" placeholder="选择日期时间"
                                              style="width: 100%"
                                              type="datetime"
                                              value-format="yyyy-MM-dd HH:mm:ss"/>
                              <el-date-picker v-if="scope.row.searchLogic === 7"
                                              v-model="scope.row.defaultQueryValue"
                                              :picker-options="pickerRangeOptions" align="right" end-placeholder="结束日期"
                                              range-separator="至" start-placeholder="开始日期" style="width: 100%"
                                              type="datetimerange" unlink-panels
                                              value-format="yyyy-MM-dd HH:mm:ss" @focus="dataPickerClick(scope.row)"/>

                              <div v-if="scope.row.searchLogic === 9">
                                <el-select slot="prepend" v-model="scope.row.dynamicDateType"
                                           :placeholder="'请选择查询逻辑'"
                                           placeholder="请选择" style="width: 100%">
                                  <el-option :key="0" :value="0" label="本周"/>
                                  <el-option :key="1" :value="1" label="本月"/>
                                  <el-option :key="2" :value="2" label="本季度"/>
                                </el-select>
                              </div>

                              <div v-if="scope.row.searchLogic === 10">
                                <el-select slot="prepend" v-model="scope.row.dynamicDateType"
                                           :placeholder="'请选择查询逻辑'"
                                           placeholder="请选择" style="width: 100%">
                                  <el-option :key="0" :value="0" label="当天"/>
                                  <el-option :key="1" :value="1" label="本周第一天"/>
                                  <el-option :key="2" :value="2" label="本月第一天"/>
                                  <el-option :key="3" :value="3" label="本季度第一天"/>
                                </el-select>
                              </div>
                            </el-col>
                          </el-row>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column v-if="$store.state.user.roles.includes('admin')" align="center" label="操作" prop="width"
                             width="80">
              <template #default="scope">
                <el-link type="danger" @click="removeTableColumn(scope.row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="showMain" v-model="showMain" :close-on-click-modal="false" :close-on-press-escape="false"
               :fullscreen="isFullScreen"
               :title="'配置主表属性'" :visible.sync="showMain" append-to-body
               width="1024px">
      <el-row>
        <el-col :span="12">
          <el-switch
              v-model="userDataScope"
              :active-value="1"
              :inactive-value="0"
              active-text="启用数据权限"
              inactive-text="关闭数据权限"
          >
          </el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="userDataScope === 1" :span="6">
          <el-input
              v-model="deptIdName"
              clearable
              placeholder="请输入部门ID列名称"
              size="small"
              style="margin-bottom: 20px"
          />
        </el-col>
        <el-col v-if="userDataScope === 1" :span="6">
          <el-input
              v-model="userIdName"
              clearable
              placeholder="请输入用户ID列名称"
              size="small"
              style="margin-bottom: 20px"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="runType !== undefined && runType !== null && runType !== 1" :span="8">
          <el-divider content-position="center">主表信息</el-divider>
          <el-input
              v-model="tableSearchName"
              clearable
              placeholder="请输入表名称"
              prefix-icon="el-icon-search"
              size="small"
              style="margin-bottom: 20px"
          ></el-input>
          <el-scrollbar style="height: 400px;">
            <el-tree
                ref="tree"
                :data="getTableListInfoList"
                :filter-node-method="filterNode"
                hight="400px"
                @node-click="handleMainCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="(runType !== undefined && runType !== null && runType !== 1) ? 8 : 12">
          <el-divider content-position="center">主表元属性</el-divider>
          <el-input
              v-model="mainColumnSearchName"
              clearable
              placeholder="请输入属性名称"
              prefix-icon="el-icon-search"
              size="small"
              style="margin-bottom: 20px"
          />
          <el-scrollbar style="height: 400px;">
            <el-tree
                ref="mainColumnTree"
                :check-on-click-node="true"
                :data="getMainColumnListInfoList"
                :filter-node-method="filterColumnNode"
                hight="400px"
                show-checkbox
                @check-change="handleMainColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col v-if="!finalTableConfig.version"
                :span="(runType !== undefined && runType !== null && runType !== 1) ? 8 : 12">
          <el-divider content-position="center">主表扩展属性</el-divider>
          <el-row>
            <el-col v-if="(runType !== undefined && runType !== null && runType !== 1)" :span="12">
              <el-select v-model="relationBusinessConfigId" filterable placeholder="请选择业务类型" style="width: 100%"
                         @change="relationMainSelectChange">
                <el-option
                    v-for="item in businessConfigList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="(runType !== undefined && runType !== null && runType !== 1) ? 12 : 24">
              <el-select v-model="exDataKey" filterable placeholder="请选择关联表主键" style="width: 100%">
                <el-option
                    v-for="item in getMainColumnListInfoList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="24">
              <el-input
                  v-model="columnExSearchName"
                  clearable
                  placeholder="请输入属性名称"
                  prefix-icon="el-icon-search"
                  size="small"
                  style="margin-bottom: 20px"
              />
              <el-scrollbar style="height: 400px;">
                <el-tree
                    ref="exMainDataTree"
                    :check-on-click-node="true"
                    :data="exDataOptions"
                    :filter-node-method="filterColumnNode"
                    hight="400px"
                    show-checkbox
                    @check-change="handleColumnCheckChange">
                </el-tree>
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-if="finalTableConfig.version && finalTableConfig.version === 'v2'" :span="8">
          <el-divider content-position="center">主表扩展属性</el-divider>
          <el-row>
            <el-col :span="24">
              <el-input
                  v-model="columnExSearchName"
                  clearable
                  placeholder="请输入属性名称"
                  prefix-icon="el-icon-search"
                  size="small"
                  style="margin-bottom: 20px"
              />
              <el-scrollbar style="height: 400px;">
                <el-tree
                    ref="exMainDataTree"
                    :check-on-click-node="true"
                    :data="exDataOptions"
                    :filter-node-method="filterColumnNode"
                    hight="400px"
                    show-checkbox
                    @check-change="handleColumnCheckChange">
                </el-tree>
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMain">确定</el-button>
        <el-button @click="cancelMain">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="showRelation" :close-on-click-modal="false" :close-on-press-escape="false"
               :fullscreen="isFullScreen" :title="'配置关联表属性'"
               :visible.sync="showRelation" append-to-body width="1024px">
      <el-row>

        <el-col :span="8">
          <el-divider content-position="center">关联表信息</el-divider>
          <el-input
              v-model="tableSearchName"
              clearable
              placeholder="请输入表名称"
              prefix-icon="el-icon-search"
              size="small"
              style="margin-bottom: 20px"
          />
          <el-scrollbar style="height: 400px;">
            <el-tree
                ref="tree"
                :data="getTableListInfoList"
                :filter-node-method="filterNode"
                hight="400px"
                @node-click="handleCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="8">
          <el-divider content-position="center">关联表元属性</el-divider>
          <el-row>
            <el-col :span="12">
              <el-select v-model="relationKeyLeft" filterable placeholder="请选择主表关联属性"
                         style="width: 100%">
                <el-option
                    v-for="item in getMainColumnListInfoList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="relationKeyRight" filterable placeholder="请选择关联表属性"
                         style="width: 100%">
                <el-option
                    v-for="item in getColumnListInfoList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-input
              v-model="columnSearchName"
              clearable
              placeholder="请输入属性名称"
              prefix-icon="el-icon-search"
              size="small"
              style="margin-bottom: 20px"
          />
          <el-scrollbar style="height: 400px;">
            <el-tree
                ref="columnTree"
                :check-on-click-node="true"
                :data="getColumnListInfoList"
                :filter-node-method="filterColumnNode"
                hight="400px"
                show-checkbox
                @check-change="handleColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col v-if="!finalTableConfig.version" :span="8">
          <el-divider content-position="center">关联表扩展属性</el-divider>
          <el-row>
            <el-col :span="12">
              <el-select v-model="relationBusinessConfigId" filterable placeholder="请选择业务类型"
                         style="width: 100%" @change="relationSelectChange">
                <el-option
                    v-for="item in businessConfigList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="relationExDataKey" filterable placeholder="请选择关联表主键"
                         style="width: 100%">
                <el-option
                    v-for="item in getColumnListInfoList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-input
              v-model="columnSearchName"
              clearable
              placeholder="请输入属性名称"
              prefix-icon="el-icon-search"
              size="small"
              style="margin-bottom: 20px"
          />
          <el-scrollbar style="height: 400px;">
            <el-tree
                ref="exDataTree"
                :check-on-click-node="true"
                :data="relationExDataOptions"
                :filter-node-method="filterColumnNode"
                hight="400px"
                show-checkbox
                @check-change="handleColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col v-if="finalTableConfig.version && finalTableConfig.version === 'v2'" :span="8">
          <el-divider content-position="center">关联表扩展属性</el-divider>
          <el-input
              v-model="columnExSearchName"
              clearable
              placeholder="请输入属性名称"
              prefix-icon="el-icon-search"
              size="small"
              style="margin-bottom: 20px"
          />
          <el-scrollbar style="height: 400px;">
            <el-tree
                ref="exDataTree"
                :check-on-click-node="true"
                :data="relationExDataOptions"
                :filter-node-method="filterColumnNode"
                hight="400px"
                show-checkbox
                @check-change="handleColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRelation">确定</el-button>
        <el-button @click="cancelRelation">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="showSelectOptionConfig" :close-on-click-modal="false" :close-on-press-escape="false"
               :fullscreen="isFullScreen"
               :title="'配置下拉数据源'" :visible.sync="showSelectOptionConfig" append-to-body width="1024px">
      <el-row>
        <el-form ref="optionsConfigForm" :model="selectOptionRow" @submit.native.prevent>
          <el-col :span="24">
            <el-radio-group v-model="selectOptionRow.selectOptionType" size="small" @input="selectOptionTypeChange">
              <el-radio-button :label="1">静态数据</el-radio-button>
              <el-radio-button :label="2">远程数据</el-radio-button>
              <el-radio-button :label="3">关联数据源</el-radio-button>
            </el-radio-group>
            <div style="display: inline-block;margin-left: 50px;">
              <el-switch
                  v-model="selectOptionRow.multipleOptions"
                  :active-value="2"
                  :inactive-value="1"
                  active-text="多选"
                  inactive-text="单选"
                  @change="multipleOptionsChange"
              >
              </el-switch>
            </div>
            <div style="display: inline-block;margin-left: 50px;">
              <el-switch
                  v-model="selectOptionRow.staticKeyType"
                  :active-value="2"
                  :inactive-value="1"
                  active-text="字符型Key"
                  inactive-text="数字型Key"
              ></el-switch>
            </div>
            <div style="display: inline-flex;margin-left: 50px;flex-direction: row;">
              <el-tag
                  v-for="tag in selectOptionRow.defaultQueryValue"
                  v-if="selectOptionRow.multipleOptions === 2"
                  :key="tag"
                  :disable-transitions="false"
                  closable
                  @close="handleClose(tag)">
                {{ tag }}
              </el-tag>
              <el-tag
                  v-if="selectOptionRow.multipleOptions === 1 && selectOptionRow.defaultQueryValue"
                  :disable-transitions="false"
                  closable
                  @close="handleClose(selectOptionRow.defaultQueryValue)">
                {{ selectOptionRow.defaultQueryValue }}
              </el-tag>
              <el-input
                  v-if="inputVisible && selectOptionRow.staticKeyType === 2"
                  ref="saveTagInput"
                  v-model="inputValue"
                  class="input-new-tag"
                  size="small"
                  @blur="handleInputConfirm"
                  @keyup.enter.native="handleInputConfirm"
              >
              </el-input>
              <el-input-number
                  v-if="inputVisible && selectOptionRow.staticKeyType === 1"
                  ref="saveTagInput"
                  v-model="inputValue"
                  class="input-new-tag"
                  controls-position="right"
                  size="small"
                  @blur="handleInputConfirm"
                  @keyup.enter.native="handleInputConfirm"/>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加默认值</el-button>
            </div>
            <el-divider/>
          </el-col>

        </el-form>
      </el-row>
      <el-row v-if="selectOptionRow.selectOptionType === 1">
        <el-divider content-position="left">配置下拉选项</el-divider>
        <el-button type="text" @click="addRow">+ 增加行</el-button>
        <el-col :span="24">
          <el-table
              :data="selectOptionRow.staticOptions"
              border
              ooltip-effect="dark"
          >
            <el-table-column align="center" label="选项值">
              <template #default="scope">
                <el-input v-if="selectOptionRow.staticKeyType === 1" v-model="scope.row.key"
                          placeholder="请输入Key"/>
                <el-input-number v-else-if="selectOptionRow.staticKeyType === 2" v-model="scope.row.key"
                                 controls-position="right"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="选项名称">
              <template #default="scope">
                <el-input v-model="scope.row.label" placeholder="请输入Label"/>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" prop="operation">
              <template #default="scope">
                <el-button size="small" type="text" @click="deleteRow(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="selectOptionRow.selectOptionType === 2">
        <el-divider content-position="left">配置远程数据源</el-divider>
        <el-form ref="dynamicOptionsForm" :model="selectOptionRow" label-width="400px">
          <el-col :span="24">
            <el-form-item label="远程数据源Url">
              <el-input v-model="selectOptionRow.dynamicUrl" placeholder="请输入远程数据源URL"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="远程数据源Key名称">
              <el-input v-model="selectOptionRow.dynamicKeyName" placeholder="请输入远程数据源Key名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="远程数据源Label名称">
              <el-input v-model="selectOptionRow.dynamicLabelName"
                        placeholder="请输入远程数据源Label名称"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row v-if="selectOptionRow.selectOptionType === 3">

        <el-divider content-position="left">关联数据源</el-divider>
        <el-col :span="24">
          <el-form ref="dynamicOptionsForm" :model="selectOptionRow" label-width="150px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="数据源">
                  <el-select v-model="selectOptionRow.bindDataSourceId" filterable placeholder="请选择"
                             style="width: 100%" @change="bindDataSourceChange">
                    <el-option
                        v-for="item in dataSourceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数据对象">
                  <el-tree ref="pTree" :current-node-key="selectOptionRow.selectTreeNode ? selectOptionRow.selectTreeNode[0] : null"
                           :data="treeData" :default-expanded-keys="selectOptionRow.selectTreeNode" :expand-on-click-node="false"
                           :highlight-current="true" :props="defaultProps" default-expand-all
                           node-key='id'
                           @node-click="handleNodeClick"></el-tree>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数据源Key名称">
                  <el-select v-model="selectOptionRow.dataSourceKey" placeholder="数据源Key名称" style="width: 100%">
                    <el-option v-for="item in parentDataRelationData" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="远程数据源Label名称">
                  <el-select v-model="selectOptionRow.dataSourceLabel" placeholder="远程数据源Label名称"
                             style="width: 100%">
                    <el-option v-for="item in parentDataRelationData" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSelectOptionConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="showTreeSelectOptionConfig" :close-on-click-modal="false" :close-on-press-escape="false"
               :fullscreen="isFullScreen" :title="'配置下拉树数据源'"
               :visible.sync="showTreeSelectOptionConfig" append-to-body width="1024px">
      <el-row>
        <el-col :span="24">
          <el-form ref="dynamicOptionsForm" :model="selectOptionRow" label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="数据源">
                  <el-select v-model="selectOptionRow.bindDataSourceId" filterable placeholder="请选择"
                             style="width: 100%" @change="bindDataSourceChange">
                    <el-option
                        v-for="item in dataSourceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数据对象">
                  <el-tree ref="pTree" :current-node-key="selectOptionRow.selectTreeNode ? selectOptionRow.selectTreeNode[0] : null"
                           :data="treeData" :default-expanded-keys="selectOptionRow.selectTreeNode" :expand-on-click-node="false"
                           :highlight-current="true" :props="defaultProps" default-expand-all
                           node-key='id'
                           @node-click="handleNodeClick"></el-tree>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="数据源Key名称">
                  <el-select v-model="selectOptionRow.dataSourceKey" placeholder="数据源Key名称" style="width: 100%">
                    <el-option v-for="item in parentDataRelationData" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="远程数据源Label名称">
                  <el-select v-model="selectOptionRow.dataSourceLabel" placeholder="远程数据源Label名称"
                             style="width: 100%">
                    <el-option v-for="item in parentDataRelationData" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="父级节点名称">
                  <el-select v-model="selectOptionRow.dataSourceParentKey" placeholder="父级节点名称"
                             style="width: 100%">
                    <el-option v-for="item in parentDataRelationData" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="系统参数">
                  <el-switch v-model="selectOptionRow.sysQueryType"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="默认条件">
                  <el-input v-if="!selectOptionRow.sysQueryType" v-model="selectOptionRow.defaultQueryValue"
                            class="input-with-select"
                            placeholder="请输入默认查询条件"/>
                  <el-select v-if="selectOptionRow.sysQueryType" v-model="selectOptionRow.sysQueryValue"
                             :clearable="true"
                             :placeholder="'请输入默认查询条件'"
                             placeholder="请选择">
                    <el-option :key="0" :value="0" label="登录人ID"/>
                    <el-option :key="1" :value="1" label="登录人nickname"/>
                    <el-option :key="2" :value="2" label="登录人部门ID"/>
                    <el-option :key="3" :value="3" label="登录人部门名称"/>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTreeSelectOptionConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="showAggregateConfig" :close-on-click-modal="false" :fullscreen="isFullScreen"
               :title="'配置聚合查询'" :visible.sync="showAggregateConfig" append-to-body
               width="1024px">
      <el-divider content-position="center">已配置表明细</el-divider>
      <el-row>
        <el-col :span="24">
          <el-scrollbar style="height: 400px;">
            <el-table
                :data="getAllTableInfoList"
                border
                ooltip-effect="dark"
            >
              <el-table-column align="center" label="表名" prop="id"/>
              <el-table-column align="center" label="备注" prop="label"/>
              <el-table-column align="center" label="类型" prop="type"/>
              <el-table-column align="center" label="查询别名-表" prop="alias"/>
              <el-table-column align="center" label="查询别名-扩展" prop="aliasEx"/>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-divider content-position="center">聚合表明细</el-divider>
      <el-row>
        <el-col :span="24">
          <el-button size="small" type="primary" @click="addAggregateTable">添加聚合表</el-button>
          <el-divider/>
        </el-col>
        <el-col :span="24">
          <el-scrollbar style="height: 400px;">
            <el-table
                :data="aggregateConfig.tableList"
                border
                ooltip-effect="dark"
            >
              <el-table-column align="center" label="Join子句脚本" prop="script">
                <template #default="scope">
                  <el-input v-model="scope.row.script" placeholder="请输入Join子句脚本"/>
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注" prop="commit">
                <template #default="scope">
                  <el-input v-model="scope.row.commit" placeholder="请输入备注"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="width" width="80">
                <template #default="scope">
                  <el-link type="danger" @click="removeAggregateTable(scope.row, scope.$index)">删除
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-divider content-position="center">聚合列明细</el-divider>
      <el-row>
        <el-col :span="24">
          <el-button size="small" type="primary" @click="addAggregateColumn">添加聚合列</el-button>
          <el-divider/>
        </el-col>

        <el-col :span="24">
          <el-scrollbar style="height: 400px;">
            <el-table
                :data="aggregateConfig.columnList"
                border
                ooltip-effect="dark"
            >
              <el-table-column align="center" label="聚合列脚本" prop="script">
                <template #default="scope">
                  <el-input v-model="scope.row.script" placeholder="请输入聚合列脚本"/>
                </template>
              </el-table-column>
              <el-table-column align="center" label="别名" prop="id">
                <template #default="scope">
                  <el-input v-model="scope.row.id" placeholder="请输入别名"/>
                </template>
              </el-table-column>
              <el-table-column align="center" label="属性label" prop="label">
                <template #default="scope">
                  <el-input v-model="scope.row.label" placeholder="请输入属性label"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="width" width="80">
                <template #default="scope">
                  <el-link type="danger" @click="removeTableColumn(scope.row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-form ref="form" :model="aggregateConfig" label-width="150px">
        <el-form-item label="Group By 子句">
          <el-input v-model="aggregateConfig.groupScript" type="textarea"/>
        </el-form-item>
        <el-form-item label="Having 子句" label-width="150px">
          <el-input v-model="aggregateConfig.havingScript" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAggregateConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="showPreViewSql" :close-on-click-modal="false" :close-on-press-escape="false"
               :fullscreen="isFullScreen" :title="'预览Sql'"
               :visible.sync="showPreViewSql" append-to-body width="1024px">
      <Codemirror
          ref="myEditor"
          :options="codemirrorOptions"
          :value="preViewSqlStr"
          style="height:100%;"
      ></Codemirror>
      <!--            <span>{{ preViewSqlStr }}</span>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closePreView">确定</el-button>
        <el-button v-clipboard:copy="preViewSqlStr"
                   v-clipboard:error="firstCopyError"
                   v-clipboard:success="firstCopySuccess"
                   type="primary"
        >复制
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTableInfo,
  getColumnInfo,
  getBusinessConfig,
  getColumnInfoWithBusinessId,
  getExDataConfigOptions,
  saveTableListConfig,
  getTableListConfig,
  getTableInfoWithBusinessConfigId,
  getDataSourceAllList,
  getDataSourceTreeData,
  getDataSourceConfig,
  getExColumnConfigList,
} from "@/api/tableColumnConfig/api.js";
import Sortable from "sortablejs";
import NumberRange from "@/components/executionTemplate/tableColumnConfig/queryParam/NumberRange.vue";

import sqlFormatter from "sql-formatter";
import {Codemirror} from 'vue-codemirror'
import VueClipBoard from 'vue-clipboard2'

export default {
  name: "tableColumnConfig",
}
</script>
<script setup>
import {
  getTableInfo,
  getColumnInfo,
  getBusinessConfig,
  getColumnInfoWithBusinessId,
  getExDataConfigOptions,
  saveTableListConfig,
  getTableListConfig,
  getTableInfoWithBusinessConfigId,
  getDataSourceAllList,
  getDataSourceTreeData,
  getDataSourceConfig,
  getExColumnConfigList,
} from "@/api/tableColumnConfig/api.js";
import Sortable from "sortablejs";
import NumberRange from "@/components/executionTemplate/tableColumnConfig/queryParam/NumberRange.vue";

import sqlFormatter from "sql-formatter";
import {Codemirror} from 'vue-codemirror'
import VueClipBoard from 'vue-clipboard2'
import {ElMessage, ElMessageBox} from 'element-plus'

const vm = getCurrentInstance().proxy
const emit = defineEmits(['closeTableColumnsConfig'])
const prop = defineProps({
  businessConfigId: {
    type: String,
    default: null,
  },
  runType: {
    type: Number,
    default: 1,
  }
})
let businessConfigId = ref(prop.businessConfigId);
let runType = ref(prop.runType)
let showTableColumnConfig = ref(false)
let title = ref('列表配置')
let activeNames = ref(['1'])
let isFullScreen = ref(true)
let mainColumnListInfo = ref([])
let mainTableInfo = ref(null)
let tableListInfo = ref([])
let tableSearchName = ref(null)
let columnSearchName = ref(null)
let columnExSearchName = ref(null)
let mainColumnSearchName = ref(null)
let columnListInfo = ref([])
let businessConfigList = ref(null)
let relationBusinessConfigId = ref(null)
let exDataOptions = ref([])
let exDataKey = ref(null)
let relationExDataOptions = ref([])
let relationKeyLeft = ref(null)
let relationKeyRight = ref(null)
let relationExDataKey = ref(null)
let relationTableName = ref(null)
let showMain = ref(false)
let showRelation = ref(false)
let showSelectOptionConfig = ref(false)
let showTreeSelectOptionConfig = ref(false)
let showAggregateConfig = ref(false)
let aggregateConfig = reactive({
  tableList: [],
  columnList: [],
  groupScript: null,
  havingScript: null,
})
let finalTableConfig = reactive({})
let configId = ref(null)
let selectOptionRow = reactive({
  selectOptionType: 1,
  staticKeyType: 1,
})
let preViewSqlStr = ref('')
let showPreViewSql = ref(false)

let userDataScope = ref(2)
let deptIdName = ref('create_dept_id')
let userIdName = ref('create_user_id')

let pickerOptions = reactive({
  disabledDate(time) {
    return time.getTime() > Date.now();
  },
  shortcuts: [{
    text: '今天',
    onClick(picker) {
      picker.$emit('pick', new Date());
    }
  }, {
    text: '昨天',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      picker.$emit('pick', date);
    }
  }, {
    text: '一周前',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', date);
    }
  }]
})

let pickerRangeOptions = reactive({
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }]
})

let codemirrorOptions = reactive({
  mode: 'text/sql',
  lineNumbers: true,
  lineWrapping: true
})
let bindDataSourceId = ref(null)
let dataSourceOptions = ref([])
let selectTreeNode = ref([])
let selectTreeLabel = ref(null)
let defaultProps = reactive({
  children: 'children',
  label: 'label',
  id: 'id',
})
let parentDataRelationData = ref([])
let treeData = ref([])
let form = reactive({
  id: null,
  templateId: null,
  name: '',
  dataSourceType: 1,
  relationshipType: 1,
  parentDataId: null,
  parentDataName: null,
  parentDataRelationKey: null,
  remark: null,
})
let inputVisible = ref(false)
let inputValue = ref(null)
let specialTimeConditions = ref(null)


const getTableListInfoList = computed(() => {
  let result = [];
  tableListInfo.value.forEach(item => {
    let record = {
      id: item.tableName,
      label: item.tableName + ' | (' + item.tableComment + ')',
      // label: item.tableComment ,
    }
    result.push(record);
  })
  return result;
})

const getColumnListInfoList = computed(() => {
  let result = [];
  columnListInfo.value.forEach(item => {
    let record = {
      id: item.columnName,
      label: item.columnName + ' | (' + item.columnComment + ')',
      // label: item.columnComment ,
    }
    result.push(record);
  })
  return result;
})
const getAllTableInfoList = computed(() => {
  let result = [];
  result.push({
    id: mainTableInfo.value.tableName,
    label: mainTableInfo.value.tableName + ' | (' + mainTableInfo.value.tableComment + ')',
    type: '主表',
    alias: 'main',
    aliasEx: 'mainEx',
  })
  if (finalTableConfig.relationConfig) {
    finalTableConfig.relationConfig.forEach((item, index) => {
      result.push({
        id: item.relationTableName,
        label: getTableListInfoList.filter((subItem) => subItem.id === item.relationTableName)[0].label,
        type: '关联表',
        alias: 'r' + index,
        aliasEx: 'rEx' + index,
      })
    })
  }
  return result;
})

watch(tableSearchName, (newValue, oldValue) => {
  vm.$refs.tree.filter(newValue)
})
watch(columnSearchName, (val) => {
  vm.$refs.columnTree.filter(val)
})
watch(columnExSearchName, (val) => {
  if (vm.$refs.exDataTree) {
    vm.$refs.exDataTree.filter(val)
  }
  if (vm.$refs.exMainDataTree) {
    vm.$refs.exMainDataTree.filter(val)
  }
})
watch(mainColumnSearchName, (val) => {
  vm.$refs.mainColumnTree.filter(val)
})

function init() {
  showTableColumnConfig.value = true
}

function submitForm() {
  let saveData = {
    id: configId.value,
    businessConfigId: businessConfigId.value,
    listConfig: finalTableConfig,
  };
  saveTableListConfig(saveData).then(res => {
    ElMessage.success(res.msg)
    emit('closeTableColumnsConfig')
  })
}

function cancel() {
  emit('closeTableColumnsConfig')
}

function handleCheckChange(data, checked, indeterminate) {
  relationTableName.value = data.id
  relationBusinessConfigId.value = null
  getColumnInfo(data.id).then(res => {
    if (res && res.data) {
      columnListInfo.value = res.data
    }
  })

  if (!finalTableConfig.version) {
    getBusinessConfig(data.id).then(res => {
      if (res && res.data) {
        businessConfigId.value = res.data
      }
    })
  } else if (finalTableConfig.version && finalTableConfig.version === 'v2') {
    refreshExColumnConfig(data.id, 'relationExDataOptions')
  }
}

// 筛选节点
function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

function handleColumnCheckChange(data, checked, indeterminate) {
}

function handleMainColumnCheckChange(data, checked, indeterminate) {
}

function filterColumnNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

function relationSelectChange(value) {
  getExDataConfigOptions(value).then(res => {
    if (res && res.data) {
      relationExDataOptions.value = res.data
    }
  })
}

function showMainForm() {
  showMain.value = true;
}

function showRelationForm() {
  showRelation.value = true;
}

function submitMain() {
  let mateColumns = vm.$refs.mainColumnTree.getCheckedNodes()
  mateColumns.forEach(item => {
    item.sourceType = 1
    item.mateType = 1
    item.sortNum = 100
    item.tableAlias = 'main'
    item.aliasName = toCamel(item.id)
    if (!item.having) {
      item.having = false
    }
  });
  let dynamicColumns = vm.$refs.exMainDataTree.getCheckedNodes();
  dynamicColumns.forEach(item => {
    item.sourceType = 1
    item.mateType = 2
    item.sortNum = 100
    item.id = item.key
    item.aliasName = toCamel(item.key)
    if (!finalTableConfig.version) {
      item.tableAlias = 'mainEx'
    } else if (finalTableConfig.version && finalTableConfig.version === 'v2') {
      item.tableAlias = 'main'
    }
    if (!item.having) {
      item.having = false
    }
  })
  if (finalTableConfig && finalTableConfig.mateConfig) {
    if (mateColumns && mateColumns.length > 0) {
      finalTableConfig.mateConfig.mateColumns.push(...mateColumns)
    }
    if (dynamicColumns && dynamicColumns.length > 0) {
      finalTableConfig.mateConfig.dynamicColumns.push(...dynamicColumns)
    }
    if (businessConfigId) {
      finalTableConfig.mateConfig.businessConfigId = businessConfigId.value
    }
    if (exDataKey.value) {
      finalTableConfig.mateConfig.exDataKey = exDataKey.value
    }
    finalTableConfig.mateConfig.userDataScope = userDataScope.value
    finalTableConfig.mateConfig.userIdName = userIdName.value
    finalTableConfig.mateConfig.deptIdName = deptIdName.value
    finalTableConfig.mateConfig.mainTableName = mainTableInfo.value.tableName
  } else {
    let configs = {
      mateColumns,
      dynamicColumns,
      exDataKey: exDataKey.value,
      businessConfigId: businessConfigId.value,
      userDataScope: userDataScope.value,
      deptIdName: deptIdName.value,
      userIdName: userIdName.value,
      mainTableName: mainTableInfo.value.tableName

    }
    Object.assign(finalTableConfig.mateConfig, configs)
  }
  if (finalTableConfig.mateConfig.mateColumns) {
    let hash = {};
    let result = finalTableConfig.mateConfig.mateColumns.reduce((preVal, curVal) => {
      hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
      return preVal;
    }, []);
    finalTableConfig.mateConfig.mateColumns = result
  }
  if (finalTableConfig.mateConfig.dynamicColumns) {
    let hash = {};
    let result = finalTableConfig.mateConfig.dynamicColumns.reduce((preVal, curVal) => {
      hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
      return preVal;
    }, []);
    finalTableConfig.mateConfig.dynamicColumns = result
  }
  if (!finalTableConfig.relationConfig) {
    finalTableConfig.relationConfig = []
  }
  if (!finalTableConfig.aggregateConfig) {
    finalTableConfig.aggregateConfig = {
      tableList: [],
      columnList: [],
    }
  }
  processAllColumns()
  cancelMain();
}

function submitRelation() {
  let mateColumns = vm.$refs.columnTree.getCheckedNodes()
  mateColumns.forEach(item => {
    item.sourceType = 2
    item.mateType = 1
    item.sortNum = 100
    item.aliasName = toCamel(item.id)
    if (!item.having) {
      item.having = false
    }
  })
  let dynamicColumns = vm.$refs.exDataTree.getCheckedNodes();
  dynamicColumns.forEach(item => {
    item.sourceType = 2
    item.mateType = 2
    item.sortNum = 100
    item.id = item.key
    item.aliasName = toCamel(item.key)
    if (!item.having) {
      item.having = false
    }
  })
  if (!finalTableConfig.relationConfig) {
    finalTableConfig.relationConfig = []
  }
  let relationConfig = {
    mateColumns,
    dynamicColumns,
    exDataKey: relationExDataKey.value,
    relationKeyLeft: relationKeyLeft.value,
    relationKeyRight: relationKeyRight.value,
    relationTableName: relationTableName.value,
    businessConfigId: relationBusinessConfigId.value,
  };
  if ((mateColumns && mateColumns.length > 0) || (dynamicColumns && dynamicColumns.length > 0)) {
    finalTableConfig.relationConfig.push(relationConfig);
  }
  processAllColumns();
  cancelRelation();
}

function cancelMain() {
  showMain.value = false;
}

function cancelRelation() {
  this.showRelation = false;
}

function processAllColumns() {
  let mainConfig;
  if (finalTableConfig.mateConfig) {
    let mainMateColumns = finalTableConfig.mateConfig.mateColumns;
    let dynamicColumns = finalTableConfig.mateConfig.dynamicColumns;
    mainMateColumns.forEach(item => {
      item.tableAlias = 'main'
      if (!item.hasOwnProperty("having")) {
        item.having = false
      }
    })
    dynamicColumns.forEach(item => {
      if (!finalTableConfig.version) {
        item.tableAlias = 'mainEx'
      } else if (finalTableConfig.version && finalTableConfig.version === 'v2') {
        item.tableAlias = 'main'
      }
      if (!item.hasOwnProperty("having")) {
        item.having = false
      }
    })
    mainConfig = [...mainMateColumns, ...dynamicColumns];
  }
  if (finalTableConfig.relationConfig) {
    finalTableConfig.relationConfig.forEach((item, index) => {
      let mainMateColumns = item.mateColumns;
      let dynamicColumns = item.dynamicColumns;
      mainMateColumns.forEach(subItem => {
        subItem.tableAlias = 'r' + index
        if (!subItem.hasOwnProperty("having")) {
          item.having = false
        }
      })
      dynamicColumns.forEach(subItem => {
        if (!finalTableConfig.version) {
          subItem.tableAlias = 'rEx' + index;
        } else if (finalTableConfig.version && finalTableConfig.version === 'v2') {
          subItem.tableAlias = 'r' + index;
        }
        if (!subItem.hasOwnProperty("having")) {
          subItem.having = false
        }
      })
      mainConfig.push(...mainMateColumns);
      mainConfig.push(...dynamicColumns);
    })
  }
  if (finalTableConfig.aggregateConfig && finalTableConfig.aggregateConfig.columnList && finalTableConfig.aggregateConfig.columnList.length > 0) {
    let columnList = finalTableConfig.aggregateConfig.columnList;
    mainConfig.push(...columnList);
  }
  let finalMainConfig = mainConfig;
  // let hash = {};
  // let finalMainConfig = mainConfig.reduce((preVal, curVal) => {
  //     hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
  //     return preVal;
  // }, []);
  finalMainConfig.forEach(item => {
    if (!item.hasOwnProperty('sortNum')) {
      item.sortNum = 100
    }
  })
  finalMainConfig = finalMainConfig.sort(function (a, b) {
    return a.sortNum - b.sortNum;
  });
  finalTableConfig.allColumns = finalMainConfig
  initSort();
}

function removeTableColumn(row) {
  ElMessageBox.confirm('确认删除[' + row.label + ']配置?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (row.sourceType === 1) {
      if (row.mateType === 1) {
        finalTableConfig.mateConfig.mateColumns = finalTableConfig.mateConfig.mateColumns.filter(item => item.id !== row.id)
      } else if (row.mateType === 2) {
        finalTableConfig.mateConfig.dynamicColumns = finalTableConfig.mateConfig.dynamicColumns.filter(item => item.id !== row.id)
      }
    } else if (row.sourceType === 2) {
      if (row.mateType === 1) {
        finalTableConfig.relationConfig.forEach(item => {
          item.mateColumns = item.mateColumns.filter(subItem => subItem.id !== row.id)
        })
      } else {
        finalTableConfig.relationConfig.forEach(item => {
          item.dynamicColumns = item.dynamicColumns.filter(subItem => subItem.id !== row.id)
        })
      }
    } else {
      finalTableConfig.aggregateConfig.columnList = finalTableConfig.aggregateConfig.columnList.filter(item => item.id !== row.id)
    }
    if (finalTableConfig.relationConfig) {
      finalTableConfig.relationConfig.forEach((item, index) => {
        if (item.mateColumns.length === 0 && item.dynamicColumns.length === 0) {
          finalTableConfig.relationConfig.splice(index, 1);
        }
      })
    }
    processAllColumns();
    ElMessage({
      type: 'success',
      message: '删除成功!'
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}

//上移操作
function sortUp(index, row) {
  let temp = finalTableConfig.allColumns[index - 1];
  if (!temp) {
    return;
  }
  row.sortNum = index - 1
  temp.sortNum = index;
  processAllColumns();
}

//下移操作
function sortDown(index, row) {
  let temp = finalTableConfig.allColumns[index + 1];
  if (!temp) {
    return;
  }
  row.sortNum = index - 1
  temp.sortNum = index;
  processAllColumns();
}

function initSort() {
  const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[1];
  if (!el) {
    return;
  }
  console.log(' document.querySelectorAll(\'.el-table__body-wrapper > table > tbody\')', document.querySelectorAll('.el-table__body-wrapper > table > tbody'));
  // const sortable = new Sortable(el, options);
  // 根据具体需求配置options配置项
  const sortable = new Sortable(el, {

    handle: '.handle', // handle's class
    onEnd({newIndex, oldIndex}) {
      const currRow = finalTableConfig.allColumns.splice(oldIndex, 1)[0]
      finalTableConfig.allColumns.splice(newIndex, 0, currRow)
      finalTableConfig.allColumns[newIndex]['sortNum'] = newIndex;
      // evt.oldIndex 是当前拖动的行，evt.newIndex 是放置到的位置。
      // 我们有了 evt.oldIndex 和 evt.newIndex 这两个参数做索引，我们可以根据绑定在表格上面的 data 这个 Array 找到两个相应的记录。就可以针对数据进行操作啦。
    }
  })
}

function preview() {
  vm.parentRouter.push('/micFoundation/previewDynamicList?businessConfigId=' + businessConfigId);
}

function selectOptionConfig(row) {
  Object.assign(selectOptionRow, row)
  if (!selectOptionRow.hasOwnProperty('selectOptionType')) {
    selectOptionRow.selectOptionType = 1
    selectOptionRow.staticOptions = []
    selectOptionRow.staticKeyType = 1
  }
  showSelectOptionConfig.value = !showSelectOptionConfig.value
  if (selectOptionRow.selectOptionType === 3) {
    getDataSourceAllList().then(res => {
      if (res && res.data) {
        let tempData = [];
        res.data.forEach(item => {
          tempData.push({
            value: item.id,
            label: item.name
          })
        })
        dataSourceOptions.value = tempData
        console.log(res.data);
        if (selectOptionRow.bindDataSourceId) {
          getDataSourceTreeData(selectOptionRow.bindDataSourceId).then(res => {
            if (res && res.data) {
              treeData.value = res.data
            }
          })
        }
        if (selectOptionRow.selectTreeNode) {
          getDataSourceConfig(selectOptionRow.selectTreeNode).then(res => {
            parentDataRelationData.value.splice(0);
            parentDataRelationData.value = res.data.dataSourceConfig.allColumns
          })
        }
      }
    })
  }
}

function selectTreeOptionConfig(row) {
  Object.assign(selectOptionRow, row)
  if (!selectOptionRow.hasOwnProperty('selectOptionType')) {
    selectOptionRow.selectOptionType = 3
    selectOptionRow.staticOptions = []
    selectOptionRow.staticKeyType = 1
  }
  showTreeSelectOptionConfig.value = !showTreeSelectOptionConfig.value
  getDataSourceAllList().then(res => {
    if (res && res.data) {
      let tempData = [];
      res.data.forEach(item => {
        tempData.push({
          value: item.id,
          label: item.name
        })
      })
      dataSourceOptions.value = tempData
      console.log(res.data);
      if (selectOptionRow.bindDataSourceId) {
        getDataSourceTreeData(selectOptionRow.bindDataSourceId).then(res => {
          if (res && res.data) {
            treeData.value = res.data
          }
        })
      }
      if (selectOptionRow.selectTreeNode) {
        getDataSourceConfig(selectOptionRow.selectTreeNode).then(res => {
          parentDataRelationData.value.splice(0);
          parentDataRelationData.value = res.data.dataSourceConfig.allColumns
        })
      }
    }
  })
}

function submitSelectOptionConfig() {
  showSelectOptionConfig.value = !showSelectOptionConfig.value;
}

function submitTreeSelectOptionConfig() {
  showTreeSelectOptionConfig.value = !showTreeSelectOptionConfig.value;
}

function addRow() {
  let list = {
    key: null,
    label: null,
    default: false,
  }
  selectOptionRow.staticOptions.push(list);
}

// 删除行
function deleteRow(index, row) {
  selectOptionRow.staticOptions.splice(index, 1)
}

function changeOptionDefault(row, index) {
  if (row.default) {
    selectOptionRow.staticOptions.forEach((item, optionIndex) => {
      if (index !== optionIndex) {
        item.default = false;
      }
    })
  }
}

function initSearchTypeValue(row) {
  row.defaultQueryValue = null
  row.searchLogic = 0
}

function initSearchLogic(row) {
  if (row.searchLogic !== 7 && row.defaultQueryValue instanceof Array) {
    row.defaultQueryValue = row.defaultQueryValue[0]
  } else if (row.searchLogic === 7) {
    row.defaultQueryValue = null
  }
}

function showAggregateForm() {
  showAggregateConfig.value = !showAggregateConfig.value;
}

function submitAggregateConfig() {
  finalTableConfig.aggregateConfig = aggregateConfig
  showAggregateConfig.value = !showAggregateConfig.value;
  processAllColumns();
}

function addAggregateTable() {
  aggregateConfig.tableList.push({
    script: '',
    commit: '',
  })
}

function removeAggregateTable(row, index) {
  aggregateConfig.tableList.splice(index, 1);
}

function addAggregateColumn() {
  aggregateConfig.columnList.push({
    script: '',
    sourceType: 3,
    mateType: 3,
    id: '',
    label: '',
    sortNum: 100,
  })
}

function previewSql() {
  if (finalTableConfig.version === 'v2') {
    previewSqlV2()
    return
  }
  let sql = 'select ';
  if (finalTableConfig.meteConfig.mateColumn) {
    for (let index in finalTableConfig.meteConfig.mateColumns) {
      let item = finalTableConfig.mateConfig.mateColumns[index];
      sql += item.tableAlias + '.' + item.id + ' as ' + (!item.aliasName ? item.id : item.aliasName) + ', ';
    }
  }
  if (finalTableConfig.mateConfig.dynamicColumns) {
    for (let index in finalTableConfig.mateConfig.dynamicColumns) {
      let item = finalTableConfig.mateConfig.dynamicColumns[index];
      sql += 'JSON_UNQUOTE(mainEx.ex_form_data -> \'$.' + item.id + '\') as ' + (!item.aliasName ? item.id : item.aliasName) + ', ';
    }
  }
  if (finalTableConfig.relationConfig) {
    for (let index in finalTableConfig.relationConfig) {
      let item = finalTableConfig.relationConfig[index];
      if (item.mateColumns) {
        for (let subIndex in item.mateColumns) {
          let subItem = item.mateColumns[subIndex];
          sql += subItem.tableAlias + '.' + subItem.id + ' as ' + (!subItem.aliasName ? subItem.id : subItem.aliasName) + ', ';
        }
      }
      if (item.dynamicColumns) {
        for (let subIndex in item.dynamicColumns) {
          let subItem = item.dynamicColumns[subIndex];
          sql += 'JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') as ' + (!subItem.aliasName ? subItem.id : subItem.aliasName) + ', ';
        }
      }
    }
  }
  if (finalTableConfig.aggregateConfig && finalTableConfig.aggregateConfig.columnList) {
    for (let index in finalTableConfig.aggregateConfig.columnList) {
      let item = finalTableConfig.aggregateConfig.columnList[index];
      sql += item.script + ' as ' + item.id + ', ';
    }
  }
  sql = sql.slice(0, sql.length - 2);
  sql += ' from ' + mainTableInfo.value.tableName + ' main';
  if (finalTableConfig.mateConfig.dynamicColumns && finalTableConfig.mateConfig.dynamicColumns.length > 0) {
    sql += ' left join env_ex_form_data as mainEx on mainEx.business_id = main.' + finalTableConfig.mateConfig.exDataKey + ' and mainEx.business_config_id = ' + finalTableConfig.mateConfig.businessConfigId;
  }
  if (finalTableConfig.relationConfig) {
    for (let index in finalTableConfig.relationConfig) {
      let item = finalTableConfig.relationConfig[index];
      sql += ' left join ' + item.relationTableName + ' r' + index + ' on main.' + item.relationKeyLeft + ' = r' + index + '.' + item.relationKeyRight
    }
  }
  if (finalTableConfig.aggregateConfig && finalTableConfig.aggregateConfig.tableList.length > 0) {
    for (let index in finalTableConfig.aggregateConfig.tableList) {
      let item = finalTableConfig.aggregateConfig.tableList[index];
      sql += ' ' + item.script + ' ';
    }
  }
  sql += ' where true ';
  if (finalTableConfig.mateConfig.mateColumns) {
    for (let index in finalTableConfig.mateConfig.mateColumns) {
      let item = finalTableConfig.mateConfig.mateColumns[index];
      if (item && item.search && !item.having) {
        switch (item.searchLogic) {
          case 0:
            sql += ' and main.' + item.id + ' = ? ';
            break;
          case 1:
            sql += ' and main.' + item.id + ' != ? ';
            break;
          case 2:
            sql += ' and main.' + item.id + ' like concat(\'%\', ?, \'%\')';
            break;
          case 3:
            sql += ' and main.' + item.id + ' > ? ';
            break;
          case 4:
            sql += ' and main.' + item.id + ' >= ? ';
            break;
          case 5:
            sql += ' and main.' + item.id + ' < ? ';
            break;
          case 6:
            sql += ' and main.' + item.id + ' <= ? ';
            break;
          case 7:
            sql += ' and main.' + item.id + ' between ? and ? ';
            break;
          case 8:
            if (item.multipleOptions === 1) {
              sql += ' and main.' + item.id + ' = ? ';
            } else {
              sql += ' and main.' + item.id + ' in (?)';
            }
            break;

        }
      }
    }
  }
  if (finalTableConfig.mateConfig.dynamicColumns) {
    for (let index in finalTableConfig.mateConfig.dynamicColumns) {
      let item = finalTableConfig.mateConfig.dynamicColumns[index];
      if (item && item.search && !item.having) {
        switch (item.searchLogic) {
          case 0:
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' = ? ';
            break;
          case 1:
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' != ? ';
            break;
          case 2:
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' like concat(\'%\', ?, \'%\') ';
            break;
          case 3:
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' > ? ';
            break;
          case 4:
            sql += ' and main.' + item.id + ' >= ? ';
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' >= ? ';
            break;
          case 5:
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' < ? ';
            break;
          case 6:
            sql += ' and main.' + item.id + ' <= ? ';
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' <= ? ';
            break;
          case 7:
            sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' between ? and ? ';
            break;
          case 8:
            if (item.multipleOptions === 1) {
              sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' = ? ';
            } else {
              sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' in (?) ';
            }
            break;

        }
      }
    }
  }
  if (finalTableConfig.relationConfig) {
    for (let index in finalTableConfig.relationConfig) {
      let item = finalTableConfig.relationConfig[index];
      if (item.mateColumns) {
        for (let subIndex in item.mateColumns) {
          let subItem = item.mateColumns[index];
          if (subItem && subItem.search && !subItem.having) {
            console.log(subItem);
            switch (subItem.searchLogic) {
              case 0:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                break;
              case 1:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' != ? ';
                break;
              case 2:
                console.log('search', subItem)
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' like concat(\'%\', ?, \'%\')';
                break;
              case 3:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' > ? ';
                break;
              case 4:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' >= ? ';
                break;
              case 5:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' < ? ';
                break;
              case 6:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' <= ? ';
                break;
              case 7:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' between ? and ? ';
                break;
              case 8:
                if (item.multipleOptions === 1) {
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                } else {
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' in (?)';
                }
                break;

            }
          }
        }
      }
      if (item.dynamicColumns) {
        for (let subIndex in item.dynamicColumns) {
          let subItem = item.dynamicColumns[subIndex];
          if (subItem && subItem.search && !subItem.having) {
            switch (item.searchLogic) {
              case 0:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') = ? ';
                break;
              case 1:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') != ? ';
                break;
              case 2:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') like concat(\'%\', ?, \'%\')';
                break;
              case 3:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') > ? ';
                break;
              case 4:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') >= ? ';
                break;
              case 5:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') < ? ';
                break;
              case 6:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') <= ? ';
                break;
              case 7:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') between ? and ? ';
                break;
              case 8:
                if (item.multipleOptions === 1) {
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') = ? ';
                } else {
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') in (?) ';
                }
                break;


            }
          }
        }
      }
    }
  }
  if (finalTableConfig.allColumns.filter(item => item.sort).length > 0) {
    sql += ' order by ';
    for (let index in finalTableConfig.allColumns) {
      let item = finalTableConfig.allColumns[index];
      if (item.sort) {
        sql += (item.aliasName ? item.aliasName : item.id) + ' DESC, '
      }
    }
    sql = sql.slice(0, sql.length - 2);
  }
  sql += ' limit 10';
  showPreViewSql.value = true;
  preViewSqlStr.value = sql;
  beautifyCode();
}

function previewSqlV2() {
  let sql = 'select ';
  if (finalTableConfig.mateConfig.mateColumns) {
    for (let index in finalTableConfig.mateConfig.mateColumns) {
      let item = finalTableConfig.mateConfig.mateColumns[index];
      sql += item.tableAlias + '.' + item.id + ' as ' + (!item.aliasName ? item.id : item.aliasName) + ', ';
    }
  }
  if (finalTableConfig.mateConfig.dynamicColumns) {
    for (let index in finalTableConfig.mateConfig.dynamicColumns) {
      let item = finalTableConfig.mateConfig.dynamicColumns[index];
      sql += 'JSON_UNQUOTE(main.extended_data -> \'$.' + item.id + '\') as ' + (!item.aliasName ? item.id : item.aliasName) + ', ';
    }
  }
  if (finalTableConfig.relationConfig) {
    for (let index in finalTableConfig.relationConfig) {
      let item = finalTableConfig.relationConfig[index];
      if (item.mateColumns) {
        for (let subIndex in item.mateColumns) {
          let subItem = item.mateColumns[subIndex];
          sql += subItem.tableAlias + '.' + subItem.id + ' as ' + (!subItem.aliasName ? subItem.id : subItem.aliasName) + ', ';
        }
      }
      if (item.dynamicColumns) {
        for (let subIndex in item.dynamicColumns) {
          let subItem = item.dynamicColumns[subIndex];
          sql += 'JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') as ' + (!subItem.aliasName ? subItem.id : subItem.aliasName) + ', ';
        }
      }
    }
  }
  if (finalTableConfig.aggregateConfig && finalTableConfig.aggregateConfig.columnList) {
    for (let index in finalTableConfig.aggregateConfig.columnList) {
      let item = finalTableConfig.aggregateConfig.columnList[index];
      sql += item.script + ' as ' + item.id + ', ';
    }
  }
  sql = sql.slice(0, sql.length - 2);
  sql += ' from ' + mainTableInfo.value.tableName + ' main';
  if (finalTableConfig.relationConfig) {
    for (let index in finalTableConfig.relationConfig) {
      let item = finalTableConfig.relationConfig[index];
      sql += ' left join ' + item.relationTableName + ' r' + index + ' on main.' + item.relationKeyLeft + ' = r' + index + '.' + item.relationKeyRight
    }
  }
  if (finalTableConfig.aggregateConfig && finalTableConfig.aggregateConfig.tableList.length > 0) {
    for (let index in finalTableConfig.aggregateConfig.tableList) {
      let item = finalTableConfig.aggregateConfig.tableList[index];
      sql += ' ' + item.script + ' ';
    }
  }
  sql += ' where true ';
  if (finalTableConfig.mateConfig.mateColumns) {
    for (let index in finalTableConfig.mateConfig.mateColumns) {
      let item = finalTableConfig.mateConfig.mateColumns[index];
      if (item && item.search && !item.having) {
        switch (item.searchLogic) {
          case 0:
            sql += ' and main.' + item.id + ' = ? ';
            break;
          case 1:
            sql += ' and main.' + item.id + ' != ? ';
            break;
          case 2:
            sql += ' and main.' + item.id + ' like concat(\'%\', ?, \'%\')';
            break;
          case 3:
            sql += ' and main.' + item.id + ' > ? ';
            break;
          case 4:
            sql += ' and main.' + item.id + ' >= ? ';
            break;
          case 5:
            sql += ' and main.' + item.id + ' < ? ';
            break;
          case 6:
            sql += ' and main.' + item.id + ' <= ? ';
            break;
          case 7:
            sql += ' and main.' + item.id + ' between ? and ? ';
            break;
          case 8:
            if (item.multipleOptions === 1) {
              sql += ' and main.' + item.id + ' = ? ';
            } else {
              sql += ' and main.' + item.id + ' in (?) ';
            }
            break;

        }
      }
    }
  }
  if (finalTableConfig.mateConfig.dynamicColumns) {
    for (let index in finalTableConfig.mateConfig.dynamicColumns) {
      let item = finalTableConfig.mateConfig.dynamicColumns[index];
      if (item && item.search && !item.having) {
        switch (item.searchLogic) {
          case 0:
            sql += ' and main.extended_data -> \'$.' + item.id + '\' = ? ';
            break;
          case 1:
            sql += ' and main.extended_data -> \'$.' + item.id + '\' != ? ';
            break;
          case 2:
            sql += ' and main.extended_data -> \'$.' + item.id + '\' like concat(\'%\', ?, \'%\') ';
            break;
          case 3:
            sql += ' and main.extended_data -> \'$.' + item.id + '\' > ? ';
            break;
          case 4:
            sql += ' and main.' + item.id + ' >= ? ';
            sql += ' and main.extended_data -> \'$.' + item.id + '\' >= ? ';
            break;
          case 5:
            sql += ' and main.extended_data -> \'$.' + item.id + '\' < ? ';
            break;
          case 6:
            sql += ' and main.' + item.id + ' <= ? ';
            sql += ' and main.extended_data -> \'$.' + item.id + '\' <= ? ';
            break;
          case 7:
            sql += ' and main.extended_data -> \'$.' + item.id + '\' between ? and ? ';
            break;
          case 8:
            if (item.multipleOptions === 1) {
              sql += ' and main.extended_data -> \'$.' + item.id + '\' = ? ';
            } else {
              sql += ' and main.extended_data -> \'$.' + item.id + '\' in (?) ';
            }
            break;

        }
      }
    }
  }
  if (finalTableConfig.relationConfig) {
    for (let index in finalTableConfig.relationConfig) {
      let item = finalTableConfig.relationConfig[index];
      if (item.mateColumns) {
        for (let subIndex in item.mateColumns) {
          let subItem = item.mateColumns[index];
          if (subItem && subItem.search && !subItem.having) {
            console.log(subItem);
            switch (subItem.searchLogic) {
              case 0:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                break;
              case 1:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' != ? ';
                break;
              case 2:
                console.log('search', subItem)
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' like concat(\'%\', ?, \'%\')';
                break;
              case 3:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' > ? ';
                break;
              case 4:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' >= ? ';
                break;
              case 5:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' < ? ';
                break;
              case 6:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' <= ? ';
                break;
              case 7:
                sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' between ? and ? ';
                break;
              case 8:
                if (item.multipleOptions === 1) {
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                } else {
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' in (?) ';
                }
                break;

            }
          }
        }
      }
      if (item.dynamicColumns) {
        for (let subIndex in item.dynamicColumns) {
          let subItem = item.dynamicColumns[subIndex];
          if (subItem && subItem.search && !subItem.having) {
            switch (item.searchLogic) {
              case 0:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') = ? ';
                break;
              case 1:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') != ? ';
                break;
              case 2:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') like concat(\'%\', ?, \'%\')';
                break;
              case 3:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') > ? ';
                break;
              case 4:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') >= ? ';
                break;
              case 5:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') < ? ';
                break;
              case 6:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') <= ? ';
                break;
              case 7:
                sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') between ? and ? ';
                break;
              case 8:
                if (item.multipleOptions === 1) {
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') = ? ';
                } else {
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') in (?) ';
                }
                break;

            }
          }
        }
      }
    }
  }
  if (finalTableConfig.aggregateConfig.groupScript) {
    sql += ' ' + finalTableConfig.aggregateConfig.groupScript;
    sql += ' having true';
    if (finalTableConfig.mateConfig.mateColumns) {
      for (let index in finalTableConfig.mateConfig.mateColumns) {
        let item = finalTableConfig.mateConfig.mateColumns[index];
        if (item && item.search && item.having) {
          switch (item.searchLogic) {
            case 0:
              sql += ' and main.' + item.id + ' = ? ';
              break;
            case 1:
              sql += ' and main.' + item.id + ' != ? ';
              break;
            case 2:
              sql += ' and main.' + item.id + ' like concat(\'%\', ?, \'%\')';
              break;
            case 3:
              sql += ' and main.' + item.id + ' > ? ';
              break;
            case 4:
              sql += ' and main.' + item.id + ' >= ? ';
              break;
            case 5:
              sql += ' and main.' + item.id + ' < ? ';
              break;
            case 6:
              sql += ' and main.' + item.id + ' <= ? ';
              break;
            case 7:
              sql += ' and main.' + item.id + ' between ? and ? ';
              break;
            case 8:
              if (item.multipleOptions === 1) {
                sql += ' and main.' + item.id + ' = ? ';
              } else {
                sql += ' and main.' + item.id + ' in (?) ';
                ;
              }
              break;

          }
        }
      }
    }
    if (finalTableConfig.mateConfig.dynamicColumns) {
      for (let index in finalTableConfig.mateConfig.dynamicColumns) {
        let item = finalTableConfig.mateConfig.dynamicColumns[index];
        if (item && item.search && item.having) {
          switch (item.searchLogic) {
            case 0:
              sql += ' and main.extended_data -> \'$.' + item.id + '\' = ? ';
              break;
            case 1:
              sql += ' and main.extended_data -> \'$.' + item.id + '\' != ? ';
              break;
            case 2:
              sql += ' and main.extended_data -> \'$.' + item.id + '\' like concat(\'%\', ?, \'%\') ';
              break;
            case 3:
              sql += ' and main.extended_data -> \'$.' + item.id + '\' > ? ';
              break;
            case 4:
              sql += ' and main.' + item.id + ' >= ? ';
              sql += ' and main.extended_data -> \'$.' + item.id + '\' >= ? ';
              break;
            case 5:
              sql += ' and main.extended_data -> \'$.' + item.id + '\' < ? ';
              break;
            case 6:
              sql += ' and main.' + item.id + ' <= ? ';
              sql += ' and main.extended_data -> \'$.' + item.id + '\' <= ? ';
              break;
            case 7:
              sql += ' and main.extended_data -> \'$.' + item.id + '\' between ? and ? ';
              break;
            case 8:
              if (item.multipleOptions === 1) {
                sql += ' and main.extended_data -> \'$.' + item.id + '\' = ? ';
              } else {
                sql += ' and main.extended_data -> \'$.' + item.id + '\' in (?) ';
              }
              break;

          }
        }
      }
    }
    if (finalTableConfig.relationConfig) {
      for (let index in finalTableConfig.relationConfig) {
        let item = finalTableConfig.relationConfig[index];
        if (item.mateColumns) {
          for (let subIndex in item.mateColumns) {
            let subItem = item.mateColumns[index];
            if (subItem && subItem.search && subItem.having) {
              switch (item.searchLogic) {
                case 0:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                  break;
                case 1:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' != ? ';
                  break;
                case 2:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' like concat(\'%\', ?, \'%\')';
                  break;
                case 3:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' > ? ';
                  break;
                case 4:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' >= ? ';
                  break;
                case 5:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' < ? ';
                  break;
                case 6:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' <= ? ';
                  break;
                case 7:
                  sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' between ? and ? ';
                  break;
                case 8:
                  if (item.multipleOptions === 1) {
                    sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                  } else {
                    sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' in (?) ';
                  }
                  break;

              }
            }
          }
        }
        if (item.dynamicColumns) {
          for (let subIndex in item.dynamicColumns) {
            let subItem = item.dynamicColumns[subIndex];
            if (subItem && subItem.search && subItem.having) {
              switch (item.searchLogic) {
                case 0:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') = ? ';
                  break;
                case 1:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') != ? ';
                  break;
                case 2:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') like concat(\'%\', ?, \'%\')';
                  break;
                case 3:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') > ? ';
                  break;
                case 4:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') >= ? ';
                  break;
                case 5:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') < ? ';
                  break;
                case 6:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') <= ? ';
                  break;
                case 7:
                  sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') between ? and ? ';
                  break;
                case 8:
                  if (item.multipleOptions === 1) {
                    sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') = ? ';
                  } else {
                    sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.extended_data -> \'$.' + subItem.id + '\') in (?) ';
                  }
                  break;

              }
            }
          }
        }
      }
    }
  }

  if (finalTableConfig.allColumns.filter(item => item.sort).length > 0) {
    sql += ' order by ';
    for (let index in finalTableConfig.allColumns) {
      let item = finalTableConfig.allColumns[index];
      if (item.sort) {
        sql += (item.aliasName ? item.aliasName : item.id) + ' DESC, '
      }
    }
    sql = sql.slice(0, sql.length - 2);
  }
  sql += ' limit 10';
  showPreViewSql.value = true;
  preViewSqlStr.value = sql;
  beautifyCode();
}

function closePreView() {
  showPreViewSql.value = false;
}

function changeSort(value, index) {
  console.log(value, index);
  if (!value) {
    finalTableConfig.allColumns[index].defaultSort = false
  }
}

function changeDefaultSort(value, index) {
  if (value) {
    finalTableConfig.allColumns.forEach((item, num) => {
      if (index !== num) {
        item.defaultSort = false
      }
    })
  }
  console.log(value, index);
}

function beautifyCode() {
  console.log('sqlFormatter', sqlFormatter);
  preViewSqlStr.value = sqlFormatter.format(preViewSqlStr.value);
}

function firstCopySuccess() {
  ElMessage.success('复制成功')
}

function firstCopyError() {
  ElMessage.error('复制失败')
}

function selectOptionTypeChange(val) {
  console.log('selectOptionTypeChange', val);
  if (val === 3) {
    getDataSourceAllList().then(res => {
      if (res && res.data) {
        let tempData = [];
        res.data.forEach(item => {
          tempData.push({
            value: item.id,
            label: item.name
          })
        })
        dataSourceOptions.value = tempData
        console.log(res.data);
      }
    })
  }
}

function bindDataSourceChange(val) {
  console.log(val);
  getDataSourceTreeData(val).then(res => {
    if (res && res.data) {
      treeData.value = res.data
    }
  })
}

function handleNodeClick(data) {
  console.log('handleNodeClick', data.id, data);
  selectOptionRow.selectTreeNode = [data.id];
  selectOptionRow.selectTreeLabel = data.label
  getDataSourceConfig(data.id).then(res => {
    parentDataRelationData.value.splice(0)
    parentDataRelationData.value = res.data.dataSourceConfig.allColumns;
  })
}

function handleMainCheckChange(data) {
  console.log('handleMainCheckChange', data);
  if (!mainTableInfo.value) {
    mainTableInfo.value = {};
  }
  mainTableInfo.value.tableName = data.id;
  relationTableName.value = data.id
  relationBusinessConfigId.value = null
  getMainColumnInfo(data.id);
  if (!finalTableConfig.version) {
    getBusinessConfig(data.id).then(res => {
      if (res && res.data) {
        businessConfigList.value = res.data
      }
    })
  } else if (finalTableConfig.version && finalTableConfig.version === 'v2') {
    refreshExColumnConfig(data.id, 'exDataOptions');
  }
}

function getMainColumnInfo(id) {
  getColumnInfo(id).then(res => {
    if (res && res.data) {
      mainColumnListInfo.value = res.data
    }
  })
}

function refreshExColumnConfig(tableName, dataName) {
  getExColumnConfigList(tableName).then(res => {
    if (res && res.data) {
      dataName = res.data
    }
  })
}

function relationMainSelectChange(value) {
  getExDataConfigOptions(value).then(res => {
    if (res && res.data) {
      exDataOptions.value = res.data
    }
  })
}

function toCamel(str) {
  return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
    return $1 + $2.toUpperCase();
  });
}

function handleClose(tag) {
  if (selectOptionRow.multipleOptions === 1) {
    selectOptionRow.defaultQueryValue = null;
  } else {
    selectOptionRow.defaultQueryValue.splice(selectOptionRow.defaultQueryValue.indexOf(tag), 1);
  }
}

function showInput() {
  inputVisible.value = true;
  nextTick(_ => {
    vm.$refs.saveTagInput.$refs.input.focus();
  });
}

function handleInputConfirm() {
  let inputVal = inputValue.value;
  if (inputVal) {
    if (selectOptionRow.multipleOptions === 1) {
      selectOptionRow.defaultQueryValue = inputVal;
    } else {
      selectOptionRow.defaultQueryValue.push(inputVal);
    }
  }
  inputVisible.value = false;
  inputValue.value = '';
}

function multipleOptionsChange(val) {
  console.log('multipleOptionsChange', val);
  if (val === 1) {
    selectOptionRow.defaultQueryValue = null;
  } else {
    selectOptionRow.defaultQueryValue = [];
  }
}

function dataPickerClick(rowConfig) {
  console.log('dataPickerClick', rowConfig);
  specialTimeConditions.value = rowConfig;
}

onMounted(() => {
  //businessConfigId
  getTableListConfig(businessConfigId.value).then(res => {
    if (res && res.data) {
      configId.value = res.data.id;
      Object.assign(finalTableConfig, res.data.listConfig)
      if (finalTableConfig.aggregateConfig) {
        Object.assign(aggregateConfig, finalTableConfig.aggregateConfig)
      }
      if (finalTableConfig.mateConfig) {
        userDataScope.value = finalTableConfig.meteConfig.userDataScope
        if (finalTableConfig.mateConfig.deptIdName) {
          deptIdName.value = finalTableConfig.meteConfig.deptIdName
        }
        if (finalTableConfig.mateConfig.userIdName) {
          userIdName.value = finalTableConfig.meteConfig.userIdName
        }
        if (runType.value === 2 && finalTableConfig.mateConfig.mainTableName) {
          mainTableInfo.value = {};
          mainTableInfo.value.tableName = finalTableConfig.mateConfig.mainTableName
          getColumnInfo(finalTableConfig.mateConfig.mainTableName).then(res => {
            if (res && res.data) {
              mainColumnListInfo.value = res.data
            }
          })
        }
      }
      processAllColumns();
    } else {
      finalTableConfig.version = 'v2'
    }
  })
  getTableInfo().then(res => {
    if (res && res.data) {
      tableListInfo.value = res.data;
    }
  })
  if (runType.value !== 2) {
    getColumnInfoWithBusinessId(businessConfigId.value).then(res => {
      if (res && res.data) {
        mainColumnListInfo.value = res.data;
      }

    })
    getExDataConfigOptions(businessConfigId.value).then(res => {
      if (res && res.data) {
        exDataOptions.value = res.data
      }
    })
    getTableInfoWithBusinessConfigId(businessConfigId.value).then(res => {
      if (res && res.data) {
        mainTableInfo.value = res.data;
      }
    })
  }
})
defineExpose({init})
</script>

<style scoped>
.down-tree {
  height: 300px;
  display: block;
  overflow-y: scroll;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
