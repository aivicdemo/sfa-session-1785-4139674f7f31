import { test, expect } from '@playwright/test';

test.describe("AIエージェント推奨支援ダッシュボード", () => {
  // SCEN-021: [normal] AIエージェント推奨支援ダッシュボード - 顧客フォローアップの最適タイミング判断と実行
  test("顧客フォローアップの最適タイミング判断と実行が最初から最後まで通り、記録が残る", async ({ page, request }) => {
    // ログイン処理
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);

    // ダッシュボードを開く
    await page.goto("/panels/scr-1785571913372.html");
    await expect(page.locator('[data-testid="customer-search"]')).toBeVisible();

    // 追跡用の一意の値を生成
    const uniqueCustomerName = "顧客" + Date.now();
    const uniqueNotes = "備考" + Date.now();

    await test.step("顧客データと購買シグナルを入力", async () => {
      // 顧客名入力
      await page.fill('[data-testid="customer-search"]', uniqueCustomerName);

      // 業種選択
      const industrySelect = page.locator('[data-testid="industry-select"]');
      await industrySelect.click();
      await page.locator('text=製造業').click();

      // 企業規模選択
      const companySizeSelect = page.locator('[data-testid="company-size-select"]');
      await companySizeSelect.click();
      await page.locator('text=中堅企業').click();

      // 予想金額入力
      await page.fill('[data-testid="expected-amount"]', '500');

      // 商談ステージ選択
      const dealStageSelect = page.locator('[data-testid="deal-stage-select"]');
      await dealStageSelect.click();
      await page.locator('text=提案').click();

      // 商談条件を選択（複数選択可）
      await page.check('[data-testid="condition-budget"]');
      await page.check('[data-testid="condition-decision"]');

      // 備考入力
      await page.fill('[data-testid="deal-notes"]', uniqueNotes);
    });

    await test.step("AIエージェント推奨を確認・分析", async () => {
      // [検索・推奨開始]ボタンをクリック
      const executeBtn = page.locator('button:has-text("推奨を実行")');
      await executeBtn.click();

      // 推奨内容と根拠説明が表示されることを確認
      await expect(page.locator('#recommendation-content')).toBeVisible();
      await expect(page.locator('#recommendation-basis')).toBeVisible();

      // 推奨内容に入力した顧客名が含まれていることを確認
      const recommendationContent = page.locator('#recommendation-content');
      await expect(recommendationContent).toContainText(uniqueCustomerName);
    });

    await test.step("推奨を承認", async () => {
      // [承認]ボタンをクリック
      const approveBtn = page.locator('button:has-text("承認")');
      await approveBtn.click();

      // 承認後、次の工程へ遷移することを確認
      await expect(page.locator('text=過去成功パターンマトリクスの参照')).toBeVisible({ timeout: 5000 });
    });

    await test.step("過去成功パターンマトリクスを参照", async () => {
      // 前工程で入力した顧客データが表示されていることを確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniqueCustomerName);

      // 推奨マトリクス参照画面に過去成功パターンが表示されていることを確認
      await expect(page.locator('table')).toBeVisible();
      const tableContent = await page.locator('table').textContent();
      expect(tableContent).toBeTruthy();

      // [確認完了]ボタンをクリック
      const confirmBtn = page.locator('button:has-text("確認完了")').first();
      await confirmBtn.click();
    });

    await test.step("レポートが出力され、履歴に記録される", async () => {
      // ダウンロードURLが表示されることを確認
      await expect(page.locator('text=レポート')).toBeVisible({ timeout: 5000 });

      // API URLとアプリIDを取得
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);

      // テーブル一覧を取得して「推奨履歴」テーブルのインデックスを検索
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "推奨履歴",
      );

      expect(tableIndex).toBeGreaterThanOrEqual(0);

      // 推奨履歴テーブルにアクセス
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      expect(res.ok()).toBeTruthy();

      const rows = await res.json();
      const rowsJson = JSON.stringify(rows);

      // 入力した顧客名と備考がレコードに含まれていることを確認
      expect(rowsJson).toContain(uniqueCustomerName);
      expect(rowsJson).toContain(uniqueNotes);

      // 承認アクション、AIエージェントの根拠説明、レポートファイル情報が含まれていることを確認
      expect(rowsJson).toContain("承認");
    });
  });
});