import { calculateDataQualityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - データ品質スコア算出', () => {
  // SCEN-521
  test('エラー率がちょうど閾値0%のときスコアが満点になる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'standard_proposal',
        confidence: 95,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.95),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        url: 'https://s3.example.com/report.pdf',
        key: 'reports/report-123.pdf',
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue('https://s3.example.com/signed-url'),
      deleteExpiredReports: jest.fn().mockResolvedValue(true),
    };

    const inputData = {
      totalRecords: 1000,
      errorCount: 0,
      completenessScore: 95.0,
      consistencyScore: 92.0,
      accuracyScore: 98.0,
      validationRuleCount: 50,
      passedRuleCount: 50,
    };

    const result = calculateDataQualityScore(
      inputData,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toEqual({
      score: 100.0,
      errorRate: 0.0,
      qualityLevel: 'excellent',
      timestamp: expect.any(String),
    });
    expect(typeof result.score).toBe('number');
    expect(result.score).toBe(100.0);
  });
});