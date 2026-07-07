import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('http://127.0.0.1:4173/profile/Player%23TAG/overview', {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('text=Section 1');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(100);

  await page.click('text=Insights');

  const samples = [];
  for (let i = 0; i < 30; i++) {
    samples.push(await page.evaluate(() => window.scrollY));
    await page.waitForTimeout(25);
  }

  const skeletonVisible = await page.locator('[data-testid="tab-skeleton"]').count();
  await page.waitForSelector('text=Section 1', { timeout: 10000 });
  const afterLoad = await page.evaluate(() => window.scrollY);

  console.log(
    JSON.stringify(
      {
        samplesDuringTabSwitch: samples,
        maxDuringTabSwitch: Math.max(...samples),
        skeletonVisibleCount: skeletonVisible,
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
