<template>
  <div class="rightStyle">
    <right></right>
    <el-card v-if="false" class="box-card">
      <div slot="header" class="clearfix">
        <span>报告验证</span>
      </div>
      <el-input v-model="reportCode" class="centerInput" clearable placeholder="输入报告编码查询真伪"
                @keyup.enter.native="searchCode"></el-input>
      <div class="centerBtn">
        <el-button class="btnStyle" size="small" type="primary" @click="searchCode">验 证</el-button>
      </div>
    </el-card>

    <el-card class="box-card statics">
      <div slot="header" class="clearfix">
        <span>满意度调查</span>
        <el-button class="timeText" size="small" style="float: right;color: #1e1e1e" type="text" @click="checkAll">
          <span class="isMore">历史记录</span>
          <el-image :src="rightBtn" class="imgStyle"></el-image>
        </el-button>
      </div>
      <div class="searchCenter bg-color">
        <div class="searchContent">
          <div class="checkReportStyle">
            <p>{{ templateName }}</p>
            <p>{{ dateRange }}</p>
          </div>
          <div class="centerBtn">
            <el-button class="btnStyle" size="small" type="primary" @click="e_doquestionnaire">参 与</el-button>
          </div>
          <el-image :src="searchImg" class="imgPosition"></el-image>
        </div>
      </div>
    </el-card>
    <!-- 测试 -->
    <questionnaires v-if="showquestionnaire" ref="questionnaire" @close="e_closequestionnaire"
                    @save="e_saveQuestionaire"/>
  </div>
</template>

<script setup>
import searchImg from '@/assets/logos/image_file.png'
import rightBtn from '@/assets/logos/btn_chevron_right@2x.png'
import right from '@/views/customerMain/indexCustomerComponents/topComponent/right.vue'
import dayjs from 'dayjs'
import {ref, reactive, getCurrentInstance} from 'vue'
import questionnaires from '@/components/questionnaire/index.vue'

const instance = getCurrentInstance()
var showquestionnaire = ref(false)
// 调查问卷标题
const templateName = ref('')
const questionnaireInfo = ref({})
// 获取vue实例
const vm = instance['proxy']
let reportCode = ref(null)
const currentDate = dayjs();
const startDate = currentDate.startOf('month').format('YYYY-MM-DD');
const endDate = currentDate.endOf('month').format('YYYY-MM-DD');
const dateRange = ref('');
function jump2Page(pageValue) {
  if (pageValue == "user") {
    this.$router.push({
      name: "users",
      query: {addUserShow: true}
    });
  } else if (pageValue == "task") {
    this.$router.push({
      name: "entrustDetail",
      query: {taskIdCode: -1, pageFlag: "edit"}
    });
  } else if (pageValue == "company") {
    this.$router.push({
      name: "company"
    });
  }
}
//验证
function searchCode() {
  console.log(reportCode)
  vm.$net('/v1/entrustRemoteAgreement/selectCode', 'get', {reportCode: reportCode.value}).then(res => {
    console.log(res)
    if (res.code === 200) {
      vm.$confirm('为您找到一份原始报告，请点击下载', '提示', {
        confirmButtonText: '下载',
        cancelButtonText: '取消'
      }).then(_ => {
        vm.mbu_downloadPageOffice(res.data.pdfUrl)
      }).catch()
    }
  })
}
// 检测报告
let detectReport = ref([
  {label: 'R230527001', id: 1, time: dayjs().format('MM-DD')},
  {label: 'R230527001', id: 2, time: dayjs().format('MM-DD')},
  {label: 'R230527001', id: 3, time: dayjs().format('MM-DD')},
])
// vm.$net(`/v1/entrustRemoteAgreement/reportList?pageSize=10&pageNum=1`,'post',).then(res => {
//   if (res.code === 200) {
//     detectReport.value = res.rows.slice(0, 3)
//   }
// })
const addEntrust = (path) => {
  vm.$router.push({path})
}
// 查看全部报告
function checkAll() {
  vm.$router.push({
    name: 'allReport'
  })
}
function download(item) {
  console.log(window.localStorage.getItem('menuId'))
  vm.$net('/v1/entrustRemoteAgreement/selectReportCode', 'get', item).then(res => {
    if (res.code === 200) {
      // let msg = res.msg.split('/')
      // const fileName = msg.pop()
      // const file = {
      //   fileName: res.msg.split('/').pop(),
      //   url: res.msg
      // }
      vm.mbu_downloadPdf(res.msg)
    }
  })
}

// 获取最新的满意度调查
const getNewSatisfactionSurvey = () => {
  vm.$net('/v1/entrustRemoteAgreement/list', 'get', {sort: 1}).then(res => {
    templateName.value = res.data.list[0].templateName
    dateRange.value = res.data.list[0].templateStartDate + '~' + res.data.list[0].templateEndDate
    questionnaireInfo.value = res.data.list[0]
  })
}
getNewSatisfactionSurvey()
function e_doquestionnaire() {
  if (questionnaireInfo.value.isWrite == 1) {
    vm.$message.info('已填写过，无需重复填写')
    return
  }
  let templateEndTime = new Date(questionnaireInfo.value.templateEndDate).getTime()
  console.log('templateEndTime', templateEndTime)
  let now = new Date().getTime()
  if (now > templateEndTime) {
    vm.$message.info('未在生效时间，请稍后')
    return
  }
  showquestionnaire.value = true
  vm.$nextTick(() => {
    console.log('vm', vm)
    vm.$refs.questionnaire.init(questionnaireInfo.value)
  })
}
function e_closequestionnaire() {
  showquestionnaire.value = false
}
function e_saveQuestionaire() {
  showquestionnaire.value = false
}
</script>
<style lang="less" scoped>
.btnStyle {
  width: 100px;
}

.rightStyle {
  width: 372px;

  .box-card:first-child {
    height: 260px;
  }

  .centerInput {
    margin-top: 10%;
  }
}

.text,
.clearfix {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.timeText {
  line-height: 12px;
  margin-left: auto;

  img {
    width: 12px;
    height: 12px;
  }
}

.centerBtn {
  margin-top: 15px;
  display: flex;
  justify-content: left;
  margin-left: 5%;
}

.checkReportStyle {
  margin-top: 5%;
  margin-left: 5%;
  padding-top: 5%;
  p {
    text-align: left;
    margin: 0 auto;
  }

  p:first-child {
    font-size: 16px;
    font-weight: bolder;
  }

  p:last-child {
    font-size: 12px;
    color: #909399;
  }
}

.box-card + .box-card {
  margin-top: 15px;
}

.imgPosition {
  position: relative;
  left: 40%;
}
</style>
