// Basic Playwright test examples
// Note: This file uses Playwright's test framework which handles its own TypeScript configuration

const { test, expect } = require('@playwright/test');

test.describe('Playwright Browser Tests', () => {
  
  test('should navigate to example.com and verify title', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/example-homepage.png',
      fullPage: true 
    });
  });

  test('should interact with form elements', async ({ page }) => {
    // Navigate to a form testing page
    await page.goto('https://httpbin.org/forms/post');
    
    // Fill form fields
    await page.fill('input[name="custname"]', 'Test User');
    await page.fill('input[name="custtel"]', '123-456-7890');
    await page.fill('input[name="custemail"]', 'test@example.com');
    
    // Select dropdown option
    await page.selectOption('select[name="size"]', 'large');
    
    // Check radio button
    await page.check('input[name="topping"][value="bacon"]');
    
    // Take screenshot of filled form
    await page.screenshot({ 
      path: 'screenshots/form-filled.png',
      fullPage: true 
    });
    
    // Verify form values
    await expect(page.locator('input[name="custname"]')).toHaveValue('Test User');
    await expect(page.locator('select[name="size"]')).toHaveValue('large');
  });

  test('should execute JavaScript and test browser features', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test JavaScript execution
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toBeTruthy();
    
    // Test local storage
    await page.evaluate(() => {
      localStorage.setItem('testKey', 'testValue');
    });
    
    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('testKey');
    });
    
    expect(storedValue).toBe('testValue');
    
    // Test cookies
    await page.context().addCookies([{
      name: 'testCookie',
      value: 'testValue',
      domain: 'example.com',
      path: '/'
    }]);
    
    const cookies = await page.context().cookies();
    expect(cookies.length).toBeGreaterThan(0);
  });

  test('should handle network interception', async ({ page }) => {
    // Intercept network requests
    await page.route('**/*.png', route => {
      console.log(`Intercepted PNG request: ${route.request().url()}`);
      route.continue();
    });
    
    await page.goto('https://example.com');
    
    // Wait for network to be idle
    await page.waitForLoadState('networkidle');
    
    // Verify page loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should test multiple browser contexts', async ({ browser }) => {
    // Create multiple contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Navigate to different pages
    await page1.goto('https://example.com');
    await page2.goto('https://httpbin.org/get');
    
    // Verify both pages loaded
    await expect(page1.locator('h1')).toContainText('Example Domain');
    await expect(page2.locator('pre')).toBeVisible();
    
    // Clean up
    await context1.close();
    await context2.close();
  });

  test('should simulate mobile viewport', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    await page.goto('https://example.com');
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'screenshots/mobile-view.png',
      fullPage: true 
    });
    
    // Verify mobile viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
    
    await context.close();
  });

  test('should handle file downloads', async ({ page }) => {
    // This is a mock test for file download functionality
    await page.goto('https://httpbin.org/');
    
    // Look for any downloadable content or links
    const links = await page.locator('a').count();
    expect(links).toBeGreaterThan(0);
    
    // Take screenshot of the page
    await page.screenshot({ 
      path: 'screenshots/download-page.png',
      fullPage: true 
    });
  });

});