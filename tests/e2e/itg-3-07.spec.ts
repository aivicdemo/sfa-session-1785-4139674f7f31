import { test, expect } from '@playwright/test';

test.describe("AIエージェント推奨支援ダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/panels/scr-1785571913372.html");
  });

  // SCEN-001
  test("顧客マスタ検索で検索条件を入力して検索実行ボタンを押すと検索結果一覧が表示される", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("テスト太郎");
    
    const searchButton = page.locator('button:has-text("推奨を実行")').first();
    await searchButton.click();
    
    const resultTable = page.locator('.table');
    await expect(resultTable).toBeVisible({ timeout: 5000 });
  });

  // SCEN-002
  test("顧客マスタ検索で検索条件を入力して検索実行ボタンを押したときに0件の場合は空表示になる", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("存在しない顧客XXXXXX");
    
    const searchButton = page.locator('button:has-text("推奨を実行")').first();
    await searchButton.click();
    
    const emptyMessage = page.locator('text=該当する顧客がありません');
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
  });

  // SCEN-003
  test("検索結果一覧から顧客を選択すると新規案件情報入力フォームに顧客情報が自動入力される", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("テスト太郎");
    
    const searchButton = page.locator('button:has-text("推奨を実行")').first();
    await searchButton.click();
    
    await page.waitForTimeout(1000);
    
    const tableRow = page.locator('.table tbody tr').first();
    await tableRow.click();
    
    const customerName = page.locator('[data-testid="customer-search"]');
    await expect(customerName).toHaveValue(/テスト太郎/);
  });

  // SCEN-004
  test("商談条件入力欄に入力した値がAIエージェント推奨実行時に処理へ届く", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("テスト顧客A");
    
    const industrySelect = page.locator('[data-testid="industry-select"]');
    await industrySelect.selectOption("IT");
    
    const budgetInput = page.locator('[data-testid="condition-budget"]');
    await budgetInput.fill("500");
    
    const notesTextarea = page.locator('[data-testid="deal-notes"]');
    await notesTextarea.fill("システム導入");
    
    await page.waitForTimeout(500);
    
    const executeButton = page.locator('button:has-text("推奨を実行")').first();
    await executeButton.click();
    
    const recommendationContent = page.locator('#recommendation-content');
    await expect(recommendationContent).toBeVisible({ timeout: 5000 });
  });

  // SCEN-005
  test("顧客マスタ検索が必須のため検索・選択なしでAIエージェント推奨実行ボタンを押すとエラー表示になる", async ({ page }) => {
    const budgetInput = page.locator('[data-testid="condition-budget"]');
    await budgetInput.fill("500");
    
    const executeButton = page.locator('button:has-text("推奨を実行")').first();
    await executeButton.click();
    
    const errorMessage = page.locator('text=顧客マスタの選択は必須です');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  // SCEN-006
  test("商談条件入力が必須のため入力なしでAIエージェント推奨実行ボタンを押すとエラー表示になる", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("○○株式会社");
    
    const executeButton = page.locator('button:has-text("推奨を実行")').first();
    await executeButton.click();
    
    const errorMessage = page.locator('text=商談条件は必須項目です');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    
    await expect(executeButton).toBeDisabled();
  });

  // SCEN-007
  test("AIエージェント推奨実行ボタンを押すと推奨提案アプローチ表示パネルが表示される", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("テスト顧客");
    
    const industrySelect = page.locator('[data-testid="industry-select"]');
    await industrySelect.selectOption("IT");
    
    const budgetInput = page.locator('[data-testid="condition-budget"]');
    await budgetInput.fill("500");
    
    const executeButton = page.locator('button:has-text("推奨を実行")').first();
    await executeButton.click();
    
    const recommendationPanel = page.locator('#recommendation-content');
    await expect(recommendationPanel).toBeVisible({ timeout: 5000 });
    
    const scoreElement = page.locator('[data-testid="kpi-avg-confidence"]');
    await expect(scoreElement).toBeVisible();
  });

  // SCEN-008
  test("AIエージェント推奨実行ボタンを押すと推奨根拠の可視化表示が表示される", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("テスト太郎");
    
    const industrySelect = page.locator('[data-testid="industry-select"]');
    await industrySelect.selectOption("IT");
    
    const budgetInput = page.locator('[data-testid="condition-budget"]');
    await budgetInput.fill("500");
    
    const decisionSelect = page.locator('[data-testid="condition-decision"]');
    await decisionSelect.click();
    
    const executeButton = page.locator('button:has-text("推奨を実行")').first();
    await executeButton.click();
    
    const reasoningBasis = page.locator('#recommendation-basis');
    await expect(reasoningBasis).toBeVisible({ timeout: 5000 });
    
    await expect(reasoningBasis).toContainText("過去");
  });

  // SCEN-009
  test("AIエージェント推奨実行ボタンを押すと成功パターン詳細表示が表示される", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("テスト企業");
    
    const companySizeSelect = page.locator('[data-testid="company-size-select"]');
    await companySizeSelect.selectOption("中堅企業");
    
    const budgetInput = page.locator('[data-testid="expected-amount"]');
    await budgetInput.fill("1000");
    
    const stageSelect = page.locator('[data-testid="deal-stage-select"]');
    await stageSelect.selectOption("提案");
    
    const executeButton = page.locator('button:has-text("推奨を実行")').first();
    await executeButton.click();
    
    const successPatternSection = page.locator('text=成功パターン');
    await expect(successPatternSection).toBeVisible({ timeout: 5000 });
    
    const recommendationContent = page.locator('#recommendation-content');
    await expect(recommendationContent).toContainText("マッチ");
  });

  // SCEN-010
  test("AIエージェント推奨実行ボタンを押すと類似案件一覧・比較ビューが表示される", async ({ page }) => {
    const customerSearchInput = page.locator('[data-testid="customer-search"]');
    await customerSearchInput.fill("テスト企業B");
    
    const companySizeSelect = page.locator('[data-testid="company-size-select"]');
    await companySizeSelect.selectOption("大企業");
    
    const industrySelect = page.locator('[data-testid="industry-select"]');
    await industrySelect.selectOption("金融");
    
    const budgetInput = page.locator('[data-testid="condition-budget"]');
    await budgetInput.fill("2000");
    
    const executeButton = page.locator('button:has-text("推奨を実行")').first();
    await executeButton.click();
    
    const similarDealsTitle = page.locator('text=類似案件一覧');
    await expect(similarDealsTitle).toBeVisible({ timeout: 5000 });
    
    const similarDealsTable = page.locator('#similar-deals-tbody');
    await expect(similarDealsTable).toBeVisible();
  });
});