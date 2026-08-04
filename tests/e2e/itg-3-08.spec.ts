import { test, expect } from '@playwright/test';

test.describe("AIエージェント推奨支援ダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/panels/scr-1785571913372.html");
  });

  // SCEN-011
  test("[edge] AIエージェント推奨支援ダッシュボード - AIエージェント推奨実行時に類似案件が0件の場合は空表示になる", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', 'テスト顧客A');
    await page.selectOption('[data-testid="industry-select"]', '製造業');
    await page.fill('[data-testid="condition-budget"]', '500');
    await page.fill('[data-testid="expected-amount"]', '500');
    await page.selectOption('[data-testid="deal-stage-select"]', '初期接触');

    // Stub: AIRecommendationEngine returns empty array
    await page.evaluate(() => {
      (window as any).__recommendationStub = { patterns: [] };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    const recommendationContent = page.locator('#recommendation-content');
    const text = await recommendationContent.textContent();
    
    expect(text).toContain('該当する過去案件がありません');
    expect(text).not.toContain('提案アプローチ');
  });

  // SCEN-012
  test("[normal] AIエージェント推奨支援ダッシュボード - AIエージェント推奨実行時に類似案件が複数件の場合はすべて一覧表示される", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', 'A社');
    await page.selectOption('[data-testid="industry-select"]', '製造業');
    await page.selectOption('[data-testid="deal-stage-select"]', '提案');
    await page.fill('[data-testid="expected-amount"]', '5000');

    // Stub: AIRecommendationEngine returns 3 similar patterns
    await page.evaluate(() => {
      (window as any).__recommendationStub = {
        patterns: [
          { id: 'X', similarity: 0.92, name: '過去案件X' },
          { id: 'Y', similarity: 0.87, name: '過去案件Y' },
          { id: 'Z', similarity: 0.81, name: '過去案件Z' }
        ]
      };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    const similarRow = page.locator('#similar-deals-tbody tr');
    const count = await similarRow.count();
    
    expect(count).toBe(3);
    
    const firstRow = await similarRow.nth(0).textContent();
    expect(firstRow).toContain('92');
    
    const secondRow = await similarRow.nth(1).textContent();
    expect(secondRow).toContain('87');
    
    const thirdRow = await similarRow.nth(2).textContent();
    expect(thirdRow).toContain('81');
  });

  // SCEN-013
  test("[normal] AIエージェント推奨支援ダッシュボード - 推奨内容詳細表示をクリックすると推奨内容の詳細情報が展開・表示される", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', 'テスト顧客');
    await page.selectOption('[data-testid="industry-select"]', '金融');
    await page.selectOption('[data-testid="deal-stage-select"]', '提案');
    await page.fill('[data-testid="expected-amount"]', '1000');

    await page.evaluate(() => {
      (window as any).__recommendationStub = {
        patterns: [{ id: '1', similarity: 0.9, name: '成功案件1' }],
        recommendation: {
          approach: '段階導入モデル',
          confidence: 95,
          reasoning: '類似案件7件と一致'
        }
      };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    const detailButton = page.locator('button:has-text("詳細を見る"), [role="button"]:has-text("詳細"), .action-btn:visible').first();
    await detailButton.click();
    await page.waitForTimeout(300);

    const detailContent = page.locator('#recommendation-content');
    const detailText = await detailContent.textContent();
    
    expect(detailText).toContain('段階導入モデル');
    expect(detailText).toContain('類似案件');
  });

  // SCEN-014
  test("[normal] AIエージェント推奨支援ダッシュボード - 推奨根拠詳細表示をクリックすると推奨根拠の詳細情報が展開・表示される", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', 'B社');
    await page.selectOption('[data-testid="industry-select"]', 'IT');
    await page.selectOption('[data-testid="deal-stage-select"]', '交渉');
    await page.fill('[data-testid="expected-amount"]', '2000');

    await page.evaluate(() => {
      (window as any).__recommendationStub = {
        patterns: [{ id: '2', similarity: 0.88, name: '過去案件2' }],
        recommendation: {
          approach: 'クラウド導入',
          confidence: 88,
          reasoning: '適用可能性スコア: 88%'
        }
      };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    const basisButton = page.locator('#recommendation-basis').locator('..').locator('button').first();
    await basisButton.click();
    await page.waitForTimeout(300);

    const basisContent = page.locator('#recommendation-basis');
    const basisText = await basisContent.textContent();
    
    expect(basisText).toContain('適用可能性');
  });

  // SCEN-015
  test("[normal] AIエージェント推奨支援ダッシュボード - 推奨承認ボタンを押すと推奨内容が承認され推奨履歴に記録される", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', 'テスト顧客A');
    await page.selectOption('[data-testid="industry-select"]', '製造業');
    await page.fill('[data-testid="condition-budget"]', '500');
    await page.fill('[data-testid="expected-amount"]', '500');
    await page.selectOption('[data-testid="deal-stage-select"]', '初期接触');

    await page.evaluate(() => {
      (window as any).__recommendationStub = {
        patterns: [{ id: 'pat1', similarity: 0.92 }],
        recommendation: {
          approach: '段階導入モデル',
          reasoning: '過去成功パターン7件と一致'
        }
      };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    await page.click('button:has-text("承認")');
    await page.waitForTimeout(500);

    const historyRows = page.locator('#history-tbody tr');
    const rowCount = await historyRows.count();
    
    expect(rowCount).toBeGreaterThan(0);
    
    const firstRow = await historyRows.nth(0).textContent();
    expect(firstRow).toContain('承認');
  });

  // SCEN-016
  test("[normal] AIエージェント推奨支援ダッシュボード - 推奨却下ボタンを押すと推奨内容が却下され推奨履歴に記録される", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', '株式会社テスト');
    await page.selectOption('[data-testid="deal-stage-select"]', '初期接触');
    await page.fill('[data-testid="expected-amount"]', '500');

    await page.evaluate(() => {
      (window as any).__recommendationStub = {
        patterns: [{ id: 'pat2', similarity: 0.85 }],
        recommendation: {
          approach: '顧客課題ヒアリング重視型',
          reasoning: '初期段階での関係構築が重要'
        }
      };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    await page.click('button:has-text("却下")');
    await page.waitForTimeout(500);

    const historyRows = page.locator('#history-tbody tr');
    const rowCount = await historyRows.count();
    
    expect(rowCount).toBeGreaterThan(0);
    
    const firstRow = await historyRows.nth(0).textContent();
    expect(firstRow).toContain('却下');
  });

  // SCEN-017
  test("[normal] AIエージェント推奨支援ダッシュボード - 推奨承認後に画面の状態が更新されて推奨履歴の追跡情報が表示される", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', 'C社');
    await page.selectOption('[data-testid="industry-select"]', '小売業');
    await page.selectOption('[data-testid="deal-stage-select"]', '提案');
    await page.fill('[data-testid="expected-amount"]', '3000');
    await page.check('[data-testid="condition-budget"]');

    await page.evaluate(() => {
      (window as any).__recommendationStub = {
        patterns: [
          { id: 'pat3', similarity: 0.91, name: '類似案件1' },
          { id: 'pat4', similarity: 0.86, name: '類似案件2' }
        ],
        recommendation: {
          approach: '段階的導入',
          confidence: 90
        }
      };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    const beforeInputValue = await page.locator('[data-testid="customer-search"]').inputValue();
    expect(beforeInputValue).toBe('C社');

    await page.click('button:has-text("承認")');
    await page.waitForTimeout(800);

    const historySection = page.locator('[data-testid="recommendation-history"]');
    const historyText = await historySection.textContent();
    
    expect(historyText).toContain('承認');
    
    const inputAfterApproval = await page.locator('[data-testid="customer-search"]').inputValue();
    expect(inputAfterApproval).toBe('');
  });

  // SCEN-018
  test("[normal] AIエージェント推奨支援ダッシュボード - 推奨却下後に画面の状態が更新されて推奨履歴の追跡情報が表示される", async ({ page }) => {
    await page.fill('[data-testid="customer-search"]', 'A社');
    await page.selectOption('[data-testid="industry-select"]', '製造業');
    await page.selectOption('[data-testid="deal-stage-select"]', '提案');
    await page.fill('[data-testid="expected-amount"]', '500');

    await page.evaluate(() => {
      (window as any).__recommendationStub = {
        patterns: [{ id: 'pat5', similarity: 0.89 }],
        recommendation: {
          approach: 'クラウド型ERP提案',
          reasoning: '類似案件の成功率78%'
        }
      };
    });

    await page.click('button:has-text("推奨を実行")');
    await page.waitForTimeout(500);

    const rejectButton = page.locator('button:has-text("却下")');
    await rejectButton.click();
    await page.waitForTimeout(800);

    const historyRows = page.locator('#history-tbody tr');
    const rowCount = await historyRows.count();
    
    expect(rowCount).toBeGreaterThan(0);
    
    const latestRow = await historyRows.nth(0).textContent();
    expect(latestRow).toContain('却下');
    expect(latestRow).toContain('クラウド型ERP提案');

    const inputAfterReject = await page.locator('[data-testid="customer-search"]').inputValue();
    expect(inputAfterReject).toBe('');
  });
});