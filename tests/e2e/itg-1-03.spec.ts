import { test, expect } from '@playwright/test';

test.describe("営業事例・成功パターン検索・学習", () => {
  // SCEN-079
  test("顧客フォローアップの最適タイミング判断と実行が最初から最後まで通り、記録が残る", async ({ page, request }) => {
    // ログイン
    await test.step("ログイン", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', 'test');
      await page.fill('[name="password"]', 'test');
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
    });

    // 営業プロセス監査ダッシュボードにアクセス
    await test.step("営業プロセス監査ダッシュボードにアクセス", async () => {
      await page.goto("/panels/scr-1785571032716.html");
      await expect(page.locator("text=匠SFA")).toBeVisible();
    });

    // AIエージェント推奨内容を確認
    await test.step("AIエージェント推奨内容を確認", async () => {
      const recommendationContent = await page.locator('[data-aivic-recommendation]').textContent();
      expect(recommendationContent).toBeTruthy();
    });

    // 営業事例・成功パターン検索・学習画面に遷移
    await test.step("営業事例・成功パターン検索・学習画面に遷移", async () => {
      await page.goto("/panels/scr-1785570831723.html");
      await expect(page.locator("text=匠SFA")).toBeVisible();
    });

    // AIエージェント推奨の内容が引き継がれていることを確認
    await test.step("AIエージェント推奨の内容が引き継がれていることを確認", async () => {
      const inheritedContent = await page.locator('[data-aivic-inherited]').textContent();
      expect(inheritedContent).toBeTruthy();
    });

    // 過去成功パターンマトリクスを参照
    const patternValue = "パターン" + Date.now();
    await test.step("過去成功パターンマトリクスを参照", async () => {
      await page.fill('[data-aivic-pattern-search]', patternValue);
      await page.click('[data-aivic-pattern-search-button]');
      await expect(page.locator(`text=${patternValue}`)).toBeVisible();
    });

    // 成功パターンの詳細情報を記録
    await test.step("成功パターンの詳細情報を記録", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "成功パターン",
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      expect(res.ok()).toBeTruthy();
    });

    // 最適アクション時期と提案内容を入力
    const actionValue = "アクション" + Date.now();
    await test.step("最適アクション時期と提案内容を入力", async () => {
      await page.fill('[data-aivic-action-timing]', actionValue);
      await page.fill('[data-aivic-proposal-content]', "提案内容");
      await page.click('[data-aivic-action-confirm]');
      await expect(page.locator('[data-aivic-action-status]')).toContainText("確定");
    });

    // 顧客へのフォローアップを実行
    const followupValue = "フォローアップ" + Date.now();
    await test.step("顧客へのフォローアップを実行", async () => {
      await page.fill('[data-aivic-followup-content]', followupValue);
      await page.click('[data-aivic-followup-execute]');
      await expect(page.locator('[data-aivic-followup-status]')).toContainText("実行完了");
    });

    // フォローアップ結果と顧客反応を記録
    const responseValue = "反応" + Date.now();
    await test.step("フォローアップ結果と顧客反応を記録", async () => {
      await page.fill('[data-aivic-customer-response]', responseValue);
      await page.click('[data-aivic-response-confirm]');
      await expect(page.locator('[data-aivic-response-status]')).toContainText("確定");
    });

    // 営業プロセス分析レポート生成・確認画面に遷移
    await test.step("営業プロセス分析レポート生成・確認画面に遷移", async () => {
      await page.goto("/panels/scr-1785570831724.html");
      await expect(page.locator("text=匠SFA")).toBeVisible();
    });

    // レポートが生成されていることを確認
    await test.step("レポートが生成されていることを確認", async () => {
      const reportContent = await page.locator('[data-aivic-report-content]').textContent();
      expect(reportContent).toContain(actionValue);
      expect(reportContent).toContain(followupValue);
      expect(reportContent).toContain(responseValue);
    });

    // レポートをダウンロード
    await test.step("レポートをダウンロード", async () => {
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-aivic-report-download]');
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('report');
    });

    // 記録の確認
    await test.step("記録の確認", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "営業活動ログ",
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();
      
      expect(JSON.stringify(rows)).toContain(actionValue);
      expect(JSON.stringify(rows)).toContain(followupValue);
      expect(JSON.stringify(rows)).toContain(responseValue);
    });

    // 営業プロセス実行状況の確認
    await test.step("営業プロセス実行状況の確認", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "営業プロセス実行状況",
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();
      
      expect(rows.length).toBeGreaterThan(0);
    });
  });
});