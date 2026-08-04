import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1374
  test('商談条件データが空のとき適用可能なパターンが検索できない', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyDealConditions = {};

    const mockRecommendationPatternMaster = [
      {
        pattern_id: 'PAT-001',
        customer_segment: 'large_enterprise',
        product_category: 'cloud_solution',
        success_rate: 0.85,
        recommended_approach: 'Executive engagement with ROI focus',
        cached_recommendation: 'Cached approach for large enterprises',
      },
      {
        pattern_id: 'PAT-002',
        customer_segment: 'mid_market',
        product_category: 'security_service',
        success_rate: 0.72,
        recommended_approach: 'Compliance-focused proposal',
        cached_recommendation: 'Cached approach for mid-market security',
      },
    ];

    const result = extractSuccessPatterns(
      emptyDealConditions,
      mockAIRecommendationEngine,
      mockRecommendationPatternMaster
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      emptyDealConditions
    );
    expect(result.searchResults).toEqual([]);
    expect(result.fallbackMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.cachedPatterns).toHaveLength(2);
    expect(result.cachedPatterns[0]).toEqual({
      pattern_id: 'PAT-001',
      customer_segment: 'large_enterprise',
      product_category: 'cloud_solution',
      success_rate: 0.85,
      recommended_approach: 'Executive engagement with ROI focus',
      cached_recommendation: 'Cached approach for large enterprises',
    });
    expect(result.error).toBeUndefined();
  });
});