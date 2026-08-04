import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出機能', () => {
  // SCEN-419
  test('スコアが閾値直上の場合、正しい改善優先度ランクが付与される', () => {
    const threshold = 70;
    const scoreAtThreshold = 70.0;
    
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(scoreAtThreshold)
    };

    const testDataset = {
      customerId: 'CUST-001',
      industry: 'manufacturing',
      companySize: 'large',
      dealValue: 5000000,
      proposalContent: 'ERP system implementation',
      dataCompleteness: 0.95,
      dataAccuracy: 0.92,
      dataConsistency: 0.88,
      recordCount: 1200
    };

    const result = calculateDataQualityScore(testDataset, mockAIRecommendationEngine);

    expect(result.qualityScore).toBe(70.0);
    expect(result.improvementPriorityRank).toBe('Priority2');
    expect(result.thresholdCrossed).toBe(false);
  });
});