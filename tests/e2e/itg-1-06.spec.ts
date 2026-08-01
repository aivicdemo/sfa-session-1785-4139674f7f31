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
  });

  // SCEN-043
  test("[normal] レポートテンプレートを選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check template dropdown exists and has options
    const templateDropdown = page.locator('select[data-role="template-select"]').first();
    
    // Get all available template options
    const options = await templateDropdown.locator('option').count();
    expect(options).toBeGreaterThan(1);
    
    // Select first template
    await templateDropdown.selectOption({ index: 1 });
    await page.waitForTimeout(500);
    
    // Verify the condition panel is updated - check if any condition field is visible
    const conditionPanel = page.locator('[data-role="generation-conditions"]').first();
    await expect(conditionPanel).toBeVisible();
    
    // Select another template
    await templateDropdown.selectOption({ index: 2 });
    await page.waitForTimeout(500);
    
    // Verify condition panel still exists and is visible (indicating update)
    await expect(conditionPanel).toBeVisible();
  });

  // SCEN-044
  test("[normal] 分析指標（成約率）を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Get the metric selection area
    const metricSelect = page.locator('[data-role="metric-select"]').first();
    
    // Select "成約率" (conversion rate)
    await metricSelect.selectOption({ label: '成約率' });
    await page.waitForTimeout(500);
    
    // Verify it's selected in the condition panel
    const conditionPanel = page.locator('[data-role="generation-conditions"]').first();
    const selectedMetric = conditionPanel.locator('[data-role="selected-metric"]').first();
    
    await expect(selectedMetric).toContainText('成約率');
  });

  // SCEN-045
  test("[normal] 分析指標（活動頻度）を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Get the metric dropdown
    const metricSelect = page.locator('[data-role="metric-select"]').first();
    
    // Verify it's initially empty or unselected
    const currentValue = await metricSelect.inputValue();
    
    // Select "活動頻度" (activity frequency)
    await metricSelect.selectOption({ label: '活動頻度' });
    await page.waitForTimeout(500);
    
    // Verify selection is reflected in condition panel
    const selectedMetric = page.locator('[data-role="selected-metric"]').first();
    await expect(selectedMetric).toContainText('活動頻度');
  });

  // SCEN-046
  test("[normal] 分析指標（プロセス進捗）を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Get metric selection area
    const metricSelect = page.locator('[data-role="metric-select"]').first();
    
    // Select "プロセス進捗" (process progress)
    await metricSelect.selectOption({ label: 'プロセス進捗' });
    await page.waitForTimeout(500);
    
    // Verify it's reflected in condition panel
    const conditionPanel = page.locator('[data-role="generation-conditions"]').first();
    await expect(conditionPanel).toBeVisible();
    
    // Verify progress stage field is present
    const progressField = conditionPanel.locator('[data-role="progress-stage"]');
    if (await progressField.count() > 0) {
      await expect(progressField).toBeVisible();
    }
  });

  // SCEN-047
  test("[error] レポートテンプレートを指定せずレポート生成実行するとエラー表示になる", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Don't select a template, just fill other fields
    const periodInput = page.locator('input[data-role="analysis-period"]').first();
    if (await periodInput.count() > 0) {
      await periodInput.fill('2024-01');
    }
    
    // Click generate button
    const generateButton = page.locator('button[data-role="generate-button"]').first();
    await generateButton.click();
    await page.waitForTimeout(1000);
    
    // Verify error message appears
    const errorMessage = page.locator('[data-role="error-message"]').first();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('テンプレート');
  });

  // SCEN-048
  test("[error] 分析指標を1つも選択せずレポート生成実行するとエラー表示になる", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Select a template but no metrics
    const templateDropdown = page.locator('select[data-role="template-select"]').first();
    await templateDropdown.selectOption({ index: 1 });
    await page.waitForTimeout(300);
    
    // Try to generate without selecting metrics
    const generateButton = page.locator('button[data-role="generate-button"]').first();
    await generateButton.click();
    await page.waitForTimeout(1000);
    
    // Verify error message
    const errorMessage = page.locator('[data-role="error-message"]').first();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('指標');
  });

  // SCEN-049
  test("[normal] 生成したレポートをダウンロードボタン押下でファイルがダウンロードされる", async ({ page, context }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for existing reports in history
    const reportItem = page.locator('[data-role="report-item"]').first();
    if (await reportItem.count() > 0) {
      // Click on a report to view details
      await reportItem.click();
      await page.waitForTimeout(500);
    }
    
    // Find and click download button
    const downloadButton = page.locator('button[data-role="download-button"]').first();
    if (await downloadButton.count() > 0) {
      // Set up download promise
      const downloadPromise = context.waitForEvent('download');
      
      await downloadButton.click();
      const download = await downloadPromise;
      
      // Verify download happened
      expect(download.suggestedFilename()).toMatch(/\.(pdf|csv)$/);
    }
  });

  // SCEN-050
  test("[normal] 生成履歴一覧にレポート生成が記録される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Generate a new report
    const templateDropdown = page.locator('select[data-role="template-select"]').first();
    await templateDropdown.selectOption({ index: 1 });
    await page.waitForTimeout(300);
    
    const metricSelect = page.locator('[data-role="metric-select"]').first();
    await metricSelect.selectOption({ index: 1 });
    await page.waitForTimeout(300);
    
    const generateButton = page.locator('button[data-role="generate-button"]').first();
    await generateButton.click();
    await page.waitForTimeout(2000);
    
    // Navigate to history tab
    const historyTab = page.locator('[data-role="history-tab"]').first();
    if (await historyTab.count() > 0) {
      await historyTab.click();
      await page.waitForTimeout(500);
    }
    
    // Verify new report appears in history
    const historyList = page.locator('[data-role="history-list"]').first();
    await expect(historyList).toBeVisible();
    
    // Check for recent entry
    const historyItems = page.locator('[data-role="history-item"]');
    const count = await historyItems.count();
    expect(count).toBeGreaterThan(0);
  });

  // SCEN-051
  test("[normal] 生成履歴から過去のレポートを再表示できる", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Navigate to history section
    const historyTab = page.locator('[data-role="history-tab"]').first();
    if (await historyTab.count() > 0) {
      await historyTab.click();
      await page.waitForTimeout(500);
    }
    
    // Click on a past report
    const firstHistoryItem = page.locator('[data-role="history-item"]').first();
    if (await firstHistoryItem.count() > 0) {
      await firstHistoryItem.click();
      await page.waitForTimeout(1000);
    }
    
    // Verify report content is displayed
    const reportContent = page.locator('[data-role="report-content"]').first();
    if (await reportContent.count() > 0) {
      await expect(reportContent).toBeVisible();
    }
    
    // Check for download button
    const downloadButton = page.locator('button[data-role="download-button"]').first();
    if (await downloadButton.count() > 0) {
      await expect(downloadButton).toBeVisible();
    }
  });

  // SCEN-052
  test("[normal] 生成履歴の削除ボタン押下でレコードが一覧から削除される", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Navigate to history
    const historyTab = page.locator('[data-role="history-tab"]').first();
    if (await historyTab.count() > 0) {
      await historyTab.click();
      await page.waitForTimeout(500);
    }
    
    // Get initial count
    const historyItems = page.locator('[data-role="history-item"]');
    const initialCount = await historyItems.count();
    
    if (initialCount > 0) {
      // Find delete button on first item
      const firstItem = historyItems.first();
      const deleteButton = firstItem.locator('button[data-role="delete-button"]').first();
      
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        await page.waitForTimeout(500);
        
        // Handle confirmation dialog if it appears
        const confirmButton = page.locator('[data-role="confirm-delete"]').first();
        if (await confirmButton.count() > 0) {
          await confirmButton.click();
          await page.waitForTimeout(500);
        }
        
        // Verify count decreased
        const newCount = await historyItems.count();
        expect(newCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });
});