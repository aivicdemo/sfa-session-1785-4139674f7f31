import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 推奨履歴の重複実行防止', () => {
  // SCEN-124
  test('同一入力パラメータでの2回目の推奨生成がDUPLICATE_RECOMMENDATION_RECORDエラーを返す', async () => {
    const customerId = 'CUST001';
    const dealConditions = '予算500万円、導入希望時期3ヶ月以内';
    const recommendationId = 'REC-20240801-001';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        proposedApproach: 'クラウド導入支援プラン',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockRecommendationHistoryStore = {
      records: [] as Array<{
        customerId: string;
        dealConditions: string;
        recommendationId: string;
        createdAt: string;
      }>,
      findByCustomerAndConditions: jest.fn(function (cid: string, conditions: string) {
        return this.records.find(
          (r) => r.customerId === cid && r.dealConditions === conditions
        );
      }),
      insert: jest.fn(function (record: any) {
        this.records.push(record);
        return record;
      }),
    };

    const firstInput = {
      customerId: customerId,
      dealConditions: dealConditions,
      aiEngine: mockAIRecommendationEngine,
      historyStore: mockRecommendationHistoryStore,
    };

    const firstResult = await generateRecommendation(firstInput);
    expect(firstResult.recommendationId).toBe(recommendationId);
    expect(mockRecommendationHistoryStore.records.length).toBe(1);
    expect(mockRecommendationHistoryStore.records[0].customerId).toBe(customerId);
    expect(mockRecommendationHistoryStore.records[0].dealConditions).toBe(dealConditions);

    const secondInput = {
      customerId: customerId,
      dealConditions: dealConditions,
      aiEngine: mockAIRecommendationEngine,
      historyStore: mockRecommendationHistoryStore,
    };

    await expect(() => generateRecommendation(secondInput)).rejects.toThrow(
      /DUPLICATE_RECOMMENDATION_RECORD|同じ条件での推奨は既に存在します/
    );

    expect(mockRecommendationHistoryStore.records.length).toBe(1);
  });
});