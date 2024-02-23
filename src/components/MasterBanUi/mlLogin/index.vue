<script>
import envKevin from './lib/envKevin.vue';
import envPoint from './lib/envPoint.vue'

export default {
  name: 'ml-login',
  components: {
    envKevin,

  },
  data() {
    return {

      list: []
    }
  },
  methods: {
    doLogin(params) {
      this.$emit('doLogin', params)
    }
  },
  props: {
    loginBgi: {
      typeof: String,
      default: ''
    },
    themeTypeName: {
      typeof: String,
      default: '',
    },
    config: {
      typeof: Object,
      default: () => {
      }
    }
  },
  render(createElement, context) {
    return (
        <div class="ml_login_area" style={{'backgroundImage': `url(${this.loginBgi})`}}>
          {
            (() => {
              switch (this.themeTypeName) {
                case 'envKevin':
                  return <envKevin config={this.config} onLogin={(loginForm) => {
                    this.doLogin(loginForm)
                  }}/>
                  break;
                case 'envPoint':
                  return <envPoint config={this.config} onLogin={(loginForm) => {
                    this.doLogin(loginForm)
                  }}/>
                  break;
              }
            })()
          }
        </div>
    )
  }
}
</script>

<style lang="less" scoped>
.ml_login_area {
  width: 100%;
  height: 100vh;
  /* 背景图垂直、水平均居中 */
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-attachment: fixed;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
  position: relative;
}
</style>
