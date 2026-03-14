const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 40000,
  use: {
    headless: false,
    slowMo: 500,
    viewport: { width: 1280, height: 800 },
  },
  reporter: 'list',
});
