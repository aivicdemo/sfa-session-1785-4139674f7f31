import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目算出機能', () => {
  test('SCEN-493: データ品質ルール定義が null のとき、エラーが発生する', () => {
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

    const improvementRequest = {
      dataQualityScore: 78,
      detectionDate: '2024-01-15T10:30:00Z',
      targetSystem: '営業データ品質管理システム',
    };

    expect(() => {
      calculateImprovementItems(
        null,
        improvementRequest,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      );
    }).toThrow(/Data quality rule definition is required|データ品質ルール定義が null です/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});