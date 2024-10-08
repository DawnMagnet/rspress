import { expect, test } from '@playwright/test';
import path from 'path';
import { getPort, killProcess, runDevCommand } from '../utils/runCommands';

const fixtureDir = path.resolve(__dirname, '../fixtures');

test.describe('i18n test', async () => {
  let appPort;
  let app;
  test.beforeAll(async () => {
    const appDir = path.join(fixtureDir, 'i18n');
    appPort = await getPort();
    app = await runDevCommand(appDir, appPort);
  });

  test.afterAll(async () => {
    if (app) {
      await killProcess(app);
    }
  });

  // check the language switch button
  test('Language switch button', async ({ page }) => {
    await page.goto(`http://localhost:${appPort}`, {
      waitUntil: 'networkidle',
    });

    const h1 = await page.$('h1');
    const text = await page.evaluate(h1 => h1?.textContent, h1);
    await expect(text).toContain('首页');

    const button = await page.$('.translation .nav-menu-group-button')!;
    expect(button).toBeTruthy();
    // hover the button
    await button!.hover();
    // click the button content to switch to English
    const buttonContent = await page.$(
      '.translation .nav-menu-group-content > div > div:nth-child(2)',
    );
    const buttonContentText = await page.evaluate(
      buttonContent => buttonContent?.textContent,
      buttonContent,
    );
    expect(buttonContentText).toBe('English');
  });

  test('Add language prefix in route automatically when current language is not default language', async ({
    page,
  }) => {
    await page.goto(`http://localhost:${appPort}/en/guide/quick-start`, {
      waitUntil: 'networkidle',
    });
    // take the `click` button
    let link = await page.getByRole('link', {
      name: /absolute/,
    });
    expect(link).toBeTruthy();
    // check the compile result of absolute link in doc content
    expect(await link.getAttribute('href')).toBe('/en/guide/install.html');
    link = await page.getByRole('link', {
      name: /relative/,
    });

    // check the compile result of relative link in doc content
    expect(link).toBeTruthy();
    expect(await link.getAttribute('href')).toBe('/en/guide/install.html');
  });

  test('Should not add language prefix when current language is default language', async ({
    page,
  }) => {
    await page.goto(`http://localhost:${appPort}/guide/quick-start`, {
      waitUntil: 'networkidle',
    });
    // check the compile result of absolute link in doc content
    let link = await page.getByRole('link', {
      name: /绝对路径/,
    });
    expect(link).toBeTruthy();
    expect(await link.getAttribute('href')).toBe('/guide/install.html');
    // check the compile result of relative link in doc content
    link = await page.getByRole('link', {
      name: /相对路径/,
    });
    expect(link).toBeTruthy();
    expect(await link.getAttribute('href')).toBe('/guide/install.html');
  });

  test('Should render sidebar correctly', async ({ page }) => {
    await page.goto(`http://localhost:${appPort}/guide/quick-start`, {
      waitUntil: 'networkidle',
    });
    // take the sidebar
    const sidebar = await page.$$(
      '.rspress-sidebar .rspress-scrollbar > nav > section',
    );
    expect(sidebar?.length).toBe(1);
  });

  test('Should not render appearance switch button', async ({ page }) => {
    await page.goto(`http://localhost:${appPort}/guide/quick-start`, {
      waitUntil: 'networkidle',
    });
    // take the appearance switch button
    const button = await page.$('.rspress-nav-appearance');
    expect(button).toBeFalsy();
  });

  test('Should not 404 after redirecting in first visit', async ({ page }) => {
    const changeNavigatorLanguage = async (language: string) => {
      await page.addScriptTag({
        content: `
          localStorage.clear();
          navigator.language = '${language}';
        `,
      });
    };
    await changeNavigatorLanguage('nl-NL');
    await page.goto(`http://localhost:${appPort}`, {
      waitUntil: 'networkidle',
    });
    const content = await page.evaluate(() => document.body.textContent);
    expect(content?.includes('PAGE NOT FOUND')).toBe(false);
  });
});
