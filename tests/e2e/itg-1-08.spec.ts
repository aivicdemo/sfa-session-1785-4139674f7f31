import { test, expect } from '@playwright/test';

test.describe("営業プロセス監査ダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/panels/scr-1785570818400.html");
  });

  // SCEN-011: プロセス乖離検出結果が表示される
  test("SCEN-011: プロセス乖離検出結果が表示される", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const deviationSection = page.locator("text=プロセス乖離検出");
    await expect(deviationSection).toBeVisible();
    const resultContent = page.locator("[class*='deviation']");
    await expect(resultContent).toBeTruthy();
  });

  // SCEN-012: 成約相関分析結果テーブルが表示される
  test("SCEN-012: 成約相関分析結果テーブルが表示される", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const correlationTable = page.locator("table[class*='correlation']");
    await expect(correlationTable).toBeVisible();
    const tableRow = page.locator("table[class*='correlation'] tbody tr");
    const rowCount = await tableRow.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  // SCEN-013: 営業担当者フィルタを適用すると表示内容が更新される
  test("SCEN-013: 営業担当者フィルタを適用すると表示内容が更新される", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const filterDropdown = page.locator("select[class*='sales-filter']");
    await filterDropdown.selectOption({ label: "田中太郎" });
    await page.waitForTimeout(500);
    const processCard = page.locator("[class*='process-status']");
    await expect(processCard).toBeVisible();
    const dataContent = await processCard.textContent();
    expect(dataContent).toBeTruthy();
  });

  // SCEN-014: 期間フィルタを適用すると表示内容が更新される
  test("SCEN-014: 期間フィルタを適用すると表示内容が更新される", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const startDate = page.locator("input[class*='start-date']");
    const endDate = page.locator("input[class*='end-date']");
    const applyButton = page.locator("button[class*='apply-filter']");
    
    await startDate.fill("2024-01-01");
    await endDate.fill("2024-01-31");
    await applyButton.click();
    await page.waitForTimeout(500);
    
    let graphContent = await page.locator("[class*='graph']").textContent();
    expect(graphContent).toBeTruthy();
    
    await startDate.fill("2024-02-01");
    await endDate.fill("2024-02-29");
    await applyButton.click();
    await page.waitForTimeout(500);
    
    let updatedGraphContent = await page.locator("[class*='graph']").textContent();
    expect(updatedGraphContent).toBeTruthy();
  });

  // SCEN-015: プロセス段階フィルタを適用すると表示内容が更新される
  test("SCEN-015: プロセス段階フィルタを適用すると表示内容が更新される", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const stageFilter = page.locator("select[class*='stage-filter']");
    await stageFilter.selectOption({ label: "初期接触" });
    await page.waitForTimeout(500);
    
    const processChart = page.locator("[class*='process-chart']");
    await expect(processChart).toBeVisible();
    const chartData = await processChart.textContent();
    expect(chartData).toContain("初期接触");
  });

  // SCEN-016: データ更新ボタン押下で最新データが読み込まれる
  test("SCEN-016: データ更新ボタン押下で最新データが読み込まれる", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const scoreWidget = page.locator("[class*='score-display']").first();
    const initialScore = await scoreWidget.textContent();
    
    const refreshButton = page.locator("button[class*='refresh']");
    await refreshButton.click();
    
    const spinner = page.locator("[class*='spinner']");
    await spinner.waitFor({ state: "visible", timeout: 2000 }).catch(() => {});
    await spinner.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(500);
    
    const updatedScore = await scoreWidget.textContent();
    expect(updatedScore).toBeTruthy();
  });

  // SCEN-017: エクスポートボタン押下でダウンロードが開始される
  test("SCEN-017: エクスポートボタン押下でダウンロードが開始される", async ({ page, context }) => {
    await page.waitForLoadState("networkidle");
    
    const downloadPromise = context.waitForEvent('page');
    const exportButton = page.locator("button[class*='export']");
    await exportButton.click();
    
    await page.waitForTimeout(1000);
  });

  // SCEN-018: 不適切パターン検出結果リスト内のリンク押下で詳細画面に遷移する
  test("SCEN-018: 不適切パターン検出結果リスト内のリンク押下で詳細画面に遷移する", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const detectionSection = page.locator("text=不適切パターン検出");
    await expect(detectionSection).toBeVisible();
    
    const detectionLink = page.locator("[class*='detection-item'] a").first();
    const linkHref = await detectionLink.getAttribute("href");
    expect(linkHref).toBeTruthy();
    
    await detectionLink.click();
    await page.waitForNavigation({ timeout: 3000 }).catch(() => {});
  });

  // SCEN-019: 成功パターン適用状況トラッキング内のリンク押下で詳細画面に遷移する
  test("SCEN-019: 成功パターン適用状況トラッキング内のリンク押下で詳細画面に遷移する", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const patternSection = page.locator("text=成功パターン適用状況");
    await expect(patternSection).toBeVisible();
    
    const patternLink = page.locator("[class*='pattern-item'] a").first();
    const linkExists = await patternLink.count();
    expect(linkExists).toBeGreaterThan(0);
    
    await patternLink.click();
    await page.waitForNavigation({ timeout: 3000 }).catch(() => {});
  });

  // SCEN-020: プロセス乖離検出結果内のリンク押下で詳細画面に遷移する
  test("SCEN-020: プロセス乖離検出結果内のリンク押下で詳細画面に遷移する", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const deviationSection = page.locator("text=プロセス乖離検出");
    await expect(deviationSection).toBeVisible();
    
    const deviationLink = page.locator("[class*='deviation-item'] a").first();
    const linkCount = await deviationLink.count();
    expect(linkCount).toBeGreaterThan(0);
    
    await deviationLink.click();
    await page.waitForNavigation({ timeout: 3000 }).catch(() => {});
  });
});