import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import chromedriver from "chromedriver";
import { Options } from "selenium-webdriver/chrome.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Authentication Tests", () => {
  let driver;
  let testAvatarPath;
  const BASE_URL = "http://localhost:3000";
  const TIMEOUT = 10000; // 10 seconds timeout

  before(async () => {
    // Start ChromeDriver
    chromedriver.start();
    
    // Create test avatar file
    const fixturesDir = path.join(__dirname, "fixtures");
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir);
    }
    testAvatarPath = path.join(fixturesDir, "test-avatar.jpg");
    
    // Create a simple test image if it doesn't exist
    if (!fs.existsSync(testAvatarPath)) {
      const testImageData =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      fs.writeFileSync(testAvatarPath, testImageData, "base64");
    }

    // Set up Chrome options
    const options = new Options()
      .addArguments("--no-sandbox")
      .addArguments("--disable-dev-shm-usage")
      .addArguments("--disable-gpu")
      .addArguments("--window-size=1920,1080")
      .addArguments("--headless")  // Run in headless mode
      .setChromeBinaryPath("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");  // Specify Chrome binary path

    // Create driver instance
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    // Set implicit wait
    await driver.manage().setTimeouts({ implicit: TIMEOUT });
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
    chromedriver.stop();
  });

  const waitForElement = async (selector, timeout = TIMEOUT) => {
    try {
      const element = await driver.wait(
        until.elementLocated(By.css(selector)),
        timeout
      );
      return element;
    } catch (error) {
      throw new Error(`Element ${selector} not found within ${timeout}ms`);
    }
  };

  describe("Login Form", () => {
    beforeEach(async () => {
      await driver.get(`${BASE_URL}/login`);
    });

    it("should display login form", async () => {
      const loginForm = await waitForElement("form");
      expect(await loginForm.isDisplayed()).to.be.true;

      // Check for required elements
      const emailInput = await driver.findElement(
        By.css('input[type="email"]')
      );
      const passwordInput = await driver.findElement(
        By.css('input[type="password"]')
      );
      const submitButton = await driver.findElement(
        By.css('button[type="submit"]')
      );

      expect(await emailInput.isDisplayed()).to.be.true;
      expect(await passwordInput.isDisplayed()).to.be.true;
      expect(await submitButton.isDisplayed()).to.be.true;
    });

    it("should show validation errors for empty fields", async () => {
      const submitButton = await waitForElement('button[type="submit"]');
      await submitButton.click();

      const emailError = await waitForElement(".error-message");
      expect(await emailError.getText()).to.include("Email is required");
    });

    it("should handle invalid credentials", async () => {
      const emailInput = await waitForElement('input[type="email"]');
      const passwordInput = await waitForElement('input[type="password"]');
      const submitButton = await waitForElement('button[type="submit"]');

      await emailInput.sendKeys("test@example.com");
      await passwordInput.sendKeys("wrongpassword");
      await submitButton.click();

      const errorMessage = await waitForElement(".error-message");
      expect(await errorMessage.getText()).to.include("Invalid credentials");
    });

    it("should successfully login with valid credentials", async () => {
      const emailInput = await waitForElement('input[type="email"]');
      const passwordInput = await waitForElement('input[type="password"]');
      const submitButton = await waitForElement('button[type="submit"]');

      await emailInput.sendKeys("test@example.com");
      await passwordInput.sendKeys("password123");
      await submitButton.click();

      // Wait for redirect to home page
      await driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT);
    });
  });

  describe("Registration Form", () => {
    beforeEach(async () => {
      await driver.get(`${BASE_URL}/register`);
    });

    it("should display registration form", async () => {
      const registerForm = await waitForElement("form");
      expect(await registerForm.isDisplayed()).to.be.true;

      // Check for required elements
      const usernameInput = await driver.findElement(
        By.css('input[name="username"]')
      );
      const emailInput = await driver.findElement(
        By.css('input[type="email"]')
      );
      const passwordInput = await driver.findElement(
        By.css('input[type="password"]')
      );
      const avatarInput = await driver.findElement(
        By.css('input[type="file"]')
      );
      const submitButton = await driver.findElement(
        By.css('button[type="submit"]')
      );

      expect(await usernameInput.isDisplayed()).to.be.true;
      expect(await emailInput.isDisplayed()).to.be.true;
      expect(await passwordInput.isDisplayed()).to.be.true;
      expect(await avatarInput.isDisplayed()).to.be.true;
      expect(await submitButton.isDisplayed()).to.be.true;
    });

    it("should show validation errors for empty fields", async () => {
      const submitButton = await waitForElement('button[type="submit"]');
      await submitButton.click();

      const errorMessages = await driver.findElements(By.css(".error-message"));
      expect(errorMessages.length).to.be.greaterThan(0);
    });

    it("should handle duplicate email/username", async () => {
      const usernameInput = await waitForElement('input[name="username"]');
      const emailInput = await waitForElement('input[type="email"]');
      const passwordInput = await waitForElement('input[type="password"]');
      const submitButton = await waitForElement('button[type="submit"]');

      await usernameInput.sendKeys("existinguser");
      await emailInput.sendKeys("existing@example.com");
      await passwordInput.sendKeys("password123");
      await submitButton.click();

      const errorMessage = await waitForElement(".error-message");
      expect(await errorMessage.getText()).to.include("already exists");
    });

    it("should successfully register with valid data", async () => {
      const usernameInput = await waitForElement('input[name="username"]');
      const emailInput = await waitForElement('input[type="email"]');
      const passwordInput = await waitForElement('input[type="password"]');
      const avatarInput = await waitForElement('input[type="file"]');
      const submitButton = await waitForElement('button[type="submit"]');

      // Create test avatar file if it doesn't exist
      const testAvatarPath = path.join(__dirname, "fixtures/test-avatar.jpg");
      if (!fs.existsSync(path.dirname(testAvatarPath))) {
        fs.mkdirSync(path.dirname(testAvatarPath), { recursive: true });
      }

      // Generate a unique username and email
      const timestamp = Date.now();
      const username = `testuser${timestamp}`;
      const email = `test${timestamp}@example.com`;

      await usernameInput.sendKeys(username);
      await emailInput.sendKeys(email);
      await passwordInput.sendKeys("password123");
      await avatarInput.sendKeys(testAvatarPath);
      await submitButton.click();

      // Wait for redirect to home page
      await driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT);
    });

    it("should handle file upload during registration", async () => {
      await driver.get(`${BASE_URL}/register`);

      // Fill in registration form
      await driver
        .findElement(By.css('input[name="username"]'))
        .sendKeys("seleniumuser");
      await driver
        .findElement(By.css('input[type="email"]'))
        .sendKeys("selenium@example.com");
      await driver
        .findElement(By.css('input[type="password"]'))
        .sendKeys("Test123!@#");

      // Handle file upload
      const avatarInput = await driver.findElement(
        By.css('input[type="file"]')
      );
      await avatarInput.sendKeys(testAvatarPath);

      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();

      // Wait for success message or redirect
      try {
        await driver.wait(
          until.elementLocated(By.css(".success-message")),
          TIMEOUT
        );
      } catch (error) {
        // If no success message, check if we're redirected to login
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include("/login");
      }
    });

    it("should show error for duplicate email", async () => {
      await driver.get(`${BASE_URL}/register`);

      // Fill in registration form with existing email
      await driver
        .findElement(By.css('input[name="username"]'))
        .sendKeys("seleniumuser2");
      await driver
        .findElement(By.css('input[type="email"]'))
        .sendKeys("selenium@example.com");
      await driver
        .findElement(By.css('input[type="password"]'))
        .sendKeys("Test123!@#");

      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();

      // Wait for error message
      const errorMessage = await driver.wait(
        until.elementLocated(By.css(".error-message")),
        TIMEOUT
      );

      expect(await errorMessage.getText()).to.include("Email already exists");
    });
  });
});
