import { evaluateRecommendationConfidence } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の信頼度スコア算出・根拠提示機能', () => {
  // SCEN-847
  test('[error] 類似度スコアが1.0を超えるとき、エラーで処理が進まない', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        similarity_score: 1.5,
        matched_patterns: [
          {
            pattern_id: 'pat_001',
            customer_industry: '製造業',
            deal_size: 5000000,
            decision_makers: 3,
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
    };

    const newDealInput = {
      customer_industry: '製造業',
      deal_size: 5000000,
      decision_maker_count: 3,
    };

    expect(() =>
      evaluateRecommendationConfidence(newDealInput, mockAIEngine, mockFileStorage),
    ).toThrow(/SimilarityScoreOutOfRangeError/);

    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});