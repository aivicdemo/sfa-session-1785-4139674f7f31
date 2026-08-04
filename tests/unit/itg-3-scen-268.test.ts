import { extractAndMatchSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・マッチング機能 - 類似度スコアが適用閾値直上のケース', () => {
  // SCEN-268
  test('類似度スコア0.7501（閾値直上）で過去事例がマッチし、採用パターンとして返されること', () => {
    // Arrange: スタブ化されたAIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-5001',
          similarityScore: 0.7501,
          successRate: 0.92,
          salesApproach: '段階的導入提案',
          customerIndustry: '製造業',
          budgetRange: '1000万円',
          implementationPeriod: '3ヶ月'
        }
      ])
    };

    // 推奨パターンマスタ（スタブ）
    const recommendationPatternMaster = [
      {
        patternId: 'PAT-5001',
        industry: '製造業',
        budgetMin: 10000000,
        budgetMax: 10000000,
        implementationMonths: 3,
        successRate: 0.92,
        approach: '段階的導入提案',
        similarityThreshold: 0.75
      }
    ];

    // テスト対象への入力：現在の商談条件
    const currentDealCondition = {
      customerIndustry: '製造業',
      budgetAmount: 10000000,
      implementationDurationMonths: 3
    };

    // Act
    const result = extractAndMatchSuccessPatterns(
      currentDealCondition,
      mockAIEngine,
      recommendationPatternMaster
    );

    // Assert
    expect(result.adoptedPattern.patternId).toBe('PAT-5001');
    expect(result.adoptedPattern.similarityScore).toBe(0.7501);
    expect(result.adoptedPattern.matchStatus).toBe('ADOPTED');
    expect(result.adoptedPattern.rationale).toContain('段階的導入提案');
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      currentDealCondition,
      recommendationPatternMaster
    );
  });
});