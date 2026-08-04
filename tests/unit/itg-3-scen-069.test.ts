import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('IT-1-BR-3-3-2-1: パターン適用可能性評価機能', () => {
  // SCEN-069
  test('OpenAI API呼び出しが失敗した場合に内部マスタから代替評価スコアが返される', async () => {
    const newDealCondition = {
      customerIndustry: 'IT',
      budgetAmount: 5000000,
      decisionMakerCount: 3,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error')),
    };

    const mockInternalPatternMaster = [
      {
        patternId: 'PAT-001',
        successRate: 0.85,
        applicableIndustries: ['IT', 'Finance'],
        minBudget: 3000000,
        maxBudget: 10000000,
        baseScore: 88,
      },
      {
        patternId: 'PAT-002',
        successRate: 0.82,
        applicableIndustries: ['IT', 'Manufacturing'],
        minBudget: 2000000,
        maxBudget: 8000000,
        baseScore: 82,
      },
      {
        patternId: 'PAT-003',
        successRate: 0.79,
        applicableIndustries: ['IT', 'Retail'],
        minBudget: 1000000,
        maxBudget: 5000000,
        baseScore: 79,
      },
    ];

    const result = await evaluatePatternRelevance(
      newDealCondition,
      mockAIEngine,
      mockInternalPatternMaster,
    );

    expect(result).toEqual({
      evaluationScore: expect.any(Number),
      fallbackMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      source: 'internal_master',
      appliedPatterns: expect.arrayContaining([
        expect.objectContaining({
          patternId: expect.any(String),
          baseScore: expect.any(Number),
        }),
      ]),
      retryAttempts: 3,
    });

    expect(result.evaluationScore).toBeGreaterThanOrEqual(0);
    expect(result.evaluationScore).toBeLessThanOrEqual(100);
    expect(result.appliedPatterns.length).toBeGreaterThan(0);
    expect(result.appliedPatterns[0].baseScore).toBe(88);
    expect(result.retryAttempts).toBe(3);
  });
});