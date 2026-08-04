import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能', () => {
  // SCEN-2670
  test('複数の成功パターンが同じマッチスコアで並ぶとき、優先度順に出力される', async () => {
    const mockPatternA = {
      id: 'pattern-a',
      name: 'パターンA',
      matchScore: 0.85,
      priority: 1,
      description: '高成約率パターン',
      successCriteria: {},
      appliedCount: 45,
    };

    const mockPatternB = {
      id: 'pattern-b',
      name: 'パターンB',
      matchScore: 0.85,
      priority: 2,
      description: '中成約率パターン',
      successCriteria: {},
      appliedCount: 32,
    };

    const mockPatternC = {
      id: 'pattern-c',
      name: 'パターンC',
      matchScore: 0.85,
      priority: 3,
      description: '初期対応パターン',
      successCriteria: {},
      appliedCount: 18,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        mockPatternA,
        mockPatternB,
        mockPatternC,
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customerId: 'cust-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      productCategory: 'automation',
      dealAmount: 2500000,
      dealStage: 'proposal',
    };

    const result = await findSimilarPatterns(dealCondition, mockAIEngine);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('pattern-a');
    expect(result[0].priority).toBe(1);
    expect(result[0].matchScore).toBe(0.85);
    expect(result[1].id).toBe('pattern-b');
    expect(result[1].priority).toBe(2);
    expect(result[1].matchScore).toBe(0.85);
    expect(result[2].id).toBe('pattern-c');
    expect(result[2].priority).toBe(3);
    expect(result[2].matchScore).toBe(0.85);
  });
});