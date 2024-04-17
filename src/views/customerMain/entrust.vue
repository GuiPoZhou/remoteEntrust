<template>
  <div class="app-container">
    <div class="baseInfo">
      <div class="container">
        <el-card
            class="box-card"
        >
          <listContainer ref="listContainer" :businessConfigId="businessConfigId + ''"
                         @handleSelectionChange="handleSelectionChange"
          >
            <template slot="botabs">
              <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                       @select="e_selTab"
              >
                <el-menu-item v-for="(item, i) in tabConfig" :key="item.id" :index="item.id.toString()">
                  <template slot="title">
                    <div class="fontImage">
                      {{ item.configName }}
                    </div>
                  </template>
                </el-menu-item>
              </el-menu>
            </template>
            <template slot="bobutton">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="handleAddPrice">新增委托
              </el-button>
            </template>
            <template slot="action" v-slot="scope">
              <!--              <el-button @click="editRow('edit',scope.slotScopt.row)" type="text" size="small">编辑</el-button>-->
              <el-button v-if="scope.slotScopt.row.status === 0" size="small" type="text"
                         @click="handlepush(scope.slotScopt.row)">推送
              </el-button>
            </template>
          </listContainer>
        </el-card>
        <addEntrustDialog
            v-if="entrustShow"
            ref="entrustDialog"
            :businessConfigId="businessConfigId"
            @close="entrustShow = false"
            @saveReload="e_saveReload"
        />
      </div>
    </div>
  </div>
</template>

<script>
import listContainer from '@/components/executionTemplate/tableColumnConfig/listContainer'
import addEntrustDialog from './entrustCommponents/addEntrustDialog'

export default {
  components: {
    listContainer,
    addEntrustDialog
  },
  data() {
    return {
      tabConfig: [],
      businessConfigId: null,
      activeIndex: null,
      entrustShow: false
    }
  },
  created() {
    this.getBusinessConfigInfo(0)
  },
  methods: {
    // 选中tab
    e_selTab(e) {
      console.log(e)
      console.log(this.tabConfig)
      let tabInfo = this.tabConfig.filter(item => {
        return item.id == e
      })[0]
      console.log(tabInfo)
      this.businessConfigId = tabInfo.id
      this.itemBindType = tabInfo.itemBindType
    },
    getBusinessConfigInfo(businessConfigId) {
      if (businessConfigId == 0) {
        this.$net('/template/execution/run/getBusinessConfig/ENTRUSTMENT_AGREEMENT_PRE', 'get').then(re => {
          this.tabConfig = re.data
          this.activeIndex = re.data[0].id.toString()
          this.businessConfigId = re.data[0].id
          this.itemBindType = re.data[0].itemBindType
        })
      } else {
        this.tabConfig = []
      }

    },
    e_saveReload() {
      this.entrustShow = false
      this.$refs.listContainer.$refs.query.getList()
    },
//多选回调
    handleSelectionChange(e) {

    },
    handlepush(row) {
      this.$confirm('确定要推送所选数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let params = {
          entrustCode: row.entrustCode,
          status: 3
        }
        this.$net('/v1/entrustRemoteAgreement/submit', 'post', params).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$refs.listContainer.$refs.query.getList()
          }
        })
      })

    },
// 新增委托
    handleAddPrice() {
      this.entrustShow = true
      this.$nextTick(() => {
        this.$refs.entrustDialog.init(this.businessConfigId, 'add')
      })
    },
    editRow(type, row) {
      console.log(row)
      this.entrustShow = true;
      this.$nextTick(() => {
        this.$refs.entrustDialog.editInit(this.businessConfigId, row, 'edit')
      })
    },
  }
}

</script>

<style lang="less" scoped>
/deep/ .baseInfo {
  height: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-card {
  height: 100%;
}

.header {
  width: 100%;
  height: 224px;
  padding-top: 44px;
  position: relative;
  background: linear-gradient(270deg,
  rgba(51, 119, 255, 0.93) 0%,
  #1f73f3 100%);
  display: flex;
  flex-direction: row;
  justify-content: center;

  .hader-content {
    width: 57.3%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .header-title {
      display: block;
      width: 400px;
      font-size: 26px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
    }

    .header-image {
      width: 312px;
      height: 156px;
    }
  }
}

/deep/ .container {
  width: 1200px;
  padding: 0 10px;
  height: 100%;
  background: #ffffff;
}

.entrustInfo-left {
  margin-left: 13%;
  margin-top: 30px;
}

//委托编号去掉input框
.rule-input {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid #b4bccc;
    background-color: white;
  }
}

/*label过长*/
/deep/ .overLable .el-form-item--medium .el-form-item__label {
  line-height: 20px;
  text-align: right;
  padding-left: 10px;
}

.app-container {
}

.expandClass {
  table {
    margin-top: -5px;
    margin-bottom: -5px;
  }

  .table1 {
    width: 200px;
    text-align: center;
  }

  .table2 {
    width: 100px;
    text-align: center;
  }

  .table3 {
    width: 100px;
    text-align: center;
    overflow: auto;
  }
}

.el-table__expanded-cell {
  padding-top: 0;
}

.el-table--border th, .el-table--border td {
  border-right: none;
}
</style>
