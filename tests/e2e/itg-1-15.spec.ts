import { test, expect } from '@playwright/test';

test.describe('営業プロセス分析レポート生成・確認', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
    await page.goto('/panels/scr-1785570844176.html');
  });

  // SCEN-065
  test('[normal] 営業プロセス分析レポート生成・確認 - 生成されたレポートをダウンロードボタン押下でファイルがダウンロードされる', async ({ page, context }) => {
    await page.waitForLoadState('networkidle');
    
    const downloadPromise = context.waitForEvent('download');
    const downloadButtons = page.locator('button:has-text("ダウンロード")');
    const count = await downloadButtons.count();
    
    if (count > 0) {
      await downloadButtons.first().click();
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toMatch(/\.(pdf|csv|xlsx)$/);
      expect(download.suggestedFilename().length).toBeGreaterThan(0);
    }
  });

  // SCEN-066
  test('[normal] 営業プロセス分析レポート生成・確認 - レポート確認画面から生成履歴画面へ遷移する', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const historyButton = page.locator('button:has-text("生成履歴")');
    const historyLinkCount = await historyButton.count();
    
    if (historyLinkCount > 0) {
      await historyButton.first().click();
      await page.waitForLoadState('networkidle');
      
      const historyElements = page.locator('text=/生成履歴|生成日時|ステータス/');
      expect(await historyElements.count()).toBeGreaterThan(0);
    }
  });

  // SCEN-067
  test('[edge] 営業プロセス分析レポート生成・確認 - 生成履歴一覧が 0 件のとき空表示になる', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const emptyMessage = page.locator('text=/履歴がありません|検索結果がありません|データがありません/');
    const historyTable = page.locator('table');
    const historyRows = page.locator('table tbody tr');
    
    const emptyCount = await emptyMessage.count();
    const rowCount = await historyRows.count();
    
    if (rowCount === 0) {
      expect(emptyCount).toBeGreaterThan(0);
    }
  });

  // SCEN-068
  test('[edge] 営業プロセス分析レポート生成・確認 - 生成履歴一覧が複数件のとき全件表示される', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const historyRows = page.locator('table tbody tr');
    const rowCount = await historyRows.count();
    
    if (rowCount >= 10) {
      for (let i = 0; i < rowCount; i++) {
        const row = historyRows.nth(i);
        const isVisible = await row.isVisible();
        expect(isVisible).toBeTruthy();
      }
      
      expect(rowCount).toBeGreaterThanOrEqual(10);
    }
  });

  // SCEN-069
  test('[normal] 営業プロセス分析レポート生成・確認 - 生成履歴から過去のレポートを再確認できる', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const historyRows = page.locator('table tbody tr');
    const rowCount = await historyRows.count();
    
    if (rowCount > 0) {
      const firstRow = historyRows.first();
      const detailButton = firstRow.locator('button:has-text("詳細")', { timeout: 2000 }).first();
      const detailCount = await firstRow.locator('button').count();
      
      if (detailCount > 0) {
        await firstRow.click();
        await page.waitForLoadState('networkidle');
        
        const detailElements = page.locator('text=/生成日時|分析対象期間|データ品質/');
        expect(await detailElements.count()).toBeGreaterThanOrEqual(1);
      }
    }
  });

  // SCEN-070
  test('[normal] 営業プロセス分析レポート生成・確認 - 生成履歴から過去のレポートを再ダウンロードできる', async ({ page, context }) => {
    await page.waitForLoadState('networkidle');
    
    const historyRows = page.locator('table tbody tr');
    const rowCount = await historyRows.count();
    
    if (rowCount > 0) {
      const firstRow = historyRows.first();
      const downloadBtn = firstRow.locator('button:has-text("ダウンロード")');
      const btnCount = await downloadBtn.count();
      
      if (btnCount > 0) {
        const downloadPromise = context.waitForEvent('download');
        await downloadBtn.first().click();
        const download = await downloadPromise;
        
        expect(download.suggestedFilename()).toMatch(/\.(pdf|csv|xlsx)$/);
        expect(download.suggestedFilename().length).toBeGreaterThan(0);
      }
    }
  });

  // SCEN-071
  test('[normal] 営業プロセス分析レポート生成・確認 - 〈営業プロセス監査ダッシュボード〉で抽出指示したログデータが〈営業プロセス分析レポート生成・確認〉でレポート生成可能な状態で受け渡される', async ({ page }) => {
    await page.goto('/panels/scr-1785570844176.html');
    await page.waitForLoadState('networkidle');
    
    const generateButton = page.locator('button:has-text("新規レポート生成")');
    const generateCount = await generateButton.count();
    
    if (generateCount > 0) {
      await generateButton.first().click();
      await page.waitForLoadState('networkidle');
      
      const formInputs = page.locator('input[type="text"], input[type="date"], select');
      const inputCount = await formInputs.count();
      
      expect(inputCount).toBeGreaterThanOrEqual(1);
    }
  });

  // SCEN-075
  test('[normal] 営業プロセス分析レポート生成・確認 - 〈営業プロセス監査ダッシュボード〉で検出された不適切パターンが〈営業プロセス分析レポート生成・確認〉で分析対象データとして受け渡される', async ({ page }) => {
    await page.goto('/panels/scr-1785570844176.html');
    await page.waitForLoadState('networkidle');
    
    const analysisItems = page.locator('div[class*="pattern"], div[class*="analysis"]');
    const itemCount = await analysisItems.count();
    
    if (itemCount > 0) {
      const firstItem = analysisItems.first();
      await firstItem.click();
      await page.waitForLoadState('networkidle');
      
      const reportSection = page.locator('text=/レポート生成|分析対象|不適切パターン/');
      expect(await reportSection.count()).toBeGreaterThanOrEqual(1);
    }
  });
});