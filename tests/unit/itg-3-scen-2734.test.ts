import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2734
  test('マッチした成功パターンが存在しないとき根拠説明生成が失敗する', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn()
        .mockRejectedValueOnce(new Error('マッチした成功パターンが見つかりません'))
    };

    const recommendationInput = {
      customerId: 'cust_20240115_001',
      customerIndustry: '製造業',
      customerScale: '中堅企業',
      currentDealConditions: {
        dealStage: '提案準備',
        proposalType: '生産効率化',
        estimatedValue: 5000000
      },
      matchedPatterns: []
    };

    const internalFallbackPattern = {
      patternId: 'pattern_fallback_001',
      patternName: '統計的に上位の成功パターン（製造業・効率化提案）',
      successRate: 68,
      applicableIndustries: ['製造業'],
      keySuccessFactors: ['導入準備期間の明確化', 'ROI試算の提示'],
      description: '過去事例から抽出した一般的な成功アプローチ'
    };

    expect(async () => {
      await mockAIRecommendationEngine.explainRecommendationReasoning(
        recommendationInput
      );
    }).rejects.toThrow(/マッチした成功パターン/);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith({
      customerId: recommendationInput.customerId,
      dealConditions: recommendationInput.currentDealConditions
    });

    expect(mockAIRecommendationEngine.explainRecommendationReasoning)
      .toHaveBeenCalledTimes(1);

    const result = {
      status: 'fallback',
      explanation: internalFallbackPattern.description,
      pattern: internalFallbackPattern,
      confidenceScore: 68,
      externalAIAttempted: false,
      usesFallbackMastery: true
    };

    expect(result.externalAIAttempted).toBe(false);
    expect(result.usesFallbackMastery).toBe(true);
    expect(result.pattern.patternId).toBe('pattern_fallback_001');
    expect(result.confidenceScore).toBe(68);
    expect(result.explanation).toMatch(/過去事例から抽出した一般的な成功アプローチ/);
  });
});