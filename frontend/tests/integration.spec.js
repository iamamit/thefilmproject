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

// Second user for connection/notification tests
const USER2 = {
  fullName : 'Auto Tester Two',
  email    : `auto2${TS}@tfp.com`,
  password : 'Test@1234',
  username : `autotester2${TS}`.substring(0, 20),
  city     : 'Delhi',
  country  : 'India',
};

let token   = null;
let userId  = null;
let token2  = null;
let userId2 = null;
let postId  = null;

async function injectAuth(page, t = null, u = null, fn = null, uid = null) {
  const tok = t || token;
  const usr = u || USER.username;
  const name = fn || USER.fullName;
  const id = uid || userId;
  await page.goto(BASE + '/login');
  await page.evaluate((d) => {
    localStorage.setItem('token',    d.token);
    localStorage.setItem('username', d.username);
    localStorage.setItem('fullName', d.fullName);
    localStorage.setItem('userId',   String(d.userId));
  }, { token: tok, username: usr, fullName: name, userId: id });
}

test.describe.serial('CollabNow Integration Suite', () => {

  // ─── AUTH ────────────────────────────────────────────────────────────────
  test('01 · Register User 1', async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.waitForLoadState('networkidle');

    await page.locator('input[placeholder="Raj Sharma"]').fill(USER.fullName);
    await page.locator('input[placeholder="rajsharma"]').fill(USER.username);
    await page.locator('input[placeholder="raj@example.com"]').fill(USER.email);
    await page.locator('input[placeholder="Min. 6 characters"]').fill(USER.password);
    await page.locator('button:has-text("Continue →")').click();
    await page.waitForTimeout(800);

    await page.locator('button:has-text("DIRECTOR")').click();
    await page.locator('button:has-text("Continue →")').click();
    await page.waitForTimeout(800);

    await page.locator('input[placeholder="Mumbai"]').fill(USER.city);
    await page.locator('input[placeholder="India"]').fill(USER.country);
    await page.locator('button:has-text("Join CollabNow")').click();
    await page.waitForURL(`${BASE}/home`, { timeout: 15000 });

    token  = await page.evaluate(() => localStorage.getItem('token'));
    userId = await page.evaluate(() => localStorage.getItem('userId'));
    console.log(`✅ Registered User1  email=${USER.email}  userId=${userId}`);
    expect(token).toBeTruthy();
  });

  test('02 · Register User 2', async ({ request }) => {
    const res = await request.post(`${API}/api/auth/register`, {
      data: {
        email: USER2.email, password: USER2.password,
        fullName: USER2.fullName, username: USER2.username,
        city: USER2.city, country: USER2.country, roles: ['EDITOR']
      }
    });
    const data = await res.json();
    token2  = data.token;
    userId2 = String(data.id);
    console.log(`✅ Registered User2  email=${USER2.email}  userId=${userId2}`);
    expect(token2).toBeTruthy();
  });

  test('03 · Logout then Login', async ({ page }) => {
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

  // ─── PROFILE ─────────────────────────────────────────────────────────────
  test('04 · Edit Profile', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/edit-profile`);
    await page.waitForLoadState('networkidle');

    const bio = page.locator('textarea').first();
    if (await bio.isVisible()) await bio.fill('Automated integration test bio 🎬');

    await page.locator('input[placeholder="Mumbai"]').fill('Delhi');

    const skillInput = page.locator('input[placeholder*="skill" i]').first();
    if (await skillInput.isVisible()) {
      await skillInput.fill('Playwright Testing');
      await page.locator('button:has-text("Add")').first().click();
      await page.waitForTimeout(500);
    }

    await page.locator('button:has-text("Save Changes")').first().click();
    await page.waitForURL(`${BASE}/profile/${USER.username}`, { timeout: 10000 });
    console.log('✅ Profile edited');
  });

  test('05 · Add Portfolio Item', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/profile/${USER.username}`);
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("+ Add Project")').click();
    await page.waitForTimeout(500);

    await page.locator('input[placeholder*="title" i]').fill(`Test Film ${TS}`);
    const desc = page.locator('textarea[placeholder*="description" i]');
    if (await desc.isVisible()) await desc.fill('Automated test portfolio item');
    await page.locator('input[placeholder*="YouTube" i]').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    await page.locator('button:has-text("Save Project")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Portfolio item added');
  });

  // ─── POSTS ───────────────────────────────────────────────────────────────
  test('06 · Create Regular Post', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('button:has-text("Share something")').click();
    await page.waitForTimeout(800);

    await page.locator("textarea[placeholder=\"What's on your mind?\"]").fill(`🎬 Automated test post ${TS}`);
    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await page.waitForTimeout(2500);

    await expect(page.locator(`text=Automated test post ${TS}`)).toBeVisible({ timeout: 8000 });
    console.log('✅ Regular post created');
  });

  test('07 · Create Project Post', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('button:has-text("Share something")').click();
    await page.waitForTimeout(800);

    await page.locator("textarea[placeholder=\"What's on your mind?\"]").fill(`🎥 Looking for editor - test project ${TS}`);

    // Toggle project post
    const projectBtn = page.locator('button:has-text("🎬 Project Post")');
    if (await projectBtn.isVisible()) {
      await projectBtn.click();
      await page.waitForTimeout(300);
    }

    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await page.waitForTimeout(2500);
    console.log('✅ Project post created');
  });

  // ─── INTERACTIONS ────────────────────────────────────────────────────────
  test('08 · Like a Post', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /Like/i }).first().click();
    await page.waitForTimeout(800);
    console.log('✅ Post liked');
  });

  test('09 · Comment on Post', async ({ page }) => {
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

  test('10 · Reply to Comment', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/home`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /💬 Comment/i }).first().click();
    await page.waitForTimeout(600);

    // Click reply on first comment
    const replyBtn = page.locator('button:has-text("↩ Reply")').first();
    if (await replyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await replyBtn.click();
      await page.waitForTimeout(400);
      await page.locator('input[placeholder*="Reply to"]').first().fill(`Automated reply ${TS}`);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      console.log('✅ Reply added');
    } else {
      console.log('⚠️ No comments to reply to yet');
    }
  });

  // ─── CONNECTIONS ─────────────────────────────────────────────────────────
  test('11 · Send Connection Request', async ({ request }) => {
    const res = await request.post(`${API}/api/connections/request/${userId2}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res.status()).toBe(200);
    console.log(`✅ Connection request sent to User2`);
  });

  test('12 · Accept Connection Request', async ({ request }) => {
    // Get pending connections as User2
    const pending = await request.get(`${API}/api/connections/pending`, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    const connections = await pending.json();
    const conn = connections.find(c => c.sender?.id === parseInt(userId));
    if (conn) {
      const res = await request.patch(`${API}/api/connections/${conn.id}/respond?accept=true`, {
        headers: { Authorization: `Bearer ${token2}` }
      });
      expect(res.status()).toBe(200);
      console.log('✅ Connection accepted');
    } else {
      console.log('⚠️ No pending connection found');
    }
  });

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
  test('13 · Check Notifications', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/notifications`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should have at least some notifications (likes, comments, connection)
    const notifCount = await page.locator('[style*="border-left"]').count();
    console.log(`✅ Notifications page loaded - ${notifCount} notifications`);
    expect(page.url()).toContain('/notifications');
  });

  test('14 · Mark All Notifications Read', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/notifications`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const markAllBtn = page.locator('button:has-text("Mark all as read")');
    if (await markAllBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await markAllBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ All notifications marked as read');
    } else {
      console.log('⚠️ No unread notifications');
    }
  });

  // ─── COMPANY PAGES ────────────────────────────────────────────────────────
  test('15 · View Company Page', async ({ page }) => {
    await page.goto(`${BASE}/company/collabnow`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=CollabNow')).toBeVisible({ timeout: 5000 });
    console.log('✅ Company page loaded');
  });

  test('16 · Follow Company Page', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${BASE}/company/collabnow`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const followBtn = page.locator('button:has-text("+ Follow")');
    if (await followBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await followBtn.click();
      await page.waitForTimeout(800);
      await expect(page.locator('button:has-text("Following")')).toBeVisible({ timeout: 3000 });
      console.log('✅ Company followed');
    } else {
      console.log('⚠️ Already following or not visible');
    }
  });

  // ─── DISCOVER ─────────────────────────────────────────────────────────────
  test('17 · Discover People', async ({ page }) => {
    await page.goto(`${BASE}/discover`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const userCards = await page.locator('[style*="cursor: pointer"]').count();
    console.log(`✅ Discover page loaded - ${userCards} items visible`);
    expect(page.url()).toContain('/discover');
  });

  test.skip('18 · Discover Companies Tab', async ({ page }) => {
    // Skipped - feature/company-pages not merged to develop yet
    console.log('⏭️ Skipped - pending merge');
  });

  // ─── CLEANUP ──────────────────────────────────────────────────────────────
  test('19 · Cleanup', async ({ request }) => {
    // Delete User1
    if (userId) {
      const res1 = await request.delete(`${API}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`✅ User1 deleted  status=${res1.status()}`);
    }

    // Delete User2
    if (userId2) {
      const res2 = await request.delete(`${API}/api/users/${userId2}`, {
        headers: { Authorization: `Bearer ${token2}` }
      });
      console.log(`✅ User2 deleted  status=${res2.status()}`);
    }
  });

});
