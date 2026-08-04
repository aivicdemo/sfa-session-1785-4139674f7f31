import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1297
  test('OpenAI APIが失敗した場合に簡略版の根拠説明が返却される', async () => {
    const dealId = 'DEAL-12345';
    const industry = '製造業';
    const budgetScale = '1000万円';
    const dealStage = '初期提案';

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValueOnce(
        new Error('API_ERROR: OpenAI API request failed')
      ),
    };

    const result = await explainRecommendationReasoning(
      dealId,
      industry,
      budgetScale,
      dealStage,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.recommendationPatternId).toBeDefined();
    expect(typeof result.recommendationPatternId).toBe('string');
    expect(result.simplifiedExplanation).toBeDefined();
    expect(typeof result.simplifiedExplanation).toBe('string');
    expect(result.simplifiedExplanation).toMatch(/過去の類似商談/);
    expect(result.simplifiedExplanation).toMatch(/製造業/);
    expect(result.simplifiedExplanation).toMatch(/1000万円帯/);
    expect(result.simplifiedExplanation).toMatch(/成功確度\d+%/);
    expect(result.confidenceScore).toBe(87);
    expect(result.generationMethod).toBe('FALLBACK_PATTERN_MASTER');
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      dealId,
      industry,
      budgetScale,
      dealStage
    );
  });
});