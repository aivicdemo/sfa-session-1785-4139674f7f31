import { validateRecommendationContent } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2862: [error] 推奨内容検証判定機能 - 推奨内容（失敗要因）が空のとき、エラーを返す
  test('should throw ValidationError with INVALID_FAILURE_REASON code when failureReason is empty string', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        approachName: 'テスト提案アプローチ',
        confidenceScore: 85,
        reasoning: '過去の類似案件から推奨',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidPayload = {
      recommendationId: 'rec-001',
      dealId: 'deal-12345',
      customerId: 'cust-67890',
      proposedApproach: 'テスト提案アプローチ',
      riskFactors: ['市場変動リスク'],
      failureReason: '',
      successPattern: '既存顧客との関係構築',
      recommendationBasis: {
        historicalSimilarCases: ['case-001', 'case-002'],
        customerData: { industry: 'IT', scale: 'large' },
        successPatternId: 'sp-001',
      },
      evaluationScore: 85,
    };

    expect(() =>
      validateRecommendationContent(invalidPayload, mockAIEngine)
    ).toThrow(/推奨内容の失敗要因は必須項目です。空値は許可されません/);
  });
});