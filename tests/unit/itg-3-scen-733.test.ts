import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-733: AIRecommendationEngineへの外部呼び出しがタイムアウト（30秒超過）したとき推奨生成失敗と判定される', async () => {
    const customerId = 'CUST-001';
    const dealCondition = {
      industry: 'manufacturing',
      companySize: 'large',
      budget: 5000000,
      decisionMaker: 'CFO',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ recommendation: 'mock_result' });
            }, 31000);
          })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const cachedSuccessPatterns = [
      {
        patternId: 'PATTERN-001',
        rank: 1,
        matchScore: 0.92,
        description: 'Direct approach with C-level engagement',
        successRate: 0.87,
      },
      {
        patternId: 'PATTERN-002',
        rank: 2,
        matchScore: 0.88,
        successRate: 0.84,
      },
    ];

    const result = await generateRecommendation(
      {
        customerId,
        dealCondition,
        requiredCompleteness: true,
      },
      mockAIEngine,
      cachedSuccessPatterns
    );

    expect(result.status).toBe('RECOMMENDATION_GENERATION_FAILED');
    expect(result.errorCode).toBe('TIMEOUT_EXCEEDED');
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.cachedRecommendation).toEqual({
      patternId: 'PATTERN-001',
      rank: 1,
      matchScore: 0.92,
      description: 'Direct approach with C-level engagement',
      successRate: 0.87,
    });
    expect(result.reasoningExplanation).toBeDefined();
    expect(result.reasoningExplanation.length).toBeGreaterThan(0);
    expect(result.reasoningExplanation).toMatch(/PATTERN-001/);
  });
});