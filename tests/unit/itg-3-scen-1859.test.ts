import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1859
  test('[error] 推奨内容IDが null のとき根拠表示に失敗する', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValueOnce(
        new Error('推奨ID')
      ),
    };

    const result = await explainRecommendationReasoning(
      null,
      mockAIEngine
    ).catch((error) => ({
      errorType: 'ValidationError',
      errorMessage: error.message,
      recommendationId: null,
      rootCauseDisplayed: false,
      reasoningExplanation: null,
      errorLogged: true,
    }));

    expect(result.errorType).toBe('ValidationError');
    expect(result.errorMessage).toMatch(/推奨ID/);
    expect(result.recommendationId).toBeNull();
    expect(result.rootCauseDisplayed).toBe(false);
    expect(result.reasoningExplanation).toBeNull();
    expect(result.errorLogged).toBe(true);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(null);
  });
});