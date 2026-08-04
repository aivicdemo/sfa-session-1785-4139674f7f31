import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1888
  test('AIRecommendationEngine の findSimilarPatterns が 0 件を返すとき推奨生成に失敗する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockPatternMaster = [
      {
        patternId: 'PAT-001',
        successRate: 0.85,
        industry: 'IT',
        budget: 5000000,
        approach: 'Direct approach to CTO with ROI-focused proposal',
        description: 'High success pattern for IT sector',
      },
      {
        patternId: 'PAT-002',
        successRate: 0.72,
        industry: 'IT',
        budget: 5000000,
        approach: 'Multi-stakeholder engagement strategy',
        description: 'Standard pattern for large IT budgets',
      },
    ];

    const result = generateRecommendation(
      {
        customerId: 'CUST-001',
        industry: 'IT',
        budget: 5000000,
        decisionMaker: 'CTO',
      },
      mockAIEngine,
      mockFileStorage,
      mockPatternMaster
    );

    expect(result).not.toBeNull();
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('NO_SIMILAR_PATTERNS_FOUND');
    expect(result.error?.message).toMatch(/類似パターンが見つかりません/);
    expect(result.fallbackRecommendation).toBeDefined();
    expect(result.fallbackRecommendation?.patternId).toBe('PAT-001');
    expect(result.fallbackRecommendation?.successRate).toBe(0.85);
    expect(result.logs).toContainEqual(
      expect.stringMatching(/findSimilarPatterns returned 0 results/)
    );
  });
});