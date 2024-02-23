<template>
  <div class="MLTable">
    <div v-if="setColumn" class="settingBox">
      <el-popover placement="bottom-end" popper-class="settingPopper" trigger="click">
        <el-checkbox-group v-model="selectCol" @change="handleChangeSelectColumn">
          <el-checkbox v-for="item in col" :key="item.prop" :disabled="item.disabled" :label="item.prop"
                       style="display:block;line-height:2;margin-right:0;">{{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
        <i slot="reference" class="icon el-icon-setting"></i>
      </el-popover>
    </div>
    <el-table :key="JSON.stringify(checkedCol)" :data="tableData" v-bind="$attrs" @select="e_select" v-on="$listeners"
              @select-all="e_selctAll" @selection-change="handleSelectionChange">
      <el-table-column v-for="(item, index) in checkedCol" :key="item.prop" :align="item.align ? item.align : 'center'"
                       :column-key="item.prop"
                       :index="index"
                       :show-overflow-tooltip="item.showOverFlowToolTip ? item.showOverFlowToolTip : false"
                       :type="item.type?item.type:''"
                       :width="item.width ? item.width : '-'"
                       v-bind="item">
        <template v-if="item.slotHeaderName" v-slot:header="scope">
          <slot :item="item" :name="item.slotHeaderName" v-bind="scope"></slot>
        </template>
        <template v-if="item.slotName" v-slot:default="scope">
          <slot :name="item.slotName" v-bind="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import Sortable from "sortablejs";

const vm = getCurrentInstance().proxy;
const props = defineProps({
  tableKey: String,
  columns: {
    type: Array,
    default() {
      return [];
    }
  },
  data: {
    type: Array,
    default() {
      return [];
    }
  },
  setColumn: {
    type: Boolean,
    default: false
  }
})
let tableKey = ref(props.tableKey)
let columns = ref(props.columns)
let data = ref(props.data)
let setColumn = ref(props.setColumn)
let tableData = ref([])
let col = ref([])
let checkedCol = ref([])
let selectCol = ref([])
watch(columns.value, (newVal) => {
  let localVal = getStorageCol();
  let hotVal = [];
  if (localVal) {
    hotVal = dataDiff(newVal, localVal);
  } else {
    hotVal = [...newVal];
  }
  col.value = hotVal.map(
      (item, index) =>
          (item = {...item, index, checked: item.checked || false})
  );
  checkedCol.value = checkedColFun(col.value);
  selectCol.value = checkedCol.map(item => (item = item.prop));
}, {
  immediate: true
})
watch(col.value, (newVal) => {
  setStorageCol(newVal)
}, {
  deep: true,
  immediate: true
})

onMounted(() => {
  document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };
  nextTick(() => {
    rowDrop();
    columnDrop();
  });
})

function debounce(fn, delay) {
  let t = null;
  return function () {
    if (t !== null) {
      clearTimeout(t);
    }
    t = setTimeout(() => {
      fn.call(vm);
    }, delay)
  }
}

const emit = defineEmits(['select', 'select-all', 'selection-change', 'dropRow', 'dropCol'])

function e_select(selection, row) {
  emit('select', {selection, row})
}

function e_selctAll(selection) {
  emit('select-all', selection)
}

function handleSelectionChange(e) {
  debounce(() => {
    emit('selection-change', e)
  }, 500)

}

function drap() {
  nextTick(() => {
    rowDrop();
    columnDrop();
  });
}

function handleChangeSelectColumn() {
  col.value.forEach(item => {
    if (selectCol.value.includes(item.prop)) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  });
  checkedCol.value = checkedColFun(col.value);
  drap();
}

function rowDrop() {
  const tbody = document.querySelector(".el-table__body-wrapper tbody");
  Sortable.create(tbody, {
    onEnd: ({newIndex, oldIndex}) => {
      [tableData.value[newIndex], tableData.value[oldIndex]] = [
        tableData.value[oldIndex],
        tableData.value[newIndex]
      ];
      drap();
      emit("dropRow", {
        drapRow: tableData.value[oldIndex],
        targetRow: tableData.value[newIndex],
        drapRowIndex: oldIndex,
        targetRowIndex: newIndex,
        data: tableData.value
      });
    }
  });
}

function columnDrop() {
  const wrapperTr = document.querySelector(".el-table__header-wrapper tr");
  Sortable.create(wrapperTr, {
    animation: 180,
    delay: 0,
    onEnd: ({newIndex, oldIndex}) => {
      const oldItem = checkedCol.value[oldIndex];
      const newItem = checkedCol.value[newIndex];
      [col.value[newItem.index].index, col.value[oldItem.index].index] = [
        oldItem.index,
        newItem.index
      ];
      col.value.sort((a, b) => {
        return a.index - b.index;
      });
      checkedCol.value = checkedColFun(col.value);
      tableData.value = tableData.value.slice(0, tableData.value.length);
      drap();
      emit("dropCol", {
        colItem: oldItem,
        newIndex: newIndex,
        oldIndex: oldIndex,
        column: checkedCol.value
      });
    }
  });
}

function checkedColFun(arr) {
  return arr.filter(item => item.checked);
}

function setStorageCol(data) {
  if (tableKey.value && data && data.length > 0) {
    localStorage.setItem("MLTable-" + tableKey.value, JSON.stringify(data));
  }
}

function getStorageCol() {
  let datajson = localStorage.getItem("MLTable-" + tableKey.value);
  return datajson ? JSON.parse(datajson) : "";
}

function dataDiff(newVal, localVal) {
  let nl = newVal.length;
  let ll = localVal.length;
  if (nl != ll) {
    return newVal;
  } else {
    let np = newVal.map(item => item.prop).sort();
    let lp = localVal.map(item => item.prop).sort();
    if (np.join() != lp.join()) {
      return newVal;
    } else {
      let nnl = [];
      for (let i = 0; i < localVal.length; i++) {
        const item_l = localVal[i];
        for (let j = 0; j < newVal.length; j++) {
          const item_n = newVal[j];
          if (item_l.prop === item_n.prop) {
            nnl.push({
              ...item_n,
              index: item_l.index
            });
          }
        }
      }
      return nnl;
    }
  }
}
</script>
<script>
export default {
  name: "ml-table",
}
</script>

<style lang="less" scoped>
.MLTable {
  position: relative;

  .settingBox {
    width: 36px;
    height: 36px;
    border-radius: 2px;
    border: 1px solid #ebeef5;
    border-bottom: 0;
    margin-left: auto;
    position: relative;

    .icon {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 36px;
      height: 36px;
      text-align: center;
      font-size: 20px;
      line-height: 36px;
      color: #909399;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.settingPopper {
  min-width: 100px !important;
}
</style>
