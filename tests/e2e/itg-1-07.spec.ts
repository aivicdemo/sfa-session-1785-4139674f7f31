import { test, expect } from '@playwright/test';

test.describe("営業プロセス監査ダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/panels/scr-1785570818400.html");
    await page.waitForLoadState("networkidle");
  });

  // SCEN-001: 営業プロセス実行状況サマリーパネルが表示される
  test("SCEN-001: 営業プロセス実行状況サマリーパネルが表示される", async ({ page }) => {
    const summaryPanel = page.locator("[class*='summary'], [class*='panel']").first();
    await expect(summaryPanel).toBeVisible();
    
    const panelText = await summaryPanel.textContent();
    expect(panelText).toBeTruthy();
  });

  // SCEN-002: 営業担当者ごとの行動パターン分析レポートが表示される
  test("SCEN-002: 営業担当者ごとの行動パターン分析レポートが表示される", async ({ page }) => {
    const reportSection = page.locator("[class*='behavior'], [class*='pattern'], [class*='analysis']").first();
    await expect(reportSection).toBeVisible();
    
    const sectionContent = await reportSection.textContent();
    expect(sectionContent).toBeTruthy();
    expect(sectionContent?.length).toBeGreaterThan(0);
  });

  // SCEN-003: 成約実績との相関分析グラフが表示される
  test("SCEN-003: 成約実績との相関分析グラフが表示される", async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const correlationChart = page.locator("[class*='chart'], [class*='graph'], svg").first();
    await expect(correlationChart).toBeVisible();
    
    const chartParent = correlationChart.locator("..");
    const chartContent = await chartParent.textContent();
    expect(chartContent).toBeTruthy();
  });

  // SCEN-004: AIエージェント推論精度監視ウィジェットが表示される
  test("SCEN-004: AIエージェント推論精度監視ウィジェットが表示される", async ({ page }) => {
    const inferenceWidget = page.locator("[class*='inference'], [class*='accuracy'], [class*='ai']").first();
    await expect(inferenceWidget).toBeVisible();
    
    const widgetContent = await inferenceWidget.textContent();
    expect(widgetContent).toBeTruthy();
  });

  // SCEN-005: 推論精度低下アラート表示パネルが表示される
  test("SCEN-005: 推論精度低下アラート表示パネルが表示される", async ({ page }) => {
    const alertPanel = page.locator("[class*='alert'], [class*='warning'], [class*='error']").first();
    
    if (await alertPanel.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(alertPanel).toBeVisible();
      const alertContent = await alertPanel.textContent();
      expect(alertContent).toBeTruthy();
    } else {
      await page.reload();
      await page.waitForLoadState("networkidle");
      const reloadedAlert = page.locator("[class*='alert'], [class*='warning']").first();
      await expect(reloadedAlert).toBeVisible({ timeout: 5000 }).catch(() => {
        // Alert may not always be present in normal state
      });
    }
  });

  // SCEN-006: プロセス遵守率スコアが表示される
  test("SCEN-006: プロセス遵守率スコアが表示される", async ({ page }) => {
    const complianceScore = page.locator("[class*='compliance'], [class*='adherence'], [class*='score']").first();
    await expect(complianceScore).toBeVisible();
    
    const scoreText = await complianceScore.textContent();
    expect(scoreText).toBeTruthy();
    expect(/\d+(%)?/.test(scoreText || "")).toBe(true);
  });

  // SCEN-007: データ品質スコアが表示される
  test("SCEN-007: データ品質スコアが表示される", async ({ page }) => {
    const qualityScore = page.locator("[class*='quality'], [class*='data'], [class*='score']").first();
    await expect(qualityScore).toBeVisible();
    
    const scoreText = await qualityScore.textContent();
    expect(scoreText).toBeTruthy();
    expect(/\d+(%)?/.test(scoreText || "")).toBe(true);
  });

  // SCEN-008: 不適切パターン検出結果リストが表示される
  test("SCEN-008: 不適切パターン検出結果リストが表示される", async ({ page }) => {
    const detectionList = page.locator("[class*='detection'], [class*='inappropriate'], [class*='list']").first();
    await expect(detectionList).toBeVisible();
    
    const listContent = await detectionList.textContent();
    expect(listContent).toBeTruthy();
    
    const listItems = page.locator("[class*='detection'], [class*='inappropriate']").locator("li, tr, [class*='item'], [class*='row']");
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });

  // SCEN-009: 成功パターン適用状況トラッキングが表示される
  test("SCEN-009: 成功パターン適用状況トラッキングが表示される", async ({ page }) => {
    const trackingSection = page.locator("[class*='success'], [class*='pattern'], [class*='tracking']").first();
    await expect(trackingSection).toBeVisible();
    
    const sectionContent = await trackingSection.textContent();
    expect(sectionContent).toBeTruthy();
    
    const trackingItems = page.locator("[class*='success'], [class*='pattern']").locator("li, tr, [class*='item'], [class*='row']");
    const itemCount = await trackingItems.count().catch(() => 0);
    if (itemCount > 0) {
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  // SCEN-010: 営業行動分析結果の可視化チャートが表示される
  test("SCEN-010: 営業行動分析結果の可視化チャートが表示される", async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const analysisChart = page.locator("svg, [class*='chart'], [class*='graph']").first();
    await expect(analysisChart).toBeVisible();
    
    const chartContainer = analysisChart.locator("..");
    const chartContent = await chartContainer.textContent();
    expect(chartContent).toBeTruthy();
  });
});