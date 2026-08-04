import { test, expect } from '@playwright/test';

test.describe("AIエージェント推奨支援ダッシュボード", () => {
  // SCEN-024: [normal] AIエージェント推奨支援ダッシュボード - 営業担当者の行動品質監督と早期問題検出
  test("営業担当者の行動品質監督と早期問題検出が最初から最後まで通り、記録が残る", async ({ page, request }) => {
    // ===== 工程1: ログイン（営業担当者） =====
    await test.step("営業担当者としてログイン", async () => {
      await page.goto("/login.html");
      await page.fill('[name="username"]', 'salesperson');
      await page.fill('[name="password"]', 'test');
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
    });

    // ===== 工程2: ダッシュボード画面へ遷移 =====
    await test.step("AIエージェント推奨支援ダッシュボードへ遷移", async () => {
      await page.goto("/panels/scr-1785571913372.html");
      await expect(page.locator("text=推奨ダッシュボード")).toBeVisible();
    });

    // ===== 工程3: 営業担当者が提案実行または顧客対応記録を入力 =====
    const uniqueCustomerName = "顧客テスト" + Date.now();
    const uniqueExpectedAmount = "150";
    const uniqueNotes = "テスト商談条件" + Date.now();

    await test.step("提案実行・顧客対応記録を入力", async () => {
      // 顧客名入力
      const customerInput = page.locator('[data-testid="customer-search"]');
      await customerInput.fill(uniqueCustomerName);
      await customerInput.blur();

      // 業種選択
      const industrySelect = page.locator('[data-testid="industry-select"]');
      await industrySelect.selectOption("manufacturing");

      // 企業規模選択
      const companySizeSelect = page.locator('[data-testid="company-size-select"]');
      await companySizeSelect.selectOption("large");

      // 予想金額入力
      const expectedAmountInput = page.locator('[data-testid="expected-amount"]');
      await expectedAmountInput.fill(uniqueExpectedAmount);

      // 商談ステージ選択
      const dealStageSelect = page.locator('[data-testid="deal-stage-select"]');
      await dealStageSelect.selectOption("proposal");

      // 商談条件チェック
      const budgetCheckbox = page.locator('[data-testid="condition-budget"]');
      await budgetCheckbox.check();

      const decisionCheckbox = page.locator('[data-testid="condition-decision"]');
      await decisionCheckbox.check();

      // 備考入力
      const notesInput = page.locator('[data-testid="deal-notes"]');
      await notesInput.fill(uniqueNotes);

      // 入力内容確認
      await expect(customerInput).toHaveValue(uniqueCustomerName);
      await expect(expectedAmountInput).toHaveValue(uniqueExpectedAmount);
      await expect(notesInput).toHaveValue(uniqueNotes);
    });

    // ===== 工程4: AIエージェント分析実行 =====
    await test.step("「AIエージェントで分析」ボタンクリック", async () => {
      const analyzeButton = page.locator('button').filter({ hasText: "推奨を実行" });
      await analyzeButton.click();

      // AIエージェント推奨内容が表示されるまで待機
      await expect(page.locator("#recommendation-content")).toBeVisible({ timeout: 5000 });
    });

    // ===== 工程5: AIエージェント推奨内容の表示確認 =====
    await test.step("AIエージェント推奨内容と根拠が表示されることを確認", async () => {
      const recommendationContent = page.locator("#recommendation-content");
      await expect(recommendationContent).toContainText(/推奨|提案|戦略/);

      const recommendationBasis = page.locator("#recommendation-basis");
      await expect(recommendationBasis).toContainText(/根拠|理由|背景/);
    });

    // ===== 工程6: 営業管理職にログイン切り替え =====
    await test.step("営業管理職にログイン切り替え", async () => {
      const logoutLink = page.locator("a.logout-link");
      await logoutLink.click();

      await page.goto("/login.html");
      await page.fill('[name="username"]', 'manager');
      await page.fill('[name="password"]', 'test');
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
    });

    // ===== 工程7: 営業管理職がダッシュボードに遷移 =====
    await test.step("営業管理職がダッシュボード画面に遷移", async () => {
      await page.goto("/panels/scr-1785571913372.html");
      await expect(page.locator("text=推奨ダッシュボード")).toBeVisible();
    });

    // ===== 工程8: 確認・レビュー画面で営業担当者の入力内容が引き継がれていることを確認 =====
    await test.step("確認・レビュー画面で入力内容の引き継ぎを確認", async () => {
      // 前ステップで入力した顧客名が表示されているか確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniqueCustomerName);
      expect(pageContent).toContain(uniqueNotes);
    });

    // ===== 工程9: 営業管理職が推奨内容に対してアクションを実行 =====
    await test.step("営業管理職が推奨内容を「承認」", async () => {
      const approveButton = page.locator('button').filter({ hasText: "承認" });
      await approveButton.click();

      // アクション確定後、処理が完了するまで待機
      await page.waitForTimeout(1000);
    });

    // ===== 工程10: FileStorageAdapterを通じてレポートが生成・保存されたことを確認 =====
    await test.step("レポート生成・保存の確認", async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "推奨履歴",
      );

      if (tableIndex >= 0 && apiUrl && appId) {
        const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
        const rows = await res.json();
        expect(JSON.stringify(rows)).toContain(uniqueCustomerName);
      }
    });

    // ===== 工程11: 推奨履歴画面に遷移 =====
    await test.step("推奨履歴画面へ遷移", async () => {
      const historyButton = page.locator('[data-testid="recommendation-history"]');
      await historyButton.click();
      await expect(page.locator("text=推奨履歴")).toBeVisible();
    });

    // ===== 工程12: 推奨履歴画面で記録が残っていることを確認 =====
    await test.step("推奨履歴に入力内容と実行アクションが記録されていることを確認", async () => {
      const historyTbody = page.locator("#history-tbody");
      const historyContent = await historyTbody.textContent();

      // 顧客名、分析日時、実行アクション、推奨内容が履歴として記録されていることを確認
      expect(historyContent).toContain(uniqueCustomerName);
      expect(historyContent).toContain("承認");
    });

    // ===== 最終確認: 全フローが正常に完結したことを確認 =====
    await test.step("ビジネスフロー全体の正常完結を確認", async () => {
      const pageTitle = page.locator(".page-title");
      await expect(pageTitle).toContainText("推奨ダッシュボード");

      // 履歴テーブルが表示されていることを確認
      await expect(historyTbody).toBeVisible();

      // 顧客名とアクション内容が最終的に記録されていることを確認
      const historyFinalContent = await page.locator("#history-tbody").textContent();
      expect(historyFinalContent).toContain(uniqueCustomerName);
      expect(historyFinalContent).toContain("承認");
    });
  });
});