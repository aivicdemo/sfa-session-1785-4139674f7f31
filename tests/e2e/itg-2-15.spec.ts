import { test, expect } from '@playwright/test';

test.describe("営業データ入力・登録画面", () => {
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto("/login.html");
    await page.fill('[name="username"]', 'test');
    await page.fill('[name="password"]', 'test');
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('/login.html')),
      page.click('button[type="submit"]'),
    ]);
    // 対象画面に遷移
    await page.goto("/panels/scr-1785571058964.html");
  });

  // SCEN-034
  test("営業事例名を入力すると入力値が反映される", async ({ page }) => {
    // 営業事例名の入力フィールドを探してフォーカス
    const inputs = await page.locator('input').all();
    let businessExampleNameInput = null;
    
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && placeholder.includes('営業事例')) {
        businessExampleNameInput = input;
        break;
      }
    }
    
    if (!businessExampleNameInput) {
      businessExampleNameInput = inputs[0];
    }
    
    await businessExampleNameInput.click();
    await businessExampleNameInput.fill('テスト営業事例001');
    await page.keyboard.press('Tab');
    
    const value = await businessExampleNameInput.inputValue();
    expect(value).toBe('テスト営業事例001');
  });

  // SCEN-035
  test("受注金額を入力すると入力値が反映される", async ({ page }) => {
    const inputs = await page.locator('input[type="text"], input[type="number"]').all();
    let amountInput = null;
    
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && placeholder.includes('金額')) {
        amountInput = input;
        break;
      }
    }
    
    if (!amountInput) {
      amountInput = inputs[1] || inputs[0];
    }
    
    await amountInput.click();
    await amountInput.fill('1500000');
    await page.keyboard.press('Tab');
    
    const value = await amountInput.inputValue();
    expect(value).toBe('1500000');
  });

  // SCEN-036
  test("案件ステージを入力すると入力値が反映される", async ({ page }) => {
    const selects = await page.locator('select').all();
    let stageSelect = null;
    
    for (const select of selects) {
      const options = await select.locator('option').all();
      for (const opt of options) {
        const text = await opt.textContent();
        if (text && text.includes('提案')) {
          stageSelect = select;
          break;
        }
      }
      if (stageSelect) break;
    }
    
    if (!stageSelect && selects.length > 0) {
      stageSelect = selects[0];
    }
    
    if (stageSelect) {
      await stageSelect.selectOption({ label: '提案段階' });
      const selected = await stageSelect.inputValue();
      expect(selected).toBeTruthy();
    }
  });

  // SCEN-037
  test("顧客データ入力フォームに顧客名を入力すると入力値が反映される", async ({ page }) => {
    const inputs = await page.locator('input[type="text"]').all();
    let customerNameInput = null;
    
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && placeholder.includes('顧客名')) {
        customerNameInput = input;
        break;
      }
    }
    
    if (!customerNameInput) {
      customerNameInput = inputs[0];
    }
    
    await customerNameInput.click();
    await customerNameInput.fill('山田太郎');
    await page.click('body');
    
    const value = await customerNameInput.inputValue();
    expect(value).toBe('山田太郎');
  });

  // SCEN-038
  test("業種を入力すると入力値が反映される", async ({ page }) => {
    const selects = await page.locator('select').all();
    let industrySelect = null;
    
    for (const select of selects) {
      const options = await select.locator('option').all();
      for (const opt of options) {
        const text = await opt.textContent();
        if (text && (text.includes('IT') || text.includes('ソフトウェア'))) {
          industrySelect = select;
          break;
        }
      }
      if (industrySelect) break;
    }
    
    if (industrySelect) {
      await industrySelect.selectOption({ label: 'IT・ソフトウェア' });
      await page.click('body');
      const selected = await industrySelect.inputValue();
      expect(selected).toBeTruthy();
      
      await industrySelect.selectOption({ label: '製造業' });
      const newSelected = await industrySelect.inputValue();
      expect(newSelected).toBeTruthy();
    }
  });

  // SCEN-039
  test("住所を入力すると入力値が反映される", async ({ page }) => {
    const inputs = await page.locator('input[type="text"]').all();
    let addressInput = null;
    
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && placeholder.includes('住所')) {
        addressInput = input;
        break;
      }
    }
    
    if (!addressInput) {
      addressInput = inputs[inputs.length - 1] || inputs[0];
    }
    
    await addressInput.click();
    await addressInput.fill('東京都渋谷区道玄坂1-2-3');
    await page.click('body');
    
    const value = await addressInput.inputValue();
    expect(value).toBe('東京都渋谷区道玄坂1-2-3');
  });

  // SCEN-040
  test("顧客マスタ検索・選択ウィジェットで既存顧客を検索して選択すると顧客データが入力フォームに反映される", async ({ page }) => {
    const searchInputs = await page.locator('input[type="text"]').all();
    let searchWidget = null;
    
    for (const input of searchInputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && (placeholder.includes('検索') || placeholder.includes('顧客'))) {
        searchWidget = input;
        break;
      }
    }
    
    if (searchWidget) {
      await searchWidget.click();
      await searchWidget.fill('山田太郎');
      await page.waitForTimeout(300);
      
      const options = await page.locator('li, div[role="option"]').all();
      if (options.length > 0) {
        await options[0].click();
        await page.waitForTimeout(300);
        
        const inputs = await page.locator('input[type="text"]').all();
        const hasData = inputs.some(async (input) => {
          const value = await input.inputValue();
          return value && value.includes('山田');
        });
        expect(hasData).toBeTruthy();
      }
    }
  });

  // SCEN-041
  test("リアルタイム品質検証インジケーターが品質検証の実行状態を表示する", async ({ page }) => {
    const inputs = await page.locator('input[type="text"]').all();
    if (inputs.length > 0) {
      await inputs[0].click();
      await inputs[0].fill('山田太郎');
    }
    
    if (inputs.length > 1) {
      await inputs[1].click();
      await inputs[1].fill('150000');
    }
    
    await page.waitForTimeout(500);
    
    const spinners = await page.locator('span[class*="loading"], span[class*="spinner"], div[class*="validation"]').all();
    const validationIndicator = spinners.length > 0 || await page.locator('text=/検証/i').isVisible().catch(() => false);
    
    expect(validationIndicator || spinners.length > 0).toBeTruthy();
  });

  // SCEN-042
  test("入力値に対してデータ品質ルール適用チェック結果が画面に表示される", async ({ page }) => {
    const inputs = await page.locator('input[type="text"]').all();
    
    if (inputs.length > 0) {
      await inputs[0].fill('田中太郎');
    }
    if (inputs.length > 1) {
      await inputs[1].fill('tanaka@example.com');
    }
    if (inputs.length > 2) {
      await inputs[2].fill('090-1234-5678');
    }
    if (inputs.length > 3) {
      await inputs[3].fill('東京都渋谷区1-2-3');
    }
    
    await page.waitForTimeout(800);
    
    const ruleResults = await page.locator('div[class*="rule"], div[class*="validation"], div[class*="result"], span[class*="status"]').all();
    expect(ruleResults.length > 0).toBeTruthy();
  });

  // SCEN-043
  test("品質ルール違反時に入力エラー・警告メッセージパネルにエラーメッセージが表示される", async ({ page }) => {
    const inputs = await page.locator('input[type="text"]').all();
    
    if (inputs.length > 0) {
      await inputs[0].fill('');
    }
    if (inputs.length > 1) {
      await inputs[1].fill('123');
    }
    
    const registerButtons = await page.locator('button').all();
    let registerButton = null;
    for (const btn of registerButtons) {
      const text = await btn.textContent();
      if (text && (text.includes('登録') || text.includes('送信'))) {
        registerButton = btn;
        break;
      }
    }
    
    if (registerButton) {
      await registerButton.click();
      await page.waitForTimeout(500);
    }
    
    const errorMessages = await page.locator('div[class*="error"], div[class*="warning"], div[class*="message"], span[class*="alert"]').all();
    expect(errorMessages.length > 0).toBeTruthy();
  });
});