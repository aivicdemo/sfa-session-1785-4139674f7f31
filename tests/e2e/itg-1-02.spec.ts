import { test, expect } from '@playwright/test';

test.describe('営業プロセス監査ダッシュボード', () => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  const dashboardUrl = `${baseUrl}/panels/scr-1785570818400.html`;

  // SCEN-011: [normal] 営業プロセス監査ダッシュボード - プロセス乖離検出結果表示が表示される
  test('SCEN-011: プロセス乖離検出結果セクションが表示される', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const deviationSection = page.locator('[data-testid="process-deviation-section"], .process-deviation-section, [class*="deviation"]');
    await expect(deviationSection).toBeVisible({ timeout: 5000 });
    
    const deviationList = page.locator('[data-testid="deviation-list"], .deviation-list, [class*="deviation"] >> xpath=//ul | [class*="deviation"] >> xpath=//div[contains(@class, "list")]');
    await expect(deviationList).toBeVisible();
  });

  // SCEN-012: [normal] 営業プロセス監査ダッシュボード - 成約相関分析結果テーブルが表示される
  test('SCEN-012: 成約相関分析結果テーブルが表示される', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => {
      document.querySelector('[data-testid="correlation-table"], .correlation-table, table')?.scrollIntoView();
    });
    
    const correlationTable = page.locator('[data-testid="correlation-table"], .correlation-table, table');
    await expect(correlationTable).toBeVisible({ timeout: 5000 });
    
    const tableHeader = page.locator('[data-testid="correlation-table"], .correlation-table, table >> xpath=//thead | table >> xpath=//tr[1]');
    await expect(tableHeader).toBeVisible();
  });

  // SCEN-013: [edge] 営業プロセス監査ダッシュボード - 不適切パターン検出結果が0件のときリストが空表示になる
  test('SCEN-013: 不適切パターン検出結果が0件のときリストが空表示', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    await page.route('**/api/**', route => {
      if (route.request().url().includes('inappropriate-pattern')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.reload();
    
    const emptyMessage = page.locator('text=検出結果がありません, text=該当データなし, [data-testid="empty-message"]');
    const emptyState = page.locator('[data-testid="inappropriate-pattern-list"], .inappropriate-pattern-list');
    
    const isEmptyMessageVisible = await emptyMessage.isVisible().catch(() => false);
    const isEmptyStateVisible = await emptyState.isVisible().catch(() => false);
    
    expect(isEmptyMessageVisible || isEmptyStateVisible).toBeTruthy();
  });

  // SCEN-014: [edge] 営業プロセス監査ダッシュボード - 不適切パターン検出結果が複数件のときすべてリストに表示される
  test('SCEN-014: 不適切パターン検出結果が複数件のときすべてリストに表示', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const inappropriateList = page.locator('[data-testid="inappropriate-pattern-list"], .inappropriate-pattern-list');
    const listItems = inappropriateList.locator('>> xpath=//li | >> xpath=//*[@role="listitem"]');
    
    const itemCount = await listItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(5);
  });

  // SCEN-015: [edge] 営業プロセス監査ダッシュボード - 成約相関分析結果が0件のときテーブルが空表示になる
  test('SCEN-015: 成約相関分析結果が0件のときテーブルが空表示', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const correlationTable = page.locator('[data-testid="correlation-table"], .correlation-table, table');
    const tableRows = correlationTable.locator('>> xpath=//tbody//tr');
    
    const rowCount = await tableRows.count();
    expect(rowCount).toBe(0);
    
    const tableHeader = correlationTable.locator('>> xpath=//thead');
    await expect(tableHeader).toBeVisible();
  });

  // SCEN-016: [edge] 営業プロセス監査ダッシュボード - 成約相関分析結果が複数件のときすべてテーブルに表示される
  test('SCEN-016: 成約相関分析結果が複数件のときすべてテーブルに表示', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const correlationTable = page.locator('[data-testid="correlation-table"], .correlation-table, table');
    await expect(correlationTable).toBeVisible();
    
    const tableRows = correlationTable.locator('>> xpath=//tbody//tr');
    const initialRowCount = await tableRows.count();
    expect(initialRowCount).toBeGreaterThanOrEqual(3);
    
    const lastRow = tableRows.last();
    await lastRow.scrollIntoViewIfNeeded();
    await expect(lastRow).toBeVisible();
  });

  // SCEN-017: [normal] 営業プロセス監査ダッシュボード - 推論精度低下アラートが存在するときアラート表示パネルに通知が表示される
  test('SCEN-017: 推論精度低下アラートが存在するときアラート表示パネルに通知が表示', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const alertPanel = page.locator('[data-testid="alert-panel"], .alert-panel, [class*="alert"]');
    await expect(alertPanel).toBeVisible({ timeout: 5000 });
    
    const alertContent = page.locator('[data-testid="alert-content"], .alert-content, [class*="alert"] >> xpath=//text()');
    const alertText = await alertContent.textContent();
    expect(alertText).toContain('推論精度低下');
  });

  // SCEN-018: [edge] 営業プロセス監査ダッシュボード - 推論精度低下アラートが存在しないときアラート表示パネルが非表示になる
  test('SCEN-018: 推論精度低下アラートが存在しないときアラート表示パネルが非表示', async ({ page }) => {
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const alertPanel = page.locator('[data-testid="alert-panel"], .alert-panel, [class*="alert"]');
    const isVisible = await alertPanel.isVisible().catch(() => false);
    
    if (isVisible) {
      const displayStyle = await alertPanel.evaluate(el => window.getComputedStyle(el).display);
      expect(displayStyle).toBe('none');
    }
  });

  // SCEN-055: [normal] 営業プロセス監査ダッシュボード - 成功パターン検索・学習画面で確認された成功パターンが成功パターン適用状況として反映される
  test('SCEN-055: 成功パターン検索・学習画面の成功パターンが適用状況に反映', async ({ page }) => {
    await page.goto(`${baseUrl}/panels/scr-success-pattern-search.html`);
    await page.waitForLoadState('networkidle');
    
    const patternItem = page.locator('[data-testid="pattern-item"], .pattern-item, [class*="pattern"] >> xpath=//li[1]');
    await patternItem.click();
    
    const applyButton = page.locator('button:has-text("適用対象に追加"), button:has-text("ダッシュボードに反映"), [data-testid="apply-button"]');
    await applyButton.click();
    
    const confirmButton = page.locator('button:has-text("確定"), [data-testid="confirm-button"]');
    await confirmButton.click();
    
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const patternStatusSection = page.locator('[data-testid="pattern-status-section"], .pattern-status-section, [class*="pattern-status"]');
    await expect(patternStatusSection).toBeVisible({ timeout: 5000 });
    
    const appliedPattern = page.locator('[data-testid="applied-pattern"], .applied-pattern, [class*="applied"]');
    const statusText = await appliedPattern.textContent();
    expect(statusText).toMatch(/適用済み|反映中/);
  });

  // SCEN-057: [normal] 営業プロセス監査ダッシュボード - 営業プロセス分析レポート生成・確認画面で確認されたヘルスチェック診断結果が反映される
  test('SCEN-057: プロセス分析レポート画面のヘルスチェック結果がダッシュボードに反映', async ({ page }) => {
    await page.goto(`${baseUrl}/panels/scr-process-analysis-report.html`);
    await page.waitForLoadState('networkidle');
    
    const generateButton = page.locator('button:has-text("レポート生成"), button:has-text("分析実行"), [data-testid="generate-report-button"]');
    await generateButton.click();
    
    await page.waitForTimeout(2000);
    
    const processComplianceScore = page.locator('[data-testid="process-compliance-score"], .process-compliance-score, [class*="compliance"] >> xpath=//span[contains(text(), "%")]');
    const complianceText = await processComplianceScore.textContent();
    const complianceValue = parseInt(complianceText.match(/\d+/)[0]);
    
    const dataQualityScore = page.locator('[data-testid="data-quality-score"], .data-quality-score, [class*="quality"] >> xpath=//span[contains(text(), "%")]');
    const qualityText = await dataQualityScore.textContent();
    const qualityValue = parseInt(qualityText.match(/\d+/)[0]);
    
    const inappropriatePatternCount = page.locator('[data-testid="inappropriate-pattern-count"], .inappropriate-pattern-count, [class*="count"]');
    const countText = await inappropriatePatternCount.textContent();
    const countValue = parseInt(countText.match(/\d+/)[0]);
    
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const healthcheckSection = page.locator('[data-testid="healthcheck-section"], .healthcheck-section, [class*="healthcheck"]');
    await expect(healthcheckSection).toBeVisible({ timeout: 5000 });
    
    const dashboardComplianceScore = page.locator('[data-testid="dashboard-compliance-score"], .dashboard-compliance-score, [class*="compliance-score"]');
    const dashboardComplianceText = await dashboardComplianceScore.textContent();
    const dashboardComplianceValue = parseInt(dashboardComplianceText.match(/\d+/)[0]);
    expect(dashboardComplianceValue).toBe(complianceValue);
    
    const dashboardQualityScore = page.locator('[data-testid="dashboard-quality-score"], .dashboard-quality-score, [class*="quality-score"]');
    const dashboardQualityText = await dashboardQualityScore.textContent();
    const dashboardQualityValue = parseInt(dashboardQualityText.match(/\d+/)[0]);
    expect(dashboardQualityValue).toBe(qualityValue);
    
    const dashboardPatternCount = page.locator('[data-testid="dashboard-pattern-count"], .dashboard-pattern-count, [class*="pattern-count"]');
    const dashboardCountText = await dashboardPatternCount.textContent();
    const dashboardCountValue = parseInt(dashboardCountText.match(/\d+/)[0]);
    expect(dashboardCountValue).toBe(countValue);
  });
});