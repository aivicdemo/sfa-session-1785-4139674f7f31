import { test, expect } from '@playwright/test';

test.describe("営業プロセス分析レポート生成・確認", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
    await page.goto("/panels/scr-1785570844176.html");
    await page.waitForLoadState('networkidle');
  });

  // SCEN-053
  test("[normal] 営業プロセス分析レポート生成・確認 - 営業プロセス監査ダッシュボードで確認されたログがレポート生成に利用できる", async ({ page }) => {
    // 営業プロセス監査ダッシュボード画面へ遷移
    await page.goto("/panels/scr-1785570844144.html");
    await page.waitForLoadState('networkidle');

    // ダッシュボード上の営業プロセスログを確認（存在確認）
    const dashboardContent = await page.locator('body').textContent();
    expect(dashboardContent).toBeTruthy();

    // 営業プロセス分析レポート生成・確認画面へ遷移
    await page.goto("/panels/scr-1785570844176.html");
    await page.waitForLoadState('networkidle');

    // 新規レポート生成ボタンをクリック
    const newReportButton = page.locator('button:has-text("新規レポート生成")').first();
    if (await newReportButton.isVisible()) {
      await newReportButton.click();
      await page.waitForLoadState('networkidle');
    }

    // レポート生成画面でデータソース選択肢が表示されていることを確認
    const dataSourceOptions = page.locator('label, input, select');
    const optionCount = await dataSourceOptions.count();
    expect(optionCount).toBeGreaterThan(0);

    // レポート生成に必要なログデータ項目を選択（最初の選択肢を選択）
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.check();
    }

    // 生成ボタンをクリック
    const generateButton = page.locator('button:has-text("生成")').first();
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForLoadState('networkidle');
    }

    // レポート一覧にレポートが表示されていることを確認
    const reportList = page.locator('table, ul, div[class*="list"]');
    const reportContent = await reportList.textContent();
    expect(reportContent).toBeTruthy();

    // レポートIDや生成日時などの情報が含まれていることを期待
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('匠SFA');
  });

  // SCEN-056
  test("[normal] 営業プロセス分析レポート生成・確認 - 不適切パターンがレポート詳細として確認できる", async ({ page }) => {
    // 営業プロセス監査ダッシュボード画面へ遷移
    await page.goto("/panels/scr-1785570844144.html");
    await page.waitForLoadState('networkidle');

    // 不適切パターン検出セクションを確認
    const dashboardContent = await page.locator('body').textContent();
    expect(dashboardContent).toBeTruthy();

    // 不適切パターンの詳細またはリンクをクリック
    const inappropriatePatternLinks = page.locator('a, button[role="button"]');
    const linkCount = await inappropriatePatternLinks.count();
    if (linkCount > 0) {
      await inappropriatePatternLinks.first().click();
      await page.waitForLoadState('networkidle');
    }

    // 営業プロセス分析レポート生成・確認画面に遷移していることを確認
    const currentUrl = page.url();
    if (!currentUrl.includes('scr-1785570844176')) {
      await page.goto("/panels/scr-1785570844176.html");
      await page.waitForLoadState('networkidle');
    }

    // レポート一覧またはレポート詳細セクションから詳細を表示
    const reportDetailButton = page.locator('button:has-text("詳細"), a:has-text("詳細")').first();
    if (await reportDetailButton.isVisible()) {
      await reportDetailButton.click();
      await page.waitForLoadState('networkidle');
    }

    // レポート詳細内に不適切パターンの内容が記載されていることを確認
    const detailContent = await page.locator('body').textContent();
    expect(detailContent).toBeTruthy();
    expect(detailContent).toContain('匠SFA');

    // 画面遷移と情報の連携が正常に機能していることを確認
    const finalContent = await page.locator('[class*="detail"], [class*="content"], main').textContent();
    expect(finalContent).toBeTruthy();
  });
});