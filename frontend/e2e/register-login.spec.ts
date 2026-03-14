import { test, expect } from '@playwright/test';

function unique(prefix = 'user') {
  return `${prefix}_${Date.now().toString().slice(-6)}`;
}

test('full integration: register, create posts, comment, comment on other, like', async ({ page, browser }) => {
  const usernameA = unique('uA');
  const emailA = `${usernameA}@example.com`;
  const password = 'password123';
  const fullNameA = 'E2E Tester A';

  // Register user A
  await page.goto('/register');
  await page.locator('label:has-text("Full Name")').locator('..').locator('input').fill(fullNameA);
  await page.locator('label:has-text("Username")').locator('..').locator('input').fill(usernameA);
  await page.locator('label:has-text("Email")').locator('..').locator('input').fill(emailA);
  await page.locator('label:has-text("Password")').locator('..').locator('input').fill(password);
  await page.locator('button:has-text("Continue")').first().click();
  await page.locator('button:has-text("DIRECTOR")').click();
  await page.locator('button:has-text("Continue")').last().click();
  await page.locator('label:has-text("City")').locator('..').locator('input').fill('Mumbai');
  await page.locator('label:has-text("Country")').locator('..').locator('input').fill('India');
  await page.locator('button:has-text("Join TheFilmProject")').click();
  await page.waitForURL('/home', { timeout: 10000 });

  // Create a post as A
  const postA = `Post A ${Date.now()}`;
  await page.goto('/home');
  await page.locator('button:has-text("Share something")').first().click();
  await page.locator('textarea[placeholder="What\'s on your mind?"]').fill(postA);
  await page.locator('button:has-text("Post")').last().click();
  await page.locator(`text=${postA}`).first().waitFor({ timeout: 5000 });

  // Comment on own post
  const commentA = 'Nice post from A';
  const commentButtonForA = page.locator(`xpath=//p[text()="${postA}"]/following::button[contains(., 'Comment')][1]`);
  await commentButtonForA.click();
  const commentInputForA = page.locator(`xpath=//p[text()="${postA}"]/following::input[@placeholder="Add a comment..."][1]`);
  await commentInputForA.waitFor({ state: 'visible', timeout: 5000 });
  await commentInputForA.fill(commentA);
  const commentPostButtonForA = page.locator(`xpath=//p[text()="${postA}"]/following::button[contains(., 'Post')][1]`);
  await commentPostButtonForA.click();
  await page.locator(`text=${commentA}`).first().waitFor({ timeout: 5000 });

  // Create user B in a separate context
  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  const usernameB = unique('uB');
  const emailB = `${usernameB}@example.com`;
  const fullNameB = 'E2E Tester B';

  await pageB.goto('/register');
  await pageB.locator('label:has-text("Full Name")').locator('..').locator('input').fill(fullNameB);
  await pageB.locator('label:has-text("Username")').locator('..').locator('input').fill(usernameB);
  await pageB.locator('label:has-text("Email")').locator('..').locator('input').fill(emailB);
  await pageB.locator('label:has-text("Password")').locator('..').locator('input').fill(password);
  await pageB.locator('button:has-text("Continue")').first().click();
  await pageB.locator('button:has-text("DIRECTOR")').click();
  await pageB.locator('button:has-text("Continue")').last().click();
  await pageB.locator('label:has-text("City")').locator('..').locator('input').fill('Delhi');
  await pageB.locator('label:has-text("Country")').locator('..').locator('input').fill('India');
  await pageB.locator('button:has-text("Join TheFilmProject")').click();
  await pageB.waitForURL('/home', { timeout: 10000 });

  // Create a post as B
  const postB = `Post B ${Date.now()}`;
  await pageB.goto('/home');
  await pageB.locator('button:has-text("Share something")').first().click();
  await pageB.locator('textarea[placeholder="What\'s on your mind?"]').fill(postB);
  await pageB.locator('button:has-text("Post")').last().click();
  await pageB.locator(`text=${postB}`).first().waitFor({ timeout: 5000 });

  // As B, comment on A's post and like it
  const commentOnA = 'Comment from B on A';
  const commentButtonForA_onB = pageB.locator(`xpath=//p[text()="${postA}"]/following::button[contains(., 'Comment')][1]`);
  await commentButtonForA_onB.click();
  const commentInputForA_onB = pageB.locator(`xpath=//p[text()="${postA}"]/following::input[@placeholder="Add a comment..."][1]`);
  await commentInputForA_onB.waitFor({ state: 'visible', timeout: 5000 });
  await commentInputForA_onB.fill(commentOnA);
  const commentPostButtonForA_onB = pageB.locator(`xpath=//p[text()="${postA}"]/following::button[contains(., 'Post')][1]`);
  await commentPostButtonForA_onB.click();
  await pageB.locator(`text=${commentOnA}`).first().waitFor({ timeout: 5000 });
  const likeButtonForA_onB = pageB.locator(`xpath=//p[text()="${postA}"]/following::button[contains(., 'Like')][1]`);
  await likeButtonForA_onB.click();

  // As A, like B's post
  await page.bringToFront();
  // ensure A sees B's post (feed may not auto-refresh)
  await page.goto('/home');
  await page.locator(`text=${postB}`).first().waitFor({ timeout: 10000 });
  const likeButtonForB_onA = page.locator(`xpath=//p[text()="${postB}"]/following::button[contains(., 'Like')][1]`);
  await likeButtonForB_onA.waitFor({ state: 'visible', timeout: 10000 });
  await likeButtonForB_onA.click();

  await contextB.close();
});
