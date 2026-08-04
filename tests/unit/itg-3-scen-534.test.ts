import { extractImprovementItems } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 改善対象項目抽出', () => {
  test('SCEN-534: 改善対象項目が1件のとき1件が返される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        improvementItems: [
          {
            itemId: 'IMP-001',
            itemName: '顧客ニーズヒアリング深掘り',
            score: 65,
            priority: true,
          },
        ],
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const customerCondition = {
      customerId: 'CUST-12345',
      customerName: '株式会社A',
      industry: '製造業',
      scale: 'large',
    };

    const dealCondition = {
      dealId: 'DEAL-67890',
      dealStage: 'proposal',
      productCategory: 'software',
      proposedAmount: 5000000,
    };

    const result = extractImprovementItems(mockAIEngine, customerCondition, dealCondition);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      itemId: 'IMP-001',
      itemName: '顧客ニーズヒアリング深掘り',
      score: 65,
      priority: true,
    });
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerCondition,
      dealCondition
    );
  });
});