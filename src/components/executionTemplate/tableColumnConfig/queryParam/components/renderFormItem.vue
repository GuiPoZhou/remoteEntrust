<template>
  <el-form-item
      v-show="!item.searchHidden"
      :label="item.label"
      class="foldLabel"
  >
    <!--    <el-tooltip-->
    <!--        slot="label"-->
    <!--        :content="item.label"-->
    <!--        class="item"-->
    <!--        effect="light"-->
    <!--        placement="top-start"-->
    <!--    >-->
    <!--&lt;!&ndash;      <label class="slotFormLabel">{{ item.label }}</label>&ndash;&gt;-->
    <!--    </el-tooltip>-->

    <el-input
        v-if="item.searchType === 0"
        v-model="queryParams[item.id]"
        :clearable="true"
        placeholder="请输入查询条件"
        size="small"
        style="width: 100%"
        @keyup.enter.native="getList"
    />

    <el-select
        v-else-if="item.searchType === 2"
        v-model="queryParams[item.id]"
        :clearable="true"
        :multiple="item.multipleOptions === 2"
        :placeholder="'请选择查询逻辑'"
        filterable
        placeholder="请选择"
        size="small"
        @keyup.enter.native="getList"
    >
      <el-option
          v-for="subItem in item.staticOptions"
          v-if="item.selectOptionType === 1"
          :key="subItem.key"
          :label="subItem.label"
          :value="subItem.key"
      />
      <el-option
          v-for="subItem in cacheRemoteDataSource[item.dynamicUrl]"
          v-if="item.selectOptionType === 2"
          :key="subItem.key"
          :label="subItem.label"
          :value="subItem.key"
      />
      <el-option
          v-for="subItem in cacheRemoteDataSource[item.bindDataSourceId]"
          v-if="item.selectOptionType === 3"
          :key="subItem.key"
          :label="subItem.label"
          :value="subItem.key"
      />
    </el-select>
    <selectTree
        v-else-if="item.searchType === 7"
        v-model="queryParams[item.id]"
        :clearable="true"
        :config="item"
        :dataSource="cacheRemoteDataSource[item.bindDataSourceId]"
        :placeholder="'请选择查询逻辑'"
        filterable
        placeholder="请选择"
        size="small"
        @keyup.enter.native="getList"
    ></selectTree>

    <el-input-number
        v-else-if="item.searchType === 1 && item.searchLogic !== 7"
        v-model="queryParams[item.id]"
        :clearable="true"
        controls-position="right"
        style="width: 100%"
    />

    <el-row v-else-if="item.searchType === 1 && item.searchLogic === 7">
      <el-col :span="24">
        <NumberRange
            v-model="queryParams[item.id]"
            :clearable="true"
            style="width: 100%"
            @keyup.enter.native="getList"
        />
      </el-col>
    </el-row>
    <el-row v-else-if="item.searchType === 4">
      <el-col :span="24">
        <el-time-picker
            v-if="item.searchLogic !== 7"
            v-model="queryParams[item.id]"
            :clearable="true"
            placeholder="请选择时间"
            size="small"
            style="width: 100%"
            value-format="HH:mm:ss"
            @keyup.enter.native="getList"
        />
        <el-time-picker
            v-if="item.searchLogic === 7"
            v-model="queryParams[item.id]"
            :clearable="true"
            end-placeholder="结束时间"
            is-range
            placeholder="选择时间范围"
            range-separator="至"
            size="small"
            start-placeholder="开始时间"
            style="width: 100%"
            value-format="HH:mm:ss"
            @keyup.enter.native="getList"
        />
      </el-col>
    </el-row>
    <el-row v-else-if="item.searchType === 5">
      <el-col :span="24">
        <el-date-picker
            v-if="item.searchLogic !== 7 && item.searchLogic !== 9"
            v-model="queryParams[item.id]"
            :clearable="true"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            align="right"
            placeholder="选择日期"
            size="small"
            style="width: 100%"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            @keyup.enter.native="getList"
        />
        <el-date-picker
            v-if="item.searchLogic === 7 || item.searchLogic === 9"
            v-model="queryParams[item.id]"
            :clearable="true"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerRangeOptions"
            align="right"
            end-placeholder="结束日期"
            range-separator="至"
            size="small"
            start-placeholder="开始日期"
            style="width: 100%"
            type="daterange"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            @keyup.enter.native="getList"
        />
      </el-col>
    </el-row>
    <el-row v-else-if="item.searchType === 6">
      <el-col :span="24">
        <el-date-picker
            v-if="item.searchLogic !== 7 && item.searchLogic !== 9"
            v-model="queryParams[item.id]"
            :clearable="true"
            :picker-options="pickerOptions"
            align="right"
            placeholder="选择日期时间"
            size="small"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @keyup.enter.native="getList"
        />
        <el-date-picker
            v-if="item.searchLogic === 7 || item.searchLogic === 9"
            v-model="queryParams[item.id]"
            :clearable="true"
            :picker-options="pickerRangeOptions"
            align="right"
            end-placeholder="结束日期"
            range-separator="至"
            size="small"
            start-placeholder="开始日期"
            type="datetimerange"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            @keyup.enter.native="getList"
        />
      </el-col>
    </el-row>
  </el-form-item>
</template>

<script>
import NumberRange from "@/components/executionTemplate/tableColumnConfig/queryParam/NumberRange.vue";
import selectTree from "@/components/executionTemplate/tableColumnConfig/queryParam/selectTree.vue";

export default {
  components: {NumberRange, selectTree},
  props: {
    queryParams: Object,
    item: Object,
    pickerRangeOptions: Object,
    cacheRemoteDataSource: Array,
  },
  data() {
    return {};
  },
  methods: {
    getList() {
      this.$emit("getList");
    },
  },
};
</script>

<style lang="less">
.slotFormLabel {
  display: block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 12px;
}
</style>
