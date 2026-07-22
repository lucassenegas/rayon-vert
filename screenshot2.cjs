const { chromium } = require('playwright');
const SCRATCHPAD = 'C:/Users/kevin/AppData/Local/Temp/claude/C--Users-kevin-Documents-Dev-hotel-rayon-vert/70e85f34-b52c-4577-99e7-fbf326a1ab17/scratchpad';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 20000 });
  // Force all lazy images to load
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.loading = 'eager';
      const src = img.src; img.src = ''; img.src = src;
    });
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: SCRATCHPAD + '/hero2.png' });
  console.log('Hero');
  
  await page.evaluate(() => document.getElementById('hotel')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: SCRATCHPAD + '/about.png' });
  console.log('About');

  await page.evaluate(() => document.getElementById('chambres')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: SCRATCHPAD + '/rooms2.png' });
  console.log('Rooms');
  
  await page.evaluate(() => document.getElementById('restaurant')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: SCRATCHPAD + '/restaurant2.png' });
  console.log('Restaurant');
  
  await page.evaluate(() => document.getElementById('galerie')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: SCRATCHPAD + '/gallery2.png' });
  console.log('Gallery');
  
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: SCRATCHPAD + '/footer.png' });
  console.log('Footer');

  await browser.close();
  console.log('Done');
})();
