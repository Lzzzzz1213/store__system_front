import type { UserConfig, ConfigEnv } from 'vite';
import { resolve } from 'path';
import { loadEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createHtmlPlugin } from 'vite-plugin-html';

const { dependencies, devDependencies, name, version } = pkg;
const assetsDir = 'assets';

// 生成版本号
const appVersion = dayjs().format('YYYYMMDDHHmm');
const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  version: appVersion,
  lastBuildTime,
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  console.log(`=== run ${command} ${dayjs().format('YYYY-MM-DD HH:mm:ss')} ===`);
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const server = env.VITE_APP_SERVER_IP

  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
          },
        },
        minify: false,
      }),
    ],
    server: {
      host: true,
      port: Number(env.VITE_PORT),
      // proxy: {
      //   '/dev-api': {
      //     target: 'https://api.it120.cc/xiaochengxu',
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace(/^\/dev-api/, ''),
      //   },
      // },
      proxy: {
        /** 基础服务 192.168.46.108:9000 */
        "/demo/api": {
          target: `http://${server}/demo/api`,
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
          rewrite: (path) => path.replace("/demo/api", "")
        },
        /** 基础服务 */
        "/pay": {
          target: "http://127.0.0.1:8080/pay",
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
          // rewrite: (path) => path.replace("/demo/api", "")
        },
      }
    },
    build: {
      assetsDir: assetsDir,
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          entryFileNames: `${assetsDir}/[name].${appVersion}.js`,
          chunkFileNames: `${assetsDir}/[name].${appVersion}.js`,
          assetFileNames: `${assetsDir}/static/[name].${appVersion}.[ext]`,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import '/src/styles/variable.less';`,
          },
          javascriptEnabled: true,
        },
      },
    },
  };
};
