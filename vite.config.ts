import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

const ROUTE_METADATA: Record<string, { title: string }> = {
  about: {
    title: 'عن مزرعة بيت استنبات | قصة التأسيس والزراعة العضوية بالدلم',
  },
  products: {
    title: 'منتجات مزرعة استنبات | فطر محاري، أجبان طبيعية، ومايكروجرين فاخر',
  },
  locations: {
    title: 'فروع ومنافذ بيع مزرعة استنبات | أين تجد منتجاتنا بالرياض والخرج',
  },
  experience: {
    title: 'السياحة الريفية وحجز الزيارات | تجارب مزرعة بيت استنبات بالدلم',
  },
  contact: {
    title: 'اتصل بنا | مؤسسة مزرعة بيت الاستنبات بالدلم',
  },
  admin: {
    title: 'لوحة التحكم | مزرعة بيت استنبات',
  },
};

function generateStaticRoutesPlugin(): Plugin {
  return {
    name: 'generate-static-routes',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const rootHtmlPath = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(rootHtmlPath)) return;

      const rootHtml = fs.readFileSync(rootHtmlPath, 'utf-8');
      const routes = ['about', 'products', 'locations', 'experience', 'contact', 'admin'];

      routes.forEach((route) => {
        // Delete any previously generated folder (dist/about/, etc.)
        const oldRouteDir = path.resolve(distDir, route);
        if (fs.existsSync(oldRouteDir) && fs.statSync(oldRouteDir).isDirectory()) {
          fs.rmSync(oldRouteDir, { recursive: true, force: true });
        }

        // Generate flat HTML file: dist/{route}.html
        let routeHtml = rootHtml;

        // Replace canonical link
        routeHtml = routeHtml.replace(
          /<link rel="canonical" href="https:\/\/www\.istenbat\.com\.sa\/" \/>/,
          `<link rel="canonical" href="https://www.istenbat.com.sa/${route}" />`
        );

        // Replace og:url
        routeHtml = routeHtml.replace(
          /<meta property="og:url" content="https:\/\/www\.istenbat\.com\.sa\/" \/>/,
          `<meta property="og:url" content="https://www.istenbat.com.sa/${route}" />`
        );

        // Replace title
        if (ROUTE_METADATA[route]) {
          routeHtml = routeHtml.replace(
            /<title>.*?<\/title>/,
            `<title>${ROUTE_METADATA[route].title}</title>`
          );
        }

        const flatHtmlPath = path.resolve(distDir, `${route}.html`);
        fs.writeFileSync(flatHtmlPath, routeHtml, 'utf-8');
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
