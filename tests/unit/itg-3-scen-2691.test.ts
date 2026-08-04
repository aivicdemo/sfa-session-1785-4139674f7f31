import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジックの外部サービス呼び出し', () => {
  // SCEN-2691
  test('AIRecommendationEngine.generateRecommendationが正常応答したとき、返却されたパターンと根拠がそのまま推奨ロジックに組み込まれる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedPattern: '顧客規模別アプローチ_エンタープライズ向け提案',
        reasoning: '過去24ヶ月の類似顧客（従業員数5000名以上）との商談成功率78%に基づく',
        confidenceScore: 0.78,
        similarPastDeals: ['deal_id_2024001', 'deal_id_2024015'],
      }),
    };

    const prospectInput = {
      prospectCompanySize: 8000,
      industry: '金融',
      dealValue: 5000000,
      dealStage: '提案前',
    };

    const result = generateRecommendation(prospectInput, mockAIEngine);

    expect(result).toEqual({
      recommendedPattern: '顧客規模別アプローチ_エンタープライズ向け提案',
      reasoning: '過去24ヶ月の類似顧客（従業員数5000名以上）との商談成功率78%に基づく',
      confidenceScore: 0.78,
      similarPastDeals: ['deal_id_2024001', 'deal_id_2024015'],
    });

    expect(result.recommendedPattern).toBe('顧客規模別アプローチ_エンタープライズ向け提案');
    expect(result.reasoning).toBe('過去24ヶ月の類似顧客（従業員数5000名以上）との商談成功率78%に基づく');
    expect(result.confidenceScore).toBe(0.78);
    expect(result.similarPastDeals).toEqual(['deal_id_2024001', 'deal_id_2024015']);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(prospectInput);
  });
});