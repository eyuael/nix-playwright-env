"use strict";
// Simple TypeScript utility functions for Playwright testing
// This file provides helper functions that can be used in Playwright tests
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserTestHelper = void 0;
class BrowserTestHelper {
    static async takeScreenshot(page, name) {
        const screenshotPath = `screenshots/${name}.png`;
        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });
        return screenshotPath;
    }
    static async fillForm(page, formData) {
        for (const [selector, value] of Object.entries(formData)) {
            await page.fill(selector, value);
        }
    }
    static async testLocalStorage(page, key, value) {
        await page.evaluate(([k, v]) => {
            localStorage.setItem(k, v);
        }, [key, value]);
        const storedValue = await page.evaluate((k) => {
            return localStorage.getItem(k);
        }, key);
        return storedValue === value;
    }
    static async getUserAgent(page) {
        return await page.evaluate(() => navigator.userAgent);
    }
    static logResult(browserName, success, error) {
        const status = success ? '✅ PASS' : '❌ FAIL';
        console.log(`${browserName.padEnd(10)} | ${status}`);
        if (error) {
            console.log(`           | Error: ${error}`);
        }
    }
}
exports.BrowserTestHelper = BrowserTestHelper;
exports.default = BrowserTestHelper;
