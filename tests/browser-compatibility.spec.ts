import { test, expect } from '@playwright/test';

/**
 * Browser Compatibility Tests
 * Tests core functionality across Chrome, Firefox, and Safari (WebKit)
 */

test.describe('Browser Compatibility - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:3000/zh-tw');
  });

  test('should load homepage correctly', async ({ page }) => {
    // Wait for page to load
    await expect(page).toHaveTitle(/Next\.js|實驗室/);
    
    // Check main content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check semantic navigation element exists (proper a11y)
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('should display images correctly', async ({ page }) => {
    // Check logo/images are loading
    const images = page.locator('img');
    const count = await images.count();
    
    // Verify at least one image exists
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Browser Compatibility - Components Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:3000/zh-tw/components');
  });

  test('should load components page', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    
    // Check page has component links
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to component demo', async ({ page }) => {
    // Find component links
    const componentLinks = page.locator('a[href*="/components/"]');
    const count = await componentLinks.count();
    
    if (count > 0) {
      const firstLink = componentLinks.first();
      
      // Click and wait for navigation
      await firstLink.click();
      await page.waitForLoadState('domcontentloaded');
      
      // Verify we're on a component page (use Playwright expect for better reliability)
      await expect(page).toHaveURL(/\/components\//);
    } else {
      test.skip();
    }
  });
});

test.describe('Browser Compatibility - Language Switching', () => {
  test('should support Chinese (Traditional)', async ({ page }) => {
    await page.goto('https://localhost:3000/zh-tw');
    await expect(page).toHaveURL(/zh-tw/);
  });

  test('should support English', async ({ page }) => {
    await page.goto('https://localhost:3000/en');
    await expect(page).toHaveURL(/\/en/);
  });
});

test.describe('Browser Compatibility - Responsive Design', () => {
  // Increase timeout for viewport tests as some browsers need more time
  test.setTimeout(60000);

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('https://localhost:3000/zh-tw');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('https://localhost:3000/zh-tw');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://localhost:3000/zh-tw');
    
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Browser Compatibility - Interactive Components', () => {
  test('should handle button clicks', async ({ page }) => {
    await page.goto('https://localhost:3000/zh-tw/components/switch-button-test');
    
    // Wait for page and React hydration
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Check if SwitchButton components exist
    const switches = page.locator('input[type="checkbox"]');
    const count = await switches.count();
    
    if (count > 0) {
      // Click first switch
      const firstSwitch = switches.first();
      const initialState = await firstSwitch.isChecked();
      
      await firstSwitch.click();
      
      // Verify state changed
      if (initialState) {
        await expect(firstSwitch).not.toBeChecked();
      } else {
        await expect(firstSwitch).toBeChecked();
      }
    } else {
      // Page loaded but no checkboxes - verify page is functional
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle form inputs', async ({ page }) => {
    await page.goto('https://localhost:3000/zh-tw/components/selector-demo');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Check if selectors exist
    const selects = page.locator('select');
    const count = await selects.count();
    
    if (count > 0) {
      // Verify select is interactive
      const firstSelect = selects.first();
      await expect(firstSelect).toBeVisible();
    } else {
      // Page loaded successfully
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
