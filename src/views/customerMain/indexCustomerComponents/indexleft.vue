<template>
  <div class="leftStyle">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="titleLeft">通知报告</span>
        <el-button style="float: right;padding: 3px 0 0" type="text" @click="checkAll('note')">
          <span class="isMore">更多</span>
          <el-image :src="rightBtn" class="imgStyle"></el-image>
        </el-button>
      </div>
      <div class="left-text" style="width: 100%">
        <template v-for="(item, index) in reportList">
          <el-row class="rowStyle" @click.native="noteDetail(item)">
            <span>{{ index + 1 }}.</span>
            <span>{{ item.noticeTitle + '的通知' }}</span>
            <span class="timeText">{{ dayjs(item.createTime).format('YYYY-MM-DD') }}</span>
          </el-row>
        </template>
      </div>
    </el-card>
    <el-card class="box-card" style="position: relative">
      <div slot="header" class="clearfix">
        <span class="titleLeft">检测报告</span>
        <el-button style="float: right;padding: 3px 0 0" type="text" @click="checkAll('detect')">
          <span class="isMore">更多</span>
          <el-image :src="rightBtn" class="imgStyle"></el-image>
        </el-button>
      </div>
      <div v-for="item in detectReport" :key="item.entrustCode" class="text item">
        <span class="leftText">编号{{ item.reportCode }}的检测报告</span>
        <span class="right-text">
          <el-button size="mini" type="text" @click="download(item)">下载</el-button>
        </span>
      </div>
      <p class="totalStyle">
        <el-image :src="iconlog" class="imgCenter"></el-image>
        <span>已生成报告份数：</span>
        <span>{{ total }}份</span>
      </p>
      <!--      <div style="text-align: right">-->
      <!--        <el-pagination-->
      <!--            small-->
      <!--            layout="prev, pager, next"-->
      <!--            :total="total"-->
      <!--            @size-change="handleSizeChange"-->
      <!--            @current-change="handleCurrentChange"-->
      <!--        >-->
      <!--        </el-pagination>-->
      <!--      </div>-->

    </el-card>
    <noteDialog
        v-if="noteShow"
        ref="noteRef"
    />
  </div>
</template>

<script setup>
import iconlog from '@/assets/logos/icon_log.png'
import rightBtn from '@/assets/logos/btn_chevron_right@2x.png'
import noteDialog from "@/views/components/noteDialog/index.vue";
import {ref, getCurrentInstance, reactive, nextTick} from 'vue'
import dayjs from 'dayjs'

const instance = getCurrentInstance()
// 获取 vue 实例相当于 this
const vm = instance['proxy']

let reportList = ref([])

// 获取通知报告
const getReportList = () => {
  vm.$net(`/v1/entrustRemoteAgreement/list/sysNoticeList?pageSize=10&pageNum=1`, 'get').then(res => {
    if (res.code === 200) {
      reportList.value = res.rows.splice(0, 5)
    }
  })
}
getReportList()
// 获取检测报告详情
let noteShow = ref(false)
const noteDetail = (row) => {
  noteShow.value = true
  nextTick(() => {
    vm.$refs.noteRef.init(row.noticeId)
  })
}
let detectReport = ref([])
let total = ref(0)
let queryData = reactive({
  pageSize: 10,
  pageNum: 1
})
vm.$net(`/v1/entrustRemoteAgreement/reportList?pageSize=10&pageNum=1`, 'post',).then(res => {
  if (res.code === 200) {
    detectReport.value = res.rows.splice(0, 5)
    total.value = res.total
  }
})
const handleQuery = () => {
  vm.$net(`/v1/entrustRemoteAgreement/reportList?pageSize=${queryData.pageSize}&pageNum=${queryData.pageNum}`, 'post',).then(res => {
    if (res.code === 200) {
      detectReport.value = res.rows
      total.value = res.total
    }
  })
}

function changePage(e) {
  queryData.pageNum = e.page
  queryData.pageSize = e.limit
  handleQuery()
}

const handleSizeChange = (val) => {
  changePage({page: queryData.pageNum, limit: val})
  if (this.autoScroll) {
    scrollTo(0, 800)
  }
}
const handleCurrentChange = (val) => {
  changePage({page: val, limit: queryData.pageSize})
  if (this.autoScroll) {
    scrollTo(0, 800)
  }
}

// 查看全部报告
function checkAll(type) {
  vm.$router.push({
    name: 'allMsg',
    query: {
      type: type
    }
  })
}

function download(item) {
  console.log(window.localStorage.getItem('menuId'))
  vm.$net('/v1/entrustRemoteAgreement/selectReportCode', 'get', item).then(res => {
    if (res.code === 200) {
      vm.mbu_downloadPageOffice(res.msg)
    }
  })
}
</script>

<style lang="less" scoped>
.titleLeft {
  font-size: 12px;
}

.leftStyle {
  width: 372px;

  .box-card {
    height: 260px;
  }
}

.box-card {
  margin-bottom: 10px;
}

.leftText {
  display: inline-block;
  font-size: 14px;
}

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

.text {
  position: relative;
  display: flex;
  align-items: center;

  .right-text {
    margin-left: auto;
    font-size: 12px;
    color: #909399;
  }
}

.box-card:last-child {
  //height: 350px;
}

.totalStyle {
  position: absolute;
  bottom: 0;

  span {
    display: inline-block;
  }

  span:first-child {
    margin-left: 10px;
  }
}
</style>
