import { calculateImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目算出機能', () => {
  // SCEN-494
  test('データ品質ルール定義が空配列のとき、エラーをスロー', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const emptyDataQualityRules = [];
    const dataQualityScore = 85;
    const improvementPriorityRank = 'high';

    expect(() => {
      calculateImprovementItems(
        emptyDataQualityRules,
        dataQualityScore,
        improvementPriorityRank,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      );
    }).toThrow(/データ品質ルール定義/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.generateDownloadUrl).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.deleteExpiredReports).not.toHaveBeenCalled();
  });
});