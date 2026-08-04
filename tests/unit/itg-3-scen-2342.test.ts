import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2342
  test('推奨データが0件のときレポートが生成されない', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealConditions = {
      customerId: 'CUST-001',
      industryType: 'manufacturing',
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const result = generateRecommendationReport(
      dealConditions,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toEqual({
      success: false,
      message: '推奨データが0件のため、レポートは生成されません',
    });
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});