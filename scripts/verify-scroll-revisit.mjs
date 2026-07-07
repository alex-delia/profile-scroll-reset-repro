import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('http://127.0.0.1:4173/profile/Player%23TAG/insights', {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('text=Section 1');
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(100);

  await page.click('text=Overview');
  await page.waitForSelector('text=Section 1');
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(100);

  await page.click('text=Insights');
  await page.waitForTimeout(50);
  const duringSkeleton = await page.evaluate(() => window.scrollY);
  await page.waitForSelector('text=Section 1');
  const afterLoad = await page.evaluate(() => window.scrollY);

  console.log(
    JSON.stringify({ duringSkeleton, afterLoad, restoredInsightsScroll: afterLoad > 600 }, null, 2)
  );

  await browser.close();
}

main();
