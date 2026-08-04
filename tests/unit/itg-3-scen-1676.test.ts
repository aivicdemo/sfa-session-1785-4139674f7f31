import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1676
  test('推奨根拠可視化機能 - 根拠テキストが null のとき、エラーが発生する', () => {
    const mockRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(null),
    };

    const dealConditions = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      productCategory: 'software',
      estimatedValue: 500000,
      stage: 'proposal',
    };

    const recommendationId = 'REC-2024-001';

    expect(async () => {
      await explainRecommendationReasoning(
        recommendationId,
        dealConditions,
        mockRecommendationEngine
      );
    }).rejects.toThrow(/推奨根拠の取得に失敗しました/);
  });
});