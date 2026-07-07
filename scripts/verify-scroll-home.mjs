import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(100);
  const homeScroll = await page.evaluate(() => window.scrollY);

  await Promise.all([
    page.waitForURL('**/profile/**/overview'),
    page.click('text=Open Player#TAG profile'),
  ]);

  const samples = [];
  for (let i = 0; i < 20; i++) {
    samples.push(await page.evaluate(() => window.scrollY));
    await page.waitForTimeout(50);
  }

  await page.waitForSelector('text=Section 1', { timeout: 10000 });
  const afterLoad = await page.evaluate(() => window.scrollY);

  console.log(
    JSON.stringify(
      {
        homeScroll,
        samplesDuringLoad: samples,
        maxDuringLoad: Math.max(...samples),
        afterLoad,
        reproducesBug: Math.max(...samples) > 200,
      },
      null,
      2
    )
  );

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
