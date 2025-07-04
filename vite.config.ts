import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      visualizer({
        open: true,
        filename: 'bundle-report.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    server: {
      port: Number(env.VITE_API_PORT),
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET,
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_API_TARGET,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            antd: ['antd'],
            mobx: ['mobx', 'mobx-react-lite'],
            router: ['react-router-dom'],
            tsbelt: ['@mobily/ts-belt'],
            zod: ['zod'],
            utils: ['axios', 'neverthrow'],
          },
        },
        external: [],
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
