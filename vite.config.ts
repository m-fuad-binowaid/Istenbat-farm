import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.istenbat.com.sa/#farm',
  name: 'مؤسسة مزرعة بيت الاستنبات للزراعة',
  alternateName: 'Istenbat House Farm',
  url: 'https://www.istenbat.com.sa',
  logo: 'https://www.istenbat.com.sa/logo.png',
  image: 'https://www.istenbat.com.sa/assets/flora11.jpg',
  telephone: '+966501207704',
  email: 'info@istenbat.com.sa',
  priceRange: '$$',
  taxID: '7041512679',
  identifier: 'س.ت: 7041512679',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'طريق الملك عبدالله',
    addressLocality: 'الدلم',
    addressRegion: 'منطقة الرياض',
    addressCountry: 'SA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.9897,
    longitude: 47.1624,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '07:00',
      closes: '18:00',
    },
  ],
};

const PRODUCTS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'قائمة منتجات مزرعة بيت الاستنبات العضوية',
  url: 'https://www.istenbat.com.sa/products',
  numberOfItems: 5,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Product',
        name: 'دجاج بلدي طازج حر المرعى',
        image: 'https://www.istenbat.com.sa/assets/prod18a.png',
        description: 'دجاج بلدي طازج ومربى في مراعي حرة طبيعية بدون هرمونات أو مضادات حيوية في مزارع الدلم.',
        brand: {
          '@type': 'Brand',
          name: 'مزرعة بيت الاستنبات',
        },
        offers: {
          '@type': 'Offer',
          price: '35.00',
          priceCurrency: 'SAR',
          availability: 'https://schema.org/InStock',
          url: 'https://www.istenbat.com.sa/products',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Product',
        name: 'فطر المحار العضوي الطازج',
        image: 'https://www.istenbat.com.sa/assets/mushroom-placeholder.jpg',
        description: 'فطر محاري عضوي طازج قطفة يومية غني بالبروتين والمعادن من بيوت الاستنبات بالدلم.',
        brand: {
          '@type': 'Brand',
          name: 'مزرعة بيت الاستنبات',
        },
        offers: {
          '@type': 'Offer',
          price: '25.00',
          priceCurrency: 'SAR',
          availability: 'https://schema.org/InStock',
          url: 'https://www.istenbat.com.sa/products',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Product',
        name: 'أجبان مزارع الدلم الطبيعية الفاخرة',
        image: 'https://www.istenbat.com.sa/assets/dairy-halloumi.jpg',
        description: 'أجبان حرفية طبيعية طازجة من حليب الأبقار والأغنام البلدية (حلوم، عكاوي، وجبن بلدي طازج).',
        brand: {
          '@type': 'Brand',
          name: 'مزرعة بيت الاستنبات',
        },
        offers: {
          '@type': 'Offer',
          price: '30.00',
          priceCurrency: 'SAR',
          availability: 'https://schema.org/InStock',
          url: 'https://www.istenbat.com.sa/products',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Product',
        name: 'عسل النحل الطبيعي الخام',
        image: 'https://www.istenbat.com.sa/assets/prod01a.png',
        description: 'عسل سدر وزهور برية بلدي طبيعي 100% مستخرج من مناحل مزرعة بيت الاستنبات.',
        brand: {
          '@type': 'Brand',
          name: 'مزرعة بيت الاستنبات',
        },
        offers: {
          '@type': 'Offer',
          price: '95.00',
          priceCurrency: 'SAR',
          availability: 'https://schema.org/InStock',
          url: 'https://www.istenbat.com.sa/products',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Product',
        name: 'أوراق المورينجا العضوية',
        image: 'https://www.istenbat.com.sa/assets/flora11.jpg',
        description: 'أوراق وزهور المورينجا العضوية المجففة والطازجة المزروعة بأعلى معايير الاستدامة بالدلم.',
        brand: {
          '@type': 'Brand',
          name: 'مزرعة بيت الاستنبات',
        },
        offers: {
          '@type': 'Offer',
          price: '20.00',
          priceCurrency: 'SAR',
          availability: 'https://schema.org/InStock',
          url: 'https://www.istenbat.com.sa/products',
        },
      },
    },
  ],
};

const ROUTE_METADATA: Record<string, { title: string; schema?: object }> = {
  about: {
    title: 'عن مزرعة بيت استنبات | قصة التأسيس والزراعة العضوية بالدلم',
    schema: LOCAL_BUSINESS_SCHEMA,
  },
  products: {
    title: 'منتجات مزرعة استنبات | فطر محاري، أجبان طبيعية، ومايكروجرين فاخر',
    schema: PRODUCTS_SCHEMA,
  },
  locations: {
    title: 'فروع ومنافذ بيع مزرعة استنبات | أين تجد منتجاتنا بالرياض والخرج',
    schema: LOCAL_BUSINESS_SCHEMA,
  },
  experience: {
    title: 'السياحة الريفية وحجز الزيارات | تجارب مزرعة بيت استنبات بالدلم',
    schema: LOCAL_BUSINESS_SCHEMA,
  },
  contact: {
    title: 'اتصل بنا | مؤسسة مزرعة بيت الاستنبات بالدلم',
    schema: LOCAL_BUSINESS_SCHEMA,
  },
  admin: {
    title: 'لوحة التحكم | مزرعة بيت استنبات',
  },
};

function injectSchema(html: string, schema: object): string {
  const jsonString = JSON.stringify(schema, null, 2);
  const scriptTag = `    <script type="application/ld+json">\n${jsonString}\n    </script>\n  `;
  return html.replace('</head>', `${scriptTag}</head>`);
}

function generateStaticRoutesPlugin(): Plugin {
  return {
    name: 'generate-static-routes',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const rootHtmlPath = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(rootHtmlPath)) return;

      const baseHtml = fs.readFileSync(rootHtmlPath, 'utf-8');

      // 1. Inject LocalBusiness Schema into root dist/index.html
      const rootHtmlWithSchema = injectSchema(baseHtml, LOCAL_BUSINESS_SCHEMA);
      fs.writeFileSync(rootHtmlPath, rootHtmlWithSchema, 'utf-8');

      const routes = ['about', 'products', 'locations', 'experience', 'contact', 'admin'];

      routes.forEach((route) => {
        // Delete any previously generated folder (dist/about/, etc.)
        const oldRouteDir = path.resolve(distDir, route);
        if (fs.existsSync(oldRouteDir) && fs.statSync(oldRouteDir).isDirectory()) {
          fs.rmSync(oldRouteDir, { recursive: true, force: true });
        }

        // Generate flat HTML file: dist/{route}.html starting from baseHtml
        let routeHtml = baseHtml;

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
        const meta = ROUTE_METADATA[route];
        if (meta) {
          routeHtml = routeHtml.replace(
            /<title>.*?<\/title>/,
            `<title>${meta.title}</title>`
          );
          if (meta.schema) {
            routeHtml = injectSchema(routeHtml, meta.schema);
          }
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
