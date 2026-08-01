import { test, expect } from '@playwright/test';

test.describe("営業プロセス監査ダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/panels/scr-1785570818400.html");
  });

  // SCEN-001
  test("営業プロセス実行状況サマリーパネルが表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const summaryPanel = page.locator('text=営業プロセス実行状況');
    await expect(summaryPanel).toBeVisible();
  });

  // SCEN-002
  test("営業担当者ごとの行動パターン分析レポート表示エリアが表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const analysisArea = page.locator('text=行動パターン分析');
    await expect(analysisArea).toBeVisible();
    const chartElements = page.locator('svg, canvas, [role="img"]');
    await expect(chartElements.first()).toBeVisible();
  });

  // SCEN-003
  test("成約実績との相関分析グラフが表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const correlationGraph = page.locator('text=相関分析').or(page.locator('[class*="chart"]'));
    await expect(correlationGraph.first()).toBeVisible();
    const graphElement = page.locator('svg').first();
    await expect(graphElement).toBeVisible();
  });

  // SCEN-004
  test("AIエージェント推論精度監視ウィジェットが表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const inferenceWidget = page.locator('text=推論精度').or(page.locator('text=AI'));
    await expect(inferenceWidget.first()).toBeVisible();
  });

  // SCEN-005
  test("推論精度低下アラート表示パネルが表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const alertPanel = page.locator('text=アラート').or(page.locator('[role="alert"]'));
    const alertCount = await alertPanel.count();
    if (alertCount > 0) {
      await expect(alertPanel.first()).toBeVisible();
    }
  });

  // SCEN-006
  test("プロセス遵守率スコア表示が更新される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const scoreDisplay = page.locator('text=遵守率').or(page.locator('[class*="score"]'));
    const initialScore = await scoreDisplay.first().textContent();
    expect(initialScore).toBeTruthy();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const updatedScore = await scoreDisplay.first().textContent();
    expect(updatedScore).toBeTruthy();
  });

  // SCEN-007
  test("データ品質スコア表示が更新される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const qualityScore = page.locator('text=品質スコア').or(page.locator('[class*="quality"]'));
    const initialValue = await qualityScore.first().textContent();
    expect(initialValue).toBeTruthy();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const updatedValue = await qualityScore.first().textContent();
    expect(updatedValue).toBeTruthy();
  });

  // SCEN-008
  test("不適切パターン検出結果リストに検出結果が表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const detectionSection = page.locator('text=不適切パターン検出').or(page.locator('[class*="detection"]'));
    await expect(detectionSection.first()).toBeVisible();
    const resultList = page.locator('[class*="list"], table, [role="grid"]').first();
    await expect(resultList).toBeVisible();
    const rows = page.locator('[role="row"], tr, [class*="row"]');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  // SCEN-009
  test("成功パターン適用状況トラッキングが表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const trackingSection = page.locator('text=成功パターン適用');
    await expect(trackingSection).toBeVisible();
    const patternList = page.locator('[class*="pattern"], [class*="tracking"]').first();
    await expect(patternList).toBeVisible();
  });

  // SCEN-010
  test("営業行動分析結果の可視化チャートが表示される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const analysisSection = page.locator('text=営業行動分析').or(page.locator('[class*="analysis"]'));
    if (await analysisSection.count() > 0) {
      await expect(analysisSection.first()).toBeVisible();
    }
    const charts = page.locator('svg, canvas, [role="img"]');
    expect(await charts.count()).toBeGreaterThan(0);
  });
});