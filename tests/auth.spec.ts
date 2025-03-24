import { test, expect } from '@playwright/test';
import { join } from 'path';
import * as fs from 'fs';

test.describe('Authentication Tests', () => {
    let testAvatarPath: string;

    test.beforeAll(async () => {
        // Create fixtures directory if it doesn't exist
        const fixturesDir = join(__dirname, 'fixtures');
        if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir);
        }

        // Create test avatar file
        testAvatarPath = join(fixturesDir, 'test-avatar.jpg');
        const testImageBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=', 'base64');
        fs.writeFileSync(testAvatarPath, testImageBuffer);
    });

    test.beforeEach(async ({ page }) => {
        // Navigate to the login page before each test
        await page.goto('/login');
        // Wait for the page to be fully loaded
        await page.waitForLoadState('networkidle');
    });

    test('should display login form', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByLabel('Email')).toBeVisible({ timeout: 10000 });
        await expect(page.getByLabel('Password')).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible({ timeout: 10000 });
    });

    test('should show error for empty fields', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Please fill in all fields')).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.getByLabel('Email').fill('invalid@example.com');
        await page.getByLabel('Password').fill('wrongpassword');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Invalid username or password')).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to registration page', async ({ page }) => {
        await page.getByRole('link', { name: 'Register here' }).click();
        await expect(page).toHaveURL('/register');
        await page.waitForLoadState('networkidle');
    });

    test('should display registration form', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByLabel('Full Name')).toBeVisible({ timeout: 10000 });
        await expect(page.getByLabel('Username')).toBeVisible({ timeout: 10000 });
        await expect(page.getByLabel('Email')).toBeVisible({ timeout: 10000 });
        await expect(page.getByLabel('Password')).toBeVisible({ timeout: 10000 });
        await expect(page.getByLabel('Avatar')).toBeVisible({ timeout: 10000 });
    });

    test('should show error for empty required fields in registration', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByText('Please fill all required fields')).toBeVisible({ timeout: 10000 });
    });

    test('should show error for existing email/username', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');

        // Fill in the form
        await page.getByLabel('Full Name').fill('Test User');
        await page.getByLabel('Username').fill('testuser');
        await page.getByLabel('Email').fill('sahamahmed70@gmail.com');
        await page.getByLabel('Password').fill('12345678');

        // Handle file upload
        const fileInput = page.getByLabel('Avatar');
        await fileInput.setInputFiles(testAvatarPath);

        // Submit the form
        await page.getByRole('button', { name: 'Register' }).click();

        // Wait for the error message
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('email or username already exists')).toBeVisible({ timeout: 10000 });
    });

    test('should successfully register new user', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');

        // Generate unique username and email
        const timestamp = Date.now();
        const username = `testuser${timestamp}`;
        const email = `test${timestamp}@example.com`;

        // Fill in the form
        await page.getByLabel('Full Name').fill('Test User');
        await page.getByLabel('Username').fill(username);
        await page.getByLabel('Email').fill(email);
        await page.getByLabel('Password').fill('12345678');

        // Handle file upload
        const fileInput = page.getByLabel('Avatar');
        await fileInput.setInputFiles(testAvatarPath);

        // Submit the form
        await page.getByRole('button', { name: 'Register' }).click();

        // Wait for navigation and verify
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/login');
    });

    test('should successfully login with valid credentials', async ({ page }) => {
        // Fill in the login form with valid credentials
        await page.getByLabel('Email').fill('sahamahmed70@gmail.com');
        await page.getByLabel('Password').fill('12345678');

        // Click login button
        await page.getByRole('button', { name: 'Login' }).click();

        // Wait for navigation and network requests to complete
        await page.waitForLoadState('networkidle');

        // Wait for the URL to change to home page
        await page.waitForURL('http://localhost:3000/', { timeout: 10000 });

        // Verify we're on the home page
        await expect(page).toHaveURL('/');
    });
}); 