import { test, expect } from '@playwright/test';

test.describe("営業データ品質管理ダッシュボード", () => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
  const dashboardURL = "/panels/scr-1785571032716.html";

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
  });

  // SCEN-011
  test("[normal] 不整合検出結果一覧から不整合詳細表示パネルが開く", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    const inconsistencyList = page.locator('[class*="inconsistency-list"]');
    await expect(inconsistencyList).toBeVisible();
    
    const firstRecord = page.locator('[class*="inconsistency-record"]').first();
    await firstRecord.click();
    
    const detailPanel = page.locator('[class*="inconsistency-detail-panel"]');
    await expect(detailPanel).toBeVisible();
    
    const detailContent = page.locator('[class*="detail-content"]');
    await expect(detailContent).toContainText(/不整合|フィールド|ルール|時刻/);
  });

  // SCEN-012
  test("[normal] 検証実行後に正規化ルール適用状況確認パネルが表示される", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    const validateButton = page.locator('button:has-text("検証実行")');
    await validateButton.click();
    
    const progressIndicator = page.locator('[class*="progress"]');
    await progressIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    
    const normalizationPanel = page.locator('[class*="normalization-status-panel"]');
    await expect(normalizationPanel).toBeVisible();
    
    const panelContent = page.locator('[class*="panel-content"]');
    await expect(panelContent).toContainText(/適用済み|未適用|件数/);
  });

  // SCEN-013
  test("[normal] 適用済みルール一覧にルール情報が表示される", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    await page.locator('[class*="applied-rules-section"]').scrollIntoViewIfNeeded();
    
    const rulesTable = page.locator('[class*="applied-rules-table"]');
    await expect(rulesTable).toBeVisible();
    
    const headerRow = page.locator('[class*="table-header"]');
    await expect(headerRow).toContainText(/ルールID|ルール名|説明|フィールド|適用日時|実行件数/);
    
    const dataRow = page.locator('[class*="table-row"]').first();
    await expect(dataRow).toBeVisible();
  });

  // SCEN-014
  test("[edge] 適用済みルール一覧が0件のとき空表示になる", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    await page.locator('[class*="applied-rules-section"]').scrollIntoViewIfNeeded();
    
    const emptyMessage = page.locator('text=/適用済みのルールはありません|該当するルールがありません/');
    const rulesTable = page.locator('[class*="applied-rules-table"]');
    
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
    const hasTableRows = await rulesTable.locator('[class*="table-row"]').count();
    
    if (hasEmptyMessage) {
      await expect(emptyMessage).toBeVisible();
    } else {
      expect(hasTableRows).toBe(0);
    }
  });

  // SCEN-015
  test("[normal] ルール別適用件数グラフが画面に表示される", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    await page.waitForLoadState('networkidle');
    
    const chartArea = page.locator('[class*="rule-application-chart"]');
    await expect(chartArea).toBeVisible();
    
    const chartElement = page.locator('canvas, svg[class*="chart"]').first();
    await expect(chartElement).toBeVisible();
  });

  // SCEN-016
  test("[normal] 重複候補詳細表示パネルを閉じると元の画面に戻る", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    const duplicateList = page.locator('[class*="duplicate-candidate-list"]');
    const firstCandidate = duplicateList.locator('[class*="candidate-item"]').first();
    await firstCandidate.click();
    
    const detailPanel = page.locator('[class*="duplicate-detail-panel"]');
    await expect(detailPanel).toBeVisible();
    
    const closeButton = detailPanel.locator('button:has-text("×"), button:has-text("閉じる"), button[class*="close"]').first();
    await closeButton.click();
    
    await expect(detailPanel).not.toBeVisible();
    await expect(duplicateList).toBeVisible();
  });

  // SCEN-017
  test("[normal] 不整合詳細表示パネルを閉じると元の画面に戻る", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    const inconsistencyList = page.locator('[class*="inconsistency-list"]');
    const firstInconsistency = inconsistencyList.locator('[class*="inconsistency-record"]').first();
    await firstInconsistency.click();
    
    const detailPanel = page.locator('[class*="inconsistency-detail-panel"]');
    await expect(detailPanel).toBeVisible();
    
    const closeButton = detailPanel.locator('button:has-text("×"), button:has-text("閉じる"), button[class*="close"]').first();
    await closeButton.click();
    
    await expect(detailPanel).not.toBeVisible();
    await expect(inconsistencyList).toBeVisible();
  });

  // SCEN-063
  test("[normal] 営業データ入力・登録画面で登録したデータが品質管理ダッシュボードに表示される", async ({ page }) => {
    const inputPageURL = "/panels/scr-sales-data-input.html";
    await page.goto(baseURL + inputPageURL);
    
    const customerNameInput = page.locator('input[placeholder*="顧客名"], input[name*="customerName"]').first();
    const emailInput = page.locator('input[placeholder*="メール"], input[name*="email"]').first();
    const phoneInput = page.locator('input[placeholder*="電話"], input[name*="phone"]').first();
    
    await customerNameInput.fill('山田太郎');
    await emailInput.fill('yamada@example.com');
    await phoneInput.fill('09012345678');
    
    const registerButton = page.locator('button:has-text("登録")').first();
    await registerButton.click();
    
    const successMessage = page.locator('text=/登録完了|登録しました/');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    await page.goto(baseURL + dashboardURL);
    
    const searchInput = page.locator('input[placeholder*="検索"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('山田太郎');
    }
    
    const resultRow = page.locator('text=/山田太郎|yamada@example.com/').first();
    await expect(resultRow).toBeVisible();
  });

  // SCEN-065
  test("[normal] 顧客データ品質検証・修正画面で実行した修正結果がダッシュボードに反映される", async ({ page }) => {
    await page.goto(baseURL + dashboardURL);
    
    const inconsistencyList = page.locator('[class*="inconsistency-list"]');
    const firstInconsistency = inconsistencyList.locator('[class*="inconsistency-record"]').first();
    await firstInconsistency.click();
    
    const detailPanel = page.locator('[class*="inconsistency-detail-panel"]');
    const openModifyButton = detailPanel.locator('button:has-text("修正画面を開く"), a[href*="modify"]').first();
    await openModifyButton.click();
    
    await page.waitForURL(url => !url.toString().includes(dashboardURL), { timeout: 10000 });
    
    const ruleApplyButton = page.locator('button:has-text("ルール適用"), button[class*="apply-rule"]').first();
    if (await ruleApplyButton.isVisible()) {
      await ruleApplyButton.click();
    }
    
    const confirmButton = page.locator('button:has-text("修正を確定"), button:has-text("確定")').first();
    await confirmButton.click();
    
    const completionMessage = page.locator('text=/修正完了|完了しました/');
    await expect(completionMessage).toBeVisible({ timeout: 5000 });
    
    await page.goto(baseURL + dashboardURL);
    
    const statusLabel = page.locator('text=/解決済み|修正適用済み/').first();
    await expect(statusLabel).toBeVisible({ timeout: 5000 });
    
    const scoreInfo = page.locator('[class*="quality-score"]');
    await expect(scoreInfo).toBeVisible();
  });
});