import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';

export const options = {
  scenarios: {
    BoboSmradeDoesBrowserTest: {
      executor: 'shared-iterations',
      vus : 10,
      iterations: 10,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    'browser_web_vital_cls': ['max<0.1'],                  // no janky shifts
    'browser_web_vital_fcp': ['p(95)<1000'],               // fast first paint
    'browser_web_vital_fid': ['p(95)<100'],                // fast interaction
    'browser_web_vital_lcp': ['p(95)<2500'],               // full render under 2.5s
    'browser_web_vital_ttfb': ['p(95)<200'], 
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://test.k6.io/my_messages.php");

    await page.locator('input[name="login"]').type("admin");
    await page.locator('input[name="password"]').type("123");

    await Promise.all([
      page.waitForNavigation(),
      page.locator('input[type="submit"]').click(),
    ]);

    await check(page.locator("h2"), {
      'Is header displayed': async h2 => await h2.textContent() == "Welcome, admin!"
    });
  } finally {
    await page.close();
  }
}
