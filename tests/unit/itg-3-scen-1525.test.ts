import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1525
  test('[normal] 類似顧客マッチング処理 - 過去の類似顧客パターンが複数件存在する場合、全件に対して一致度スコアが数値化される', () => {
    // Arrange: スタブの AIRecommendationEngine を作成
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern_001',
          customerIndustry: '製造業',
          customerSize: '大企業',
          dealAmount: 5000000,
          dealCycle: 90
        },
        {
          patternId: 'pattern_002',
          customerIndustry: '製造業',
          customerSize: '中堅企業',
          dealAmount: 3000000,
          dealCycle: 60
        },
        {
          patternId: 'pattern_003',
          customerIndustry: '卸売業',
          customerSize: '中企業',
          dealAmount: 2000000,
          dealCycle: 45
        }
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
        .mockReturnValueOnce(0.87)
        .mockReturnValueOnce(0.72)
        .mockReturnValueOnce(0.65)
    };

    // 新規案件の顧客・商談条件
    const newDealCondition = {
      customerIndustry: '製造業',
      customerSize: '大企業',
      dealAmount: 4800000,
      dealCycle: 85,
      productCategory: 'ERP',
      decisionMaker: '経営管理部'
    };

    // Act: 類似顧客マッチング処理を実行
    const matchingResults = findSimilarPatterns(newDealCondition, mockAIEngine);

    // Assert
    // 1. 結果が配列であることを確認
    expect(Array.isArray(matchingResults)).toBe(true);

    // 2. 結果配列の要素数が入力パターン数と一致することを確認
    expect(matchingResults.length).toBe(3);

    // 3. 各要素についてスコアが数値型で存在することを確認
    expect(typeof matchingResults[0].score).toBe('number');
    expect(typeof matchingResults[1].score).toBe('number');
    expect(typeof matchingResults[2].score).toBe('number');

    // 4. 各スコア値が0.0～1.0の範囲内であることを確認
    expect(matchingResults[0].score).toBeGreaterThanOrEqual(0.0);
    expect(matchingResults[0].score).toBeLessThanOrEqual(1.0);
    expect(matchingResults[1].score).toBeGreaterThanOrEqual(0.0);
    expect(matchingResults[1].score).toBeLessThanOrEqual(1.0);
    expect(matchingResults[2].score).toBeGreaterThanOrEqual(0.0);
    expect(matchingResults[2].score).toBeLessThanOrEqual(1.0);

    // 5. スコアが期待値と一致することを確認
    expect(matchingResults[0].score).toBe(0.87);
    expect(matchingResults[1].score).toBe(0.72);
    expect(matchingResults[2].score).toBe(0.65);

    // 6. スコアが降順でソートされていることを確認
    expect(matchingResults[0].score).toBeGreaterThan(matchingResults[1].score);
    expect(matchingResults[1].score).toBeGreaterThan(matchingResults[2].score);

    // 7. 各パターン情報が含まれていることを確認
    expect(matchingResults[0].patternId).toBe('pattern_001');
    expect(matchingResults[1].patternId).toBe('pattern_002');
    expect(matchingResults[2].patternId).toBe('pattern_003');
  });
});