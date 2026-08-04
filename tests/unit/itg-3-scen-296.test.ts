import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 類似パターン検索機能', () => {
  // SCEN-296
  test('過去商談データが0件の場合、空の検索結果が返却される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const result = await findSimilarPatterns(
      dealCondition,
      mockAIRecommendationEngine,
    );

    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});