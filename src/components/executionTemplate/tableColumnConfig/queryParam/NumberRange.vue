<template>
  <div>
    <div :class="{ 'is-disabled': disabled }" class="input-number-range">
      <div class="flex">
        <div class="from">
          <el-input
              ref="input_from"
              v-model="userInputForm"
              :disabled="disabled"
              :size="size"
              placeholder="最小值"
              @blur="handleBlurFrom"
              @change="handleInputChangeFrom"
              @focus="handleFocusFrom"
              @input="handleInputFrom"
          ></el-input>
        </div>
        <div class="center">
          <span>至</span>
        </div>
        <div class="to">
          <el-input
              ref="input_to"
              v-model="userInputTo"
              :disabled="disabled"
              :size="size"
              placeholder="最大值"
              @blur="handleBlurTo"
              @change="handleInputChangeTo"
              @focus="handleFocusTo"
              @input="handleInputTo"
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputNumberRange',

  props: {
    // 初始化范围
    value: {required: true},

    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'mini'
    },

    // 精度参数
    precision: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10)
      }
    }
  },

  data() {
    return {
      userInputForm: null,
      userInputTo: null
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(value) {
        /** 初始化范围 */
        if (value instanceof Array && this.precision !== undefined) {
          this.userInputForm = typeof value[0] === 'number' ? value[0] : null
          this.userInputTo = typeof value[1] === 'number' ? value[1] : null
        }
      }
    }
  },

  methods: {
    // 根据精度保留数字
    toPrecision(num, precision) {
      if (precision === undefined) precision = 0
      return parseFloat(
          Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
      )
    },

    handleBlurFrom(event) {
      this.$emit('blurfrom', event)
    },

    handleFocusFrom(event) {
      this.$emit('focusfrom', event)
    },

    handleBlurTo(event) {
      this.$emit('blurto', event)
    },

    handleFocusTo(event) {
      this.$emit('focusto', event)
    },

    handleInputFrom(value) {
      this.$emit('inputfrom', value)
    },

    handleInputTo(value) {
      this.$emit('inputto', value)
    },

    // from输入框change事件
    handleInputChangeFrom(value) {
      // 如果是非数字空返回null
      if (isNaN(value) || value === '') {
        this.$emit('input', [null, this.userInputTo])
        this.$emit('changefrom', this.userInputForm)
        return
      }

      // 初始化数字精度
      this.userInputForm = this.setPrecisionValue(value)

      // 如果from > to 将from值替换成to
      if (typeof this.userInputTo === 'number') {
        this.userInputForm =
            parseFloat(this.userInputForm) <= parseFloat(this.userInputTo)
                ? this.userInputForm
                : this.userInputTo
      }
      this.$emit('input', [this.userInputForm, this.userInputTo])
      this.$emit('changefrom', this.userInputForm)
    },

    // to输入框change事件
    handleInputChangeTo(value) {
      // 如果是非数字空返回null
      if (isNaN(value) || value === '') {
        this.$emit('input', [this.userInputForm, null])
        this.$emit('changefrom', this.userInputTo)
        return
      }

      // 初始化数字精度
      this.userInputTo = this.setPrecisionValue(value)

      // 如果to < tfrom 将to值替换成from
      if (typeof this.userInputForm === 'number') {
        this.userInputTo =
            parseFloat(this.userInputTo) >= parseFloat(this.userInputForm)
                ? this.userInputTo
                : this.userInputForm
      }
      this.$emit('input', [this.userInputForm, this.userInputTo])
      this.$emit('changeto', this.userInputTo)
    },

    // 设置成精度数字
    setPrecisionValue(value) {
      if (this.precision !== undefined) {
        const val = this.toPrecision(value, this.precision)
        return val
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
// 取消element原有的input框样式
::v-deep .el-input--mini .el-input__inner {
  border: 0px;
  margin: 0;
  padding: 0 15px;
  background-color: transparent;
}

.input-number-range {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;

  .center {
    margin-top: 1px;
  }
}

.is-disabled {
  background-color: #eef0f6;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
