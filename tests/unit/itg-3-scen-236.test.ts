import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

// Mock for AIRecommendationEngine
const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

// Mock for FileStorageAdapter
const mockFileStorageAdapter = {
  uploadRecommendationReport: jest.fn(),
  generateDownloadUrl: jest.fn(),
  deleteExpiredReports: jest.fn(),
};

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-236
  test('推奨根拠の類似度スコアが1を超過したときにエラーをスロー', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockAIRecommendationEngine.evaluatePatternRelevance.mockResolvedValue(1.5);
      mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValue({
        url: 'https://example.s3.amazonaws.com/report.pdf',
        expiresAt: new Date('2024-02-15T12:00:00Z').toISOString(),
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const invalidRecommendationData = {
      recommendationId: 'rec-001',
      customerId: 'cust-123',
      dealId: 'deal-456',
      proposedApproach: 'Cross-sell strategy based on purchase history',
      confidenceScore: 85,
      similarityScore: 1.5,
      rootCauseFactors: [
        {
          factorType: 'purchase_pattern',
          factorValue: 'quarterly_buyer',
          relevanceScore: 0.92,
        },
        {
          factorType: 'customer_segment',
          factorValue: 'enterprise',
          relevanceScore: 0.88,
        },
      ],
      supportingCaseIds: ['case-789', 'case-790'],
      generatedAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    };

    expect(() =>
      visualizeRecommendationReasoning(
        invalidRecommendationData,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      )
    ).toThrow(/類似度スコア/);

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});