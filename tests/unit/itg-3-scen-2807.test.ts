import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2807
  test('[error] 推奨内容の根拠表示機能 - 推奨内容が空文字列のとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue('')
    };

    const recommendationContent = '';
    const dealConditions = {
      customerId: 'CUST001',
      dealAmount: 5000000,
      industryType: '製造業',
      dealStage: '提案段階'
    };

    expect(() => {
      explainRecommendationReasoning(
        recommendationContent,
        dealConditions,
        mockAIRecommendationEngine
      );
    }).toThrow(/EMPTY_RECOMMENDATION_CONTENT|推奨内容が空です/);
  });
});