const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const path = require("path");
const fs = require("fs");

describe("Authentication Tests", () => {
  let driver;
  const BASE_URL = "http://localhost:3000";
  const TIMEOUT = 10000; // 10 seconds timeout

  before(async () => {
    // Initialize the driver with Chrome
    driver = await new Builder().forBrowser("chrome").build();

    // Set implicit wait
    await driver.manage().setTimeouts({ implicit: TIMEOUT });
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
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

      await emailInput.sendKeys("invalid@example.com");
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
  });
});
