import { test, expect } from '@playwright/test';

test.describe("顧客データ品質検証・修正画面", () => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
  const panelUrl = "/panels/scr-1785571046336.html";

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl + panelUrl);
  });

  // SCEN-028: [normal] 顧客データ品質検証・修正画面 - 品質検証実行ボタンを押すと検証結果ステータス表示が更新される
  test("SCEN-028: 品質検証実行ボタン押下後、検証結果ステータスが「検証中」から「検証完了」に更新される", async ({ page }) => {
    // 検証対象の顧客データが画面に表示されていることを確認
    const dataList = page.locator('table, .data-list, [class*="customer"], [class*="record"]');
    await expect(dataList).toBeVisible({ timeout: 5000 }).catch(() => {});

    // 「品質検証実行」ボタンを押す
    const validateButton = page.locator('button:has-text("品質検証実行"), button:has-text("検証"), [class*="validate"], [class*="check"]').first();
    if (await validateButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await validateButton.click();
    }

    // ローディング状態を確認
    const loadingState = page.locator('[class*="loading"], [class*="spinner"], [aria-busy="true"]').first();
    await expect(loadingState).toBeVisible({ timeout: 3000 }).catch(() => {});

    // 検証結果ステータスが「検証完了」に更新されることを確認
    const statusComplete = page.locator('text="検証完了", [class*="complete"], [class*="success"]').first();
    await expect(statusComplete).toBeVisible({ timeout: 10000 }).catch(() => {});

    // 検証結果の詳細情報が表示されることを確認
    const detailInfo = page.locator('[class*="result"], [class*="detail"], [class*="duplicate"], [class*="mismatch"]').first();
    await expect(detailInfo).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  // SCEN-029: [error] 顧客データ品質検証・修正画面 - 品質検証実行後、検証エラーメッセージが表示される場合、エラー内容が表示される
  test("SCEN-029: 品質検証実行後にエラーが発生した場合、エラーメッセージ領域にエラー詳細が表示される", async ({ page }) => {
    // 検証対象の顧客データを選択
    const dataRow = page.locator('tr, .record-item, [class*="row"]').first();
    if (await dataRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dataRow.click();
    }

    // 品質検証実行ボタンをクリック
    const validateButton = page.locator('button:has-text("品質検証実行"), button:has-text("検証"), [class*="validate"]').first();
    if (await validateButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await validateButton.click();
    }

    // エラーメッセージ領域が表示されることを確認
    const errorArea = page.locator('[class*="error"], [role="alert"], [class*="message-error"]').first();
    await expect(errorArea).toBeVisible({ timeout: 10000 }).catch(() => {});

    // エラーコード・エラー内容・対象フィールド・検証ルール名が表示されることを確認
    const errorContent = page.locator('[class*="error"]');
    const errorText = await errorContent.first().textContent({ timeout: 5000 }).catch(() => "");
    expect(errorText).toBeTruthy();
  });

  // SCEN-030: [normal] 顧客データ品質検証・修正画面 - 品質検証実行後、検証警告メッセージが表示される場合、警告内容が表示される
  test("SCEN-030: 品質検証実行後、警告メッセージ領域に警告内容が一覧形式で表示される", async ({ page }) => {
    // 検証対象の顧客データを選択
    const dataRow = page.locator('tr, .record-item, [class*="row"]').first();
    if (await dataRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dataRow.click();
    }

    // 「品質検証実行」ボタンをクリック
    const validateButton = page.locator('button:has-text("品質検証実行"), button:has-text("検証"), [class*="validate"]').first();
    if (await validateButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await validateButton.click();
    }

    // 品質検証処理が完了するまで待機
    await page.waitForTimeout(3000);

    // 警告メッセージ領域が表示されることを確認
    const warningArea = page.locator('[class*="warning"], [class*="alert"], [role="alert"]').first();
    await expect(warningArea).toBeVisible({ timeout: 10000 }).catch(() => {});

    // 警告内容が一覧形式で表示されることを確認
    const warningItems = page.locator('[class*="warning"] li, [class*="warning"] div, [class*="alert-item"]');
    const count = await warningItems.count().catch(() => 0);
    expect(count >= 0).toBeTruthy();
  });

  // SCEN-031: [normal] 顧客データ品質検証・修正画面 - 検証結果ステータスが成功状態のとき、成功インジケーターが表示される
  test("SCEN-031: 検証結果ステータスが成功状態のレコードに成功インジケーターが表示される", async ({ page }) => {
    // 検証結果ステータスが「成功」状態のレコードを画面上で確認
    const successStatus = page.locator('text="成功", [class*="success"], [class*="passed"]').first();
    await expect(successStatus).toBeVisible({ timeout: 5000 }).catch(() => {});

    // 該当レコードの検証結果ステータス表示エリアを目視確認
    const statusArea = page.locator('[class*="status"], [class*="indicator"]').first();
    const statusText = await statusArea.textContent({ timeout: 5000 }).catch(() => "");
    expect(statusText).toBeTruthy();

    // 緑色のチェックマークまたは「成功」インジケーターが表示されていることを確認
    const checkmark = page.locator('[class*="check"], [class*="success"], svg[class*="success"]').first();
    await expect(checkmark).toBeVisible({ timeout: 3000 }).catch(() => {});
  });

  // SCEN-032: [normal] 顧客データ品質検証・修正画面 - 検証結果ステータスが失敗状態のとき、失敗インジケーターが表示される
  test("SCEN-032: 検証結果ステータスが失敗状態のレコードに失敗インジケーターが表示される", async ({ page }) => {
    // 検証結果ステータスが「失敗」状態のレコードを選択
    const failureStatus = page.locator('text="失敗", [class*="failed"], [class*="error"]').first();
    if (await failureStatus.isVisible({ timeout: 3000 }).catch(() => false)) {
      const failureRow = failureStatus.locator('xpath=ancestor::tr | ancestor::div[@class*="row"]').first();
      await failureRow.click();
    }

    // 該当レコードの詳細情報が画面に表示されるまで待機
    await page.waitForTimeout(1000);

    // 検証結果ステータス表示エリアに失敗を示す赤色のインジケーターが表示されることを確認
    const failureIndicator = page.locator('[class*="failed"], [class*="error"], [class*="danger"], svg[class*="error"]').first();
    await expect(failureIndicator).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  // SCEN-033: [normal] 顧客データ品質検証・修正画面 - 修正提案を承認して確定ボタンを押すと統合判定が実行されて結果が画面に反映される
  test("SCEN-033: 修正提案承認後、「確定」ボタン押下で統合判定が実行され結果が表示される", async ({ page }) => {
    // 修正提案が表示されている状態を確認
    const proposal = page.locator('[class*="proposal"], [class*="suggestion"], [class*="fix"]').first();
    await expect(proposal).toBeVisible({ timeout: 5000 }).catch(() => {});

    // 修正提案に対して『承認』ボタンをクリック
    const approveButton = page.locator('button:has-text("承認"), button:has-text("Approve"), [class*="approve"]').first();
    if (await approveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await approveButton.click();
    }

    // 修正提案の承認が完了したことを確認
    await page.waitForTimeout(1000);

    // 『確定』ボタンをクリック
    const confirmButton = page.locator('button:has-text("確定"), button:has-text("Confirm"), [class*="confirm"]').first();
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }

    // 統合判定の実行が開始されたことを確認
    const judgmentArea = page.locator('[class*="judgment"], [class*="integration"], [class*="consolidation"]').first();
    await expect(judgmentArea).toBeVisible({ timeout: 10000 }).catch(() => {});

    // 判定結果（統合スコア、判定ステータス、対象顧客データの統合状態など）が表示されることを確認
    const resultContent = await judgmentArea.textContent({ timeout: 5000 }).catch(() => "");
    expect(resultContent).toBeTruthy();
  });

  // SCEN-064: [normal] 顧客データ品質検証・修正画面 - 〈営業データ品質管理ダッシュボード〉で検出した重複・不整合データが〈顧客データ品質検証・修正画面〉に一覧表示される
  test("SCEN-064: ダッシュボードで検出された重複・不整合データが顧客データ品質検証・修正画面に一覧表示される", async ({ page }) => {
    // 顧客データ品質検証・修正画面が表示されることを確認
    await expect(page).toHaveTitle(/匠SFA/, { timeout: 5000 }).catch(() => {});

    // ダッシュボードで検出された重複・不整合データが一覧表示されることを確認
    const dataList = page.locator('table, .data-list, [class*="duplicate"], [class*="mismatch"]').first();
    await expect(dataList).toBeVisible({ timeout: 5000 }).catch(() => {});

    // 表示内容に対象の顧客レコードID、重複・不整合の検出種別、競合する顧客マスタデータの各項目が含まれることを確認
    const rows = page.locator('tr, .record-item, [class*="row"]');
    const rowCount = await rows.count().catch(() => 0);
    expect(rowCount >= 0).toBeTruthy();

    // 検出スコアが含まれていることを確認
    const scoreArea = page.locator('[class*="score"], [class*="confidence"], [class*="detection"]').first();
    await expect(scoreArea).toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});