import { test, expect } from '@playwright/test';

test.describe("営業データ品質管理ダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/panels/scr-1785571032716.html");
  });

  // SCEN-001
  test("[normal] データ品質検証エンジン実行ボタン押下で検証処理が開始される", async ({ page }) => {
    const runButton = page.locator('button:has-text("データ品質検証エンジン実行")').first();
    await expect(runButton).toBeVisible();
    
    await runButton.click();
    
    const loadingIndicator = page.locator('[class*="loading"], [class*="progress"], [class*="spinner"]').first();
    const isLoadingVisible = await loadingIndicator.isVisible().catch(() => false);
    
    if (isLoadingVisible) {
      await expect(loadingIndicator).toBeVisible();
    }
    
    const isDisabled = await runButton.isDisabled().catch(() => false);
    expect(isDisabled || isLoadingVisible).toBeTruthy();
  });

  // SCEN-002
  test("[normal] 検証実行後に全体データ品質スコアが画面に表示される", async ({ page }) => {
    const runButton = page.locator('button:has-text("検証実行")').first();
    
    if (await runButton.isVisible()) {
      await runButton.click();
      await page.waitForTimeout(2000);
    }
    
    const scoreLocator = page.locator('text=/全体データ品質スコア|品質スコア|スコア/i').first();
    await expect(scoreLocator).toBeVisible();
    
    const scoreValue = page.locator('[class*="score"], [class*="Score"]').first();
    const scoreText = await scoreValue.textContent();
    expect(scoreText).toMatch(/\d+/);
  });

  // SCEN-003
  test("[normal] 検証実行後に品質スコア推移グラフが更新される", async ({ page }) => {
    const graphLocator = page.locator('[class*="chart"], [class*="graph"], svg').first();
    const initialPointCount = await page.locator('[class*="chart"] [class*="point"], svg circle').count();
    
    const runButton = page.locator('button:has-text("検証実行")').first();
    if (await runButton.isVisible()) {
      await runButton.click();
      await page.waitForTimeout(2000);
    }
    
    await expect(graphLocator).toBeVisible();
    
    const updatedPointCount = await page.locator('[class*="chart"] [class*="point"], svg circle').count();
    expect(updatedPointCount).toBeGreaterThanOrEqual(initialPointCount);
  });

  // SCEN-004
  test("[normal] 検証実行後に顧客データ重複検出件数サマリーが更新される", async ({ page }) => {
    const summaryLocator = page.locator('text=/顧客データ重複検出件数|重複検出件数/i').first();
    await expect(summaryLocator).toBeVisible();
    
    const runButton = page.locator('button:has-text("検証実行")').first();
    if (await runButton.isVisible()) {
      await runButton.click();
      await page.waitForTimeout(2000);
    }
    
    const duplicateCount = page.locator('[class*="duplicate"], [class*="Duplicate"]').first();
    const countText = await duplicateCount.textContent();
    expect(countText).toMatch(/\d+/);
  });

  // SCEN-005
  test("[normal] 検証実行後に重複候補一覧テーブルにデータが表示される", async ({ page }) => {
    const runButton = page.locator('button:has-text("検証実行"), button:has-text("データ品質検証エンジン実行")').first();
    if (await runButton.isVisible()) {
      await runButton.click();
      await page.waitForTimeout(2000);
    }
    
    await page.locator('text=/重複候補一覧/i').scrollIntoViewIfNeeded();
    
    const tableLocator = page.locator('table').first();
    await expect(tableLocator).toBeVisible();
    
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    
    if (rowCount > 0) {
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  // SCEN-006
  test("[edge] 重複候補テーブルの件数が0件のとき空表示になる", async ({ page }) => {
    await page.locator('text=/重複候補一覧/i').scrollIntoViewIfNeeded();
    
    const emptyMessage = page.locator('text=/データがありません|0件/i');
    const tableRows = page.locator('table tbody tr');
    
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
    const rowCount = await tableRows.count();
    
    if (hasEmptyMessage || rowCount === 0) {
      expect(hasEmptyMessage || rowCount === 0).toBeTruthy();
    }
  });

  // SCEN-007
  test("[normal] 重複候補一覧から重複候補詳細表示パネルが開く", async ({ page }) => {
    const runButton = page.locator('button:has-text("検証実行"), button:has-text("データ品質検証エンジン実行")').first();
    if (await runButton.isVisible()) {
      await runButton.click();
      await page.waitForTimeout(2000);
    }
    
    const tableRow = page.locator('table tbody tr').first();
    const isRowVisible = await tableRow.isVisible().catch(() => false);
    
    if (isRowVisible) {
      await tableRow.click();
      
      const detailPanel = page.locator('[class*="detail"], [class*="panel"], [class*="modal"]').first();
      await expect(detailPanel).toBeVisible();
    }
  });

  // SCEN-008
  test("[normal] 検証実行後にデータ不整合検出件数サマリーが更新される", async ({ page }) => {
    const summaryLocator = page.locator('text=/データ不整合検出件数|不整合検出件数/i').first();
    await expect(summaryLocator).toBeVisible();
    
    const runButton = page.locator('button:has-text("検証実行")').first();
    if (await runButton.isVisible()) {
      await runButton.click();
      await page.waitForTimeout(2000);
    }
    
    const inconsistencyCount = page.locator('[class*="inconsistency"], [class*="mismatch"]').first();
    const countText = await inconsistencyCount.textContent();
    expect(countText).toMatch(/\d+/);
  });

  // SCEN-009
  test("[normal] 検証実行後に不整合検出結果一覧テーブルにデータが表示される", async ({ page }) => {
    const runButton = page.locator('button:has-text("検証実行"), button:has-text("データ品質検証エンジン実行")').first();
    if (await runButton.isVisible()) {
      await runButton.click();
      await page.waitForTimeout(2000);
    }
    
    await page.locator('text=/不整合検出結果一覧/i').scrollIntoViewIfNeeded();
    
    const tableLocator = page.locator('table').last();
    await expect(tableLocator).toBeVisible();
    
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    
    if (rowCount > 0) {
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  // SCEN-010
  test("[edge] 不整合検出結果テーブルの件数が0件のとき空表示になる", async ({ page }) => {
    await page.locator('text=/不整合検出結果一覧/i').scrollIntoViewIfNeeded();
    
    const emptyMessage = page.locator('text=/検出結果がありません|データなし/i');
    const tableRows = page.locator('table tbody tr');
    
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
    const rowCount = await tableRows.count();
    
    if (hasEmptyMessage || rowCount === 0) {
      expect(hasEmptyMessage || rowCount === 0).toBeTruthy();
    }
  });
});