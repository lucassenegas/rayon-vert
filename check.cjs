const { chromium } = require('playwright');
const SCRATCHPAD = 'C:/Users/kevin/AppData/Local/Temp/claude/C--Users-kevin-Documents-Dev-hotel-rayon-vert/70e85f34-b52c-4577-99e7-fbf326a1ab17/scratchpad';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 20000 });
  await page.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; const s = img.src; img.src=''; img.src=s; }); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SCRATCHPAD + '/check_rooms.png' });
  await page.evaluate(() => document.getElementById('chambres')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: SCRATCHPAD + '/check_rooms2.png' });
  await browser.close();
  console.log('ok');
})();
