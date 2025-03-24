import { test, expect } from '@playwright/test';

test.describe('Videos Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Go to login page
        await page.goto('http://localhost:3000/login');

        // Fill in login credentials
        await page.fill('input[type="email"]', 'sahamahmed70@gmail.com');
        await page.fill('input[type="password"]', '12345678');

        // Click login button
        await page.click('button[type="submit"]');

        // Wait for navigation and ensure we're redirected to the home page
        await page.waitForURL('http://localhost:3000/');
    });

    test('should load videos page with initial data', async ({ page }) => {
        // Navigate to videos page
        await page.goto('http://localhost:3000/videos');

        // Wait for videos to load
        await page.waitForSelector('[data-testid="video-grid"]', { timeout: 10000 });

        // Check if videos are displayed
        const videos = await page.$$('[data-testid="video-card"]');
        expect(videos.length).toBeGreaterThan(0);
    });

    test('should handle pagination correctly', async ({ page }) => {
        // Navigate to videos page
        await page.goto('http://localhost:3000/videos');

        // Wait for initial videos to load
        await page.waitForSelector('[data-testid="video-grid"]', { timeout: 10000 });

        // Get initial videos
        const initialVideos = await page.$$('[data-testid="video-card"]');
        const initialCount = initialVideos.length;

        // Click next page button if it exists and is enabled
        const nextButton = await page.getByRole('button', { name: /next/i });
        if (await nextButton.isEnabled()) {
            await nextButton.click();

            // Wait for new videos to load
            await page.waitForTimeout(2000); // Give time for the new page to load

            // Get new videos
            const newVideos = await page.$$('[data-testid="video-card"]');
            expect(newVideos.length).toBeGreaterThan(0);

            // Verify we have different videos (by checking if at least one video ID is different)
            const initialVideoIds = await Promise.all(
                initialVideos.map(video => video.getAttribute('data-video-id'))
            );
            const newVideoIds = await Promise.all(
                newVideos.map(video => video.getAttribute('data-video-id'))
            );
            expect(initialVideoIds).not.toEqual(newVideoIds);
        }
    });

    test('should handle empty video list gracefully', async ({ page }) => {
        // Mock the API response to return empty video list
        await page.route('**/api/v1/videos**', async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({
                    success: true,
                    data: {
                        videos: [],
                        totalVideos: 0,
                        totalPages: 0,
                        currentPage: 1
                    }
                })
            });
        });

        // Navigate to videos page
        await page.goto('http://localhost:3000/videos');

        // Check if empty state message is displayed
        const emptyMessage = await page.getByText(/no videos found/i);
        expect(await emptyMessage.isVisible()).toBeTruthy();
    });

    test('should handle API errors gracefully', async ({ page }) => {
        // Mock API failure
        await page.route('**/api/v1/videos**', async (route) => {
            await route.fulfill({
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: 'Internal server error'
                })
            });
        });

        // Navigate to videos page
        await page.goto('http://localhost:3000/videos');

        // Check if error message is displayed
        const errorMessage = await page.getByText(/error loading videos/i);
        expect(await errorMessage.isVisible()).toBeTruthy();
    });

    test('should preserve pagination state on refresh', async ({ page }) => {
        // Navigate to videos page
        await page.goto('http://localhost:3000/videos?page=2');

        // Wait for videos to load
        await page.waitForSelector('[data-testid="video-grid"]', { timeout: 10000 });

        // Get current page number from URL
        const url = new URL(page.url());
        const currentPage = url.searchParams.get('page');
        expect(currentPage).toBe('2');

        // Refresh the page
        await page.reload();

        // Check if page number is preserved
        const newUrl = new URL(page.url());
        const newPage = newUrl.searchParams.get('page');
        expect(newPage).toBe('2');
    });
}); 