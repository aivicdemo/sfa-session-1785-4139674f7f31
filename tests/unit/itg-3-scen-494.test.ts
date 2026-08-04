import { calculateImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目算出機能', () => {
  // SCEN-494
  test('データ品質ルール定義が空配列のときエラーをスロー', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const emptyDataQualityRules = [];
    const sampleQualityScore = 65;
    const samplePriorityRank = 2;

    expect(() =>
      calculateImprovementItems(
        emptyDataQualityRules,
        sampleQualityScore,
        samplePriorityRank,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/データ品質ルール定義|Invalid data quality rules/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});