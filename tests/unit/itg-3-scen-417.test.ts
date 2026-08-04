import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出機能', () => {
  // SCEN-417
  test('スコアがちょうど閾値（80点）の場合、正しい改善優先度ランクが付与される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(80.0),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const inputData = {
      completeness: 0.8,
      accuracy: 0.8,
      consistency: 0.8,
      timeliness: 0.8,
    };

    const result = calculateDataQualityScore(
      inputData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result.score).toBe(80.0);
    expect(result.improvementPriorityRank).toBe('C');
  });
});