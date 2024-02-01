import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path';
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
                  return require('sass').renderSync({ file: id }).css;
              }
              return src;
          },
      },
      vue(),
      AutoImport({
          resolvers: [ElementPlusResolver()],
      }),
      Components({
          resolvers: [ElementPlusResolver()],
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
