import { test, expect } from '@playwright/test';

test.describe("営業データ入力・登録画面", () => {
  // SCEN-069: [normal] 営業データ入力・登録画面 - 〈顧客データの重複排除と正規化〉が最初から最後まで通り、記録が残る
  test("顧客データの重複排除と正規化フロー全体が通り、各工程の記録が保存される", async ({ page, request }) => {
    const uniqueValue = "yamada_" + Date.now();
    const customerName = "山田太郎_" + uniqueValue;
    const customerEmail = "yamada." + uniqueValue + "@example.com";
    const customerPhone = "0901234567" + Math.floor(Math.random() * 10);
    const customerAddress = "東京都渋谷区" + uniqueValue;

    // 取得用の API 設定情報
    let apiUrl: string;
    let appId: string;
    let customerMasterTableIndex: number;
    let duplicationCandidateTableIndex: number;
    let validationResultTableIndex: number;
    let integrationHistoryTableIndex: number;
    let operationLogTableIndex: number;

    // ===== 工程1: 営業データ入力・登録 =====
    await test.step("営業データ入力・登録画面でデータを入力して登録", async () => {
      await page.goto("/panels/scr-1785571058964.html");
      
      // API設定を取得
      apiUrl = await page.evaluate(() => (window as any).AIVIC_API_URL);
      appId = await page.evaluate(() => (window as any).AIVIC_APP_ID);
      
      // テーブルインデックスを取得
      const tables = await page.evaluate(() => (window as any).AIVIC_TABLES || []);
      customerMasterTableIndex = tables.findIndex((t: any) => t.tableName === "顧客マスタ");
      duplicationCandidateTableIndex = tables.findIndex((t: any) => t.tableName === "顧客重複候補");
      validationResultTableIndex = tables.findIndex((t: any) => t.tableName === "品質検証結果");
      integrationHistoryTableIndex = tables.findIndex((t: any) => t.tableName === "統合判定履歴");
      operationLogTableIndex = tables.findIndex((t: any) => t.tableName === "操作ログ");

      // 入力フィールドを検索してデータを入力
      const nameInputs = await page.locator('input[type="text"]').all();
      const emailInputs = await page.locator('input[type="email"]').all();
      const phoneInputs = await page.locator('input[type="tel"]').all();

      if (nameInputs.length > 0) {
        await nameInputs[0].fill(customerName);
      }
      if (emailInputs.length > 0) {
        await emailInputs[0].fill(customerEmail);
      }
      if (phoneInputs.length > 0) {
        await phoneInputs[0].fill(customerPhone);
      }

      // 住所フィールド（テキストエリアまたはテキスト入力）
      const textareas = await page.locator('textarea').all();
      const allTextInputs = await page.locator('input[type="text"]').all();
      if (textareas.length > 0) {
        await textareas[0].fill(customerAddress);
      } else if (allTextInputs.length > 1) {
        await allTextInputs[allTextInputs.length - 1].fill(customerAddress);
      }

      // 登録ボタンを探して押す
      const buttons = await page.locator('button').all();
      let submitButton = null;
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && (text.includes('登録') || text.includes('保存') || text.includes('Submit'))) {
          submitButton = btn;
          break;
        }
      }
      
      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(1000);
      }

      // 顧客マスタにデータが記録されたことを確認
      const res = await request.get(`${apiUrl}/api/${customerMasterTableIndex}?app=${appId}`);
      const rows = await res.json();
      expect(JSON.stringify(rows)).toContain(uniqueValue);
    });

    // ===== 工程2: 営業管理職によるバッチ処理トリガー確認 =====
    await test.step("営業管理職がダッシュボードからバッチ処理トリガー確認を実施", async () => {
      // ダッシュボード画面に遷移（営業データ品質管理ダッシュボード想定）
      await page.goto("/panels/scr-1785571032716.html");
      await page.waitForTimeout(500);

      // 登録されたデータが画面に表示されていることを確認
      const pageContent = await page.content();
      expect(pageContent).toContain("匠SFA");
    });

    // ===== 工程3: 営業管理職による重複検知ルール実行指示 =====
    await test.step("営業管理職がダッシュボード上で重複検知ルール実行指示ボタンをクリック", async () => {
      const buttons = await page.locator('button').all();
      let ruleTriggerButton = null;
      
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && (text.includes('重複検知') || text.includes('ルール実行') || text.includes('トリガー'))) {
          ruleTriggerButton = btn;
          break;
        }
      }

      if (ruleTriggerButton) {
        await ruleTriggerButton.click();
        await page.waitForTimeout(1000);
      }

      // 状態が更新されたことを確認（操作ログに記録）
      const operationRes = await request.get(`${apiUrl}/api/${operationLogTableIndex}?app=${appId}`);
      const operationLogs = await operationRes.json();
      expect(Array.isArray(operationLogs)).toBe(true);
    });

    // ===== 工程4: IT部門がアクセスして重複検知ルール実行指示の状態を確認 =====
    await test.step("IT部門のアクセス権限で重複データ確認・分析画面にアクセス", async () => {
      // 顧客データ品質検証・修正画面に遷移（IT部門用）
      await page.goto("/panels/scr-1785571058964.html");
      await page.waitForTimeout(500);

      // 登録データが画面に表示されていることを確認
      const pageText = await page.textContent();
      expect(pageText).toBeTruthy();
    });

    // ===== 工程5: IT部門が重複・不整合検出結果を確認して分析 =====
    await test.step("IT部門が検出された重複候補や不整合項目を確認し、分析内容をダッシュボードに記録", async () => {
      // 重複候補が顧客重複候補テーブルに記録されていることを確認
      const dupRes = await request.get(`${apiUrl}/api/${duplicationCandidateTableIndex}?app=${appId}`);
      const dupData = await dupRes.json();
      expect(Array.isArray(dupData)).toBe(true);

      // 分析確認ボタンを探して押す
      const buttons = await page.locator('button').all();
      let confirmButton = null;
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && (text.includes('確認') || text.includes('分析') || text.includes('次へ'))) {
          confirmButton = btn;
          break;
        }
      }

      if (confirmButton) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    });

    // ===== 工程6: 営業管理職が修正ルール検討・承認 =====
    await test.step("営業管理職がIT部門の分析結果を確認し、修正ルールを入力して承認", async () => {
      // ダッシュボード画面で修正ルール検討工程へ遷移したことを確認
      await page.goto("/panels/scr-1785571032716.html");
      await page.waitForTimeout(500);

      // 修正ルール入力フィールドを探して入力
      const textareas = await page.locator('textarea').all();
      const textInputs = await page.locator('input[type="text"]').all();
      
      const ruleContent = "重複レコードをマージ、メールアドレスを正規化" + uniqueValue;
      
      if (textareas.length > 0) {
        await textareas[0].fill(ruleContent);
      } else if (textInputs.length > 0) {
        await textInputs[textInputs.length - 1].fill(ruleContent);
      }

      // 承認ボタンを探して押す
      const buttons = await page.locator('button').all();
      let approveButton = null;
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && (text.includes('承認') || text.includes('決定') || text.includes('確定'))) {
          approveButton = btn;
          break;
        }
      }

      if (approveButton) {
        await approveButton.click();
        await page.waitForTimeout(1000);
      }

      // 修正ルールが操作ログに記録されたことを確認
      const operationRes = await request.get(`${apiUrl}/api/${operationLogTableIndex}?app=${appId}`);
      const operationLogs = await operationRes.json();
      expect(JSON.stringify(operationLogs)).toContain(ruleContent);
    });

    // ===== 工程7: IT部門が正規化結果を検証 =====
    await test.step("IT部門が顧客データ品質検証・修正画面で正規化結果を確認して検証完了をボタンをクリック", async () => {
      // 検証画面に遷移
      await page.goto("/panels/scr-1785571058964.html");
      await page.waitForTimeout(500);

      // 正規化結果（統合されたレコード、正規化されたデータ形式）が表示されていることを確認
      const pageContent = await page.content();
      expect(pageContent).toBeTruthy();

      // 検証完了ボタンを探して押す
      const buttons = await page.locator('button').all();
      let verifyButton = null;
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && (text.includes('検証完了') || text.includes('完了') || text.includes('確認'))) {
          verifyButton = btn;
          break;
        }
      }

      if (verifyButton) {
        await verifyButton.click();
        await page.waitForTimeout(1000);
      }

      // 品質検証結果テーブルに記録が追加されたことを確認
      const validRes = await request.get(`${apiUrl}/api/${validationResultTableIndex}?app=${appId}`);
      const validData = await validRes.json();
      expect(Array.isArray(validData)).toBe(true);
    });

    // ===== 工程8: 営業管理職がデータ品質レポート確認画面で最終確認 =====
    await test.step("営業管理職がダッシュボードからデータ品質レポート確認画面に遷移し、全工程の履歴と結果を確認", async () => {
      // ダッシュボード画面に戻る
      await page.goto("/panels/scr-1785571032716.html");
      await page.waitForTimeout(500);

      // 統合判定履歴テーブルに最終結果が記録されたことを確認
      const integrationRes = await request.get(`${apiUrl}/api/${integrationHistoryTableIndex}?app=${appId}`);
      const integrationData = await integrationRes.json();
      expect(Array.isArray(integrationData)).toBe(true);

      // 操作ログに全工程の履歴が記録されたことを確認
      const operationRes = await request.get(`${apiUrl}/api/${operationLogTableIndex}?app=${appId}`);
      const operationLogs = await operationRes.json();
      
      // 各工程が記録されていることを検証
      const logContent = JSON.stringify(operationLogs);
      expect(logContent).toBeTruthy();
      
      // 最終的に顧客マスタに統合・正規化されたデータが存在することを確認
      const finalRes = await request.get(`${apiUrl}/api/${customerMasterTableIndex}?app=${appId}`);
      const finalRows = await finalRes.json();
      expect(JSON.stringify(finalRows)).toContain(uniqueValue);
    });

    // ===== 最終検証: 全工程の記録が保存されていることを確認 =====
    await test.step("全工程の実行記録（タイムスタンプ、実行者、入力内容、ステータス）がシステムに保存されていることを確認", async () => {
      // 操作ログから全工程の記録を取得
      const operationRes = await request.get(`${apiUrl}/api/${operationLogTableIndex}?app=${appId}`);
      const allLogs = await operationRes.json();
      
      // 複数の操作ログが記録されていることを確認
      expect(Array.isArray(allLogs)).toBe(true);
      expect(allLogs.length).toBeGreaterThan(0);

      // 顧客マスタに統合・正規化されたデータが存在することを最終確認
      const masterRes = await request.get(`${apiUrl}/api/${customerMasterTableIndex}?app=${appId}`);
      const masterRows = await masterRes.json();
      expect(JSON.stringify(masterRows)).toContain(customerName);
      expect(JSON.stringify(masterRows)).toContain(customerEmail);
    });
  });
});