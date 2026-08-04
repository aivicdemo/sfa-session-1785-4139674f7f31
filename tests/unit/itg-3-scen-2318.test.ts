import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2318
  test('推奨パターンマスタが欠落しているとき、照合は空配列を返す', () => {
    const dealCondition = {
      customerIndustry: 'retail',
      dealAmount: 5000000,
      decisionMakerCount: 3,
      salesStage: 'negotiation',
      dealDuration: 45
    };

    const emptyRecommendationPatterns: any[] = [];

    const result = findSimilarPatterns(
      dealCondition,
      emptyRecommendationPatterns
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});