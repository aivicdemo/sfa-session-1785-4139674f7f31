import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン推奨ロジック', () => {
  // SCEN-2746
  test('ロジック精度検証 - 過去成功パターンのデータ品質が低いとき推奨ロジックの精度基準適合判定が保留される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.35,
        dataQualityScore: 0.35,
        isApplicable: false,
        reason: 'データ品質不足'
      })
    };

    const lowQualityPatterns = [
      {
        id: 'pattern_001',
        customerSize: 'mid_market',
        product: 'cloud_system',
        budgetMin: 5000000,
        budgetMax: 10000000,
        successRate: 0.65,
        missingValueRate: 0.32,
        outlierCount: 2,
        dataQualityScore: 0.35
      },
      {
        id: 'pattern_002',
        customerSize: 'mid_market',
        product: 'cloud_system',
        budgetMin: 5000000,
        budgetMax: 10000000,
        successRate: 0.58,
        missingValueRate: 0.31,
        outlierCount: 3,
        dataQualityScore: 0.35
      },
      {
        id: 'pattern_003',
        customerSize: 'mid_market',
        product: 'cloud_system',
        budgetMin: 5000000,
        budgetMax: 10000000,
        successRate: 0.61,
        missingValueRate: 0.33,
        outlierCount: 2,
        dataQualityScore: 0.35
      },
      {
        id: 'pattern_004',
        customerSize: 'mid_market',
        product: 'cloud_system',
        budgetMin: 5000000,
        budgetMax: 10000000,
        successRate: 0.62,
        missingValueRate: 0.30,
        outlierCount: 4,
        dataQualityScore: 0.35
      },
      {
        id: 'pattern_005',
        customerSize: 'mid_market',
        product: 'cloud_system',
        budgetMin: 5000000,
        budgetMax: 10000000,
        successRate: 0.59,
        missingValueRate: 0.32,
        outlierCount: 1,
        dataQualityScore: 0.35
      }
    ];

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue(
      lowQualityPatterns
    );

    const newCaseInput = {
      customerSize: 'mid_market',
      product: 'cloud_system',
      budgetMin: 5000000,
      budgetMax: 10000000,
      industry: 'technology',
      employeeCount: 250,
      region: 'japan'
    };

    const result = await generateRecommendation(
      newCaseInput,
      mockAIRecommendationEngine,
      { qualityThreshold: 0.6, confidenceThreshold: 0.7 }
    );

    expect(result.status).toBe('PENDING');
    expect(result.reason).toBe(
      '過去成功パターンのデータ品質が基準未満（品質スコア0.35/0.6）のため、推奨精度の信頼性が確認できません。データ品質改善後に再実行してください。'
    );
    expect(result.recommendation).toBeNull();
    expect(result.confidenceScore).toBeNull();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});