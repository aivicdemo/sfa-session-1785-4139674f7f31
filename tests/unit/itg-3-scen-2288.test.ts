import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターン照合・マッチング機能', () => {
  // SCEN-2288
  test('現在の商談条件に類似する過去事例が0件のとき、findSimilarPatternsがエラーになる', async () => {
    const mockAIEngine = {
      generateEmbedding: jest.fn().mockResolvedValue([
        0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
        0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0
      ]),
      queryPastDeals: jest.fn().mockResolvedValue([
        {
          id: 'past_deal_1',
          customerIndustry: 'manufacturing',
          dealStage: 'proposal',
          amount: 5000000,
          embedding: [
            0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0,
            0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0
          ]
        },
        {
          id: 'past_deal_2',
          customerIndustry: 'retail',
          dealStage: 'discovery',
          amount: 1000000,
          embedding: [
            0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95,
            0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95
          ]
        }
      ])
    };

    const currentDealCondition = {
      customerIndustry: 'technology',
      dealStage: 'negotiation',
      amount: 3000000,
      customerSize: 'large',
      productCategory: 'cloud_solution'
    };

    const similarityThreshold = 0.75;

    expect(async () => {
      await findSimilarPatterns(currentDealCondition, mockAIEngine, similarityThreshold);
    }).rejects.toThrow(/類似/);
  });
});