import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import ViteRequireContext from "@originjs/vite-plugin-require-context";
import envCompatible from "vite-plugin-env-compatible";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// 导入VTJ开发工具
import { createDevTools } from '@vtj/pro/vite';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: "",
        },
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    plugins: [
      vue(),
      vueJsx(),
      viteCommonjs(),
      ViteRequireContext(),
      envCompatible(),
      // createHtmlPlugin({
      //   minify: true,
      //   entry: "src/main.ts",
      //   inject: {
      //     data: {
      //       title: env.VITE_VUE_APP_TITLE,
      //     },
      //   },
      // }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(__dirname, "src/assets/icons/svg")],
        // 指定symbolId格式
        symbolId: "icon-[name]",
        inject: "body-first",
        customDomId: "svg-icon",
      }),
      createDevTools({ linkOptions: { href: "/__vtj__/#/" } }),
    ],
    base: "/",
    server: {
      strictPort: false,
      port: Number(env.VITE_VUE_APP_PORT),
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: "http://" + env.VITE_VUE_APP_ADDR + ":8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      // 传递给 chockidar 的文件系统监视器选项
      watch: {
        ignored: ["!**/node_modules/ares-ui-vue3/**"],
      },
    },
    optimizeDeps: { exclude: ["fsevents"] },
    //打包配置
    build: {
      minify: "terser",
      //指定输出路径
      outDir: "dist",
      //生成静态资源的存放路径
      assetsDir: "assets",
      //构建后是否生成 source map 文件
      sourcemap: env.VITE_SOURCEMAP === "true" ? "inline" : false,
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash:8].js",
          entryFileNames: "js/[name]-[hash:8].js",
          assetFileNames: "assets/[ext]/[name]-[hash:8].[ext]",
          // 最小化拆分包
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString()
            }
          },
        },
      },
      //传递给 Terser 的更多 minify 选项。
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === "true",
          drop_console: env.VITE_DROP_CONSOLE === "true",
        },
      },
    },
  };
});
