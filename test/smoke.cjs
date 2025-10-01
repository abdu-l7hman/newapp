const playwright = require('playwright');
const http = require('http');

async function findPort() {
  const ports = [5173, 5174, 5175, 5176];
  for (const p of ports) {
    try {
      await new Promise((res, rej) => {
        const req = http.request({ hostname: '127.0.0.1', port: p, method: 'HEAD', path: '/' }, (r) => {
          res();
        });
        req.on('error', rej);
        req.end();
      });
      return p;
    } catch (e) {
      // continue
    }
  }
  throw new Error('No running dev server found on ports 5173-5176');
}

(async () => {
  const port = await findPort();
  const url = `http://127.0.0.1:${port}/`;
  console.log('Found dev server at', url);

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle' });
    console.log('HTTP status:', resp.status());

    // check header text
    const header = await page.locator('text=Student Projects Hub').first();
    if (!(await header.count())) {
      console.error('Header not found');
      process.exitCode = 2;
    }

    const errors = consoleMessages.filter(m => m.type === 'error');
    if (errors.length > 0) {
      console.error('Console errors found:');
      errors.forEach(e => console.error(e.text));
      process.exitCode = 3;
    } else {
      console.log('No console errors detected. Smoke test passed.');
      process.exitCode = 0;
    }
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exitCode = 4;
  } finally {
    await browser.close();
    process.exit();
  }
})();
