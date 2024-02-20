<template>
  <div class="app-container">
    <div v-show="showSearch" class="a-c-top">
      <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="100px">
        <el-form-item label="业务编码" prop="businessCode">
          <el-input
              v-model="queryParams.businessCode"
              clearable
              placeholder="请输入业务编码"
              size="small"
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="业务名称" prop="businessName">
          <el-input
              v-model="queryParams.businessName"
              clearable
              placeholder="请输入业务名称"
              size="small"
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="子业务编码" prop="subBusinessCode">
          <el-input
              v-model="queryParams.subBusinessCode"
              clearable
              placeholder="请输入子业务编码"
              size="small"
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="子业务名称" prop="subBusinessName">
          <el-input
              v-model="queryParams.subBusinessName"
              clearable
              placeholder="请输入子业务名称"
              size="small"
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button icon="el-icon-search" size="small" type="cyan" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="a-c-bottom">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="handleAdd"
          >新增
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="executionTemplateList" border stripe
                @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column align="center" label="业务编码" prop="businessCode"/>
        <el-table-column align="center" label="业务名称" prop="businessName"/>
        <el-table-column align="center" label="子业务编码" prop="subBusinessCode"/>
        <el-table-column align="center" label="子业务名称" prop="subBusinessName"/>
        <el-table-column align="center" label="子业务落库表名" prop="tableName"/>
        <el-table-column align="center" label="运行状态" prop="status" width="80px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2"
                       @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createUser" width="80px"/>
        <el-table-column align="center" label="修改人" prop="updateUser" width="80px"/>
        <el-table-column align="center" label="修改时间" prop="updateTime"/>
        <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
          <template slot-scope="scope">
            <el-button
                icon="el-icon-edit"
                size="small"
                type="text"
                @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <!--            <el-button-->
            <!--              size="small"-->
            <!--              type="text"-->
            <!--              icon="el-icon-edit"-->
            <!--              @click="loadPage(scope.row)"-->
            <!--            >加载页面</el-button>-->
            <el-button
                icon="el-icon-delete"
                size="small"
                type="text"
                @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :limit.sync="queryParams.pageSize"
          :page.sync="queryParams.pageNum"
          :total="total"
          @pagination="getList"
      />
    </div>


    <!-- 添加或修改业务单运行实例对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-show="!isEdit" label="业务编码" prop="businessCode">
          <el-select v-model="form.defaultTemplateId" placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in businessCodeList"
                :key="item.id"
                :label="item.businessName"
                :value="item.id">
              <span style="float: left">{{ item.businessName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.businessCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="子业务编码" prop="subBusinessCode">
          <el-input v-model="form.subBusinessCode" placeholder="请输入子业务编码"/>
        </el-form-item>
        <el-form-item label="子业务名称" prop="subBusinessName">
          <el-input v-model="form.subBusinessName" placeholder="请输入子业务名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listExecutionTemplate,
  delExecutionTemplate,
  addExecutionTemplate,
  editExecutionTemplate,
  updateExecutionTemplate,
  getBusinessCodeList,
  updateStatus,
} from "@/api/system/executionTemplate";

export default {
  name: "ExecutionTemplate",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 业务单运行实例表格数据
      executionTemplateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        defaultTemplateId: null,
        businessCode: null,
        businessName: null,
        subBusinessCode: null,
        subBusinessName: null,
        tableName: null,
        status: null,
        createUser: null,
        updateUser: null,
        businessCodes: 'DETECT_SCHEME,ENTRUSTMENT_AGREEMENT,SUBCONTRACT_AGREEMENT,envEquipmentInstrument,envCustomer, ' +
            'ENV_ENTRUST, ENV_ENTRUST_ACCEPT, ' +
            'SAMPLE_RECEIVE, SAMPLE_FLOW, SAMPLES_PUT_IN_STORAGE, SAMPLE_PROCESSING, ' +
            'REPORT_COMPILED, REPORT_REVIEW, REPORT_ISSUED, REPORT_ARCHIVE'
        ,
      },
      // 表单参数
      form: {},
      isEdit: false,
      // 表单校验
      rules: {},
      businessCodeList: []
    };
  },
  created() {
    this.getList();
    getBusinessCodeList().then(response => {
      this.businessCodeList = response.data;
    })
  },
  methods: {
    /** 查询业务单运行实例列表 */
    getList() {
      this.loading = true;
      listExecutionTemplate(this.queryParams).then(response => {
        this.executionTemplateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        defaultTemplateId: null,
        businessCode: null,
        businessName: null,
        subBusinessCode: null,
        subBusinessName: null,
        tableName: null,
        status: 0,
        metaJson: null,
        fieldJson: null,
        configJson: null,
        listPageJson: null,
        tableColumnsJson: null,
        createTime: null,
        createUser: null,
        updateTime: null,
        updateUser: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isEdit = false;
      this.title = "添加业务单运行实例";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log('handleUpdate');
      // this.$router.push({
      //   path: '/design/formDesign/' + row.id
      // });
      this.open = true
      this.title = '修改记录单'
      this.isEdit = true;
      editExecutionTemplate(row.id).then(response => {
        this.$set(this.form, 'subBusinessCode', response.data.subBusinessCode)
        this.$set(this.form, 'subBusinessName', response.data.subBusinessName)
        this.$set(this.form, 'id', response.data.id)
        this.$set(this.form, 'defaultTemplateId', response.data.defaultTemplateId)
        this.$set(this.form, 'businessCode', response.data.businessCode)
      })
    },
    /** 加载页面 */
    loadPage(row) {
      console.log('loadPage');
      this.$router.push({
        path: '/template/dynamic/list/' + row.id
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateExecutionTemplate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.$router.push({
                  path: '/design/formDesign/' + this.form.id + '?businessCode=' + this.form.businessCode,
                })
              }
            });
          } else {
            addExecutionTemplate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除业务单运行实例编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delExecutionTemplate(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    handleStatusChange(row) {
      updateStatus(row.id, row.status).then(response => {
        this.msgSuccess(response.msg);
      })
    }
  }
};
</script>
