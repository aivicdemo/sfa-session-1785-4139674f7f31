import { describe, test, expect } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2558
  test('推奨根拠の参照データが欠落しているとき、例外が発生する', () => {
    const recommendationId = 'REC-2024-001';
    const dealConditions = {
      customerId: 'CUST-12345',
      dealAmount: 5000000,
      dealStage: 'proposal',
      industryType: 'manufacturing',
      companySize: 'large',
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId,
        recommendedApproach: 'approach_template_001',
        trustScore: 85,
        referenceData: null,
        confidenceFactors: [
          {
            factor: 'similar_success_pattern',
            weight: 0.4,
            evidenceCount: 12,
          },
          {
            factor: 'customer_segment_match',
            weight: 0.3,
            evidenceCount: 8,
          },
        ],
        generatedAt: new Date('2024-12-15T10:30:00Z').toISOString(),
      }),
    };

    expect(() => {
      visualizeRecommendationReasoning(
        recommendationId,
        dealConditions,
        mockAIEngine
      );
    }).toThrow(/参照データ|Reference data/);
  });
});