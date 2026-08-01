import { test, expect } from '@playwright/test';

test.describe("営業事例・成功パターン検索・学習", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
    await page.goto("/panels/scr-1785570831723.html");
  });

  // SCEN-029
  test("[normal] 複数の検索条件を組み合わせて検索すると全条件を満たす事例のみが表示される", async ({ page }) => {
    await page.waitForSelector('input[placeholder*="業種"]', { timeout: 5000 });
    
    await page.fill('input[placeholder*="業種"]', 'IT');
    await page.fill('input[placeholder*="成約金額"]', '100万円以上');
    await page.fill('select[name*="営業段階"]', '提案済み');
    await page.fill('input[placeholder*="成約月"]', '2024年1月');
    
    await page.click('button:has-text("検索")');
    
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
    const results = await page.locator('[data-testid="search-result-row"]').count();
    
    expect(results).toBeGreaterThan(0);
    
    for (let i = 0; i < results; i++) {
      const row = page.locator('[data-testid="search-result-row"]').nth(i);
      const industry = await row.locator('[data-col="業種"]').textContent();
      const amount = await row.locator('[data-col="成約金額"]').textContent();
      const stage = await row.locator('[data-col="営業段階"]').textContent();
      const month = await row.locator('[data-col="成約月"]').textContent();
      
      expect(industry).toContain('IT');
      expect(amount).toMatch(/100万円以上/);
      expect(stage).toContain('提案済み');
      expect(month).toContain('2024年1月');
    }
  });

  // SCEN-030
  test("[edge] 検索条件を入力せずに検索実行ボタンを押すと全事例が表示される", async ({ page }) => {
    await page.waitForSelector('button:has-text("検索実行")', { timeout: 5000 });
    
    const keywordInput = page.locator('input[placeholder*="キーワード"]');
    const caseClassifySelect = page.locator('select[name*="案件分類"]');
    const agreementSelect = page.locator('select[name*="成約区分"]');
    const periodInput = page.locator('input[placeholder*="期間"]');
    
    await expect(keywordInput).toHaveValue('');
    await expect(caseClassifySelect).toHaveValue('');
    await expect(agreementSelect).toHaveValue('');
    await expect(periodInput).toHaveValue('');
    
    await page.click('button:has-text("検索実行")');
    
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
    const results = await page.locator('[data-testid="search-result-row"]').count();
    
    expect(results).toBeGreaterThan(0);
    
    const sortIndicator = page.locator('[data-sort="created_at"]');
    await expect(sortIndicator).toContainText('↓');
    
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
    await expect(page.locator('[data-testid="filter-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="sort-button"]')).toBeVisible();
  });

  // SCEN-031
  test("[edge] 検索結果が0件のとき空表示メッセージが表示される", async ({ page }) => {
    await page.waitForSelector('input[placeholder*="営業担当者名"]', { timeout: 5000 });
    
    await page.fill('input[placeholder*="営業担当者名"]', '存在しない太郎');
    await page.click('button:has-text("検索")');
    
    await page.waitForSelector('[data-testid="empty-message"]', { timeout: 5000 });
    const emptyMessage = page.locator('[data-testid="empty-message"]');
    
    await expect(emptyMessage).toContainText('検索条件に合致する営業事例がありません');
    await expect(page.locator('[data-testid="search-results"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="pagination"]')).not.toBeVisible();
  });

  // SCEN-032
  test("[edge] 検索結果が複数件のとき全件が一覧に表示される", async ({ page }) => {
    await page.waitForSelector('select[name*="業種"]', { timeout: 5000 });
    
    await page.selectOption('select[name*="業種"]', 'IT');
    await page.fill('input[placeholder*="成約率"]', '80%以上');
    await page.click('button:has-text("検索")');
    
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
    const initialCount = await page.locator('[data-testid="search-result-row"]').count();
    expect(initialCount).toBeGreaterThan(0);
    
    const totalText = await page.locator('[data-testid="total-count"]').textContent();
    const totalCount = parseInt(totalText?.match(/\d+/)?.[0] || '0');
    
    let displayedCount = initialCount;
    while (await page.locator('[data-testid="pagination-next"]').isEnabled()) {
      await page.click('[data-testid="pagination-next"]');
      await page.waitForTimeout(500);
      displayedCount += await page.locator('[data-testid="search-result-row"]').count();
    }
    
    expect(displayedCount).toBe(totalCount);
  });

  // SCEN-054
  test("[normal] 営業プロセス分析レポートで生成されたAI分析結果の成功パターンが検索・参照できる", async ({ page }) => {
    await page.goto("/panels/scr-report-analysis.html");
    
    await page.waitForSelector('[data-testid="report-list"]', { timeout: 5000 });
    const completedReport = page.locator('[data-testid="report-row"]:has([data-status="完了"])').first();
    await completedReport.click();
    
    await page.waitForSelector('[data-testid="report-detail"]', { timeout: 5000 });
    const patternName = await page.locator('[data-testid="success-pattern-name"]').textContent();
    const relatedCases = await page.locator('[data-testid="related-case-count"]').textContent();
    const customerAttr = await page.locator('[data-testid="customer-attributes"]').textContent();
    const salesStage = await page.locator('[data-testid="sales-stage"]').textContent();
    
    const moveButton = page.locator('[data-testid="move-to-search-button"]');
    await moveButton.click();
    
    await page.waitForURL("/panels/scr-1785570831723.html", { timeout: 5000 });
    await page.waitForSelector('input[placeholder*="検索キーワード"]', { timeout: 5000 });
    
    await page.fill('input[placeholder*="検索キーワード"]', patternName || '');
    await page.click('button:has-text("検索実行")');
    
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
    const searchResults = await page.locator('[data-testid="search-result-row"]').count();
    
    expect(searchResults).toBeGreaterThan(0);
    
    const firstResult = page.locator('[data-testid="search-result-row"]').first();
    const resultPatternName = await firstResult.locator('[data-col="パターン名"]').textContent();
    const resultRelatedCases = await firstResult.locator('[data-col="関連事例数"]').textContent();
    const resultCustomerAttr = await firstResult.locator('[data-col="顧客属性"]').textContent();
    const resultSalesStage = await firstResult.locator('[data-col="営業段階"]').textContent();
    
    expect(resultPatternName).toEqual(patternName);
    expect(resultRelatedCases).toEqual(relatedCases);
    expect(resultCustomerAttr).toEqual(customerAttr);
    expect(resultSalesStage).toEqual(salesStage);
  });
});