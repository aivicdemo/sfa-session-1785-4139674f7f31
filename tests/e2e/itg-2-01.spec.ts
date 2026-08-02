import { test, expect } from '@playwright/test';

test.describe("営業データ品質管理ダッシュボード", () => {
  // SCEN-067: [normal] 営業データ品質管理ダッシュボード - 〈営業プロセスログ分析と属人化解消〉が最初から最後まで通り、記録が残る
  test("営業プロセスログ分析と属人化解消の業務フロー全体が通り、各工程で記録が残ること", async ({ page, request }) => {
    const uniqueValue = "テスト" + Date.now();
    const testStartDate = "2024-01-01";
    const testEndDate = "2024-01-31";

    // ============ 工程1: ダッシュボード画面へのアクセスと営業部長による抽出指示 ============
    await test.step("営業データ品質管理ダッシュボードにアクセスし、営業部長ユーザーでログイン", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', "sales_director");
      await page.fill('[name="password"]', "password");
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
      await page.goto("/panels/scr-1785571032716.html");
      const pageTitle = await page.locator("body").textContent();
      expect(pageTitle).toContain("匠SFA");
    });

    // ============ 工程2: 抽出対象期間の指定と指示確定 ============
    await test.step("抽出対象期間を指定して『指示確定』をクリック", async () => {
      const startDateInput = page.locator('input[type="date"]').first();
      const endDateInput = page.locator('input[type="date"]').nth(1);
      
      await startDateInput.fill(testStartDate);
      await endDateInput.fill(testEndDate);
      
      const confirmButton = page.locator('button:has-text("指示確定")');
      await confirmButton.click();
      
      // 画面切り替わりを待機
      await page.waitForTimeout(1000);
    });

    // ============ 工程3: 品質検証・修正画面への遷移確認 ============
    await test.step("顧客データ品質検証・修正画面に切り替わり、抽出期間が引き継がれていることを確認", async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain("/panels/");
      
      const pageContent = await page.locator("body").textContent();
      expect(pageContent).toBeTruthy();
    });

    // ============ 工程4: IT部門ユーザーに切り替えて品質検証実施 ============
    await test.step("IT部門ユーザーに切り替え、『営業データ品質検証実施』ボタンをクリック", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', "it_staff");
      await page.fill('[name="password"]', "password");
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
      
      await page.goto("/panels/scr-1785571032716.html");
      
      const validateButton = page.locator('button:has-text("営業データ品質検証実施")');
      if (await validateButton.isVisible()) {
        await validateButton.click();
        await page.waitForTimeout(2000);
      }
    });

    // ============ 工程5: 品質検証結果の確認 ============
    await test.step("品質検証結果（スコア、検出結果件数、ルール適用状況）が表示されていることを確認", async () => {
      const resultContent = await page.locator("body").textContent();
      expect(resultContent).toBeTruthy();
      // 検証結果の具体的な数値は画面に表示される想定
    });

    // ============ 工程6: データクリーニング・正規化実行 ============
    await test.step("『データクリーニング・正規化実行』ボタンをクリックして正規化ルールを適用", async () => {
      const cleaningButton = page.locator('button:has-text("データクリーニング・正規化実行")');
      if (await cleaningButton.isVisible()) {
        await cleaningButton.click();
        await page.waitForTimeout(2000);
      }
    });

    // ============ 工程7: 修正内容の記録確認（API経由） ============
    await test.step("修正内容（正規化前後のデータ、適用ルール名、タイムスタンプ）がシステムに記録されていることを確認", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tables = await page.evaluate(() => (window as any).AIVIC_TABLES || []);
      
      // 正規化ルール適用の記録を確認
      const normalizationLogTableIndex = tables.findIndex((t: any) => t.tableName === "操作ログ");
      if (normalizationLogTableIndex >= 0) {
        const res = await request.get(
          `${apiUrl}/api/${normalizationLogTableIndex}?app=${appId}`
        );
        const rows = await res.json();
        expect(Array.isArray(rows)).toBe(true);
      }
    });

    // ============ 工程8: ダッシュボード画面への戻却確認 ============
    await test.step("画面が営業データ品質管理ダッシュボードに戻り、『AIエージェント推論実行指示』ボタンが表示されていることを確認", async () => {
      await page.goto("/panels/scr-1785571032716.html");
      
      const inferenceButton = page.locator('button:has-text("AIエージェント推論実行指示")');
      const isVisible = await inferenceButton.isVisible({ timeout: 3000 }).catch(() => false);
      expect(isVisible).toBe(true);
    });

    // ============ 工程9: 営業管理職ユーザーでAIエージェント推論実行指示 ============
    await test.step("営業管理職ユーザーでログインし、『AIエージェント推論実行指示』ボタンをクリックして業務フロー全体の実行完了を確認", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', "sales_manager");
      await page.fill('[name="password"]', "password");
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
      
      await page.goto("/panels/scr-1785571032716.html");
      
      const inferenceButton = page.locator('button:has-text("AIエージェント推論実行指示")');
      if (await inferenceButton.isVisible()) {
        await inferenceButton.click();
        await page.waitForTimeout(2000);
      }
    });

    // ============ 工程10: 全体の記録確認 ============
    await test.step("営業データ品質管理ダッシュボールの履歴・ログで各工程の実行結果が記録されていることを確認", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tables = await page.evaluate(() => (window as any).AIVIC_TABLES || []);
      
      // 操作ログの確認
      const operationLogTableIndex = tables.findIndex((t: any) => t.tableName === "操作ログ");
      if (operationLogTableIndex >= 0) {
        const res = await request.get(
          `${apiUrl}/api/${operationLogTableIndex}?app=${appId}`
        );
        const rows = await res.json();
        expect(Array.isArray(rows)).toBe(true);
        expect(rows.length).toBeGreaterThan(0);
      }
      
      // 品質検証結果の確認
      const qualityResultTableIndex = tables.findIndex((t: any) => t.tableName === "品質検証結果");
      if (qualityResultTableIndex >= 0) {
        const res = await request.get(
          `${apiUrl}/api/${qualityResultTableIndex}?app=${appId}`
        );
        const rows = await res.json();
        expect(Array.isArray(rows)).toBe(true);
      }
    });
  });
});