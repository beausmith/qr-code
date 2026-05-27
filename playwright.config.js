import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

const PREINSTALLED_CHROMIUM = '/opt/pw-browsers/chromium';
const useSystemChromium = fs.existsSync(PREINSTALLED_CHROMIUM);

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npx serve -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(useSystemChromium && {
          launchOptions: {
            executablePath: PREINSTALLED_CHROMIUM,
            args: ['--no-sandbox'],
          },
        }),
      },
    },
  ],
});
