<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row style="margin-bottom: 30px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-form ref="queryParams" :model="queryParams" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="名称" prop="templateName">
              <el-input v-model="queryParams.templateName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="isWrite">
              <el-select v-model="queryParams.isWrite" placeholder="请选择">
                <el-option :value="1" label="已完成">
                </el-option>
                <el-option :value="0" label="未完成">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型" prop="releaseScopeId">
              <el-select v-model="queryParams.releaseScopeId" placeholder="请选择">
                <el-option v-for="item in releaseScopeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="small" type="primary" @click="getTemplateList()">搜索</el-button>
              <el-button size="small" @click="e_resetSearch">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="templateList" border style="width: 100%">
        <el-table-column label="满意度调查" prop="templateName">
        </el-table-column>
        <el-table-column label="发布时间" prop="releaseDate">
        </el-table-column>
        <el-table-column label="状态" prop="isWrite">
          <template v-slot="scope">
            <span v-if="scope.row.isWrite == 0">未完成</span>
            <span v-if="scope.row.isWrite == 1">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="releaseScopeName">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button v-if="scope.row.isWrite == 0 && scope.row.releaseStatus && checkTime(scope.row.templateEndDate)"
                       text type="primary"
                       @click="e_goQuestion(scope.row)">填写
            </el-button>
            <el-button v-if="scope.row.isWrite == 1" text type="primary"
                       @click="e_showQuestion(scope.row, 'detail')">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :limit="queryParams.pageSize" :page="queryParams.pageNum" :total="total"
                  @pagination="getTemplateList"/>
    </el-card>
    <questionnaires v-if="showquestionnaire" ref="questionnaire" @close="showquestionnaire = false"
                    @save="e_saveQuestionaire"/>
  </div>
</template>
<script>
import questionnaires from '@/components/questionnaire/index'
import pagination from '@/components/Pagination/index'
export default {
  components: {
    questionnaires,
    pagination
  },
  name: 'allReport',
  data() {
    return {
      showquestionnaire: false,
      releaseScopeList: [],
      templateList: [],
      queryParams: {
        isWrite: undefined,
        templateName: undefined,
        releaseScopeId: undefined,
        isShow: 1,
        pageSize: 10,
        pageNum: 1,
      },
      total: 0
    }
  },
  mounted() {
    this.getTemplateList()
    this.getreleaseScopeList()
  },
  methods: {
    e_saveQuestionaire() {
      this.showquestionnaire = false
      this.getTemplateList()
    },
    checkTime(templateEndDate) {
      let templateEndTime = new Date(templateEndDate).getTime()
      let now = new Date().getTime()
      if (now <= templateEndTime) {
        return true
      } else {
        return false
      }
    },
    e_resetSearch() {
      this.queryParams = {
        isWrite: undefined,
        templateName: undefined,
        releaseScopeId: undefined,
        isShow: 1,
        pageSize: 10,
        pageNum: 1,
      },
          this.getTemplateList()
    },
    e_goQuestion(row) {
      if (row.isWrite == 1) {
        this.$message.info('已填写过，无需重复填写')
        return
      }
      this.showquestionnaire = true
      this.$nextTick(() => {
        this.$refs.questionnaire.init(row)
      })
    },
    getTemplateList() {
      this.$net('/v1/entrustRemoteAgreement/list', 'get', this.queryParams).then(re => {
        this.templateList = re.data.list
        this.total = re.data.total
      })
    },
    getreleaseScopeList() {
      let list = [];

      this.$net(
          '/template/execution/run/getBusinessConfig/ENTRUSTMENT_AGREEMENT',
          'get'
      )
          .then((response) => {
            response.data.forEach((item) => {
              let obj = {label: item.configName, value: item.id};
              list.push(obj);
            });
            this.releaseScopeList = list
          });
    },
    e_showQuestion(row) {
      this.$net(`/v1/satisfactionSurvey/getSatisfactionSurveyResults/${row.id}`, 'get').then(re => {
        this.showquestionnaire = true
        this.$nextTick(() => {
          re.data.templateName = row.templateName
          re.data.templateEndDate = row.templateEndDate
          this.$refs.questionnaire.editInit(re.data, 'detail')
        })
      })

    }
  }
}
</script>
<style scoped>
.box-card {
  margin-left: 5%;
  margin-right: 5%;
  height: 100%;
}

.reportInfo {
  width: 100%;
}

.rowStyle {
  margin-top: 10px;
}

.reportCode {
  margin-right: 10px;
}

.currentDate {
  margin-left: 18px;
}

.reportInfo {
  width: 100%;
  display: flex;
  align-items: center;
}

.reportCodeSeparator {
  flex-grow: 1;
  height: 1px;
  background-color: #ccc;
  margin: 0 10px;
}
</style>
