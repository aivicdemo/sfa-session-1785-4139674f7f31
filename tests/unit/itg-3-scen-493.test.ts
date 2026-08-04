import { calculateImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目算出機能', () => {
  test('SCEN-493: データ品質ルール定義が null のときエラーが発生する', () => {
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

    const invalidInput = {
      dataQualityRuleDefinition: null,
      qualityCheckResults: [
        {
          ruleId: 'RULE_001',
          ruleType: 'completeness',
          targetField: 'customerName',
          passedRecords: 950,
          totalRecords: 1000,
        },
      ],
      improvementPriority: 'high',
      aiRecommendationEngine: mockAIRecommendationEngine,
      fileStorageAdapter: mockFileStorageAdapter,
    };

    expect(() =>
      calculateImprovementItems(invalidInput)
    ).toThrow(/データ品質ルール定義|Data quality rule definition/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.generateDownloadUrl).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.deleteExpiredReports).not.toHaveBeenCalled();
  });
});