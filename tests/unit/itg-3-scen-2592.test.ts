import { determineSuccessPatternTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2592
  test('顧客属性と商談条件に一致する成功パターンが0件の場合、デフォルト推奨パターンが出力される', () => {
    const customerAttribute = {
      industry: '製造業',
      companySize: '中堅企業',
      decisionMaker: '経営層',
    };

    const dealCondition = {
      product: 'ERP導入',
      budget: 50000000,
      implementationPeriod: 6,
    };

    const aiRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicablePatterns: [],
        relevanceScore: 0,
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = determineSuccessPatternTemplate(
      customerAttribute,
      dealCondition,
      aiRecommendationEngine
    );

    expect(result).toEqual({
      approachId: 'DEFAULT_001',
      patternName: '段階的導入提案',
      proposalSteps: '初期ヒアリング→小規模パイロット導入→全社展開',
      successRate: expect.any(Number),
      reasoning: '過去事例との完全一致はありませんでしたが、推奨パターンマスタの統計的に上位の成功パターンを提示します',
    });

    expect(result.approachId).toBe('DEFAULT_001');
    expect(result.patternName).toBe('段階的導入提案');
    expect(result.proposalSteps).toBe('初期ヒアリング→小規模パイロット導入→全社展開');
    expect(typeof result.successRate).toBe('number');
    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(100);
    expect(result.reasoning).toMatch(/統計的に上位の成功パターン/);
  });
});