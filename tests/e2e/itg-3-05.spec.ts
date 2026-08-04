import { test, expect } from '@playwright/test';

test.describe('AIエージェント推奨支援ダッシュボード', () => {
  // SCEN-023: [normal] AIエージェント推奨支援ダッシュボード - 顧客企業の購買タイミング最適化
  test('顧客企業の購買タイミング最適化が最初から最後まで通り、記録が残る', async ({ page, request }) => {
    // ログイン処理
    await test.step('ログインしダッシュボードへ遷移', async () => {
      await page.goto('/login.html');
      await page.fill('[name="username"]', 'test');
      await page.fill('[name="password"]', 'test');
      await Promise.all([
        page.waitForURL(url => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);
      await page.goto('/panels/scr-1785571913372.html');
      await expect(page.locator('[data-aivic-nav="scr-1785571913372"]')).toBeVisible();
    });

    // 一意の値を生成
    const uniqueTestId = 'test-' + Date.now();
    const customerName = 'テスト顧客' + uniqueTestId;
    const proposalAmount = '5000';
    const purchaseAmount = '3000';

    // 新規案件入力フォームを開く
    await test.step('新規案件入力フォームを開く', async () => {
      await expect(page.locator('button:has-text("推奨を実行")')).toBeVisible();
      await page.click('button:has-text("推奨を実行")');
    });

    // 顧客情報を入力
    await test.step('顧客情報と購買履歴を入力', async () => {
      // 顧客検索欄に顧客名を入力
      await page.fill('[data-testid="customer-search"]', customerName);
      await page.waitForTimeout(500);

      // 業種を選択
      await page.click('[data-testid="industry-select"]');
      await page.click('text=製造業');

      // 企業規模を選択
      await page.click('[data-testid="company-size-select"]');
      await page.click('text=大企業');

      // 予想金額を入力
      await page.fill('[data-testid="expected-amount"]', proposalAmount);

      // 商談ステージを選択
      await page.click('[data-testid="deal-stage-select"]');
      await page.click('text=提案');

      // 商談条件（複数選択）から「予算確保済み」を選択
      await page.click('[data-testid="condition-budget"]');

      // 備考に購買履歴情報を入力
      await page.fill('[data-testid="deal-notes"]', `過去購買: ${purchaseAmount}万円, 提案: ${proposalAmount}万円, ${uniqueTestId}`);
    });

    // 確定ボタンを押す
    let recommendationId = '';
    await test.step('新規案件を確定してAI分析を実行', async () => {
      await Promise.all([
        page.waitForNavigation(),
        page.click('[data-testid="execute-recommendation"]'),
      ]);
      await expect(page.locator('[data-testid="kpi-execution-rate"]')).toBeVisible();
    });

    // 推奨結果画面で入力した顧客・商談条件が表示されていることを確認
    await test.step('推奨結果画面で入力内容が表示されている', async () => {
      const contentText = await page.locator('#recommendation-content').textContent();
      expect(contentText).toContain(customerName);
      expect(contentText).toContain(proposalAmount);
    });

    // AIエージェントが生成した最適な購買タイミングと推奨数量、推奨根拠が表示されていることを確認
    await test.step('AI推奨内容（タイミング・数量・根拠）が表示されている', async () => {
      const basisText = await page.locator('#recommendation-basis').textContent();
      expect(basisText).toBeTruthy();
      expect(basisText?.length).toBeGreaterThan(0);
    });

    // 推奨結果画面で承認ボタンを押し、営業管理職用確認画面に遷移
    await test.step('推奨を承認して管理職確認画面へ遷移', async () => {
      await Promise.all([
        page.waitForNavigation(),
        page.click('[data-testid="approve-recommendation"]'),
      ]);
    });

    // 営業管理職用確認画面で顧客・商談条件と推奨内容がすべて表示されていることを確認
    await test.step('管理職確認画面で全情報が表示されている', async () => {
      await expect(page.locator('text=推奨内容詳細')).toBeVisible();
      const screenContent = await page.content();
      expect(screenContent).toContain(customerName);
      expect(screenContent).toContain(proposalAmount);
    });

    // 営業管理職用確認画面で承認ボタンを押す
    await test.step('管理職が推奨を最終承認', async () => {
      await Promise.all([
        page.waitForNavigation(),
        page.click('button:has-text("承認"):visible'),
      ]);
    });

    // ダッシュボードが完了画面に遷移し、推奨の承認が完了したことを確認
    await test.step('完了画面に遷移し承認完了を確認', async () => {
      await expect(page.locator('text=推奨ダッシュボード')).toBeVisible({ timeout: 5000 });
    });

    // 推奨履歴画面を開き、本テストで実行した案件の推奨記録が履歴一覧に記録されていることを確認
    await test.step('推奨履歴画面に新規案件が記録されている', async () => {
      await page.click('[data-testid="recommendation-history"]');
      await expect(page.locator('#history-tbody')).toBeVisible();

      const historyContent = await page.locator('#history-tbody').textContent();
      expect(historyContent).toContain(customerName);
    });

    // 推奨履歴の詳細を開き、入力した購買履歴、提案内容、生成された推奨タイミング・数量・根拠がすべて保存されていることを確認
    await test.step('履歴詳細に全情報が保存されている', async () => {
      const detailRows = await page.locator('#history-tbody tr');
      const rowCount = await detailRows.count();
      expect(rowCount).toBeGreaterThan(0);

      // 最初の行をクリックして詳細を開く
      await detailRows.first().click();
      await expect(page.locator('#detail-modal')).toBeVisible();

      const detailContent = await page.locator('#detail-content').textContent();
      expect(detailContent).toContain(customerName);
      expect(detailContent).toContain(proposalAmount);
      expect(detailContent).toContain(uniqueTestId);
    });

    // API経由で推奨履歴テーブルに記録が存在することを確認
    await test.step('推奨履歴テーブルにAPIで記録が保存されている', async () => {
      const apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      const appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      const tableIndex = await page.evaluate(
        (name) => ((window as any).AIVIC_TABLES || []).findIndex((t: any) => t.tableName === name),
        '推奨履歴'
      );

      const res = await request.get(`${apiUrl}/api/${tableIndex}?app=${appId}`);
      expect(res.ok()).toBeTruthy();

      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(customerName);
      expect(JSON.stringify(rows)).toContain(proposalAmount);
    });
  });
});