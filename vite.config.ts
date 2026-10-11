import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function generateStaticRoutesPlugin(): Plugin {
  return {
    name: 'generate-static-routes',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const rootHtml = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(rootHtml)) return;

      const routes = ['about', 'products', 'locations', 'experience', 'contact', 'admin'];
      routes.forEach((route) => {
        const routeDir = path.resolve(distDir, route);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.copyFileSync(rootHtml, path.resolve(routeDir, 'index.html'));
      });

      // Ensure no 404.html remains in dist
      const dist404 = path.resolve(distDir, '404.html');
      if (fs.existsSync(dist404)) {
        fs.unlinkSync(dist404);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), generateStaticRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
