<script setup>
import noteDialog from "@/views/components/noteDialog/index.vue";
import {getCurrentInstance, nextTick, reactive, ref} from 'vue'
import {mbu_downloadPageOffice} from '@/mixins/mixinMethod.ts'
const vm = getCurrentInstance()['proxy']
let reportList = ref([])
let queryParams = reactive({
  pageSize: 10,
  pageNum: 1,
})
let total = ref(0)
let detectReport = ref([])
let route = vm.$route.query;
let getList;
// 通知报告
if (route.type == 'note') {
  let total = ref(0)
  getList = () => {
    vm.$net(`/v1/entrustRemoteAgreement/list/sysNoticeList`, 'get', queryParams).then(res => {
      if (res.code === 200) {
        reportList.value = res.rows
        total.value = res.total
      }
    })
  }
} else {
  // 检测报告
  getList = () => {
    vm.$net(`/v1/entrustRemoteAgreement/reportList?pageSize=${queryParams.pageSize}&pageNum=${queryParams.pageNum}`, 'post').then(res => {
      detectReport.value = res.rows
      total.value = res.total
    })
  }
}

getList()

// 获取检测报告详情
let noteShow = ref(false)
const noteDetail = (row) => {
  noteShow.value = true
  nextTick(() => {
    vm.$refs.noteRef.init(row.noticeId)
  })
}
// 翻页
const changePage = (val) => {
  queryParams.pageSize = val.limit
  queryParams.pageNum = val.page
  getList()
}

function download(item) {
  console.log(window.localStorage.getItem('menuId'))
  vm.$net('/v1/entrustRemoteAgreement/selectReportCode', 'get', item).then(res => {
    if (res.code === 200) {
      mbu_downloadPageOffice(res.msg)
    }
  })
}
</script>

<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row style="margin-bottom: 30px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <div class="left-text" style="width: 100%">
        <template v-for="(item, index) in reportList">
          <el-row class="rowStyle" @click.native="noteDetail(item)">
            <span>{{ index + 1 }}.</span>
            <span>{{ item.noticeTitle + '的通知' }}</span>
            <span class="timeText">{{ $dayjs(item.createTime).format('YYYY-MM-DD') }}</span>
          </el-row>
        </template>
        <div v-for="item in detectReport" :key="item.entrustCode" class="text item">
          <span class="leftText">编号{{ item.reportCode }}的检测报告</span>
          <span class="right-text">
          <el-button size="mini" type="text" @click="download(item)">下载</el-button>
        </span>
        </div>
      </div>
      <pagination :limit="queryParams.pageSize" :page="queryParams.pageNum" :total="total"
                  @pagination="changePage"/>
    </el-card>
    <noteDialog
        v-if="noteShow"
        ref="noteRef"
    />
  </div>
</template>

<style lang="less" scoped>
.left-text {
  span {
    display: inline-block;
    font-size: 14px;
  }

  .rowStyle {
    padding: 4px 0;
    cursor: pointer;
  }

  .timeText {
    font-size: 12px;
    color: #909399;
    position: absolute;
    right: 0;
  }
}
</style>
