import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理', () => {
  test('SCEN-1527: 過去の類似顧客パターンが0件の場合、空の顧客群配列が返却される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const testInput = {
      purchaseHistory: [
        {
          productId: 'PROD-001',
          quantity: 100,
          purchaseDate: '2024-01-15',
          amount: 500000,
        },
      ],
      proposalContent: {
        productCategory: 'software',
        targetIndustry: 'finance',
        estimatedValue: 2000000,
      },
    };

    const result = await findSimilarPatterns(
      testInput,
      mockAIRecommendationEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});