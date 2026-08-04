import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2338
  test('根拠スコアデータが欠落しているとき説明文生成が中断される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealData = {
      deal_id: 'DEAL-2024-001',
      customer_industry: '製造業',
      customer_size: '中堅企業',
      deal_amount: 5000000,
      deal_stage: '提案段階',
      customer_pain_points: ['生産効率化', 'コスト削減'],
    };

    const result = explainRecommendationReasoning(
      dealData,
      mockAIEngine
    );

    expect(result).toEqual({
      explanation: 'この推奨は過去の成功パターンに基づいています',
      is_fallback: true,
      error_type: 'MISSING_SCORE_DATA',
    });
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});