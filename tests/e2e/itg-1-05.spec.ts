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

  // SCEN-033
  test("[normal] 抽出対象期間を選択すると条件パネルに反映される", async ({ page }) => {
    const periodStartInput = page.locator('input[placeholder*="開始日"], input[placeholder*="開始"], input[type="date"]').first();
    const periodEndInput = page.locator('input[placeholder*="終了日"], input[placeholder*="終了"], input[type="date"]').nth(1);
    
    await periodStartInput.fill('2024-01-01');
    await periodEndInput.fill('2024-03-31');
    
    const conditionPanel = page.locator('text=/2024.*1.*1|2024-01-01/');
    await expect(conditionPanel).toBeVisible({ timeout: 3000 });
  });

  // SCEN-034
  test("[normal] 抽出対象営業担当者をフィルタ指定すると条件パネルに反映される", async ({ page }) => {
    const salesPersonSelect = page.locator('select, [role="combobox"]').filter({ hasText: /営業担当|担当者/ }).first();
    await salesPersonSelect.click();
    
    const option = page.locator('text=山田太郎').first();
    await option.click();
    
    const conditionText = page.locator('text=山田太郎');
    await expect(conditionText).toBeVisible({ timeout: 3000 });
  });

  // SCEN-035
  test("[normal] 抽出対象顧客をフィルタ指定すると条件パネルに反映される", async ({ page }) => {
    const customerAttrSection = page.locator('text=顧客属性').first();
    await customerAttrSection.click();
    
    const industrySelect = page.locator('text=製造業').first();
    await industrySelect.click();
    
    const regionSelect = page.locator('text=関東').first();
    await regionSelect.click();
    
    const scaleSelect = page.locator('text=1000万円以上').first();
    await scaleSelect.click();
    
    const applyButton = page.locator('button').filter({ hasText: /適用|OK/ }).first();
    await applyButton.click();
    
    const conditionPanel = page.locator('text=/製造業|関東|1000万円以上/');
    await expect(conditionPanel).toBeVisible({ timeout: 3000 });
  });

  // SCEN-036
  test("[normal] 抽出対象営業案件をフィルタ指定すると条件パネルに反映される", async ({ page }) => {
    const caseFilterPanel = page.locator('text=営業案件').first();
    await caseFilterPanel.click();
    
    const statusOption = page.locator('text=提案中').first();
    await statusOption.click();
    
    const applyButton = page.locator('button').filter({ hasText: /適用|検索/ }).first();
    await applyButton.click();
    
    const conditionDisplay = page.locator('text=提案中');
    await expect(conditionDisplay).toBeVisible({ timeout: 3000 });
  });

  // SCEN-037
  test("[normal] 営業活動タイプを選択すると条件パネルに反映される", async ({ page }) => {
    const activityTypeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /活動タイプ|活動/ }).first();
    await activityTypeSelect.click();
    
    const activityOption = page.locator('text=初回接触').first();
    await activityOption.click();
    
    const conditionText = page.locator('text=初回接触');
    await expect(conditionText).toBeVisible({ timeout: 3000 });
  });

  // SCEN-038
  test("[normal] ログ抽出実行ボタン押下で抽出結果プレビューが表示される", async ({ page }) => {
    await page.locator('input[type="date"]').first().fill('2024-01-01');
    await page.locator('input[type="date"]').nth(1).fill('2024-03-31');
    
    const extractButton = page.locator('button').filter({ hasText: /ログ抽出|抽出実行/ }).first();
    await extractButton.click();
    
    await page.waitForTimeout(1500);
    
    const previewArea = page.locator('text=/プレビュー|検索結果|一覧/').first();
    await expect(previewArea).toBeVisible({ timeout: 5000 });
  });

  // SCEN-039
  test("[error] 抽出対象期間を指定せずログ抽出実行するとエラー表示になる", async ({ page }) => {
    const extractButton = page.locator('button').filter({ hasText: /ログ抽出|抽出実行/ }).first();
    await extractButton.click();
    
    const errorMessage = page.locator('text=/期間|必須|指定してください/').first();
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });

  // SCEN-040
  test("[edge] 抽出条件に合致するログが0件のとき空表示になる", async ({ page }) => {
    await page.locator('input[type="date"]').first().fill('2099-01-01');
    await page.locator('input[type="date"]').nth(1).fill('2099-12-31');
    
    const extractButton = page.locator('button').filter({ hasText: /ログ抽出|抽出実行/ }).first();
    await extractButton.click();
    
    await page.waitForTimeout(1500);
    
    const emptyMessage = page.locator('text=/該当するレコード|検索結果.*0件|件のデータがみつかりません/').first();
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
  });

  // SCEN-041
  test("[normal] 抽出条件に合致するログが複数件のとき一覧に全件表示される", async ({ page }) => {
    await page.locator('input[type="date"]').first().fill('2024-01-01');
    await page.locator('input[type="date"]').nth(1).fill('2024-03-31');
    
    const extractButton = page.locator('button').filter({ hasText: /ログ抽出|抽出実行/ }).first();
    await extractButton.click();
    
    await page.waitForTimeout(1500);
    
    const tableRows = page.locator('table tbody tr, [role="row"]');
    const rowCount = await tableRows.count();
    
    expect(rowCount).toBeGreaterThan(0);
  });

  // SCEN-042
  test("[normal] 分析対象データ範囲を選択するとレポート生成条件パネルに反映される", async ({ page }) => {
    const startDateField = page.locator('input[placeholder*="開始日"], input[placeholder*="開始"]').first();
    const endDateField = page.locator('input[placeholder*="終了日"], input[placeholder*="終了"]').first();
    
    await startDateField.fill('2024-01-01');
    await endDateField.fill('2024-03-31');
    
    const salesPersonSelect = page.locator('select, [role="combobox"]').filter({ hasText: /営業担当|担当者/ }).first();
    await salesPersonSelect.click();
    const salesPersonOption = page.locator('text=田中太郎').first();
    await salesPersonOption.click();
    
    const customerAttrSelect = page.locator('select, [role="combobox"]').filter({ hasText: /顧客属性/ }).first();
    await customerAttrSelect.click();
    const customerAttrOption = page.locator('text=大企業').first();
    await customerAttrOption.click();
    
    const conditionPanel = page.locator('text=/2024.*1.*1|2024-01-01/').first();
    await expect(conditionPanel).toBeVisible({ timeout: 3000 });
    
    const salesPersonCondition = page.locator('text=田中太郎');
    await expect(salesPersonCondition).toBeVisible({ timeout: 3000 });
    
    const customerCondition = page.locator('text=大企業');
    await expect(customerCondition).toBeVisible({ timeout: 3000 });
  });
});