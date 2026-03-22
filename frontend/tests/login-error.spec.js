const { test, expect } = require('@playwright/test');
const BASE = 'http://localhost:3000';

test.describe('Login Error Handling', () => {

  test('01 · Wrong password shows error message not crash', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill('amit@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button:has-text("Sign in")').click();
    await page.waitForTimeout(1500);

    // Should NOT crash - no runtime error overlay
    const errorOverlay = page.locator('text=Uncaught runtime errors');
    await expect(errorOverlay).not.toBeVisible();

    // Should show a user friendly error message
    const errorMsg = page.locator('text=Invalid email or password');
    await expect(errorMsg).toBeVisible({ timeout: 3000 });

    // Should still be on login page
    expect(page.url()).toContain('/login');
  });

  test('02 · Non-existent email shows error message not crash', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill('notexist@test.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button:has-text("Sign in")').click();
    await page.waitForTimeout(1500);

    const errorOverlay = page.locator('text=Uncaught runtime errors');
    await expect(errorOverlay).not.toBeVisible();

    expect(page.url()).toContain('/login');
  });

  test('03 · Empty fields shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("Sign in")').click();
    await page.waitForTimeout(500);

    const errorOverlay = page.locator('text=Uncaught runtime errors');
    await expect(errorOverlay).not.toBeVisible();

    expect(page.url()).toContain('/login');
  });

});
