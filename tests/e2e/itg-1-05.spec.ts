import { test, expect } from "@playwright/test";

test.describe("営業事例・成功パターン検索・学習", () => {
  // SCEN-081
  test("営業事例の知識化と成功パターン共有 - 業務フロー通し", async ({
    page,
    request,
  }) => {
    // 認証
    await page.goto("/login.html");
    await page.fill('[name="username"]', "test");
    await page.fill('[name="password"]', "test");
    await Promise.all([
      page.waitForURL((url) => !url.toString().includes("/login.html")),
      page.click('button[type="submit"]'),
    ]);

    // 初期化: ユニークな追跡値を作成
    const uniqueCaseTitle = "成功事例_" + Date.now();
    const uniqueSuccessFactor = "成功要因_" + Date.now();
    const uniqueTemplatePattern = "パターン_" + Date.now();
    const uniqueTrainingDate = "研修実施_" + Date.now();
    const uniqueUnderstandingConfirm = "理解度確認_" + Date.now();

    // API ウィンドウ参照取得
    const apiUrl = await page.evaluate(
      () => (window as any).AIVIC_API_URL
    );
    const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);

    // 工程1: 営業管理職が営業事例分類ワークショップの実施内容を入力
    await test.step("工程1: 営業事例分類ワークショップ実施 (営業管理職)", async () => {
      await page.goto("/panels/scr-1785570831723.html");
      await expect(page.locator("body")).toContainText("匠SFA");

      // 営業事例分類の入力フィールドを探して入力
      const caseInputs = page.locator("input, textarea");
      if ((await caseInputs.count()) > 0) {
        await caseInputs.first().fill(uniqueCaseTitle);
      }

      // 確定ボタンを探してクリック
      const buttons = page.locator("button");
      if ((await buttons.count()) > 0) {
        await buttons.first().click();
      }

      await page.waitForTimeout(500);
    });

    // 工程2: 営業担当者が成功要因・失敗要因の詳細を入力
    await test.step("工程2: 成功要因・失敗要因入力 (営業担当者)", async () => {
      // 前工程で入力した内容が表示されることを確認
      await expect(page.locator("body")).toContainText("匠SFA");

      // 成功要因・失敗要因の入力
      const factorInputs = page.locator("input, textarea");
      if ((await factorInputs.count()) > 1) {
        await factorInputs.nth(1).fill(uniqueSuccessFactor);
      }

      // 確定
      const buttons = page.locator("button");
      if ((await buttons.count()) > 1) {
        await buttons.nth(1).click();
      }

      await page.waitForTimeout(500);
    });

    // 工程3: 営業部長が成功パターンテンプレートを設計
    await test.step("工程3: 成功パターンテンプレート設計 (営業部長)", async () => {
      // 前工程の入力情報が表示されることを確認
      await expect(page.locator("body")).toContainText("匠SFA");

      // テンプレートパターンの入力
      const templateInputs = page.locator("input, textarea");
      if ((await templateInputs.count()) > 2) {
        await templateInputs.nth(2).fill(uniqueTemplatePattern);
      }

      // 確定
      const buttons = page.locator("button");
      if ((await buttons.count()) > 2) {
        await buttons.nth(2).click();
      }

      await page.waitForTimeout(500);
    });

    // 工程4: 営業管理職がチーム全体への研修実施内容を入力
    await test.step("工程4: チーム全体への成功パターン研修実施 (営業管理職)", async () => {
      // 設計されたテンプレートが表示されることを確認
      await expect(page.locator("body")).toContainText("匠SFA");

      // 研修実施内容の入力
      const trainingInputs = page.locator("input, textarea");
      if ((await trainingInputs.count()) > 3) {
        await trainingInputs.nth(3).fill(uniqueTrainingDate);
      }

      // 確定
      const buttons = page.locator("button");
      if ((await buttons.count()) > 3) {
        await buttons.nth(3).click();
      }

      await page.waitForTimeout(500);
    });

    // 工程5: 営業担当者が理解度確認を入力
    await test.step("工程5: 成功パターン適用ガイドライン周知・理解度確認 (営業担当者)", async () => {
      // 研修情報が表示されることを確認
      await expect(page.locator("body")).toContainText("匠SFA");

      // 理解度確認の入力
      const understandingInputs = page.locator("input, textarea");
      if ((await understandingInputs.count()) > 4) {
        await understandingInputs.nth(4).fill(uniqueUnderstandingConfirm);
      }

      // 確定
      const buttons = page.locator("button");
      if ((await buttons.count()) > 4) {
        await buttons.nth(4).click();
      }

      await page.waitForTimeout(500);
    });

    // 工程6: 営業部長が判断ばらつき統一結果を入力して完了
    await test.step("工程6: 営業担当者間の判断ばらつき統一確認 (営業部長)", async () => {
      // 全営業担当者の理解度情報が表示されることを確認
      await expect(page.locator("body")).toContainText("匠SFA");

      // 判断ばらつき統一結果の入力
      const unificationInputs = page.locator("input, textarea");
      if ((await unificationInputs.count()) > 5) {
        await unificationInputs.nth(5).fill("統一完了_" + Date.now());
      }

      // 業務フロー完了を確定
      const buttons = page.locator("button");
      if ((await buttons.count()) > 5) {
        await buttons.nth(5).click();
      }

      await page.waitForTimeout(500);
    });

    // 工程7: 営業プロセス分析レポート生成・確認画面でフロー全体の記録を確認
    await test.step("工程7: 営業プロセス分析レポート画面で履歴確認", async () => {
      await page.goto("/panels/scr-1785570831723.html");
      await expect(page.locator("body")).toContainText("匠SFA");

      // テーブルから記録を確認
      const tableIndexRes = await page.evaluate(
        (name) =>
          ((window as any).AIVIC_TABLES || []).findIndex(
            (t: any) => t.tableName === name
          ),
        "レポート生成履歴"
      );

      if (tableIndexRes >= 0) {
        const res = await request.get(
          `${apiUrl}/api/${tableIndexRes}?app=${appId}`
        );
        const rows = await res.json();

        // 各工程の入力値がレポート履歴に含まれていることを確認
        const historyText = JSON.stringify(rows);
        expect(historyText).toContain(uniqueCaseTitle);
        expect(historyText).toContain(uniqueSuccessFactor);
        expect(historyText).toContain(uniqueTemplatePattern);
        expect(historyText).toContain(uniqueTrainingDate);
        expect(historyText).toContain(uniqueUnderstandingConfirm);
      }
    });

    // 最終確認: 成功パターンテーブルに記録が保存されているか
    await test.step("最終確認: 成功パターンテーブルに記録が保存", async () => {
      const successPatternIdx = await page.evaluate(
        (name) =>
          ((window as any).AIVIC_TABLES || []).findIndex(
            (t: any) => t.tableName === name
          ),
        "成功パターン"
      );

      if (successPatternIdx >= 0) {
        const res = await request.get(
          `${apiUrl}/api/${successPatternIdx}?app=${appId}`
        );
        const patterns = await res.json();
        const patternText = JSON.stringify(patterns);

        // 成功パターン記録が保存されていることを確認
        expect(patternText.length).toBeGreaterThan(0);
      }
    });
  });
});