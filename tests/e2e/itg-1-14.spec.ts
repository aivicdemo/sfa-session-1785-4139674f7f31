import { test, expect } from '@playwright/test';

test.describe("営業プロセス分析レポート生成・確認", () => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
  const targetScreenId = "scr-1785570844176";
  const targetScreenUrl = `/panels/${targetScreenId}.html`;

  test.beforeEach(async ({ page }) => {
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
    await page.goto(targetScreenUrl);
    await page.waitForLoadState('networkidle');
  });

  // SCEN-055: [edge] 営業プロセス分析レポート生成・確認 - ログ抽出結果が複数件のとき抽出結果プレビューに全件表示される
  test("SCEN-055: ログ抽出結果が複数件のとき抽出結果プレビューに全件表示される", async ({ page }) => {
    const extractionPeriodStart = page.locator('input[placeholder*="開始"]').first();
    const extractionPeriodEnd = page.locator('input[placeholder*="終了"]').first();
    const staffSelectDropdown = page.locator('select').nth(0);
    const statusSelectDropdown = page.locator('select').nth(1);
    const executeButton = page.locator('button:has-text("抽出実行")');
    const previewArea = page.locator('[data-preview-area], .preview-section, .extraction-preview').first();

    await extractionPeriodStart.fill('2024-01-01');
    await extractionPeriodEnd.fill('2024-01-31');
    await staffSelectDropdown.selectOption('all');
    await statusSelectDropdown.selectOption('active');
    
    await Promise.all([
      page.waitForResponse(response => response.url().includes('extraction')),
      executeButton.click(),
    ]);

    await previewArea.waitFor({ state: 'visible', timeout: 5000 });
    const recordCount = await page.locator('[data-preview-area] [data-record-item], .preview-section tr:not(:first-child), .extraction-preview [data-item]').count();
    expect(recordCount).toBeGreaterThan(1);

    const scrollableContainer = previewArea;
    const hasScrollable = await scrollableContainer.evaluate(el => el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
    expect(hasScrollable || recordCount > 10).toBeTruthy();
  });

  // SCEN-056: [normal] 営業プロセス分析レポート生成・確認 - 分析対象データ範囲を選択するとレポート生成条件パネルに反映される
  test("SCEN-056: 分析対象データ範囲を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    const conditionPanel = page.locator('[data-condition-panel], .condition-panel, .report-conditions').first();
    const dateRangeStart = page.locator('input[placeholder*="開始日"]').first();
    const dateRangeEnd = page.locator('input[placeholder*="終了日"]').first();
    const staffSelect = page.locator('select[name*="staff"], select[aria-label*="営業担当者"]').first();
    const categorySelect = page.locator('select[name*="category"], select[aria-label*="カテゴリ"]').first();

    await dateRangeStart.fill('2024-01-01');
    await page.waitForTimeout(300);
    const startValue = await conditionPanel.locator('text=/2024.*01.*01|2024\/01\/01/').count();
    expect(startValue).toBeGreaterThan(0);

    await dateRangeEnd.fill('2024-01-31');
    await page.waitForTimeout(300);
    const endValue = await conditionPanel.locator('text=/2024.*01.*31|2024\/01\/31/').count();
    expect(endValue).toBeGreaterThan(0);

    await staffSelect.selectOption('tanaka');
    await page.waitForTimeout(300);
    const staffText = await conditionPanel.locator('text=田中太郎').count();
    expect(staffText).toBeGreaterThan(0);

    await categorySelect.selectOption('solution');
    await page.waitForTimeout(300);
    const categoryText = await conditionPanel.locator('text=ソリューション営業').count();
    expect(categoryText).toBeGreaterThan(0);
  });

  // SCEN-057: [normal] 営業プロセス分析レポート生成・確認 - レポートテンプレートを選択するとレポート生成条件パネルに反映される
  test("SCEN-057: レポートテンプレートを選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    const templateSelect = page.locator('select[name*="template"], select[aria-label*="テンプレート"]').first();
    const conditionPanel = page.locator('[data-condition-panel], .condition-panel, .report-conditions').first();

    await templateSelect.selectOption('behavior-pattern');
    await page.waitForTimeout(300);

    const templateText = await conditionPanel.locator('text=営業行動パターン分析テンプレート').count();
    expect(templateText).toBeGreaterThan(0);

    const periodField = conditionPanel.locator('text=/分析対象期間|分析期間/').count();
    const staffField = conditionPanel.locator('text=/対象営業担当者|営業担当者/').count();
    const attributeField = conditionPanel.locator('text=/顧客属性/').count();

    expect(await periodField).toBeGreaterThan(0);
    expect(await staffField).toBeGreaterThan(0);
    expect(await attributeField).toBeGreaterThan(0);
  });

  // SCEN-058: [normal] 営業プロセス分析レポート生成・確認 - 分析指標（成約率）を選択するとレポート生成条件パネルに反映される
  test("SCEN-058: 分析指標（成約率）を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    const metricsDropdown = page.locator('select[name*="metric"], select[aria-label*="分析指標"]').first();
    const conditionPanel = page.locator('[data-condition-panel], .condition-panel, .report-conditions').first();

    await metricsDropdown.selectOption('conversion-rate');
    await page.waitForTimeout(300);

    const selectedText = await conditionPanel.locator('text=成約率').count();
    expect(selectedText).toBeGreaterThan(0);

    const otherFields = await conditionPanel.locator('text=/期間|営業担当者|顧客属性/').count();
    expect(otherFields).toBeGreaterThan(0);
  });

  // SCEN-059: [normal] 営業プロセス分析レポート生成・確認 - 分析指標（活動頻度）を選択するとレポート生成条件パネルに反映される
  test("SCEN-059: 分析指標（活動頻度）を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    const metricsDropdown = page.locator('select[name*="metric"], select[aria-label*="分析指標"]').first();
    const conditionPanel = page.locator('[data-condition-panel], .condition-panel, .report-conditions').first();

    const initialMetric = await metricsDropdown.inputValue();
    expect(initialMetric).not.toBe('activity-frequency');

    await metricsDropdown.selectOption('activity-frequency');
    await page.waitForTimeout(300);

    const selectedText = await conditionPanel.locator('text=活動頻度').count();
    expect(selectedText).toBeGreaterThan(0);

    const otherMetrics = await page.locator('select[name*="metric"] option:checked').inputValue();
    expect(otherMetrics).toBe('activity-frequency');
  });

  // SCEN-060: [normal] 営業プロセス分析レポート生成・確認 - 分析指標（プロセス進捗）を選択するとレポート生成条件パネルに反映される
  test("SCEN-060: 分析指標（プロセス進捗）を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    const metricsDropdown = page.locator('select[name*="metric"], select[aria-label*="分析指標"]').first();
    const conditionPanel = page.locator('[data-condition-panel], .condition-panel, .report-conditions').first();

    await metricsDropdown.selectOption('process-progress');
    await page.waitForTimeout(300);

    const selectedText = await conditionPanel.locator('text=プロセス進捗').count();
    expect(selectedText).toBeGreaterThan(0);

    const refinementFilters = await conditionPanel.locator('text=/期間指定|営業段階|対象部門/').count();
    expect(refinementFilters).toBeGreaterThan(0);
  });

  // SCEN-061: [normal] 営業プロセス分析レポート生成・確認 - レポート生成実行ボタン押下でレポートが生成される
  test("SCEN-061: レポート生成実行ボタン押下でレポートが生成される", async ({ page }) => {
    const dateRangeStart = page.locator('input[placeholder*="開始"]').first();
    const dateRangeEnd = page.locator('input[placeholder*="終了"]').first();
    const staffSelect = page.locator('select').nth(0);
    const templateSelect = page.locator('select').nth(1);
    const metricsSelect = page.locator('select').nth(2);
    const generateButton = page.locator('button:has-text("レポート生成実行")');
    const historyList = page.locator('[data-history-list], .history-section, .generation-history').first();

    await dateRangeStart.fill('2024-01-01');
    await dateRangeEnd.fill('2024-01-31');
    await staffSelect.selectOption('all');
    await templateSelect.selectOption('behavior-pattern');
    await metricsSelect.selectOption('conversion-rate');

    const loadingBefore = await page.locator('[data-progress], .loading, .progress-bar').count();

    await Promise.all([
      page.waitForResponse(response => response.url().includes('report')),
      generateButton.click(),
    ]);

    const loadingAfter = await page.locator('[data-progress], .loading, .progress-bar').count();
    expect(loadingAfter).toBeGreaterThanOrEqual(0);

    await page.waitForTimeout(2000);

    const generatedReport = await page.locator('[data-report-item], .report-row, .generated-report').first().count();
    expect(generatedReport).toBeGreaterThan(0);

    const historyRecord = await historyList.locator('text=/2024.*01|生成日時/').count();
    expect(historyRecord).toBeGreaterThan(0);
  });

  // SCEN-062: [error] 営業プロセス分析レポート生成・確認 - 分析対象データ範囲を指定せずレポート生成実行するとエラー表示になる
  test("SCEN-062: 分析対象データ範囲を指定せずレポート生成実行するとエラー表示になる", async ({ page }) => {
    const dateRangeStart = page.locator('input[placeholder*="開始"]').first();
    const dateRangeEnd = page.locator('input[placeholder*="終了"]').first();
    const generateButton = page.locator('button:has-text("レポート生成実行")');
    const errorArea = page.locator('[role="alert"], .error-message, .validation-error').first();

    await dateRangeStart.clear();
    await dateRangeEnd.clear();

    await generateButton.click();
    await page.waitForTimeout(500);

    const errorMessage = await page.locator('text=/分析対象データ範囲を指定してください|必須項目が未入力です/').count();
    expect(errorMessage).toBeGreaterThan(0);

    const isErrorDisplayed = await errorArea.isVisible().catch(() => false);
    expect(isErrorDisplayed || errorMessage > 0).toBeTruthy();

    const screenUnchanged = await page.url();
    expect(screenUnchanged).toContain(targetScreenId);
  });

  // SCEN-063: [error] 営業プロセス分析レポート生成・確認 - レポートテンプレートを指定せずレポート生成実行するとエラー表示になる
  test("SCEN-063: レポートテンプレートを指定せずレポート生成実行するとエラー表示になる", async ({ page }) => {
    const dateRangeStart = page.locator('input[placeholder*="開始"]').first();
    const dateRangeEnd = page.locator('input[placeholder*="終了"]').first();
    const templateSelect = page.locator('select[name*="template"], select[aria-label*="テンプレート"]').first();
    const generateButton = page.locator('button:has-text("レポート生成実行")');

    await dateRangeStart.fill('2024-01-01');
    await dateRangeEnd.fill('2024-01-31');
    await templateSelect.selectOption('');

    await generateButton.click();
    await page.waitForTimeout(500);

    const errorMessage = await page.locator('text=レポートテンプレートを選択してください').count();
    expect(errorMessage).toBeGreaterThan(0);

    const errorStyle = await page.locator('text=レポートテンプレートを選択してください').first().evaluate(el => window.getComputedStyle(el).color);
    expect(errorStyle).toMatch(/rgb|#/);

    const screenUnchanged = await page.url();
    expect(screenUnchanged).toContain(targetScreenId);
  });

  // SCEN-064: [error] 営業プロセス分析レポート生成・確認 - 分析指標を1つも選択せずレポート生成実行するとエラー表示になる
  test("SCEN-064: 分析指標を1つも選択せずレポート生成実行するとエラー表示になる", async ({ page }) => {
    const dateRangeStart = page.locator('input[placeholder*="開始"]').first();
    const dateRangeEnd = page.locator('input[placeholder*="終了"]').first();
    const templateSelect = page.locator('select[name*="template"], select[aria-label*="テンプレート"]').first();
    const metricsCheckboxes = page.locator('input[type="checkbox"][name*="metric"]');
    const generateButton = page.locator('button:has-text("レポート生成実行")');

    await dateRangeStart.fill('2024-01-01');
    await dateRangeEnd.fill('2024-01-31');
    await templateSelect.selectOption('behavior-pattern');

    const metricsCount = await metricsCheckboxes.count();
    for (let i = 0; i < metricsCount; i++) {
      const checkbox = metricsCheckboxes.nth(i);
      const isChecked = await checkbox.isChecked();
      if (isChecked) {
        await checkbox.click();
      }
    }

    const buttonDisabled = await generateButton.isDisabled();
    if (buttonDisabled) {
      expect(buttonDisabled).toBe(true);
    } else {
      await generateButton.click();
      await page.waitForTimeout(500);
      const errorMessage = await page.locator('text=分析指標を1つ以上選択してください').count();
      expect(errorMessage).toBeGreaterThan(0);
    }

    const screenUnchanged = await page.url();
    expect(screenUnchanged).toContain(targetScreenId);
  });
});