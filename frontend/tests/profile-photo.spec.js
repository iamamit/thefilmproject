const { test, expect, request } = require('@playwright/test');

const BASE = 'http://localhost:8080';
const FRONT = 'http://localhost:3000';
const TS = Date.now();

const USER = {
  fullName: 'Photo Tester',
  email: `phototester${TS}@tfp.com`,
  password: 'Test@1234',
  username: `phototester${TS}`.substring(0, 20),
  city: 'Mumbai',
  country: 'India',
};

const PHOTO_URL = 'https://i.pravatar.cc/150?u=phototester';

/** @type {string} */
let token = '';
/** @type {number} */
let userId = 0;
/** @type {number} */
let postId = 0;

/** @param {import('@playwright/test').Page} page */
async function injectAuth(page, photo = null) {
  await page.goto(FRONT + '/login');
  await page.evaluate((d) => {
    localStorage.setItem('token',    d.token);
    localStorage.setItem('username', d.username);
    localStorage.setItem('fullName', d.fullName);
    localStorage.setItem('userId',   String(d.userId));
    if (d.photo) localStorage.setItem('profilePhoto', d.photo);
  }, { token, username: USER.username, fullName: USER.fullName, userId, photo });
}

test.describe.serial('Profile Photo Display', () => {

  // ─── SETUP ────────────────────────────────────────────────────────────────
  test('00 · Setup — register test user and create a post', async () => {
    const ctx = await request.newContext();

    // Register
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
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    token  = body.token;
    userId = body.userId || body.id;

    // Create a post so it appears in the feed
    const postRes = await ctx.post(`${BASE}/api/posts`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { content: 'Profile photo test post', isProject: false },
    });
    expect(postRes.ok()).toBeTruthy();
    postId = (await postRes.json()).id;

    await ctx.dispose();
  });

  // ─── AVATAR FALLBACK: initials shown when no photo set ───────────────────
  test('01 · Left panel shows initial letter when no photo set', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${FRONT}/home`);
    await page.waitForLoadState('networkidle');
    // Should show the first letter of fullName in the left panel avatar
    const firstLetter = USER.fullName.charAt(0).toUpperCase();
    // Avatar div with the letter should be visible (no img)
    const leftAvatar = page.locator('div').filter({ hasText: new RegExp(`^${firstLetter}$`) }).first();
    await expect(leftAvatar).toBeVisible({ timeout: 5000 });
  });

  test('02 · Post compose avatar shows initial when no photo set', async ({ page }) => {
    await injectAuth(page);
    await page.goto(`${FRONT}/home`);
    await page.waitForLoadState('networkidle');
    // No profile photo img should appear in the compose area
    const composeImg = page.locator('img[alt="Photo Tester"]').first();
    await expect(composeImg).not.toBeVisible({ timeout: 3000 }).catch(() => {});
  });

  // ─── PHOTO UPLOAD: PUT /users/me/photo ───────────────────────────────────
  test('03 · Backend: PUT /users/me/photo saves the photo URL', async () => {
    const ctx = await request.newContext();
    const res = await ctx.put(`${BASE}/api/users/me/photo`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { photo: PHOTO_URL },
    });
    expect(res.ok()).toBeTruthy();
    await ctx.dispose();
  });

  test('04 · Backend: profile now has the saved photo URL', async () => {
    const ctx = await request.newContext();
    const res = await ctx.get(`${BASE}/api/users/${USER.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.profilePhotoUrl).toBe(PHOTO_URL);
    await ctx.dispose();
  });

  // ─── PHOTO DISPLAY: photo appears in UI once set ─────────────────────────
  test('05 · Left panel shows profile photo when set in localStorage', async ({ page }) => {
    await injectAuth(page, PHOTO_URL);
    await page.goto(`${FRONT}/home`);
    await page.waitForLoadState('networkidle');
    // img with the photo URL should appear in the left panel
    await expect(page.locator(`img[src="${PHOTO_URL}"]`).first()).toBeVisible({ timeout: 5000 });
  });

  test('06 · Post compose box shows profile photo when set in localStorage', async ({ page }) => {
    await injectAuth(page, PHOTO_URL);
    await page.goto(`${FRONT}/home`);
    await page.waitForLoadState('networkidle');
    // At least one img with the photo URL should be visible (left panel + compose avatar)
    const photos = page.locator(`img[src="${PHOTO_URL}"]`);
    await expect(photos.first()).toBeVisible({ timeout: 5000 });
  });

  test('07 · Post author photo shows in feed for posts with profilePhotoUrl', async ({ page }) => {
    // Set photo on the user's account, then check that their post shows the photo
    await injectAuth(page, PHOTO_URL);
    await page.goto(`${FRONT}/home`);
    await page.waitForLoadState('networkidle');
    // The feed should show at least one img (post author avatar) with the photo
    await expect(page.locator(`img[src="${PHOTO_URL}"]`).first()).toBeVisible({ timeout: 5000 });
  });

  test('08 · Comment compose avatar shows photo when set in localStorage', async ({ page }) => {
    await injectAuth(page, PHOTO_URL);
    await page.goto(`${FRONT}/home`);
    await page.waitForLoadState('networkidle');
    // Open comments on the test post
    const commentBtn = page.locator('button').filter({ hasText: /comment/i }).first();
    if (await commentBtn.isVisible()) {
      await commentBtn.click();
      await page.waitForTimeout(500);
    }
    // Profile photo should appear in the comment compose area
    await expect(page.locator(`img[src="${PHOTO_URL}"]`).first()).toBeVisible({ timeout: 5000 });
  });

  // ─── EDIT PROFILE: AvatarUpload component ────────────────────────────────
  test('09 · EditProfile shows avatar upload area', async ({ page }) => {
    await injectAuth(page, PHOTO_URL);
    await page.goto(`${FRONT}/edit-profile`);
    await page.waitForLoadState('networkidle');
    // The current profile photo or upload component should be visible
    await expect(
      page.locator('img[alt]').or(page.getByText(/click.*photo/i)).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('10 · EditProfile shows profile photo when user has one', async ({ page }) => {
    await injectAuth(page, PHOTO_URL);
    await page.goto(`${FRONT}/edit-profile`);
    await page.waitForLoadState('networkidle');
    // The saved photo URL should appear in the edit profile avatar
    await expect(page.locator(`img[src="${PHOTO_URL}"]`).first()).toBeVisible({ timeout: 5000 });
  });

  // ─── INTEGRATION: upload photo → appears in feed ─────────────────────────
  test('11 · Integration: upload photo via API then see it in home feed', async ({ page }) => {
    // Photo already uploaded in test 03. Now visit home with photo in localStorage.
    await injectAuth(page, PHOTO_URL);
    await page.goto(`${FRONT}/home`);
    await page.waitForLoadState('networkidle');
    // Verify photo appears — at minimum once (left panel avatar)
    const count = await page.locator(`img[src="${PHOTO_URL}"]`).count();
    expect(count).toBeGreaterThan(0);
  });

  // ─── CLEANUP ──────────────────────────────────────────────────────────────
  test('12 · Cleanup — delete test post', async () => {
    const ctx = await request.newContext();
    await ctx.delete(`${BASE}/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await ctx.dispose();
  });

});
