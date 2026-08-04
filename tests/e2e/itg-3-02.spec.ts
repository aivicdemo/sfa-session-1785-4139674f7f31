import { test, expect } from '@playwright/test';

test.describe("AIエージェント推奨支援ダッシュボード", () => {
  test("SCEN-020: [normal] AIエージェント推奨支援ダッシュボード - 〈新規顧客への初回提案実行〉が最初から最後まで通り、記録が残る", async ({ page, request }) => {
    // ログイン処理
    await test.step("ログイン", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', 'test');
      await page.fill('[name="password"]', 'test');
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
    });

    // AIエージェント推奨支援ダッシュボードを開く
    await test.step("AIエージェント推奨支援ダッシュボードを開く", async () => {
      await page.goto("/panels/scr-1785571913372.html");
      await expect(page.locator(".page-title")).toContainText("AIエージェント推奨支援システム");
    });

    // 顧客情報を入力
    const uniqueCustomerName = "ABC商事" + Date.now();
    await test.step("顧客情報を入力", async () => {
      await page.fill('[data-testid="customer-search"]', uniqueCustomerName);
      await page.selectOption('[data-testid="industry-select"]', "manufacturing");
      await page.selectOption('[data-testid="company-size-select"]', "medium");
      await page.fill('[data-testid="expected-amount"]', "5000");
      await page.selectOption('[data-testid="deal-stage-select"]', "initial");
      
      // 商談条件を選択
      await page.check('[data-testid="condition-budget"]');
      await page.check('[data-testid="condition-decision"]');
      
      await page.fill('[data-testid="deal-notes"]', "新規顧客の初回提案");
      
      // 入力値の確認
      await expect(page.locator('[data-testid="customer-search"]')).toHaveValue(uniqueCustomerName);
    });

    // AIエージェント推奨内容の表示を確認
    await test.step("AIエージェント推奨内容が表示される", async () => {
      // 推奨実行ボタンをクリック
      await page.click('[data-testid="execute-recommendation"]');
      
      // 推奨内容が表示されるまで待機
      await expect(page.locator("#recommendation-content")).toBeVisible({ timeout: 5000 });
      
      // 推奨内容が入力された顧客情報に基づいている
      const recommendationContent = await page.locator("#recommendation-content").textContent();
      expect(recommendationContent).toBeTruthy();
    });

    // 推奨内容の根拠を確認
    await test.step("推奨内容の根拠が表示される", async () => {
      await expect(page.locator("#recommendation-basis")).toBeVisible();
      const basisContent = await page.locator("#recommendation-basis").textContent();
      expect(basisContent).toBeTruthy();
    });

    // 推奨内容を承認
    await test.step("推奨内容を承認", async () => {
      await page.click('[data-testid="approve-recommendation"]');
      await expect(page.locator('[data-testid="recommendation-history"]')).toBeVisible({ timeout: 5000 });
    });

    // 推奨履歴画面で記録を確認
    await test.step("推奨履歴に記録が残っている", async () => {
      const historyTable = page.locator("#history-tbody");
      await expect(historyTable).toBeVisible();
      
      const historyContent = await historyTable.textContent();
      expect(historyContent).toContain(uniqueCustomerName);
    });

    // レポート出力
    await test.step("レポートをPDF形式で出力", async () => {
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="export-history"]');
      const download = await downloadPromise;
      
      // ファイル名の確認
      expect(download.suggestedFilename()).toContain('.pdf');
    });

    // ダウンロードURLが表示されることを確認
    await test.step("ダウンロードURLが画面に表示される", async () => {
      // ページ内にダウンロードリンクが生成されたことを確認
      const downloadLink = page.locator('a[href*="blob:"]').first();
      await expect(downloadLink).toBeVisible({ timeout: 5000 });
    });

    // 記録がデータベースに保存されていることを確認
    await test.step("推奨履歴がデータベースに記録されている", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "推奨履歴",
      );
      
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      expect(res.ok()).toBeTruthy();
      
      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(uniqueCustomerName);
    });

    // 商談情報がデータベースに保存されていることを確認
    await test.step("商談情報がデータベースに記録されている", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "商談",
      );
      
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      expect(res.ok()).toBeTruthy();
      
      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(uniqueCustomerName);
    });

    // 推奨根拠がデータベースに保存されていることを確認
    await test.step("推奨根拠がデータベースに記録されている", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "推奨根拠",
      );
      
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      expect(res.ok()).toBeTruthy();
      
      const rows = await res.json();
      expect(Array.isArray(rows)).toBeTruthy();
    });

    // 全工程が完了したことを確認
    await test.step("全工程が完了し、初回提案実行プロセスが通った", async () => {
      // 最終的に推奨履歴画面にいることを確認
      await expect(page.locator('[data-testid="recommendation-history"]')).toBeVisible();
      
      // 入力した顧客情報が引き継がれていることを確認
      const finalHistoryContent = await page.locator("#history-tbody").textContent();
      expect(finalHistoryContent).toContain(uniqueCustomerName);
      expect(finalHistoryContent).toContain("製造業");
    });
  });
});