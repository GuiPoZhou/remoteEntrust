<!--
 * @Autor: 焦政
 * @Date: 2021-06-16 17:28:17
 * @Description:
-->
<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
          :content="showSearch ? '隐藏搜索' : '显示搜索'"
          class="item"
          effect="dark"
          placement="top"
      >
        <el-button
            circle
            icon="el-icon-search"
            size="small"
            @click="toggleSearch()"
        />
      </el-tooltip>
      <el-tooltip
          class="item"
          content="刷新"
          effect="dark"
          placement="top"
      >
        <el-button
            circle
            icon="el-icon-refresh"
            size="small"
            @click="refresh()"
        />
      </el-tooltip>
      <el-popover
          placement="right"
          style="margin:0 10px"
          title="自定义列显示"
          trigger="click"
          width="420"
      >
        <el-checkbox-group
            v-model="checkedColumns"
            size="small"
            @change="e_changeBox"
        >
          <el-checkbox
              v-for="item in boxData"
              :key="item.key"
              :label="item.title"
              :value="item.istrue"
          ></el-checkbox>
        </el-checkbox-group>

        <el-button
            slot="reference"
            circle
            icon="el-icon-s-operation"
            size="small"
        />
      </el-popover>
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="最大化"
        placement="top"
      >
        <el-button
          size="small"
          circle
          icon="el-icon-full-screen"
          @click="fullScreen()"
        />
      </el-tooltip> -->
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {
      checkedColumns: []
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    boxData: {
      type: Array,
      default: () => {
      }
    }
  },
  mounted() {
    this.appendList(this.boxData);
  },
  methods: {
    appendList(list) {

      this.checkedColumns = [];
      if (list) {
        list.forEach((item, index) => {
          if (item.istrue) {
            this.checkedColumns.push(item.title);
          }
        });
      }
      console.log('当前1', this.checkedColumns)
    },
    e_changeBox(e) {
      this.checkedColumns = e;
      this.$emit("changeBox", this.checkedColumns);
    },

    //搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    //刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 全屏
    fullScreen() {
      this.$emit("fullScreen");
    }
  }
};
</script>
