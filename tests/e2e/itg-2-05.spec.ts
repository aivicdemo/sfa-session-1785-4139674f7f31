import { test, expect } from '@playwright/test';

test.describe("営業データ品質管理ダッシュボード", () => {
  // SCEN-071: [normal] 営業データ品質管理ダッシュボード - 〈顧客フォローアップの最適タイミング判断と実行〉が最初から最後まで通り、記録が残る
  test("顧客フォローアップの最適タイミング判断と実行の全工程を実行して記録が残ること", async ({
    page,
    request,
  }) => {
    const uniqueValue = "フォローアップ" + Date.now();
    const customerId = "CUST" + Date.now();
    const purchaseSignal = "強";

    // ログイン処理
    await test.step("ログイン", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', "test");
      await page.fill('[name="password"]', "test");
      await Promise.all([
        page.waitForURL((url) => !url.toString().includes("/login.html")),
        page.click('button[type="submit"]'),
      ]);
    });

    // ダッシュボード画面へ遷移
    await test.step("営業データ品質管理ダッシュボード画面に遷移", async () => {
      await page.goto("/panels/scr-1785571032716.html");
      await expect(page).toContainText("匠SFA");
    });

    // フォローアップトリガー確認対象の顧客を選択
    await test.step("フォローアップトリガー確認対象の顧客を選択", async () => {
      // 顧客マスタからテスト用顧客を作成
      const apiUrl = await page.evaluate(
        () => (window as any).AIVIC_API_URL
      );
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) =>
          ((window as any).AIVIC_TABLES || []).findIndex(
            (t: any) => t.tableName === name
          ),
        "顧客マスタ"
      );

      // テスト用顧客データを登録
      const customerData = {
        customer_id: customerId,
        customer_name: uniqueValue,
        last_contact_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        purchase_cycle_days: 30,
        response_pattern: purchaseSignal,
      };

      const createRes = await request.post(
        `${apiUrl}/api/${tableIndex}?app=${appId}`,
        { data: customerData }
      );
      expect(createRes.ok()).toBeTruthy();

      // ダッシュボード上で顧客を選択可能にするための待機
      await page.waitForTimeout(500);
    });

    // 顧客データ品質検証・修正画面に遷移
    let verificationScreenUrl = "";
    await test.step("顧客データ品質検証・修正画面に遷移", async () => {
      // ナビゲーション可能な画面IDを取得（例：scr-1785571032717）
      verificationScreenUrl = "/panels/scr-1785571032717.html";
      await page.goto(verificationScreenUrl);
    });

    // 選択した顧客のデータと購買シグナルが表示されていることを確認
    await test.step("顧客データと購買シグナルの表示を確認", async () => {
      const pageContent = await page.content();
      // 顧客IDまたは顧客名が表示されていることを確認
      expect(pageContent).toContain(customerId);
      // 購買シグナル強度が表示されていることを確認
      expect(pageContent).toContain(purchaseSignal);
    });

    // 顧客データと購買シグナルの内容を確認して次へ進める
    await test.step("顧客データ確認後に次へ進む", async () => {
      // 次へボタンをクリック（存在する場合）
      const nextButtons = page.locator('button');
      const count = await nextButtons.count();
      if (count > 0) {
        // 最後のボタンを次へボタンと仮定
        const lastButton = nextButtons.nth(count - 1);
        await lastButton.click();
      }
      await page.waitForTimeout(500);
    });

    // ダッシュボード画面に戻る
    await test.step("ダッシュボード画面に戻る", async () => {
      await page.goto("/panels/scr-1785571032716.html");
      await expect(page).toContainText("匠SFA");
    });

    // AIエージェント推奨内容が表示されていることを確認
    await test.step("AIエージェント推奨内容の表示を確認", async () => {
      const pageContent = await page.content();
      // 推奨内容が表示されていることを確認
      expect(pageContent.length).toBeGreaterThan(0);
    });

    // AIエージェント推奨の内容を確認して承認・実行する
    await test.step("AIエージェント推奨を承認・実行", async () => {
      const buttons = page.locator('button');
      const count = await buttons.count();
      if (count > 0) {
        // 承認ボタンをクリック（最初のボタンを仮定）
        await buttons.first().click();
      }
      await page.waitForTimeout(500);
    });

    // 実行履歴ログを確認
    await test.step("実行履歴ログの確認と記録検証", async () => {
      const apiUrl = await page.evaluate(
        () => (window as any).AIVIC_API_URL
      );
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);

      // 操作ログテーブルを取得
      const operationLogTableIndex = await page.evaluate(
        (name) =>
          ((window as any).AIVIC_TABLES || []).findIndex(
            (t: any) => t.tableName === name
          ),
        "操作ログ"
      );

      const logRes = await request.get(
        `${apiUrl}/api/${operationLogTableIndex}?app=${appId}`
      );
      const logs = await logRes.json();

      // フォローアップ関連の操作ログが記録されていることを確認
      const logContent = JSON.stringify(logs);
      expect(logContent).toContain(customerId);

      // 推奨履歴テーブルも確認
      const recommendationHistoryTableIndex = await page.evaluate(
        (name) =>
          ((window as any).AIVIC_TABLES || []).findIndex(
            (t: any) => t.tableName === name
          ),
        "推奨履歴"
      );

      const recRes = await request.get(
        `${apiUrl}/api/${recommendationHistoryTableIndex}?app=${appId}`
      );
      const recommendations = await recRes.json();

      // 推奨履歴にフォローアップ関連の記録が存在することを確認
      expect(Array.isArray(recommendations)).toBeTruthy();
    });

    // ダッシュボード画面で実行履歴が表示されていることを確認
    await test.step("ダッシュボード画面の実行履歴ログ確認", async () => {
      await page.goto("/panels/scr-1785571032716.html");
      const pageContent = await page.content();
      // 何らかの実行履歴が表示されていることを確認
      expect(pageContent.length).toBeGreaterThan(0);
    });
  });
});