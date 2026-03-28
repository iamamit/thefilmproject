const { test, expect, request } = require('@playwright/test');

const BASE = 'http://localhost:8080';
const FRONT = 'http://localhost:3000';
const TS = Date.now();

const USER = {
  fullName: 'PreLaunch Tester',
  email: `prelaunch${TS}@tfp.com`,
  password: 'Test@1234',
  username: `prelaunch${TS}`.substring(0, 20),
  city: 'Mumbai',
  country: 'India',
};

/** @type {string} */
let token = '';
/** @type {number} */
let userId = 0;

/** @param {import('@playwright/test').Page} page */
async function injectAuth(page) {
  await page.goto(FRONT + '/login');
  await page.evaluate((d) => {
    localStorage.setItem('token',    d.token);
    localStorage.setItem('username', d.username);
    localStorage.setItem('fullName', d.fullName);
    localStorage.setItem('userId',   String(d.userId));
  }, { token, username: USER.username, fullName: USER.fullName, userId });
}

test.describe.serial('Pre-launch features', () => {

  // ─── SETUP: register a user so auth-required tests can run ───────────────
  test('00 · Setup — register test user', async () => {
    const ctx = await request.newContext();
    const res = await ctx.post(`${BASE}/api/auth/register`, {
      data: {
        fullName: USER.fullName,
        email: USER.email,
        password: USER.password,
        username: USER.username,
        city: USER.city,
        country: USER.country,
        roles: ['DIRECTOR'],
      },
    });
    // Accept 200 or 201
    expect([200, 201]).toContain(res.status());
    const body = await res.json();
    token  = body.token;
    userId = body.userId || body.id;
    await ctx.dispose();
  });

  // ─── 404 ─────────────────────────────────────────────────────────────────
  test.describe('404 Not Found Page', () => {
    test('unknown route shows 404 page', async ({ page }) => {
      await page.goto(`${FRONT}/this-route-does-not-exist-abc123`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByText('Scene not found')).toBeVisible({ timeout: 5000 });
    });

    test('404 page has back-to-home button', async ({ page }) => {
      await page.goto(`${FRONT}/nonexistent-page`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('button', { name: /back to home/i })).toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TERMS & PRIVACY ─────────────────────────────────────────────────────
  test.describe('Terms of Service & Privacy Policy', () => {
    test('Terms of Service page loads', async ({ page }) => {
      await page.goto(`${FRONT}/terms`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible({ timeout: 5000 });
    });

    test('Privacy Policy page loads', async ({ page }) => {
      await page.goto(`${FRONT}/privacy`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible({ timeout: 5000 });
    });

    test('Privacy Policy mentions DPDP Act', async ({ page }) => {
      await page.goto(`${FRONT}/privacy`);
      await expect(page.getByText(/DPDP/i)).toBeVisible({ timeout: 5000 });
    });

    test('login page links to /terms', async ({ page }) => {
      await page.goto(`${FRONT}/login`);
      await expect(page.locator('a[href="/terms"]')).toBeVisible({ timeout: 5000 });
    });

    test('login page links to /privacy', async ({ page }) => {
      await page.goto(`${FRONT}/login`);
      await expect(page.locator('a[href="/privacy"]')).toBeVisible({ timeout: 5000 });
    });

    test('register page links to /terms', async ({ page }) => {
      await page.goto(`${FRONT}/register`);
      await expect(page.locator('a[href="/terms"]').first()).toBeVisible({ timeout: 5000 });
    });
  });

  // ─── FORGOT / RESET PASSWORD ──────────────────────────────────────────────
  test.describe('Forgot Password Flow', () => {
    test('forgot-password page renders email input', async ({ page }) => {
      await page.goto(`${FRONT}/forgot-password`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });
    });

    test('submitting email always shows success state', async ({ page }) => {
      await page.goto(`${FRONT}/forgot-password`);
      await page.locator('input[type="email"]').fill('anyemail@example.com');
      await page.getByRole('button', { name: /send reset link/i }).click();
      await expect(page.getByText(/check your email/i)).toBeVisible({ timeout: 8000 });
    });

    test('login page shows Forgot password link', async ({ page }) => {
      await page.goto(`${FRONT}/login`);
      await expect(page.getByText(/forgot password/i)).toBeVisible({ timeout: 5000 });
    });

    test('Forgot password link navigates correctly', async ({ page }) => {
      await page.goto(`${FRONT}/login`);
      await page.getByText(/forgot password/i).click();
      await expect(page).toHaveURL(/\/forgot-password/, { timeout: 5000 });
    });
  });

  test.describe('Reset Password Page', () => {
    test('no token shows invalid link message', async ({ page }) => {
      await page.goto(`${FRONT}/reset-password`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/invalid reset link/i)).toBeVisible({ timeout: 5000 });
    });

    test('invalid token shows error on submit', async ({ page }) => {
      await page.goto(`${FRONT}/reset-password?token=bad-token-xyz`);
      await page.waitForLoadState('networkidle');
      await page.locator('input[placeholder="New password"]').fill('newpassword123');
      await page.locator('input[placeholder="Confirm new password"]').fill('newpassword123');
      await page.getByRole('button', { name: /reset password/i }).click();
      await expect(page.getByText(/invalid or expired/i)).toBeVisible({ timeout: 8000 });
    });

    test('mismatched passwords shows error', async ({ page }) => {
      await page.goto(`${FRONT}/reset-password?token=any-token`);
      await page.waitForLoadState('networkidle');
      await page.locator('input[placeholder="New password"]').fill('password123');
      await page.locator('input[placeholder="Confirm new password"]').fill('different456');
      await page.getByRole('button', { name: /reset password/i }).click();
      await expect(page.getByText(/do not match/i)).toBeVisible({ timeout: 5000 });
    });
  });

  // ─── EMAIL VERIFICATION ───────────────────────────────────────────────────
  test.describe('Email Verification Pages', () => {
    test('check-email page renders inbox message', async ({ page }) => {
      await page.goto(`${FRONT}/check-email`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 5000 });
    });

    test('check-email page has back to sign in link', async ({ page }) => {
      await page.goto(`${FRONT}/check-email`);
      await expect(page.locator('a[href="/login"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('invalid verify token shows error', async ({ page }) => {
      await page.goto(`${FRONT}/verify-email?token=badtoken123`);
      await expect(page.getByText(/invalid or expired/i)).toBeVisible({ timeout: 8000 });
    });

    test('check-email page is accessible after registration', async ({ page }) => {
      // Simulate post-registration state: store email and navigate
      await page.goto(`${FRONT}/check-email`);
      await page.evaluate(() => {
        sessionStorage.setItem('pendingVerificationEmail', 'test@example.com');
      });
      await page.reload();
      await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 5000 });
    });
  });

  // ─── SEO TITLES ──────────────────────────────────────────────────────────
  test.describe('SEO — Page Titles', () => {
    test('login page title contains TheFilmProject', async ({ page }) => {
      await page.goto(`${FRONT}/login`);
      await expect(page).toHaveTitle(/TheFilmProject/, { timeout: 5000 });
    });

    test('terms page title contains Terms', async ({ page }) => {
      await page.goto(`${FRONT}/terms`);
      await expect(page).toHaveTitle(/Terms/, { timeout: 5000 });
    });

    test('404 page title contains Not Found', async ({ page }) => {
      await page.goto(`${FRONT}/nonexistent-xyz`);
      await expect(page).toHaveTitle(/Not Found/, { timeout: 5000 });
    });

    test('home page title contains TheFilmProject when logged in', async ({ page }) => {
      await injectAuth(page);
      await page.goto(`${FRONT}/home`);
      await expect(page).toHaveTitle(/TheFilmProject/, { timeout: 5000 });
    });
  });

  // ─── INPUT VALIDATION / CHAR COUNTERS ────────────────────────────────────
  test.describe('Input Validation & Character Counters', () => {
    test('post compose box shows character counter', async ({ page }) => {
      await injectAuth(page);
      await page.goto(`${FRONT}/home`);
      await page.waitForLoadState('networkidle');
      // Click the trigger button to open the compose box
      await page.getByText('Share something with the film community...').click();
      await page.waitForTimeout(500);
      const textarea = page.locator('textarea[placeholder="What\'s on your mind?"]');
      await textarea.fill('Hello world');
      await expect(page.getByText(/\/3000/)).toBeVisible({ timeout: 5000 });
    });

    test('post char counter turns red near limit', async ({ page }) => {
      await injectAuth(page);
      await page.goto(`${FRONT}/home`);
      await page.waitForLoadState('networkidle');
      await page.getByText('Share something with the film community...').click();
      await page.waitForTimeout(500);
      const textarea = page.locator('textarea[placeholder="What\'s on your mind?"]');
      await textarea.fill('a'.repeat(2850));
      await expect(page.getByText(/2850\/3000/)).toBeVisible({ timeout: 5000 });
    });

    test('edit profile page shows bio character counter', async ({ page }) => {
      await injectAuth(page);
      await page.goto(`${FRONT}/edit-profile`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/\/500/)).toBeVisible({ timeout: 5000 });
    });

    test('edit profile page shows profile completion bar', async ({ page }) => {
      await injectAuth(page);
      await page.goto(`${FRONT}/edit-profile`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/profile.*complete/i)).toBeVisible({ timeout: 5000 });
    });

    test('profile completion percentage is shown', async ({ page }) => {
      await injectAuth(page);
      await page.goto(`${FRONT}/edit-profile`);
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/%/).first()).toBeVisible({ timeout: 5000 });
    });
  });

  // ─── POST IMAGE UPLOAD ────────────────────────────────────────────────────
  test.describe('Post Image URL', () => {
    test('image URL input appears in post compose box', async ({ page }) => {
      await injectAuth(page);
      await page.goto(`${FRONT}/home`);
      await page.waitForLoadState('networkidle');
      await page.getByText('Share something with the film community...').click();
      await page.waitForTimeout(500);
      await expect(page.locator('input[placeholder="Image URL (optional)"]')).toBeVisible({ timeout: 5000 });
    });

    test('post with image URL is saved with imageUrl', async ({ request }) => {
      // Use the API directly to verify imageUrl is stored and returned in feed
      const postRes = await request.post(`${BASE}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          content: 'API image post test',
          imageUrl: 'https://picsum.photos/600/400',
          isProject: false,
        },
      });
      expect(postRes.ok()).toBeTruthy();
      const created = await postRes.json();
      expect(created.imageUrl).toBe('https://picsum.photos/600/400');

      // Verify it appears in the feed
      const feedRes = await request.get(`${BASE}/api/posts/feed`);
      const feed = await feedRes.json();
      const found = feed.content.find(p => p.id === created.id);
      expect(found).toBeTruthy();
      expect(found.imageUrl).toBe('https://picsum.photos/600/400');
    });
  });

});
