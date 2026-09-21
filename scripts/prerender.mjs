// Prerenders selected routes to static HTML after `vite build`, so the browser
// paints real content immediately instead of an empty #root while React loads.
// Runs as a `postbuild` step against the already-built dist/ output.
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const PORT = 4571;
const ROUTES = ['/'];
const READY_TIMEOUT_MS = 15000;

function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  const attempt = async () => {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not up yet
    }
    if (Date.now() > deadline) throw new Error(`Static server did not start at ${url}`);
    await new Promise((r) => setTimeout(r, 200));
    return attempt();
  };
  return attempt();
}

async function main() {
  const server = spawn('npx', ['serve', '-s', distDir, '-l', String(PORT)], {
    stdio: 'inherit',
  });

  try {
    await waitForServer(`http://localhost:${PORT}/`, 10000);

    // Read the pristine template once — routes are written to different output
    // paths, but each must splice into the original shell, not one already
    // rewritten by an earlier route in this loop.
    const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      for (const route of ROUTES) {
        const page = await browser.newPage();
        const url = `http://localhost:${PORT}${route}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        try {
          await page.waitForFunction('window.__PRERENDER_READY__ === true', {
            timeout: READY_TIMEOUT_MS,
          });
        } catch {
          console.warn(`[prerender] Warning: ready signal not seen for ${route} within ${READY_TIMEOUT_MS}ms, using current DOM anyway.`);
        }

        // Only take the rendered #root markup, not the whole document — the page
        // has already run scripts (GTM injects its own <script> tag at runtime),
        // and serializing the whole DOM would bake those runtime mutations into
        // the static file, duplicating them when the original scripts run again
        // on a real visit.
        const rootHtml = await page.$eval('#root', (el) => el.innerHTML);

        const outPath =
          route === '/'
            ? path.join(distDir, 'index.html')
            : path.join(distDir, route.replace(/^\//, ''), 'index.html');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });

        const merged = template.replace(
          '<div id="root"></div>',
          `<div id="root">${rootHtml}</div>`
        );
        if (merged === template) {
          throw new Error(`Could not find '<div id="root"></div>' placeholder in dist/index.html template for route ${route}`);
        }
        fs.writeFileSync(outPath, merged);
        console.log(`[prerender] ${route} -> ${path.relative(distDir, outPath)} (${(merged.length / 1024).toFixed(1)} KB)`);

        await page.close();
      }
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
