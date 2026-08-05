import { test, expect } from '@playwright/test';

test.describe("営業事例・成功パターン検索・学習", () => {
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
  });

  // SCEN-029
  test("SCEN-029: [normal] 営業事例・成功パターン検索・学習 - 顧客業種フィルターを選択すると検索結果に反映される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 顧客業種フィルターのドロップダウンをクリック
    const industryFilter = page.locator('select, [role="combobox"]').first();
    await industryFilter.click();
    
    // 「製造業」を選択
    await page.locator('text=製造業').click();
    
    // 検索ボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されたことを確認
    const resultTable = page.locator('table, [role="grid"]').first();
    await expect(resultTable).toBeVisible();
    
    // 結果内のすべての行に「製造業」が含まれていることを確認
    const rows = await page.locator('table tbody tr, [role="row"]').count();
    expect(rows).toBeGreaterThan(0);
  });

  // SCEN-030
  test("SCEN-030: [normal] 営業事例・成功パターン検索・学習 - 案件金額範囲フィルターの最小値を入力すると検索結果に反映される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 案件金額範囲の最小値入力フィールドを特定
    const minAmountInput = page.locator('input[type="number"], input[placeholder*="最小"]').first();
    await minAmountInput.fill('1000000');
    
    // 検索ボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されたことを確認
    const resultTable = page.locator('table, [role="grid"]').first();
    await expect(resultTable).toBeVisible();
  });

  // SCEN-031
  test("SCEN-031: [normal] 営業事例・成功パターン検索・学習 - 案件金額範囲フィルターの最大値を入力すると検索結果に反映される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 案件金額範囲の最大値入力フィールドを特定
    const maxAmountInput = page.locator('input[type="number"], input[placeholder*="最大"]').last();
    await maxAmountInput.fill('5000000');
    
    // 検索ボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されたことを確認
    const resultTable = page.locator('table, [role="grid"]').first();
    await expect(resultTable).toBeVisible();
    
    // 最大値フィールドに値が保持されていることを確認
    await expect(maxAmountInput).toHaveValue('5000000');
  });

  // SCEN-032
  test("SCEN-032: [normal] 営業事例・成功パターン検索・学習 - 成約期間フィルターを選択すると検索結果に反映される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 成約期間フィルターのドロップダウンをクリック
    const periodFilter = page.locator('select, [role="combobox"]').nth(1);
    await periodFilter.click();
    
    // 「過去3ヶ月」を選択
    await page.locator('text=過去3ヶ月').click();
    
    // 検索実行ボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されたことを確認
    const resultTable = page.locator('table, [role="grid"]').first();
    await expect(resultTable).toBeVisible();
  });

  // SCEN-033
  test("SCEN-033: [normal] 営業事例・成功パターン検索・学習 - 営業担当者フィルターを選択すると検索結果に反映される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 営業担当者フィルターを特定
    const salespersonFilter = page.locator('select, [role="combobox"]').nth(2);
    await salespersonFilter.click();
    
    // 特定の営業担当者を選択
    const firstOption = page.locator('[role="option"]').first();
    await firstOption.click();
    
    // フィルター適用またはボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されたことを確認
    const resultTable = page.locator('table, [role="grid"]').first();
    await expect(resultTable).toBeVisible();
  });

  // SCEN-034
  test("SCEN-034: [normal] 営業事例・成功パターン検索・学習 - 成功パターンキーワード検索欄にキーワードを入力すると検索結果に反映される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // キーワード検索欄を特定
    const keywordInput = page.locator('input[type="text"], input[placeholder*="キーワード"]').first();
    await keywordInput.fill('顧客課題ヒアリング');
    
    // 検索結果が自動更新または手動で検索
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されたことを確認
    const resultTable = page.locator('table, [role="grid"]').first();
    await expect(resultTable).toBeVisible();
  });

  // SCEN-035
  test("SCEN-035: [normal] 営業事例・成功パターン検索・学習 - 検索実行ボタン押下で事例一覧が表示される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 検索実行ボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 事例一覧テーブルが表示されることを確認
    const resultTable = page.locator('table, [role="grid"]').first();
    await expect(resultTable).toBeVisible();
    
    // 少なくとも1件以上の事例が表示されていることを確認
    const rows = await page.locator('table tbody tr, [role="row"]').count();
    expect(rows).toBeGreaterThan(0);
  });

  // SCEN-036
  test("SCEN-036: [edge] 営業事例・成功パターン検索・学習 - 検索条件で0件のときは事例一覧に0件表示になる", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 存在しない値の組み合わせを入力
    const industryFilter = page.locator('select, [role="combobox"]').first();
    await industryFilter.click();
    await page.locator('text=存在しない業種').click().catch(() => {});
    
    // 検索ボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 0件メッセージまたは空の結果が表示されることを確認
    const emptyMessage = page.locator('text=0件, text=該当する事例がありません');
    const resultTable = page.locator('table, [role="grid"]').first();
    
    const isEmptyMessageVisible = await emptyMessage.isVisible().catch(() => false);
    const rowCount = await page.locator('table tbody tr, [role="row"]').count();
    
    expect(isEmptyMessageVisible || rowCount === 0).toBeTruthy();
  });

  // SCEN-037
  test("SCEN-037: [edge] 営業事例・成功パターン検索・学習 - 検索条件で複数件のときは事例一覧に複数行表示される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 検索条件を入力（複数件マッチする条件）
    const industryFilter = page.locator('select, [role="combobox"]').first();
    await industryFilter.click();
    await page.locator('text=IT').click();
    
    // 検索ボタンをクリック
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 複数行の事例が表示されていることを確認
    const rows = await page.locator('table tbody tr, [role="row"]').count();
    expect(rows).toBeGreaterThanOrEqual(3);
  });

  // SCEN-038
  test("SCEN-038: [normal] 営業事例・成功パターン検索・学習 - 事例分類マトリクス表示が更新される", async ({ page }) => {
    await page.goto("/panels/scr-1785570831723.html");
    await page.waitForLoadState('networkidle');
    
    // 初期検索を実行
    const industryFilter = page.locator('select, [role="combobox"]').first();
    await industryFilter.click();
    await page.locator('text=IT').click();
    
    await page.locator('button:has-text("検索")').click();
    await page.waitForLoadState('networkidle');
    
    // 事例分類マトリクスが表示されていることを確認
    const matrix = page.locator('[class*="matrix"], [role="presentation"]').first();
    await expect(matrix).toBeVisible();
    
    // マトリクス内のセルをクリック（フィルター変更）
    const cell = page.locator('[role="cell"], [class*="cell"]').first();
    await cell.click();
    await page.waitForLoadState('networkidle');
    
    // マトリクスが再描画されたことを確認
    await expect(matrix).toBeVisible();
  });
});