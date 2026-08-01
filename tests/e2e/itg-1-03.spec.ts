import { test, expect } from '@playwright/test';

test.describe("営業事例・成功パターン検索・学習", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
  });

  // SCEN-019
  test("[normal] 営業事例・成功パターン検索・学習 - 顧客業種フィルターで選択した業種に該当する事例のみが表示される", async ({ page }) => {
    await page.locator('select[aria-label*="業種"]').selectOption("IT・ソフトウェア");
    await page.click('button:has-text("検索実行")');
    await page.waitForLoadState('networkidle');
    
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const industry = await rows.nth(i).locator('td:nth-child(2)').textContent();
      expect(industry).toContain('IT・ソフトウェア');
    }
  });

  // SCEN-020
  test("[normal] 営業事例・成功パターン検索・学習 - 案件金額範囲フィルターで指定した金額範囲内の事例のみが表示される", async ({ page }) => {
    await page.fill('input[placeholder*="最小金額"]', '1000000');
    await page.fill('input[placeholder*="最大金額"]', '5000000');
    await page.click('button:has-text("検索実行")');
    await page.waitForLoadState('networkidle');
    
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const amountText = await rows.nth(i).locator('td:nth-child(4)').textContent();
      const amount = parseInt(amountText?.replace(/[^0-9]/g, '') || '0');
      expect(amount).toBeGreaterThanOrEqual(1000000);
      expect(amount).toBeLessThanOrEqual(5000000);
    }
  });

  // SCEN-021
  test("[normal] 営業事例・成功パターン検索・学習 - 成約期間フィルターで指定した期間内の事例のみが表示される", async ({ page }) => {
    await page.fill('input[type="date"]:nth-of-type(1)', '2024-01-01');
    await page.fill('input[type="date"]:nth-of-type(2)', '2024-03-31');
    await page.click('button:has-text("検索実行")');
    await page.waitForLoadState('networkidle');
    
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const dateText = await rows.nth(i).locator('td:nth-child(5)').textContent();
      const date = new Date(dateText || '');
      expect(date.getTime()).toBeGreaterThanOrEqual(new Date('2024-01-01').getTime());
      expect(date.getTime()).toBeLessThanOrEqual(new Date('2024-03-31').getTime());
    }
  });

  // SCEN-022
  test("[normal] 営業事例・成功パターン検索・学習 - 営業担当者フィルターで選択した担当者の事例のみが表示される", async ({ page }) => {
    await page.locator('select[aria-label*="営業担当者"]').selectOption("山田太郎");
    await page.click('button:has-text("フィルター適用")');
    await page.waitForLoadState('networkidle');
    
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const salesperson = await rows.nth(i).locator('td:nth-child(1)').textContent();
      expect(salesperson).toContain('山田太郎');
    }
  });

  // SCEN-023
  test("[normal] 営業事例・成功パターン検索・学習 - 成功パターンキーワード検索で入力したキーワードを含む事例のみが表示される", async ({ page }) => {
    await page.fill('input[placeholder*="キーワード"]', '提案資料');
    await page.click('button:has-text("検索")');
    await page.waitForLoadState('networkidle');
    
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const title = await rows.nth(i).locator('td:nth-child(3)').textContent();
      const description = await rows.nth(i).locator('td:nth-child(6)').textContent();
      const content = (title || '') + (description || '');
      expect(content.toLowerCase()).toContain('提案資料'.toLowerCase());
    }
  });

  // SCEN-024
  test("[normal] 営業事例・成功パターン検索・学習 - 検索実行ボタン押下で事例一覧が更新される", async ({ page }) => {
    await page.locator('select[aria-label*="業種"]').selectOption("製造業");
    await page.fill('input[type="date"]:nth-of-type(1)', '2024-01-01');
    await page.fill('input[placeholder*="最小金額"]', '500000');
    await page.click('button:has-text("検索実行")');
    await page.waitForLoadState('networkidle');
    
    const table = page.locator('table tbody');
    await expect(table).toBeVisible();
    
    const rows = page.locator('table tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
    
    const firstRow = rows.nth(0);
    await expect(firstRow.locator('td:nth-child(1)')).toBeVisible();
    await expect(firstRow.locator('td:nth-child(2)')).toBeVisible();
    await expect(firstRow.locator('td:nth-child(4)')).toBeVisible();
  });

  // SCEN-025
  test("[normal] 営業事例・成功パターン検索・学習 - 事例分類マトリクス表示タブを切り替えるとマトリクス形式で事例が表示される", async ({ page }) => {
    await page.click('[role="tab"]:has-text("事例分類マトリクス")');
    await page.waitForLoadState('networkidle');
    
    const matrix = page.locator('[role="grid"], .matrix-container');
    await expect(matrix).toBeVisible();
    
    const cells = page.locator('[role="gridcell"], .matrix-cell');
    expect(await cells.count()).toBeGreaterThan(0);
  });

  // SCEN-026
  test("[normal] 営業事例・成功パターン検索・学習 - 成功パターン分類タブを切り替えるとパターン別に分類された事例が表示される", async ({ page }) => {
    await page.click('[role="tab"]:has-text("業種別")');
    await page.waitForLoadState('networkidle');
    
    const initialContent = await page.locator('table tbody').textContent();
    
    await page.click('[role="tab"]:has-text("営業段階別")');
    await page.waitForLoadState('networkidle');
    
    const updatedContent = await page.locator('table tbody').textContent();
    expect(updatedContent).not.toBe(initialContent);
    
    await page.click('[role="tab"]:has-text("成約金額別")');
    await page.waitForLoadState('networkidle');
    
    const finalContent = await page.locator('table tbody').textContent();
    expect(finalContent).not.toBe(updatedContent);
  });

  // SCEN-027
  test("[normal] 営業事例・成功パターン検索・学習 - 事例一覧から事例を選択すると詳細表示パネルが開く", async ({ page }) => {
    const rows = page.locator('table tbody tr');
    await rows.nth(0).click();
    await page.waitForLoadState('networkidle');
    
    const detailPanel = page.locator('[role="dialog"], .detail-panel, [class*="detail"]');
    await expect(detailPanel).toBeVisible();
    
    await expect(detailPanel.locator('text=事例ID')).toBeVisible({ timeout: 3000 });
    await expect(detailPanel.locator('text=営業担当者')).toBeVisible({ timeout: 3000 });
  });

  // SCEN-028
  test("[normal] 営業事例・成功パターン検索・学習 - 事例詳細表示パネルに成約実績情報が表示される", async ({ page }) => {
    await page.fill('input[placeholder*="キーワード"]', 'テスト');
    await page.click('button:has-text("検索")');
    await page.waitForLoadState('networkidle');
    
    const rows = page.locator('table tbody tr');
    await rows.nth(0).click();
    await page.waitForLoadState('networkidle');
    
    const detailPanel = page.locator('[role="dialog"], .detail-panel, [class*="detail"]');
    await expect(detailPanel).toBeVisible();
    
    await expect(detailPanel.locator('text=/成約金額|成約金額:/i')).toBeVisible({ timeout: 3000 });
    await expect(detailPanel.locator('text=/成約日時|成約日時:/i')).toBeVisible({ timeout: 3000 });
    await expect(detailPanel.locator('text=/営業担当者|営業担当者名:/i')).toBeVisible({ timeout: 3000 });
    await expect(detailPanel.locator('text=/顧客名|顧客:/i')).toBeVisible({ timeout: 3000 });
    await expect(detailPanel.locator('text=/営業活動期間|活動期間:/i')).toBeVisible({ timeout: 3000 });
  });
});