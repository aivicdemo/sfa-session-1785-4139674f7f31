import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1900
  test('成功パターンの信頼度スコアが null のとき抽出に失敗する', () => {
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern-001',
          customerIndustry: 'SaaS',
          contractAmount: 1000000,
          confidenceScore: 0.85,
          successCount: 15,
        },
        {
          patternId: 'pattern-002',
          customerIndustry: 'SaaS',
          contractAmount: 1000000,
          confidenceScore: null,
          successCount: 8,
        },
        {
          patternId: 'pattern-003',
          customerIndustry: 'SaaS',
          contractAmount: 1000000,
          confidenceScore: 0.72,
          successCount: 12,
        },
      ]),
    };

    const newDealCondition = {
      customerIndustry: 'SaaS',
      contractAmount: 1000000,
    };

    const result = findSimilarPatterns(newDealCondition, aiRecommendationEngineStub);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result.every((pattern) => pattern.confidenceScore !== null)).toBe(true);
    expect(result[0].patternId).toBe('pattern-001');
    expect(result[1].patternId).toBe('pattern-003');
    expect(result.map((p) => p.confidenceScore)).toEqual([0.85, 0.72]);
  });
});