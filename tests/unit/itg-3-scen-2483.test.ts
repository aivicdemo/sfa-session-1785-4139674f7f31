import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2483
  test('推奨根拠の自然言語説明生成機能 - OpenAI APIが失敗時、簡略版の根拠説明が生成される', async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn()
        .mockRejectedValueOnce(new Error('OpenAI API connection timeout'))
        .mockRejectedValueOnce(new Error('OpenAI API rate limit exceeded'))
        .mockRejectedValueOnce(new Error('OpenAI API service unavailable')),
    };

    const recommendationId = 'rec_20240115_001';
    const customerId = 'cust_20240115_001';
    const dealConditions = {
      industry: 'manufacturing',
      scale: 'large',
      budgetRange: 'high',
      decisionMakersCount: 5,
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      customerId,
      dealConditions,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      reasoning_text: '過去の成功実績に基づいた推奨です',
      reasoning_type: 'simplified',
      data_source: 'success_pattern_master',
      confidence_score: 75,
      user_message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      fallback_applied: true,
      retry_attempts: 3,
      similar_cases_count: 3,
    });

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});