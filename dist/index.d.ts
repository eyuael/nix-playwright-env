export interface TestResult {
    browser: string;
    success: boolean;
    error?: string;
    screenshot?: string;
}
export declare class BrowserTestHelper {
    static takeScreenshot(page: any, name: string): Promise<string>;
    static fillForm(page: any, formData: Record<string, string>): Promise<void>;
    static testLocalStorage(page: any, key: string, value: string): Promise<boolean>;
    static getUserAgent(page: any): Promise<string>;
    static logResult(browserName: string, success: boolean, error?: string): void;
}
export default BrowserTestHelper;
