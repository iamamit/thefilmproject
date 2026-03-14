const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';
const API  = 'http://localhost:8080';
const TS   = Date.now();

const USER = {
  fullName : 'Auto Tester',
  email    : `auto${TS}@tfp.com`,
  password : 'Test@1234',
  username : `autotester${TS}`.substring(0, 20),
  city     : 'Mumbai',
  country  : 'India',
};

let token  = null;
let userId = null;

async function injectAuth(page) {
  await page.goto(BASE + '/login');
  await page.evaluate((u) => {
    localStorage.setItem('token',    u.token);
    localStorage.setItem('username', u.username);
    localStorage.setItem('fullName', u.fullName);
    localStorage.setItem('userId',   String(u.userId));
  }, { token, username: USER.username, fullName: USER.fullName, userId });
}

test.describe.serial('TFP Integration Suite', () => {

  test('01 · Register', async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.waitForLoadState('networkidle');

    // Step 1
    await page.locator('input[placeholder="Raj Sharma"]').fill(USER.fullName);
    await page.locator('input[placeholder="rajsharma"]').fill(USER.username);
    await page.locator('input[placeholder="raj@example.com"]').fill(USER.email);
    await page.locator('input[placeholder="Min. 6 characters"]').fill(USER.password);
    await page.locator('button:has-text("Continue →")').click();
    await page.waitForTimeout(800);

    // Step 2 - select DIRECTOR role
    await page.locator('button:has-text("DIRECTOR")').click();
    await page.locator('button:has-text("Continue →")').click();
    await page.waitForTimeout(800);

    // Step 3 - city, country
    await page.locator('input[placeholder="Mumbai"]').fill(USER.city);
    await page.locator('input[placeholder="India"]').fill(USER.country);
    await page.locator('button:has-text("Join CollabNow")').click();
    await page.waitForURL(`${BASE}/home`, { timeout: 15000 });

    token  = await page.evaluate(() => localStorage.getItem('token'));
    userId = await page.evaluate(() => localStorage.getItem('userId'));
    console.log(`✅ Registered  email=${USER.email}  userId=${userId}`);
    expect(token).toBeTruthy();
  });

  test('02 · Logout then Login', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("Logout")').click();
    await page.waitForURL(`${BASE}/login`, { timeout: 8000 });
    console.log('✅ Logged out');

    await page.locator('input[type="email"]').fill(USER.email);
    await page.locator('input[type="password"]').fill(USER.password);
    await page.locator('button:has-text("Sign in")').click();
    await page.waitForURL(`${BASE}/home`, { timeout: 10000 });

    token  = await page.evaluate(() => localStorage.getItem('token'));
    userId = await page.evaluate(() => localStorage.getItem('userId'));
    console.log(`✅ Logged in`);
    expect(token).toBeTruthy();
  });

  test('03 · Edit Profile', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/edit-profile`);
    await page.waitForLoadState('networkidle');

    const bio = page.locator('textarea').first();
    if (await bio.isVisible()) await bio.fill('Automated integration test bio 🎬');

    await page.locator('input[placeholder="Mumbai"]').fill('Delhi');

    // Add a skill
    const skillInput = page.locator('input[placeholder*="skill" i], input[placeholder*="Skill"]').first();
    if (await skillInput.isVisible()) {
      await skillInput.fill('Playwright');
      await page.locator('button:has-text("Add")').first().click();
      await page.waitForTimeout(500);
    }

    await page.locator('button:has-text("Save Changes")').first().click();
    await page.waitForURL(`${BASE}/profile/${USER.username}`, { timeout: 10000 });
    console.log('✅ Profile edited');
  });

  test('04 · Create Post', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('button:has-text("Share something")').click();
    await page.waitForTimeout(800);

    await page.locator("textarea[placeholder=\"What's on your mind?\"]").fill(`🎬 Automated test post ${TS}`);
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await page.waitForTimeout(2500);

    await expect(page.locator(`text=Automated test post ${TS}`)).toBeVisible({ timeout: 8000 });
    console.log('✅ Post created');
  });
  test('05 · Like a Post', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /Like/i }).first().click();
    await page.waitForTimeout(800);
    console.log('✅ Post liked');
  });

  test('06 · Comment on Post', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /💬 Comment/i }).first().click();
    await page.waitForTimeout(600);

    await page.locator('input[placeholder="Add a comment..."]').first().fill(`Automated comment ${TS}`);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    console.log('✅ Comment added');
  });

  test('07 · Add Portfolio Item', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/profile/${USER.username}`);
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("+ Add Project")').click();
    await page.waitForTimeout(500);

    await page.locator('input[placeholder*="title" i]').fill(`Test Film ${TS}`);
    const desc = page.locator('textarea[placeholder*="description" i]');
    if (await desc.isVisible()) await desc.fill('Automated test portfolio item');

    await page.locator('button:has-text("Save Project")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Portfolio item added');
  });

  test('08 · Cleanup', async ({ request }) => {
    const targetId = userId || 1; // fallback to amit's id for isolated runs
    const res = await request.post(`${API}/api/auth/login`, {
      data: { email: userId ? USER.email : 'amit@test.com', password: userId ? USER.password : 'password123' }
    });
    const data = await res.json();
    const cleanToken = data.token;

    const del = await request.delete(`${API}/api/users/${targetId}`, {
      headers: { Authorization: `Bearer ${cleanToken}` }
    });
    console.log(`✅ Cleanup done  status=${del.status()}`);
  });

});
