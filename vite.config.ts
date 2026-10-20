import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Demo sites shown in the portfolio carousel. Each one is its own page, served at /demos/<name>/.
const DEMOS = ['fred-cafe', 'fred-studio', 'fred-plumbing', 'casa-luma'];

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(DEMOS.map((name) => [name, resolve(__dirname, `demos/${name}/index.html`)])),
      },
    },
  },
});
