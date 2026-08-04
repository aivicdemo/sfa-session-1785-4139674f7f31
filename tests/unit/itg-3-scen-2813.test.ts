import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2813: 根拠の詳細説明が空文字列のとき、エラーを返す', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoningExplanation: '',
        confidenceScore: 85,
        relatedPatterns: [],
      }),
    };

    const input = {
      dealId: 'DEAL-20240115-001',
      recommendedPatternId: 'PATTERN-SUCCESS-001',
      customerContext: {
        industry: 'IT',
        companySize: 'LARGE',
        purchaseHistory: [],
      },
      aiEngine: mockAIEngine,
    };

    const result = explainRecommendationReasoning(input);

    expect(result.errorCode).toBe('EMPTY_REASONING_EXPLANATION');
    expect(result.errorMessage).toBe(
      '根拠の詳細説明が空です。AIエンジンから有効な説明を取得してください'
    );
    expect(result.httpStatusCode).toBe(400);
    expect(result.reasoningExplanation).toBeUndefined();
  });
});