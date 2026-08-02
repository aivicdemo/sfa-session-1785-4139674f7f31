import { test, expect } from '@playwright/test';

test.describe("営業データ入力・登録画面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
    await page.goto("/panels/scr-1785571058964.html");
  });

  // SCEN-054
  test("[error] 営業データ入力・登録画面 - 業種が空で登録ボタンを押すとエラー表示になり処理が進まない", async ({ page }) => {
    await page.fill('input[placeholder*="顧客名"]', '株式会社テスト');
    await page.fill('input[placeholder*="住所"]', '東京都渋谷区');
    await page.fill('input[placeholder*="電話"]', '090-1234-5678');
    await page.click('button:has-text("登録")');
    const errorMsg = page.locator('text=業種は必須項目です');
    await expect(errorMsg).toBeVisible();
    await expect(page).toHaveURL(/scr-1785571058964/);
  });

  // SCEN-055
  test("[error] 営業データ入力・登録画面 - 住所が空で登録ボタンを押すとエラー表示になり処理が進まない", async ({ page }) => {
    await page.fill('input[placeholder*="顧客名"]', '株式会社テスト');
    await page.fill('input[placeholder*="電話"]', '090-1234-5678');
    await page.fill('input[placeholder*="メール"]', 'test@example.com');
    await page.fill('select[placeholder*="業種"]', '製造業');
    await page.click('button:has-text("登録")');
    const errorMsg = page.locator('text=住所は必須項目です');
    await expect(errorMsg).toBeVisible();
    await expect(page).toHaveURL(/scr-1785571058964/);
  });

  // SCEN-056
  test("[error] 営業データ入力・登録画面 - 品質ルール違反がある状態で登録ボタンを押すとエラー表示になり処理が進まない", async ({ page }) => {
    await page.fill('input[placeholder*="メール"]', 'invalid-email-format');
    await page.click('button:has-text("登録")');
    const errorMsg = page.locator('text=/メールアドレスの形式が正しくありません|品質ルール違反/');
    await expect(errorMsg).toBeVisible();
    await expect(page).toHaveURL(/scr-1785571058964/);
  });

  // SCEN-057
  test("[normal] 営業データ入力・登録画面 - 品質検証が完了して全ルールをパスした場合に登録ボタンが有効になる", async ({ page }) => {
    await page.fill('input[placeholder*="顧客名"]', '株式会社テスト');
    await page.fill('input[placeholder*="住所"]', '東京都渋谷区');
    await page.fill('input[placeholder*="電話"]', '090-1234-5678');
    await page.fill('input[placeholder*="メール"]', 'test@example.com');
    await page.fill('input[placeholder*="金額"]', '1500000');
    await page.fill('input[placeholder*="日付"]', '2024-01-15');
    await page.fill('select[placeholder*="業種"]', '製造業');
    await page.click('button:has-text("品質検証")');
    await page.waitForTimeout(1000);
    const registerBtn = page.locator('button:has-text("登録")');
    await expect(registerBtn).toBeEnabled();
  });

  // SCEN-058
  test("[normal] 営業データ入力・登録画面 - 品質検証をパスしたデータで登録ボタンを押すと登録処理が実行される", async ({ page }) => {
    await page.fill('input[placeholder*="案件名"]', 'システム導入');
    await page.fill('input[placeholder*="金額"]', '1500000');
    await page.fill('input[placeholder*="顧客名"]', '山田太郎');
    await page.fill('input[placeholder*="住所"]', '東京都渋谷区');
    await page.fill('input[placeholder*="電話"]', '090-1234-5678');
    await page.fill('input[placeholder*="メール"]', 'yamada@example.com');
    await page.click('button:has-text("品質検証")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("登録")');
    await page.waitForURL(url => !url.toString().includes('scr-1785571058964'));
    await expect(page).not.toHaveURL(/scr-1785571058964/);
  });

  // SCEN-059
  test("[normal] 営業データ入力・登録画面 - 保存ボタンを押すと入力中のデータが一時保存される", async ({ page }) => {
    await page.fill('input[placeholder*="顧客名"]', '山田太郎');
    await page.fill('input[placeholder*="金額"]', '1500000');
    await page.fill('input[placeholder*="案件名"]', 'システム導入');
    await page.click('button:has-text("保存")');
    await page.waitForTimeout(500);
    await page.reload();
    const customerName = page.locator('input[placeholder*="顧客名"]');
    const amount = page.locator('input[placeholder*="金額"]');
    const projectName = page.locator('input[placeholder*="案件名"]');
    await expect(customerName).toHaveValue('山田太郎');
    await expect(amount).toHaveValue('1500000');
    await expect(projectName).toHaveValue('システム導入');
  });

  // SCEN-060
  test("[normal] 営業データ入力・登録画面 - リセットボタンを押すとフォームの入力値が全て初期化される", async ({ page }) => {
    await page.fill('input[placeholder*="案件名"]', 'テスト営業事例001');
    await page.fill('input[placeholder*="顧客名"]', '株式会社テスト');
    await page.fill('input[placeholder*="メール"]', 'test@example.com');
    await page.fill('input[placeholder*="電話"]', '090-1234-5678');
    await page.fill('textarea[placeholder*="備考"]', 'テスト備考');
    await page.click('button:has-text("リセット")');
    await expect(page.locator('input[placeholder*="案件名"]')).toHaveValue('');
    await expect(page.locator('input[placeholder*="顧客名"]')).toHaveValue('');
    await expect(page.locator('input[placeholder*="メール"]')).toHaveValue('');
    await expect(page.locator('input[placeholder*="電話"]')).toHaveValue('');
    await expect(page.locator('textarea[placeholder*="備考"]')).toHaveValue('');
  });

  // SCEN-061
  test("[edge] 営業データ入力・登録画面 - 顧客マスタ検索で検索結果が0件の場合に0件メッセージが表示される", async ({ page }) => {
    await page.fill('input[placeholder*="顧客検索"]', 'zzz_test_no_customer');
    await page.click('button:has-text("検索")');
    await page.waitForTimeout(500);
    const noResultMsg = page.locator('text=/検索結果は0件です|該当するデータがありません/');
    await expect(noResultMsg).toBeVisible();
  });

  // SCEN-062
  test("[edge] 営業データ入力・登録画面 - 顧客マスタ検索で検索結果が複数件の場合に全ての候補が一覧表示される", async ({ page }) => {
    await page.locator('input[placeholder*="顧客名"]').click();
    await page.fill('input[placeholder*="顧客検索"]', '山田');
    await page.click('button:has-text("検索")');
    await page.waitForTimeout(500);
    const resultList = page.locator('div.customer-result-list');
    await expect(resultList).toBeVisible();
    const candidates = await resultList.locator('>> text=/山田/').count();
    expect(candidates).toBeGreaterThan(0);
  });

  // SCEN-066
  test("[normal] 営業データ入力・登録画面 - ダッシュボードで確認された品質ルール違反がリアルタイム検証でエラー・警告として表示される", async ({ page }) => {
    await page.goto("/panels/scr-1785571032716.html");
    await page.waitForTimeout(500);
    await page.goto("/panels/scr-1785571058964.html");
    await page.fill('input[placeholder*="顧客名"]', '');
    await page.fill('input[placeholder*="電話"]', 'invalid-format');
    await page.click('button:has-text("品質検証")');
    await page.waitForTimeout(500);
    const errorMsg1 = page.locator('text=顧客名は必須項目です');
    const errorMsg2 = page.locator('text=/電話番号の形式が正しくありません|形式エラー/');
    await expect(errorMsg1).toBeVisible();
    await expect(errorMsg2).toBeVisible();
  });
});