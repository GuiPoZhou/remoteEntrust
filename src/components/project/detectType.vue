<template>
  <el-dialog
      :before-close="close"
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      append-to-body
      center
      title="检测类别选择"
      width="800px"
  >
    <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        label-width="100px"
    >
      <!-- 搜索栏 -->
      <el-form-item label="类别名称">
        <el-input
            v-model="queryParams.detectName"
            clearable
            placeholder="请输入选择类别名称"
            @keyup.enter.native="handleQuery"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            icon="el-icon-search"
            size="small"
            type="primary"
            @click="handleQuery"
        >搜索
        </el-button
        >
      </el-form-item>

      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column label="序号" prop="id" type="index" width="50"/>
        <el-table-column label="类别名称" prop="detectName" width="180"/>
        <el-table-column label="上级类别名称" prop="parentName"/>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
                :disabled="scope.row.disabled"
                round
                size="small"
                type="primary"
                @click="handleClick(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <pagination
            v-show="total > 0"
            :limit.sync="queryParams.pageSize"
            :page.sync="queryParams.pageNum"
            :total="total"
            @pagination="getTablelist"
        />
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script setup>
import {getCategoryList} from "@/api/envCheckScheme/config";

let tableCurrentPagination = reactive({
  hidden: false,
  pageNum: 1,
  pageSizes: [10, 20, 30, 40, 50],
  pageSize: 10,
})
let total = ref(0)
let queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  detectName: null,
})
let tableData = ref([])

let selectDetectName = ref('')

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  ids: {
    type: Array,
    default: () => []
  }
})

let visible = ref(props.visible)
let ids = ref(props.ids)

const emit = defineEmits(['cancel', 'update:visible', 'handleClick'])

function handleQuery() {
  queryParams.pageNum = 1
  getTablelist()
}

//获取检测类别
function getTablelist() {
  getCategoryList(queryParams).then(res => {
    if (ids.value) {
      for (let i in res.data.list) {
        res.data.list[i].disabled = !!ids.value.indexOf(res.data.list[i].id !== -1);
      }
    }
    tableData.value = res.data.list;
    total.value = res.data.total;
  })
}

function close() {
  emit('cancel')
  emit('update:visible', false)
}

function handleClick(row) {
  emit('handleClick', row)
  close()
}

onBeforeMount(() => {
  getTablelist()
})
onMounted(() => {
  tableCurrentPagination = pagination || {
    pageSize: tableCurrentPagination.total,
    pageNum: 1
  }
})
</script>
