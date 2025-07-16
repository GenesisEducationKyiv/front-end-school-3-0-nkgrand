import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      visualizer({ open: true, filename: 'bundle-report.html' }),
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
      sourcemap: true,
    },
  };
});
