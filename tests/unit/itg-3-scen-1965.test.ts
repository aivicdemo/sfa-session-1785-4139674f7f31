import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 商談金額マッチング', () => {
  // SCEN-1965
  test('商談金額が過去事例の±10%の金額帯内のときにパターンが適用される', () => {
    // テストデータ: 過去成功事例
    const pastSuccessPattern = {
      dealAmountInMillionYen: 10, // 1,000万円
      patternId: 'pattern-001',
      industryCode: 'IT',
      dealStage: 'proposal',
    };

    // ケース1: 1,050万円（+5%、±10%の範囲内）
    const newDealCondition1 = {
      dealAmountInMillionYen: 10.5,
      industryCode: 'IT',
      dealStage: 'proposal',
    };

    const result1 = evaluatePatternRelevance(pastSuccessPattern, newDealCondition1);

    expect(result1.relevanceScore).toBeGreaterThanOrEqual(0.8);
    expect(result1.isApplicable).toBe(true);

    // ケース2: 950万円（-5%、±10%の範囲内）
    const newDealCondition2 = {
      dealAmountInMillionYen: 9.5,
      industryCode: 'IT',
      dealStage: 'proposal',
    };

    const result2 = evaluatePatternRelevance(pastSuccessPattern, newDealCondition2);

    expect(result2.relevanceScore).toBeGreaterThanOrEqual(0.8);
    expect(result2.isApplicable).toBe(true);

    // ケース3: 890万円（-11%、±10%の範囲外）
    const newDealCondition3 = {
      dealAmountInMillionYen: 8.9,
      industryCode: 'IT',
      dealStage: 'proposal',
    };

    const result3 = evaluatePatternRelevance(pastSuccessPattern, newDealCondition3);

    expect(result3.relevanceScore).toBeLessThan(0.5);
    expect(result3.isApplicable).toBe(false);
  });
});