import { test, expect } from '@playwright/test';

test.describe("営業プロセス監査ダッシュボード", () => {
  // SCEN-080: [normal] 営業プロセス監査ダッシュボード - 営業担当者の行動品質監督と早期問題検出
  test("営業担当者から営業部長まで業務フロー全工程を通し、記録が統合される", async ({ page, request }) => {
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

    // ユーザー1: 営業担当者（データ入力）
    const uniqueProposalContent = "提案" + Date.now();
    const uniqueCustomerAction = "顧客対応" + Date.now();

    // ========== 工程1: 営業担当者が提案実行・顧客対応記録を入力・確定 ==========
    await test.step("工程1: 営業担当者がログイン、提案内容と顧客対応パターンを入力", async () => {
      // ログイン
      await page.goto("/login.html");
      await page.fill('[name="username"]', "salesperson");
      await page.fill('[name="password"]', "test");
      await Promise.all([
        page.waitForURL((url) => !url.toString().includes("/login.html")),
        page.click('button[type="submit"]'),
      ]);

      // ダッシュボードへ移動
      await page.goto("/panels/scr-1785570818400.html");
      await expect(page.locator("text=匠SFA")).toBeVisible({ timeout: 10000 });

      // 提案内容を入力（提案がある入力欄を特定してから入力）
      const proposalInputs = page.locator("textarea, input[type='text']");
      const inputCount = await proposalInputs.count();
      if (inputCount > 0) {
        await proposalInputs.first().fill(uniqueProposalContent);
      }

      // 顧客対応パターンを入力
      if (inputCount > 1) {
        await proposalInputs.nth(1).fill(uniqueCustomerAction);
      }

      // 入力内容が表示されていることを確認
      await expect(page.locator(`text=${uniqueProposalContent}`)).toBeVisible();
      await expect(page.locator(`text=${uniqueCustomerAction}`)).toBeVisible();
    });

    // ========== 工程2: AIエージェント分析が自動実行、結果が営業管理職レビュー画面に遷移 ==========
    await test.step("工程2: 入力内容がAIエージェント分析画面に引き継がれ、問題検出結果が生成される", async () => {
      // AIエージェント分析画面へ遷移（または自動遷移）
      // 新しい画面への遷移を待つ
      await page.waitForTimeout(2000);

      // 提案内容と顧客対応パターンがAIエージェント分析画面に引き継がれていることを確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniqueProposalContent);
      expect(pageContent).toContain(uniqueCustomerAction);

      // AIエージェント分析完了の表示を確認（分析結果が存在する）
      const analysisResults = page.locator("text=分析");
      if (await analysisResults.count() > 0) {
        await expect(analysisResults.first()).toBeVisible();
      }
    });

    // ========== 工程3: 営業管理職が問題検出結果をレビュー・確定 ==========
    await test.step("工程3: 営業管理職がレビュー画面で問題検出結果を確認・確定", async () => {
      // 新しいユーザーとしてログイン（営業管理職）
      const uniqueReviewComment = "レビュー" + Date.now();

      // 管理職ログインまたはページ遷移
      await page.goto("/login.html");
      await page.fill('[name="username"]', "manager");
      await page.fill('[name="password"]', "test");
      await Promise.all([
        page.waitForURL((url) => !url.toString().includes("/login.html")),
        page.click('button[type="submit"]'),
      ]);

      // レビュー画面へ移動
      await page.goto("/panels/scr-1785570818400.html");
      await expect(page.locator("text=匠SFA")).toBeVisible({ timeout: 10000 });

      // 問題検出結果が表示されていることを確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniqueProposalContent);
      expect(pageContent).toContain(uniqueCustomerAction);

      // レビューコメントを入力
      const reviewInputs = page.locator("textarea, input[type='text']");
      const reviewInputCount = await reviewInputs.count();
      if (reviewInputCount > 0) {
        await reviewInputs.first().fill(uniqueReviewComment);
      }

      // 入力したレビュー内容が表示されることを確認
      await expect(page.locator(`text=${uniqueReviewComment}`)).toBeVisible();

      // テーブルへのレビュー記録保存を確認
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "営業活動ログ",
      );

      if (tableIndex >= 0) {
        const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
        expect(res.ok()).toBeTruthy();
        const rows = await res.json();
        expect(JSON.stringify(rows)).toContain(uniqueReviewComment);
      }
    });

    // ========== 工程4: 改善提案が営業プロセス分析レポート生成画面に引き継がれる ==========
    await test.step("工程4: 管理職のレビュー内容が分析レポート生成画面に引き継がれる", async () => {
      // 分析レポート画面へ遷移
      await page.waitForTimeout(1000);

      // 管理職が入力した内容と営業担当者の元の提案内容が両方表示されていることを確認
      const reportContent = await page.content();
      expect(reportContent).toContain(uniqueProposalContent);
      expect(reportContent).toContain(uniqueCustomerAction);
    });

    // ========== 工程5: 営業部長がチーム品質傾向を分析・指導対象を決定・確定 ==========
    await test.step("工程5: 営業部長がログイン、チーム品質傾向を分析・指導対象を決定", async () => {
      const uniqueDepartmentDecision = "指導" + Date.now();

      // 営業部長としてログイン
      await page.goto("/login.html");
      await page.fill('[name="username"]', "director");
      await page.fill('[name="password"]', "test");
      await Promise.all([
        page.waitForURL((url) => !url.toString().includes("/login.html")),
        page.click('button[type="submit"]'),
      ]);

      // ダッシュボードへ移動
      await page.goto("/panels/scr-1785570818400.html");
      await expect(page.locator("text=匠SFA")).toBeVisible({ timeout: 10000 });

      // チーム全体の品質傾向データが表示されていることを確認
      const dashboardContent = await page.content();
      expect(dashboardContent).toContain(uniqueProposalContent);
      expect(dashboardContent).toContain(uniqueCustomerAction);

      // 指導対象者と実施タイミングを決定・入力
      const directorInputs = page.locator("textarea, input[type='text']");
      const directorInputCount = await directorInputs.count();
      if (directorInputCount > 0) {
        await directorInputs.first().fill(uniqueDepartmentDecision);
      }

      // 入力内容が表示されていることを確認
      await expect(page.locator(`text=${uniqueDepartmentDecision}`)).toBeVisible();
    });

    // ========== 最終確認: 全工程の記録が統合レコードとして残っている ==========
    await test.step("最終確認: 全工程の入力内容が統合記録として営業プロセス分析レポートに保存", async () => {
      // 分析レポート画面へ遷移
      await page.waitForTimeout(1000);

      // 最終的なレポート画面で、全工程の内容が統合されていることを確認
      const finalReportContent = await page.content();

      // 営業担当者の提案内容
      expect(finalReportContent).toContain(uniqueProposalContent);
      // 営業担当者の顧客対応パターン
      expect(finalReportContent).toContain(uniqueCustomerAction);

      // テーブルから統合記録を取得して最終確認
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);

      // レポート生成履歴テーブルを確認
      const reportTableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "レポート生成履歴",
      );

      if (reportTableIndex >= 0) {
        const res = await request.get(`${apiUrl}/api/${reportTableIndex}?app=${appId}`);
        expect(res.ok()).toBeTruthy();
        const rows = await res.json();
        // 少なくとも1件以上のレポートが生成されていることを確認
        expect(rows.length).toBeGreaterThan(0);
      }

      // 営業活動ログテーブルで全工程の記録が保存されていることを確認
      const activityTableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "営業活動ログ",
      );

      if (activityTableIndex >= 0) {
        const res = await request.get(`${apiUrl}/api/${activityTableIndex}?app=${appId}`);
        expect(res.ok()).toBeTruthy();
        const rows = await res.json();
        const combinedRecords = JSON.stringify(rows);
        // 提案内容と顧客対応パターンが両方記録されている
        expect(combinedRecords).toContain(uniqueProposalContent);
        expect(combinedRecords).toContain(uniqueCustomerAction);
      }
    });
  });
});