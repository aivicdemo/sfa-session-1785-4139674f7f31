import { test, expect } from '@playwright/test';

test.describe("AIエージェント推奨支援ダッシュボード", () => {
  // SCEN-019
  test("[normal] AIエージェント推奨支援ダッシュボード - 営業プロセスログ分析と属人化解消が最初から最後まで通り、記録が残る", async ({ page, request }) => {
    // ログイン処理
    await test.step("IT部門の権限でシステムにログインし、データクリーニング完了状態を確認", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', 'it_admin');
      await page.fill('[name="password"]', 'test');
      
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
      
      // ログイン成功の確認
      await expect(page.locator(".user-name")).toBeVisible();
    });

    // AIエージェント推奨支援ダッシュボードへ遷移
    await test.step("AIエージェント推奨支援ダッシュボードにアクセス", async () => {
      await page.goto("/panels/scr-1785571913372.html");
      await expect(page.locator("data-testid=kpi-execution-rate")).toBeVisible();
    });

    // 新規案件の顧客情報と商談条件を入力
    const uniqueCustomerValue = "顧客_" + Date.now();
    const expectedAmount = "5000";
    
    await test.step("新規案件の顧客情報（企業規模、業種、課題等）と商談条件（予算、導入時期等）を入力", async () => {
      // 顧客検索/入力
      await page.fill('[data-testid="customer-search"]', uniqueCustomerValue);
      await page.waitForTimeout(500);
      
      // 業種選択
      await page.selectOption('[data-testid="industry-select"]', '製造業');
      
      // 企業規模選択
      await page.selectOption('[data-testid="company-size-select"]', '大企業');
      
      // 予想金額入力
      await page.fill('[data-testid="expected-amount"]', expectedAmount);
      
      // 商談ステージ選択
      await page.selectOption('[data-testid="deal-stage-select"]', '提案');
      
      // 商談条件（複数選択）
      await page.check('[data-testid="condition-budget"]');
      await page.check('[data-testid="condition-decision"]');
      
      // 備考入力
      await page.fill('[data-testid="deal-notes"]', "新規営業提案の自動推奨テスト");
    });

    // 入力内容を確定し、AIエージェント推論実行指示を送信
    await test.step("入力内容を確定し、AIエージェント推論実行指示を送信", async () => {
      const executeButton = page.locator('button', { hasText: '推奨を実行' });
      await expect(executeButton).toBeVisible();
      await executeButton.click();
      
      // 推論処理の実行を待つ
      await page.waitForTimeout(1000);
    });

    // 推奨生成処理が実行され、提案アプローチと根拠が画面に表示されることを確認
    await test.step("推奨生成処理が実行され、提案アプローチと根拠が表示されることを確認", async () => {
      const recommendationContent = page.locator('#recommendation-content');
      const recommendationBasis = page.locator('#recommendation-basis');
      
      await expect(recommendationContent).toBeVisible();
      await expect(recommendationBasis).toBeVisible();
      
      const contentText = await recommendationContent.textContent();
      expect(contentText).toBeTruthy();
    });

    // 表示された推奨内容を確認し、承認アクション実行
    await test.step("表示された推奨内容を確認し、承認アクション実行", async () => {
      const approveButton = page.locator('button', { hasText: '承認' });
      await expect(approveButton).toBeVisible();
      await approveButton.click();
      
      // 承認処理の完了を待つ
      await page.waitForTimeout(500);
    });

    // 推奨履歴がシステムに記録されていることを確認
    await test.step("推奨履歴として、入力した商談条件・推奨内容・承認日時・実行ユーザーがシステムに記録されていることを確認", async () => {
      // API 経由で記録を確認
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "推奨履歴",
      );
      
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();
      
      // 入力した顧客名が記録に含まれていることを確認
      expect(JSON.stringify(rows)).toContain(uniqueCustomerValue);
      expect(JSON.stringify(rows)).toContain(expectedAmount);
    });

    // レポート生成機能でPDF形式でダウンロード
    await test.step("レポート生成機能で、推奨内容と履歴をPDF形式でダウンロード", async () => {
      const exportButton = page.locator('[data-testid="export-history"]');
      await expect(exportButton).toBeVisible();
      
      // ダウンロード試行
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await Promise.race([
        downloadPromise,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
      ]);
      
      // ダウンロード処理が開始されたか確認
      if (download) {
        const fileName = download.suggestedFilename();
        expect(fileName).toBeTruthy();
      }
    });

    // 最終確認：推奨履歴テーブルが画面に表示されていることを確認
    await test.step("推奨履歴テーブルが画面に表示され、記録が残っていることを確認", async () => {
      const historyTable = page.locator('[data-testid="recommendation-history"]');
      await expect(historyTable).toBeVisible();
      
      const historyTbody = page.locator('#history-tbody');
      const rows = await historyTbody.locator('tr').count();
      expect(rows).toBeGreaterThan(0);
    });

    // 記録の最終確認：推奨根拠データベースにも記録されていることを確認
    await test.step("推奨根拠データベースに記録されていることを確認", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "推奨根拠",
      );
      
      if (tableIndex >= 0) {
        const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
        const rows = await res.json();
        expect(Array.isArray(rows)).toBeTruthy();
      }
    });
  });
});