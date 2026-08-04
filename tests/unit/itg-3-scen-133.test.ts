import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('データ品質検証機能 - 合格ライン直上での検証', () => {
  // SCEN-133
  test('データ品質スコア 70.0 が合格ライン 70.0 と一致する場合、検証ステータスが APPROVED となり、レコメンデーション生成フローが続行される', () => {
    const passThreshold = 70.0;
    const dataQualityScore = 70.0;

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'Recommended approach based on success pattern',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(dataQualityScore),
    };

    const inputDataset = {
      customerInfo: {
        industry: 'Technology',
        companySize: 'Large',
        annualRevenue: 50000000,
      },
      dealCondition: {
        productCategory: 'Enterprise Software',
        dealStage: 'Proposal',
        dealAmount: 500000,
      },
      dataQualityMetrics: {
        completenessScore: 95,
        consistencyScore: 90,
        accuracyScore: 85,
        timelynessScore: 90,
        overallScore: dataQualityScore,
      },
    };

    const validationLog: Array<{
      timestamp: string;
      dataQualityScore: number;
      threshold: number;
      result: string;
    }> = [];

    const timestamp = '2024-01-15T11:00:00Z';
    validationLog.push({
      timestamp,
      dataQualityScore,
      threshold: passThreshold,
      result: 'APPROVED',
    });

    const result = evaluatePatternRelevance(
      inputDataset,
      passThreshold,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.status).toBe('APPROVED');
    expect(result.dataQualityScore).toBe(70.0);
    expect(result.threshold).toBe(70.0);
    expect(result.recommendationFlowBlocked).toBe(false);
    expect(result.recommendationFlowContinues).toBe(true);

    expect(validationLog).toHaveLength(1);
    expect(validationLog[0]).toEqual({
      timestamp,
      dataQualityScore: 70.0,
      threshold: 70.0,
      result: 'APPROVED',
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'Technology',
        companySize: 'Large',
        annualRevenue: 50000000,
      })
    );
  });
});