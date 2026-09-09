// Kaze Tachinu (The Wind Rises) theme — dynamic plugin host half (v65).
// Serves the three theme assets the browser half's stylesheet references:
//   /kaze-tachinu/current.jpg       cinematic wallpaper (body background)
//   /kaze-tachinu/logo.svg     sidebar brand + hero headline logo
//   /kaze-tachinu/logo-letter.svg   collapsed-sidebar mark
//
// INSTALL-TIME REWRITE: the three constants below carry a <CLONE_DIR>
// placeholder. Before defining the plugin, replace every <CLONE_DIR> with
// the absolute path of this repository clone (the README's agent-assisted
// install does this automatically). Examples:
//   Linux / macOS:  '/home/you/.dsh/themes/dsh-kaze-tachinu-theme/assets/current.jpg'
//   Windows:        'C:\\Users\\you\\.dsh\\themes\\dsh-kaze-tachinu-theme\\assets\\current.jpg'
return {
  apply(ctx) {
    const fs = ctx.get('fs');
    const webServer = ctx.get('webServer');
    if (fs === undefined || webServer === undefined) return;
    const bgFile = '<CLONE_DIR>/assets/current.jpg';
    const logoFile = '<CLONE_DIR>/assets/logo/logo.svg';
    const letterFile = '<CLONE_DIR>/assets/logo/logo-letter.svg';
    const addRoute = (spec) => {
      // Tolerate an already-registered /kaze-tachinu-bg route (e.g. a previous
      // instance of this theme still active): skip instead of failing.
      try {
        return webServer.register(spec);
      } catch (e) {
        console.warn('[kaze-tachinu] route already served elsewhere, skipping:', e?.message ?? e);
        return () => {};
      }
    };
    const routeBg = addRoute({
      kind: 'exact',
      path: '/kaze-tachinu/current.jpg',
      handler: async (req, res) => {
        try {
          const target = await fs.resolve(bgFile);
          const bytes = await fs.readBytes(target, undefined, 16 * 1024 * 1024);
          res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': bytes.length,
            'Cache-Control': 'public, max-age=3600',
          });
          res.end(bytes);
        } catch (err) {
          console.error('kaze-tachinu-bg route failed:', err);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('kaze-tachinu bg not found');
        }
      },
    });
    const routeLogo = addRoute({
      kind: 'exact',
      path: '/kaze-tachinu/logo.svg',
      handler: async (req, res) => {
        try {
          const target = await fs.resolve(logoFile);
          const bytes = await fs.readBytes(target, undefined, 2 * 1024 * 1024);
          res.writeHead(200, {
            'Content-Type': 'image/svg+xml',
            'Content-Length': bytes.length,
            'Cache-Control': 'public, max-age=3600',
          });
          res.end(bytes);
        } catch (err) {
          console.error('kaze-tachinu-logo route failed:', err);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('kaze-tachinu logo not found');
        }
      },
    });
    const routeLetter = addRoute({
      kind: 'exact',
      path: '/kaze-tachinu/logo-letter.svg',
      handler: async (req, res) => {
        try {
          const target = await fs.resolve(letterFile);
          const bytes = await fs.readBytes(target, undefined, 2 * 1024 * 1024);
          res.writeHead(200, {
            'Content-Type': 'image/svg+xml',
            'Content-Length': bytes.length,
            'Cache-Control': 'public, max-age=3600',
          });
          res.end(bytes);
        } catch (err) {
          console.error('kaze-tachinu-letter route failed:', err);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('kaze-tachinu letter not found');
        }
      },
    });
    ctx.effect(() => routeBg);
    ctx.effect(() => routeLogo);
    ctx.effect(() => routeLetter);
  },
};
