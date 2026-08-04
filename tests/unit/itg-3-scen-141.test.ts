import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-141
  test('推奨根拠生成機能 - AIエージェント呼び出し失敗時に内部パターンマスタから根拠が代替生成される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('Network error')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationPatternMaster = [
      {
        pattern_id: 'P001',
        pattern_name: '顧客規模別提案アプローチ',
        success_rate: 87,
        simplified_rationale: '大規模企業向けには経営層へのアクセス強化が効果的',
      },
    ];

    const newCaseInput = {
      customer_size: '1000名以上',
      industry: '製造業',
      budget_range: '5000万円以上',
    };

    const result = await generateRecommendationWithFallback(
      newCaseInput,
      mockAIEngine,
      recommendationPatternMaster
    );

    expect(result.recommendation.pattern_id).toBe('P001');
    expect(result.recommendation.pattern_name).toBe('顧客規模別提案アプローチ');
    expect(result.recommendation.success_rate).toBe(87);
    expect(result.rationale).toBe('大規模企業向けには経営層へのアクセス強化が効果的');
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.retry_attempts).toBe(3);
    expect(result.retry_backoff_seconds).toEqual([1, 2, 4]);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});