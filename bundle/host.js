// Kaze Tachinu (The Wind Rises) theme — host half of the dsh-kaze-tachinu-theme bundle.
// Owns the three asset routes the browser half's CSS references:
//   /kaze-tachinu/current.jpg      cinematic wallpaper (body background)
//   /kaze-tachinu/logo.svg    sidebar brand + hero headline logo
//   /kaze-tachinu/logo-letter.svg  collapsed-sidebar mark
// Asset paths resolve relative to this file, so the bundle works from any
// clone location without editing constants.
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, '..', 'assets');

const ROUTES = [
  {
    path: '/kaze-tachinu/current.jpg',
    file: join(assets, 'current.jpg'),
    type: 'image/jpeg',
  },
  {
    path: '/kaze-tachinu/logo.svg',
    file: join(assets, 'logo', 'logo.svg'),
    type: 'image/svg+xml',
  },
  {
    path: '/kaze-tachinu/logo-letter.svg',
    file: join(assets, 'logo', 'logo-letter.svg'),
    type: 'image/svg+xml',
  },
];

export default {
  inject: ['webServer'],
  apply(ctx) {
    let registered = 0;
    for (const route of ROUTES) {
      // Tolerate an already-registered /kaze-tachinu-bg route (e.g. a legacy
      // dynamic-plugin instance of this theme in the same profile): skip
      // instead of failing the whole profile load.
      let dispose;
      try {
        dispose = ctx.webServer.register({
          kind: 'exact',
          path: route.path,
          handler: async (req, res) => {
            try {
              const bytes = await readFile(route.file);
              res.writeHead(200, {
                'Content-Type': route.type,
                'Content-Length': bytes.length,
                'Cache-Control': 'public, max-age=3600',
              });
              res.end(bytes);
            } catch (err) {
              console.error(`[kaze-tachinu-theme] asset route failed: ${route.path}`, err);
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('kaze-tachinu asset not found');
            }
          },
        });
        registered += 1;
      } catch (e) {
        console.warn(`[kaze-tachinu-theme] route ${route.path} already served elsewhere, skipping:`, e?.message ?? e);
        continue;
      }
      ctx.effect(() => dispose);
    }
    console.log(`[kaze-tachinu-theme] host half active (${registered}/${ROUTES.length} asset routes registered)`);
  },
};
