import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function selectType(page, value) {
  await page.selectOption('#type', value);
}

async function clickGenerate(page) {
  await page.getByRole('button', { name: 'Generate QR Code' }).click();
}

async function expectQRVisible(page) {
  await expect(page.locator('#qrcode canvas')).toBeVisible();
}

async function expectDownload(page, buttonLabel, ext) {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: buttonLabel }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(`qrcode.${ext}`);
}

// ---------------------------------------------------------------------------
// Each type: fill form, generate, download PNG, download SVG
// ---------------------------------------------------------------------------

const types = [
  {
    name: 'URL',
    value: 'url',
    fill: async (page) => {
      await page.fill('input[type="url"]', 'https://example.com');
    },
  },
  {
    name: 'Plain Text',
    value: 'text',
    fill: async (page) => {
      await page.fill('textarea', 'Hello, world!');
    },
  },
  {
    name: 'Contact (vCard)',
    value: 'vcard',
    fill: async (page) => {
      await page.locator('.field', { hasText: 'First Name' }).locator('input').fill('Jane');
      await page.locator('.field', { hasText: 'Last Name' }).locator('input').fill('Doe');
    },
  },
  {
    name: 'Email',
    value: 'email',
    fill: async (page) => {
      await page.fill('input[type="email"]', 'hello@example.com');
    },
  },
  {
    name: 'Phone Number',
    value: 'phone',
    fill: async (page) => {
      await page.fill('input[type="tel"]', '+15550001234');
    },
  },
  {
    name: 'SMS',
    value: 'sms',
    fill: async (page) => {
      await page.locator('.field', { hasText: 'Phone Number' }).locator('input[type="tel"]').fill('+15550001234');
    },
  },
  {
    name: 'WiFi Credentials',
    value: 'wifi',
    fill: async (page) => {
      await page.locator('.field', { hasText: 'SSID' }).locator('input').fill('MyNetwork');
    },
  },
];

for (const { name, value, fill } of types) {
  test.describe(name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await selectType(page, value);
      await fill(page);
    });

    test('generates QR code', async ({ page }) => {
      await clickGenerate(page);
      await expectQRVisible(page);
    });

    test('downloads as PNG', async ({ page }) => {
      await clickGenerate(page);
      await expectQRVisible(page);
      await expectDownload(page, 'Download PNG', 'png');
    });

    test('downloads as SVG', async ({ page }) => {
      await clickGenerate(page);
      await expectQRVisible(page);
      await expectDownload(page, 'Download SVG', 'svg');
    });
  });
}

// ---------------------------------------------------------------------------
// Validation: required fields
// ---------------------------------------------------------------------------

test.describe('Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows error when URL is empty', async ({ page }) => {
    await clickGenerate(page);
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Please enter a URL');
  });

  test('hides QR code after switching type', async ({ page }) => {
    await page.fill('input[type="url"]', 'https://example.com');
    await clickGenerate(page);
    await expectQRVisible(page);
    await selectType(page, 'text');
    await expect(page.locator('#qrcode canvas')).not.toBeVisible();
  });
});
