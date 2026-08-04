import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1882
  test('顧客制約条件が null のとき照合に失敗する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealCondition = {
      dealId: 'DEAL-20240115-001',
      customerId: 'CUST-12345',
      industryType: 'manufacturing',
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      productCategory: 'enterprise_solution',
    };

    const customerConstraints = null;

    const result = generateRecommendation(
      dealCondition,
      customerConstraints,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealCondition,
      customerConstraints
    );

    expect(result.similarPatterns).toEqual([]);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(result.recommendationApproach).toBeDefined();
    expect(result.recommendationApproach.source).toBe('fallback_pattern_master');

    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].successScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendations[0].successScore).toBeLessThanOrEqual(100);
  });
});