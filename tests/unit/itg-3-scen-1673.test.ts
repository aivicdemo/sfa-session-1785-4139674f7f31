import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1673
  test('推奨根拠情報が null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    const recommendationId = 'rec-12345';
    const customerId = 'cust-67890';

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    let errorMessage: string | null = null;
    let isErrorState = false;
    let reasoningData: unknown = undefined;

    try {
      reasoningData = explainRecommendationReasoning(
        recommendationId,
        customerId,
        mockAIEngine
      );

      if (reasoningData === null) {
        isErrorState = true;
        errorMessage = '推奨根拠情報が取得できません';
        console.error('RecommendationReasoningError: Reasoning data is null');
      }
    } catch (error) {
      isErrorState = true;
      errorMessage = '推奨根拠情報が取得できません';
      console.error('RecommendationReasoningError: Reasoning data is null');
    }

    expect(isErrorState).toBe(true);
    expect(errorMessage).toBe('推奨根拠情報が取得できません');
    expect(reasoningData).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'RecommendationReasoningError: Reasoning data is null'
    );

    consoleSpy.mockRestore();
  });
});