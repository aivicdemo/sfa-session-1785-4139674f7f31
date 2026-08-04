import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠説明生成機能', () => {
  // SCEN-919
  test('根拠説明テキストが0文字のときValidationErrorを返す', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        status: 'VALIDATION_ERROR',
        errorMessage: '根拠説明テキストが0文字です',
        savedToDatabase: false,
      }),
    };

    const input = {
      recommendationId: 'REC-001',
      explanationText: '',
    };

    const result = await explainRecommendationReasoning(input, mockAIEngine);

    expect(result.status).toBe('VALIDATION_ERROR');
    expect(result.errorMessage).toMatch(/根拠説明テキストが0文字/);
    expect(result.savedToDatabase).toBe(false);
  });
});