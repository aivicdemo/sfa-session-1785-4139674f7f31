import { test, expect } from '@playwright/test';

test.describe("営業プロセス分析レポート生成・確認", () => {
  // SCEN-082
  test("[normal] 営業プロセス標準書の妥当性検証と改善 - 全工程通し", async ({ page, request }) => {
    // ログイン
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);

    // 対象画面への遷移
    await page.goto("/panels/scr-1785570844176.html");
    await expect(page.locator("text=匠SFA")).toBeVisible({ timeout: 10000 });

    // API 接続情報の取得
    const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
    const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);

    // 一意な値の作成
    const uniqueDataQualityValue = "データ品質チェック" + Date.now();
    const uniquePatternAnalysisValue = "行動パターン分析" + Date.now();
    const uniqueDeviationValue = "乖離分析" + Date.now();
    const uniqueCorrelationValue = "相関分析" + Date.now();

    // 工程1: 営業部長が営業データ品質チェック指示を実行
    await test.step("工程1: 営業データ品質チェック指示", async () => {
      // ページ上で営業データ品質チェック指示の入力フォームを探す
      const dataQualityInput = page.locator('input, textarea').first();
      await dataQualityInput.fill(uniqueDataQualityValue);
      
      // 指示を確定するボタンを探す（存在する汎用ボタン）
      const submitButton = page.locator('button').first();
      await submitButton.click();

      // テーブル確認: 営業データ品質チェック指示の内容が記録されたことを確認
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "レポート生成履歴"
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(uniqueDataQualityValue);
    });

    // 工程2: 営業担当者の行動パターン分析指示
    await test.step("工程2: 営業担当者の行動パターン分析指示", async () => {
      // 前工程の内容が引き継がれているか確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniqueDataQualityValue);

      // 行動パターン分析指示を入力
      const patternInput = page.locator('input, textarea').nth(1);
      await patternInput.fill(uniquePatternAnalysisValue);

      const submitButton = page.locator('button').nth(1);
      await submitButton.click();

      // テーブル確認
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "行動パターン分析結果"
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(uniquePatternAnalysisValue);
    });

    // 工程3: 営業プロセス標準書との乖離分析
    await test.step("工程3: 営業プロセス標準書との乖離分析", async () => {
      // 前工程の内容が引き継がれているか確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniquePatternAnalysisValue);

      // 乖離分析を入力
      const deviationInput = page.locator('input, textarea').nth(2);
      await deviationInput.fill(uniqueDeviationValue);

      const submitButton = page.locator('button').nth(2);
      await submitButton.click();

      // テーブル確認
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "営業プロセス実行状況"
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(uniqueDeviationValue);
    });

    // 工程4: 成約実績との相関分析
    await test.step("工程4: 成約実績との相関分析", async () => {
      // 前工程の内容が引き継がれているか確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniqueDeviationValue);

      // 相関分析を入力
      const correlationInput = page.locator('input, textarea').nth(3);
      await correlationInput.fill(uniqueCorrelationValue);

      const submitButton = page.locator('button').nth(3);
      await submitButton.click();

      // テーブル確認
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "成約実績"
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(uniqueCorrelationValue);
    });

    // 工程5: 営業事例の分類ワークショップ開催
    await test.step("工程5: 営業事例の分類ワークショップ開催", async () => {
      // 前工程の内容が引き継がれているか確認
      const pageContent = await page.content();
      expect(pageContent).toContain(uniqueCorrelationValue);

      // ワークショップ開催を実行（ボタンをクリック）
      const workshopButton = page.locator('button').nth(4);
      await workshopButton.click();

      // テーブル確認：全工程の履歴が記録されていることを確認
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "レポート生成履歴"
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();

      // 全5工程の値が記録されていることを確認
      expect(JSON.stringify(rows)).toContain(uniqueDataQualityValue);
      expect(JSON.stringify(rows)).toContain(uniquePatternAnalysisValue);
      expect(JSON.stringify(rows)).toContain(uniqueDeviationValue);
      expect(JSON.stringify(rows)).toContain(uniqueCorrelationValue);
    });

    // 全工程の実行履歴を確認
    await test.step("全工程の実行履歴確認", async () => {
      // 履歴テーブルから全工程が記録されていることを最終確認
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        "レポート生成履歴"
      );
      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      const rows = await res.json();

      // 全値が順序通りに記録されていることを確認
      const recordString = JSON.stringify(rows);
      const dataQualityIndex = recordString.indexOf(uniqueDataQualityValue);
      const patternAnalysisIndex = recordString.indexOf(uniquePatternAnalysisValue);
      const deviationIndex = recordString.indexOf(uniqueDeviationValue);
      const correlationIndex = recordString.indexOf(uniqueCorrelationValue);

      expect(dataQualityIndex).toBeGreaterThanOrEqual(0);
      expect(patternAnalysisIndex).toBeGreaterThan(dataQualityIndex);
      expect(deviationIndex).toBeGreaterThan(patternAnalysisIndex);
      expect(correlationIndex).toBeGreaterThan(deviationIndex);
    });
  });
});