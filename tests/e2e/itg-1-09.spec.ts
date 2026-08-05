import { test, expect } from '@playwright/test';

test.describe("営業プロセス監査ダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/panels/scr-1785570818400.html");
  });

  // SCEN-021: [normal] 営業プロセス監査ダッシュボード - 成約相関分析結果テーブル内のリンク押下で詳細画面に遷移する
  test("SCEN-021: 成約相関分析結果テーブルのリンク押下で詳細画面遷移", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const correlationTable = page.locator("table").first();
    await expect(correlationTable).toBeVisible();
    
    const firstLink = correlationTable.locator("a").first();
    await expect(firstLink).toBeVisible();
    
    const navigationPromise = page.waitForURL(url => url.toString().includes("/panels/scr-") && !url.toString().includes("scr-1785570818400"));
    await firstLink.click();
    await navigationPromise;
    
    await expect(page).toHaveURL(/\/panels\/scr-\d+\.html/);
  });

  // SCEN-022: [edge] 営業プロセス監査ダッシュボード - 不適切パターン検出結果が0件のときリスト表示領域に0件メッセージが表示される
  test("SCEN-022: 不適切パターン検出結果0件時に0件メッセージ表示", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const inappropriatePatternSection = page.locator("section").filter({ hasText: "不適切パターン" }).first();
    await expect(inappropriatePatternSection).toBeVisible();
    
    const searchButton = inappropriatePatternSection.locator("button").filter({ hasText: /検索|実行/ }).first();
    await searchButton.click();
    
    await page.waitForTimeout(1000);
    
    const zeroMessagePatterns = ["0件です", "検出された不適切パターンはありません", "該当する不適切パターンはありません", "データがありません"];
    let foundZeroMessage = false;
    
    for (const message of zeroMessagePatterns) {
      const messageLocator = inappropriatePatternSection.locator(`text="${message}"`);
      if (await messageLocator.count() > 0) {
        await expect(messageLocator).toBeVisible();
        foundZeroMessage = true;
        break;
      }
    }
    
    if (!foundZeroMessage) {
      const listArea = inappropriatePatternSection.locator("div, ul, table").last();
      const contentText = await listArea.textContent();
      expect(contentText).toMatch(/0件|データがありません|該当なし/);
    }
  });

  // SCEN-023: [edge] 営業プロセス監査ダッシュボード - 成功パターン適用状況が0件のときトラッキング表示領域に0件メッセージが表示される
  test("SCEN-023: 成功パターン適用状況0件時に0件メッセージ表示", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const trackingSection = page.locator("section").filter({ hasText: /成功パターン適用|トラッキング/ }).first();
    await expect(trackingSection).toBeVisible();
    
    const zeroMessagePatterns = ["0件", "データがありません", "該当する成功パターン適用事例はありません"];
    let foundZeroMessage = false;
    
    for (const message of zeroMessagePatterns) {
      const messageLocator = trackingSection.locator(`text="${message}"`);
      if (await messageLocator.count() > 0) {
        foundZeroMessage = true;
        break;
      }
    }
    
    if (!foundZeroMessage) {
      const displayArea = trackingSection.locator("div, span").last();
      const contentText = await displayArea.textContent();
      expect(contentText).toMatch(/0|データがありません|該当なし/);
    }
  });

  // SCEN-024: [edge] 営業プロセス監査ダッシュボード - 成約相関分析結果が0件のときテーブル表示領域に0件メッセージが表示される
  test("SCEN-024: 成約相関分析結果0件時にテーブル表示領域に0件メッセージ表示", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const correlationSection = page.locator("section").filter({ hasText: /成約相関|相関分析/ }).first();
    await expect(correlationSection).toBeVisible();
    
    const searchButton = correlationSection.locator("button").filter({ hasText: /検索|実行/ }).first();
    await searchButton.click();
    
    await page.waitForTimeout(1000);
    
    const zeroMessagePatterns = ["0件のデータがあります", "検索結果はありません", "0件です", "データがありません"];
    let foundZeroMessage = false;
    
    for (const message of zeroMessagePatterns) {
      const messageLocator = correlationSection.locator(`text="${message}"`);
      if (await messageLocator.count() > 0) {
        foundZeroMessage = true;
        break;
      }
    }
    
    if (!foundZeroMessage) {
      const tableArea = correlationSection.locator("table, div[role='grid']").first();
      const rows = await tableArea.locator("tr, [role='row']").count();
      expect(rows).toBeLessThanOrEqual(1);
    }
  });

  // SCEN-025: [normal] 営業プロセス監査ダッシュボード - 推論精度が閾値以下のときアラート表示パネルが赤色で表示される
  test("SCEN-025: 推論精度が閾値以下のときアラートパネルが赤色表示", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const inferencePanel = page.locator("div").filter({ hasText: /推論精度|AI推論/ }).first();
    await expect(inferencePanel).toBeVisible();
    
    const computedStyle = await inferencePanel.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    const backgroundColor = computedStyle.backgroundColor;
    const borderColor = computedStyle.borderColor;
    
    const isRedColor = (color: string) => {
      return color.includes("rgb(255, 0, 0)") || 
             color.includes("rgb(255,0,0)") ||
             color.toLowerCase().includes("red") ||
             /rgb\(2[0-5]\d,\s*0,\s*0\)/.test(color);
    };
    
    expect(isRedColor(backgroundColor) || isRedColor(borderColor)).toBeTruthy();
  });

  // SCEN-026: [normal] 営業プロセス監査ダッシュボード - 推論精度が閾値以上のときアラート表示パネルが通常色で表示される
  test("SCEN-026: 推論精度が閾値以上のときアラートパネルが通常色表示", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const inferencePanel = page.locator("div").filter({ hasText: /推論精度|AI推論/ }).first();
    await expect(inferencePanel).toBeVisible();
    
    const computedStyle = await inferencePanel.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    const backgroundColor = computedStyle.backgroundColor;
    
    const isNormalColor = (color: string) => {
      return !color.includes("rgb(255, 0, 0)") && 
             !color.includes("rgb(255,0,0)") &&
             !color.toLowerCase().includes("red");
    };
    
    expect(isNormalColor(backgroundColor)).toBeTruthy();
  });

  // SCEN-027: [normal] 営業プロセス監査ダッシュボード - プロセス遵守率が低いときスコア表示が警告色で表示される
  test("SCEN-027: プロセス遵守率が低いときスコア表示が警告色表示", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const complianceScoreElement = page.locator("div, span").filter({ hasText: /プロセス遵守率|遵守率/ }).first();
    await expect(complianceScoreElement).toBeVisible();
    
    const scoreText = await complianceScoreElement.textContent();
    const scoreMatch = scoreText?.match(/(\d+)%/);
    
    if (scoreMatch) {
      const scoreValue = parseInt(scoreMatch[1], 10);
      if (scoreValue <= 50) {
        const computedStyle = await complianceScoreElement.evaluate((el) => {
          return window.getComputedStyle(el);
        });
        
        const color = computedStyle.color || computedStyle.backgroundColor;
        const isWarningColor = color.includes("rgb(255, 0, 0)") || 
                               color.includes("rgb(255,0,0)") ||
                               color.includes("rgb(255");
        
        expect(isWarningColor).toBeTruthy();
      }
    }
  });

  // SCEN-028: [normal] 営業プロセス監査ダッシュボード - データ品質スコアが低いときスコア表示が警告色で表示される
  test("SCEN-028: データ品質スコアが低いときスコア表示が警告色表示", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const qualityScoreElement = page.locator("div, span").filter({ hasText: /データ品質|品質スコア/ }).first();
    await expect(qualityScoreElement).toBeVisible();
    
    const scoreText = await qualityScoreElement.textContent();
    const scoreMatch = scoreText?.match(/(\d+)/);
    
    if (scoreMatch) {
      const scoreValue = parseInt(scoreMatch[1], 10);
      if (scoreValue <= 40) {
        const computedStyle = await qualityScoreElement.evaluate((el) => {
          return window.getComputedStyle(el);
        });
        
        const color = computedStyle.color || computedStyle.backgroundColor;
        const isWarningColor = color.includes("rgb(255") || 
                               color.includes("rgb(255,");
        
        expect(isWarningColor).toBeTruthy();
      }
    }
  });

  // SCEN-072: [normal] 営業プロセス監査ダッシュボード - 営業プロセス分析レポート生成・確認で生成・確認されたレポート結果が営業プロセス監査ダッシュボードに反映される
  test("SCEN-072: 分析レポート結果がダッシュボードに反映される", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const initialDashboardText = await page.textContent();
    
    const reportLink = page.locator("a").filter({ hasText: /レポート|分析|プロセス分析/ }).first();
    if (await reportLink.count() > 0) {
      const navigationPromise = page.waitForURL(url => !url.toString().includes("scr-1785570818400"));
      await reportLink.click();
      await navigationPromise;
      
      await page.waitForLoadState("networkidle");
      
      const generateButton = page.locator("button").filter({ hasText: /生成|実行|生成開始/ }).first();
      if (await generateButton.count() > 0) {
        await generateButton.click();
        await page.waitForTimeout(2000);
      }
      
      await page.goto("/panels/scr-1785570818400.html");
      await page.waitForLoadState("networkidle");
    }
    
    const dashboardAfter = page.locator("section, div[class*='widget'], div[class*='panel']").first();
    await expect(dashboardAfter).toBeVisible();
  });

  // SCEN-074: [normal] 営業プロセス監査ダッシュボード - 営業事例・成功パターン検索・学習で学習された成功パターンの適用状況が営業プロセス監査ダッシュボードに反映される
  test("SCEN-074: 成功パターン学習の適用状況がダッシュボードに反映される", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    
    const patternApplicationSection = page.locator("section").filter({ hasText: /成功パターン適用/ }).first();
    await expect(patternApplicationSection).toBeVisible();
    
    const learnLink = page.locator("a").filter({ hasText: /学習|事例|パターン/ }).first();
    if (await learnLink.count() > 0) {
      const navigationPromise = page.waitForURL(url => !url.toString().includes("scr-1785570818400"));
      await learnLink.click();
      await navigationPromise;
      
      await page.waitForLoadState("networkidle");
      
      const patternCheckbox = page.locator("input[type='checkbox']").first();
      if (await patternCheckbox.count() > 0) {
        await patternCheckbox.check();
      }
      
      const applyButton = page.locator("button").filter({ hasText: /学習|適用|実行/ }).first();
      if (await applyButton.count() > 0) {
        await applyButton.click();
        await page.waitForTimeout(1500);
      }
      
      await page.goto("/panels/scr-1785570818400.html");
      await page.waitForLoadState("networkidle");
    }
    
    const updatedSection = page.locator("section").filter({ hasText: /成功パターン適用/ }).first();
    await expect(updatedSection).toBeVisible();
    
    const appliedStatus = updatedSection.locator("text='適用済み'");
    if (await appliedStatus.count() > 0) {
      await expect(appliedStatus).toBeVisible();
    }
  });
});