// Simple TypeScript utility functions for Playwright testing
// This file provides helper functions that can be used in Playwright tests

export interface TestResult {
  browser: string;
  success: boolean;
  error?: string;
  screenshot?: string;
}

export class BrowserTestHelper {
  static async takeScreenshot(page: any, name: string): Promise<string> {
    const screenshotPath = `screenshots/${name}.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    return screenshotPath;
  }

  static async fillForm(page: any, formData: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(formData)) {
      await page.fill(selector, value);
    }
  }

  static async testLocalStorage(page: any, key: string, value: string): Promise<boolean> {
    await page.evaluate(([k, v]) => {
      localStorage.setItem(k, v);
    }, [key, value]);
    
    const storedValue = await page.evaluate((k) => {
      return localStorage.getItem(k);
    }, key);
    
    return storedValue === value;
  }

  static async getUserAgent(page: any): Promise<string> {
    return await page.evaluate(() => navigator.userAgent);
  }

  static logResult(browserName: string, success: boolean, error?: string): void {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${browserName.padEnd(10)} | ${status}`);
    if (error) {
      console.log(`           | Error: ${error}`);
    }
  }
}

export default BrowserTestHelper;