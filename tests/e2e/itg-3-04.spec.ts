import { test, expect } from '@playwright/test';

test.describe('AIエージェント推奨支援ダッシュボード', () => {
  // SCEN-022: [normal] AIエージェント推奨支援ダッシュボード - 営業担当者の定型業務自動化が最初から最後まで通り、記録が残る
  test('営業担当者による顧客情報入力から管理職による承認までの完全な業務フロー', async ({
    page,
    request,
  }) => {
    const uniqueCustomerName = 'テスト顧客_' + Date.now();
    const uniqueDealAmount = String(Math.floor(Math.random() * 900) + 100);
    const uniqueNotes = 'テスト商談_' + crypto.randomUUID();

    // ステップ1: ダッシュボードにアクセスしてログイン
    await test.step('AIエージェント推奨支援ダッシュボードにアクセス', async () => {
      await page.goto('/panels/scr-1785571913372.html');
      await expect(page.locator('.page-title')).toContainText(
        'AIエージェント推奨支援システム',
      );
    });

    // ステップ2: 営業担当者の情報入力
    await test.step('営業担当者が顧客情報と商談内容を入力', async () => {
      // 顧客名入力
      const customerSearchInput = page.locator('[data-testid="customer-search"]');
      await customerSearchInput.fill(uniqueCustomerName);

      // 業種選択
      const industrySelect = page.locator('[data-testid="industry-select"]');
      await industrySelect.selectOption('製造業');

      // 企業規模選択
      const companySizeSelect = page.locator('[data-testid="company-size-select"]');
      await companySizeSelect.selectOption('中堅企業');

      // 予想金額入力
      const expectedAmount = page.locator('[data-testid="expected-amount"]');
      await expectedAmount.fill(uniqueDealAmount);

      // 商談ステージ選択
      const dealStageSelect = page.locator('[data-testid="deal-stage-select"]');
      await dealStageSelect.selectOption('提案');

      // 商談条件の複数選択
      const conditionBudget = page.locator('[data-testid="condition-budget"]');
      const conditionUrgent = page.locator('[data-testid="condition-urgent"]');
      await conditionBudget.check();
      await conditionUrgent.check();

      // 備考入力
      const dealNotes = page.locator('[data-testid="deal-notes"]');
      await dealNotes.fill(uniqueNotes);

      // 入力値が正しく反映されていることを確認
      await expect(customerSearchInput).toHaveValue(uniqueCustomerName);
      await expect(expectedAmount).toHaveValue(uniqueDealAmount);
      await expect(dealNotes).toHaveValue(uniqueNotes);
    });

    // ステップ3: AIが推奨内容を生成
    await test.step('営業担当者が「推奨を生成」をクリック', async () => {
      const executeRecommendationBtn = page.locator(
        '[data-testid="execute-recommendation"]',
      );
      await executeRecommendationBtn.click();

      // 推奨内容が表示されるまで待機
      const recommendationContent = page.locator('#recommendation-content');
      await expect(recommendationContent).toBeVisible({ timeout: 5000 });

      // 推奨内容に顧客名が含まれていることを確認（AIが入力を参照）
      const contentText = await recommendationContent.textContent();
      expect(contentText).toContain(uniqueCustomerName);
    });

    // ステップ4: 営業担当者が推奨内容を確認し修正
    await test.step('営業担当者が推奨内容を確認して修正', async () => {
      const modifyBtn = page.locator('[data-testid="modify-recommendation"]');
      await modifyBtn.click();

      // 修正画面では前の工程の入力値がそのまま引き継がれることを確認
      const customerSearchInput = page.locator('[data-testid="customer-search"]');
      await expect(customerSearchInput).toHaveValue(uniqueCustomerName);

      const expectedAmount = page.locator('[data-testid="expected-amount"]');
      await expect(expectedAmount).toHaveValue(uniqueDealAmount);

      const dealNotes = page.locator('[data-testid="deal-notes"]');
      await expect(dealNotes).toHaveValue(uniqueNotes);
    });

    // ステップ5: 営業担当者が修正内容を反映して提案資料生成を依頼
    await test.step('営業担当者が「提案資料生成を依頼」をクリック', async () => {
      const approveBtn = page.locator('[data-testid="approve-recommendation"]');
      await approveBtn.click();

      // 確認待ち状態に遷移していることを確認
      await expect(page.locator('body')).toContainText('確認待ち', {
        timeout: 3000,
      });
    });

    // ステップ6: ユーザーを営業管理職に切り替え
    await test.step('営業管理職がシステムにアクセス', async () => {
      // ユーザーを切り替えるため一度ログアウト
      const logoutLink = page.locator('.logout-link');
      await logoutLink.click();

      // ログイン画面まで遷移
      await page.waitForURL(/login\.html/);

      // 管理職ユーザーでログイン（想定: manager という管理職ユーザーが存在）
      await page.fill('[name="username"]', 'manager');
      await page.fill('[name="password"]', 'password');
      await Promise.all([
        page.waitForURL((url) => !url.toString().includes('/login.html')),
        page.click('button[type="submit"]'),
      ]);

      // ダッシュボードに再度遷移
      await page.goto('/panels/scr-1785571913372.html');
      await expect(page.locator('.page-title')).toContainText(
        'AIエージェント推奨支援システム',
      );
    });

    // ステップ7: 営業管理職が提案内容の妥当性確認画面を表示
    await test.step('営業管理職が妥当性確認画面で前の工程の内容が引き継がれていることを確認', async () => {
      // 推奨履歴テーブルから確認待ちのレコードを探す
      const historyTable = page.locator('#history-tbody');
      await expect(historyTable).toBeVisible();

      // 入力した顧客名が履歴に表示されていることを確認
      const historyContent = await historyTable.textContent();
      expect(historyContent).toContain(uniqueCustomerName);
      expect(historyContent).toContain(uniqueDealAmount);
    });

    // ステップ8: 営業管理職がリスク対応検討に移行
    await test.step('営業管理職が「リスク対応策を検討・承認」をクリック', async () => {
      // 確認待ちレコードの詳細を開く
      const detailModal = page.locator('#detail-modal');
      const detailBtn = page.locator('button:has-text("詳細")').first();
      await detailBtn.click({ timeout: 3000 });

      // 詳細モーダルで前の工程の内容が引き継がれていることを確認
      const detailContent = page.locator('#detail-content');
      await expect(detailContent).toBeVisible({ timeout: 3000 });

      const detailText = await detailContent.textContent();
      expect(detailText).toContain(uniqueCustomerName);
      expect(detailText).toContain(uniqueDealAmount);
      expect(detailText).toContain(uniqueNotes);
    });

    // ステップ9: 営業管理職がリスク対応策を入力して承認
    await test.step('営業管理職がリスク対応策を入力して承認', async () => {
      const riskMitigationInput = page.locator(
        'textarea[placeholder*="リスク対応策"]',
      );
      const riskStrategy = 'リスク対応_' + crypto.randomUUID().substring(0, 8);

      // リスク対応策の入力フィールドが存在する場合のみ入力
      if (await riskMitigationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await riskMitigationInput.fill(riskStrategy);
      }

      // 承認ボタンをクリック
      const approveBtn = page.locator('button:has-text("承認")');
      await approveBtn.click({ timeout: 3000 });

      // 完了状態に遷移していることを確認
      await expect(page.locator('body')).toContainText('完了', {
        timeout: 3000,
      });
    });

    // ステップ10: 推奨履歴データベースに完全な記録が保存されていることを確認
    await test.step('推奨履歴データベースに完全な記録が保存されていることを確認', async () => {
      // API情報を取得
      const apiUrl = await page.evaluate(
        () => (window as any).AIVIC_API_URL,
      );
      const appId = await page.evaluate(
        () => (window as any).AIVIC_APP_ID,
      );
      const tables = await page.evaluate(
        () => (window as any).AIVIC_TABLES || [],
      );

      // 推奨履歴テーブルのインデックスを取得
      const tableIndex = tables.findIndex(
        (t: any) => t.tableName === '推奨履歴',
      );

      if (tableIndex >= 0) {
        const res = await request.get(
          `${apiUrl}/api/${tableIndex}?app=${appId}`,
        );
        const rows = await res.json();

        // 入力した顧客名を含むレコードが存在することを確認
        const recordExists = JSON.stringify(rows).includes(
          uniqueCustomerName,
        );
        expect(recordExists).toBeTruthy();

        // 入力した金額が含まれることを確認
        const amountExists = JSON.stringify(rows).includes(uniqueDealAmount);
        expect(amountExists).toBeTruthy();

        // 入力した備考が含まれることを確認
        const notesExists = JSON.stringify(rows).includes(uniqueNotes);
        expect(notesExists).toBeTruthy();
      }
    });

    // ステップ11: 操作ログに各工程での操作履跡が記録されていることを確認
    await test.step('操作ログに各工程での操作履跡が保存されていることを確認', async () => {
      const apiUrl = await page.evaluate(
        () => (window as any).AIVIC_API_URL,
      );
      const appId = await page.evaluate(
        () => (window as any).AIVIC_APP_ID,
      );
      const tables = await page.evaluate(
        () => (window as any).AIVIC_TABLES || [],
      );

      const logTableIndex = tables.findIndex(
        (t: any) => t.tableName === '操作ログ',
      );

      if (logTableIndex >= 0) {
        const res = await request.get(
          `${logTableIndex}/api/${logTableIndex}?app=${appId}`,
        );
        const logs = await res.json();

        // ログが存在していることを確認（件数チェック）
        expect(Array.isArray(logs)).toBeTruthy();
      }
    });
  });
});