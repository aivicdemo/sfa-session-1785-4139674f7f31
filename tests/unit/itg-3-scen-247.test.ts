import { describe, test, expect, beforeEach } from '@jest/globals';
import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似成功パターン検索機能 - ランキングスコア検証', () => {
  let mockAIRecommendationEngine: any;

  beforeEach(() => {
    mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };
  });

  // SCEN-247
  test('[error] 検索結果のランキングスコアが -0.1 のとき、検索処理がエラーになる', () => {
    const dealCondition = {
      customerIndustry: '製造業',
      dealSize: 5000000,
      dealStage: '提案段階',
      customerRegion: '関東',
    };

    const invalidPatternResult = {
      patterns: [
        {
          patternId: 'pat-001',
          successRate: 0.85,
          rankingScore: -0.1,
          matchedDeals: 12,
          customerAttributeMatch: 0.9,
          dealSizeMatch: 0.8,
        },
      ],
      totalMatched: 1,
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockReturnValue(
      invalidPatternResult
    );

    expect(() => {
      findSimilarPatterns(dealCondition, mockAIRecommendationEngine);
    }).toThrow(/ランキングスコア/);
  });
});