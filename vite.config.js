import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import vueJsx from '@vitejs/plugin-vue-jsx';
// https://vitejs.dev/config/
export default defineConfig({
    // 基础路径配置
    base: process.env.NODE_ENV === 'production' ? '/' : '/',
    // 输出目录
    build: {
        outDir: 'dist',
        assetsDir: 'static',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'chunk-libs';
                    }
                },
            },
        },
        commonjsOptions: {
            include: [
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/dayjs.min.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/customParseFormat.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/localeData.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/advancedFormat.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/weekOfYear.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/weekYear.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/dayOfYear.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/isSameOrAfter.js',
                'node_modules/.pnpm/dayjs@1.11.4/node_modules/dayjs/plugin/isSameOrBefore.js',
                'node_modules/.pnpm/escape-html@1.0.3/node_modules/escape-html/index.js'
            ]
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                math: 'parens-division',
            },
        }
    },
    // 开发服务器配置
    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 3000,
        open: true,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_BASE_API || 'http://192.168.36.162:9083',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        cors: true, // 如果需要跨域支持，可以开启cors
    },
    // SVG Sprite Loader
    optimizeDeps: {
        include: ['@vue/runtime-dom','@/components/SvgIcon.vue', '@/assets/svg/*.svg'],
        exclude: ['@vue/cli-service'],
    },
  plugins: [
      {
          name: 'vite:scss',
          enforce: 'pre',
          transform(src, id) {
              if (/\.(scss|sass)$/i.test(id)) {
                  return require('sass').renderSync({file: id}).css;
              }
              return src;
          },
      },
      vue(),
      vueJsx(),
      AutoImport({
          resolvers: [ElementPlusResolver()],
          imports: [
              'vue'
          ]
      }),
      Components({
          resolvers: [ElementPlusResolver()],
      }),
      commonjs({
          // 配置选项
          include: /node_modules/, // 指定哪些模块需要转换为ESM，默认是node_modules中的所有commonjs模块
          // transformMixedEsModules: true, // 当有混合引用时启用，比如同时包含import和require语句
          // other options...
      }),
  ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // 使用 path.resolve 设置别名
            '~@': path.resolve(__dirname, './src'), // 使用 path.resolve 设置别名
            '@components': path.resolve(__dirname, 'src/components'),
            '~': path.resolve(__dirname, './src'),
            // ...更多其他别名
        },
    },
})
