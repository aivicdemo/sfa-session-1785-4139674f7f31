import { RecommendationReasoningValidator } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2812
  test('根拠の詳細説明が欠けているとき、エラーを返す', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation_text: '',
        reasoning_factors: ['factor1', 'factor2'],
        confidence_score: 85,
      }),
    };

    const validator = new RecommendationReasoningValidator(mockAIEngine);

    const recommendationId = 'REC-001';
    const result = validator.validateReasoningExplanation(recommendationId);

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('REASONING_DETAIL_MISSING');
    expect(result.errorMessage).toBe('根拠の詳細説明が入力されていません');
    expect(result.status).toBe(400);
    expect(result.details).toBe(
      'explainRecommendationReasoningの戻り値にて、explanation_textフィールドが空またはnullです'
    );
  });
});