import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import envCompatible from 'vite-plugin-env-compatible';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd())
  return {
    resolve: {
      // fallback: {
      //   "path": require.resolve("path-browserify")
      // },
      alias: [
        {
          find: /^~/,
          replacement: ''
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        },
      ],
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    },
    plugins: [
      vue(),
      vueJsx(),
      viteCommonjs(),
      ViteRequireContext(),
      envCompatible(),
      createHtmlPlugin({
        minify: true,
        entry: 'src/main.js',
        inject: {
          data: {
            title: env.VITE_VUE_APP_TITLE
          }
        }
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(__dirname, 'src/assets/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[name]',
        inject: 'body-first',
        customDomId: 'svg-icon'

      })
    ],
    base: '/',
    server: {
      strictPort: false,
      port: env.VITE_VUE_APP_PORT,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // 传递给 chockidar 的文件系统监视器选项
      watch: {
        ignored: ["!**/node_modules/ares-ui-vue3/**"]
      },
    },
    // preprocessOptions: {
    //   scss: {
    //     additionalData: `@import "./src/assets/styles/index.scss";`   // 全局公共样式
    //   }
    // },
    // json: {
    //   //是否支持从 .json 文件中进行按名导入
    //   namedExports: true,
    //   //若设置为 true 导入的json会被转为 export default JSON.parse("..") 会比转译成对象字面量性能更好
    //   stringify: false
    // },
    //继承自 esbuild 转换选项，最常见的用例是自定义 JSX
    // esbuild: {
    //   jsxFactory: "h",
    //   jsxFragment: "Fragment",
    //   jsxInject: `import Vue from 'vue'`
    // },
    optimizeDeps: { exclude: ["fsevents"] },
    //打包配置
    build: {
      minify: 'terser',
      //指定输出路径
      outDir: "dist",
      //生成静态资源的存放路径
      assetsDir: "assets",
      //构建后是否生成 source map 文件
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      //传递给 Terser 的更多 minify 选项。
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
    }
  }
})
