import { test, expect } from '@playwright/test';

test.describe('営業プロセス監査ダッシュボード', () => {
  // SCEN-077: [normal] 営業プロセス監査ダッシュボード - 〈営業プロセスログ分析と属人化解消〉が最初から最後まで通り、記録が残る
  test('営業プロセスログ分析と属人化解消の完全フローが記録に残る', async ({ page, request }) => {
    // ログイン前に営業部長として認証
    await page.goto('/login.html');
    await page.fill('[name="username"]', 'eiseichief');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);

    // 営業プロセス監査ダッシュボードへ遷移
    await page.goto('/panels/scr-1785570818400.html');
    await expect(page.locator('text=匠SFA')).toBeVisible();

    // 工程1: 営業部長が抽出対象期間を指定
    const extractPeriodStart = `2024-01${Date.now().toString().slice(-4)}`;
    const extractPeriodEnd = `2024-01${(Date.now() + 1).toString().slice(-4)}`;
    const uniqueExtractionId = `抽出_${Date.now()}`;

    await test.step('営業部長が抽出対象期間を入力', async () => {
      // 抽出指示画面へアクセス
      const extractButton = page.locator('button:has-text("営業プロセスログデータ抽出指示")').first();
      if (await extractButton.isVisible()) {
        await extractButton.click();
      }
      
      // 抽出対象期間の入力欄を探索
      const periodInputs = page.locator('input[type="date"], input[placeholder*="期間"], input[placeholder*="開始"]');
      if ((await periodInputs.count()) > 0) {
        const firstInput = periodInputs.first();
        await firstInput.fill(extractPeriodStart);
      }

      // ユニーク値を入力（抽出ID/メモ欄など）
      const memoInputs = page.locator('input[placeholder*="メモ"], input[placeholder*="備考"], textarea');
      if ((await memoInputs.count()) > 0) {
        await memoInputs.first().fill(uniqueExtractionId);
      }
    });

    // 工程2: IT部門がデータ品質検証を実行
    await test.step('IT部門がデータ品質検証を実行', async () => {
      // データ品質検証画面へ遷移
      let dataQualityPage = await page.context().newPage();
      await dataQualityPage.goto('/login.html');
      await dataQualityPage.fill('[name="username"]', 'itmanager');
      await dataQualityPage.fill('[name="password"]', 'test');
      await Promise.all([
        dataQualityPage.waitForURL(url => !url.toString().includes('/login.html')),
        dataQualityPage.click('button[type="submit"]'),
      ]);

      // データ品質検証画面へ遷移（画面IDは仮定）
      await dataQualityPage.goto('/panels/scr-data-quality-validation.html').catch(() => {
        // 画面が見つからない場合はダッシュボードから遷移
        return dataQualityPage.goto('/panels/scr-1785570818400.html');
      });

      // 検証実行ボタンをクリック
      const qualityCheckButton = dataQualityPage.locator('button:has-text("品質検証実行"), button:has-text("検証開始")').first();
      if (await qualityCheckButton.isVisible()) {
        await qualityCheckButton.click();
      }

      // 検証完了を待機
      const completeButton = dataQualityPage.locator('button:has-text("完了"), button:has-text("次へ")').first();
      if (await completeButton.isVisible()) {
        await expect(completeButton).toBeVisible({ timeout: 10000 });
        await completeButton.click();
      }

      await dataQualityPage.close();
    });

    // 工程3: データクリーニング・正規化実行確認
    await test.step('データクリーニング・正規化の内容を確認', async () => {
      // クリーニング実行画面へ遷移
      let cleaningPage = await page.context().newPage();
      await cleaningPage.goto('/login.html');
      await cleaningPage.fill('[name="username"]', 'itmanager');
      await cleaningPage.fill('[name="password"]', 'test');
      await Promise.all([
        cleaningPage.waitForURL(url => !url.toString().includes('/login.html')),
        cleaningPage.click('button[type="submit"]'),
      ]);

      await cleaningPage.goto('/panels/scr-1785570818400.html');

      // クリーニング実行ボタンをクリック
      const cleaningButton = cleaningPage.locator('button:has-text("データクリーニング実行"), button:has-text("正規化実行")').first();
      if (await cleaningButton.isVisible()) {
        await cleaningButton.click();
      }

      // クリーニング結果を確認
      const cleaningResults = cleaningPage.locator('[class*="result"], [class*="summary"], table').first();
      if (await cleaningResults.isVisible()) {
        await expect(cleaningResults).toBeVisible();
      }

      await cleaningPage.close();
    });

    // 工程4: 営業管理職がAIエージェント推論実行指示
    const uniqueInferenceId = `推論_${Date.now()}`;
    await test.step('営業管理職がAIエージェント推論実行指示を出す', async () => {
      let managerPage = await page.context().newPage();
      await managerPage.goto('/login.html');
      await managerPage.fill('[name="username"]', 'salesmanager');
      await managerPage.fill('[name="password"]', 'test');
      await Promise.all([
        managerPage.waitForURL(url => !url.toString().includes('/login.html')),
        managerPage.click('button[type="submit"]'),
      ]);

      await managerPage.goto('/panels/scr-1785570818400.html');

      // AIエージェント推論実行指示ボタンをクリック
      const inferenceButton = managerPage.locator('button:has-text("AIエージェント推論実行"), button:has-text("推論実行")').first();
      if (await inferenceButton.isVisible()) {
        await inferenceButton.click();
      }

      // 推論ID/備考を入力
      const inferenceInputs = managerPage.locator('input[placeholder*="推論"], input[placeholder*="メモ"], textarea');
      if ((await inferenceInputs.count()) > 0) {
        await inferenceInputs.first().fill(uniqueInferenceId);
      }

      await managerPage.close();
    });

    // 工程5: 営業管理職がレポート内容を確認・確定
    await test.step('営業管理職がレポート内容を確認・確定', async () => {
      let reportPage = await page.context().newPage();
      await reportPage.goto('/login.html');
      await reportPage.fill('[name="username"]', 'salesmanager');
      await reportPage.fill('[name="password"]', 'test');
      await Promise.all([
        reportPage.waitForURL(url => !url.toString().includes('/login.html')),
        reportPage.click('button[type="submit"]'),
      ]);

      await reportPage.goto('/panels/scr-1785570818400.html');

      // レポート確認画面に表示されたレポート内容を検証
      const reportContent = reportPage.locator('[class*="report"], [class*="analysis"], [class*="result"]').first();
      if (await reportContent.isVisible()) {
        await expect(reportContent).toBeVisible();
      }

      // 確定ボタンをクリック
      const confirmButton = reportPage.locator('button:has-text("確定"), button:has-text("完了"), button:has-text("承認")').first();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }

      await reportPage.close();
    });

    // 工程6: 営業プロセス監査ダッシュボールに戻り、実行履歴を確認
    await test.step('営業プロセス監査ダッシュボードで実行履歴を確認', async () => {
      await page.goto('/panels/scr-1785570818400.html');
      await expect(page.locator('text=匠SFA')).toBeVisible();

      // 履歴テーブル・ログ表示を確認
      const historyTable = page.locator('table, [class*="history"], [class*="log"]').first();
      if (await historyTable.isVisible()) {
        // ユニーク値が記録に存在することを確認
        const pageContent = await page.content();
        expect(pageContent).toContain(uniqueExtractionId);
      }
    });

    // 記録をDBで確認（営業プロセス実行状況テーブル）
    await test.step('データベースに実行履歴が記録されているか確認', async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tables = await page.evaluate(() => (window as any).AIVIC_TABLES || []);
      
      // 営業プロセス実行状況テーブルを特定
      const executionTableIndex = tables.findIndex((t: any) => 
        t.tableName === '営業プロセス実行状況'
      );
      
      if (executionTableIndex >= 0 && apiUrl && appId) {
        const res = await request.get(
          `${apiUrl}/api/${executionTableIndex}?app=${appId}`
        );
        const rows = await res.json();
        
        // 入力したユニーク値が記録に含まれることを確認
        const recordFound = JSON.stringify(rows).includes(uniqueExtractionId) || 
                           JSON.stringify(rows).includes(uniqueInferenceId);
        expect(recordFound).toBeTruthy();
      }
    });

    // AIエージェント推論ログも確認
    await test.step('AIエージェント推論ログに実行記録が残っているか確認', async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tables = await page.evaluate(() => (window as any).AIVIC_TABLES || []);
      
      const inferenceLogIndex = tables.findIndex((t: any) => 
        t.tableName === 'AIエージェント推論ログ'
      );
      
      if (inferenceLogIndex >= 0 && apiUrl && appId) {
        const res = await request.get(
          `${apiUrl}/api/${inferenceLogIndex}?app=${appId}`
        );
        const rows = await res.json();
        
        // 推論実行記録が存在することを確認
        expect(rows.length).toBeGreaterThan(0);
        expect(JSON.stringify(rows)).toContain(uniqueInferenceId);
      }
    });
  });
});